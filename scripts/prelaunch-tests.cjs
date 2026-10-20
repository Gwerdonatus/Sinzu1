const test = require('node:test');
const assert = require('node:assert/strict');
const ts = require('typescript');
const fs = require('node:fs');
const vm = require('node:vm');
const path = require('node:path');
const root = path.resolve(__dirname, '..');
function load(file, mocks = {}) {
  const module = { exports: {} };
  const code = ts.transpileModule(fs.readFileSync(path.join(root, file), 'utf8'), { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020 } }).outputText;
  vm.runInNewContext(code, { module, exports: module.exports, require: name => {
    if (name in mocks) return mocks[name];
    if (name.startsWith('@/')) return load(name.slice(2) + '.ts', mocks);
    return require(name);
  }, console: { log() {}, error() {} }, process, Date, Map, BigInt }, { filename: file });
  return module.exports;
}
const { normalizeCheckoutItems } = load('lib/checkout-validation.ts');
for (const quantity of [0, -1, 1.5, null, '2', NaN, Infinity, 1000]) {
  test(`reject quantity ${String(quantity)}`, () => assert.throws(() => normalizeCheckoutItems([{variationId:'v',quantity}])));
}
test('aggregate repeated variations before stock checks', () => {
  const items = normalizeCheckoutItems([{ variationId:'v',quantity:2 },{ variationId:'v',quantity:3 }]);
  assert.equal(items.length, 1); assert.equal(items[0].quantity, 5);
});
test('reject empty and oversized carts', () => {
  assert.throws(() => normalizeCheckoutItems([]));
  assert.throws(() => normalizeCheckoutItems(Array(101).fill({variationId:'v',quantity:1})));
});
const shipping = load('lib/shipping.ts');
test('shipping threshold and pickup', () => {
  assert.equal(shipping.calcShippingCost('standard',14999),1000);
  assert.equal(shipping.calcShippingCost('standard',15000),0);
  assert.equal(shipping.calcShippingCost('pickup',1),0);
  assert.equal(shipping.calcShippingCost('express',15000),2500);
});
const discounts = load('lib/discounts.ts');
test('discount rounding and invalid code', () => {
  assert.equal(discounts.computeDiscount(' welcome10 ',1001).amountCents,100);
  assert.equal(discounts.computeDiscount('invalid',1001).ok,false);
});
const address = { firstName:'Test',lastName:'Customer',email:'test@example.com',phone:'2025550100',addressLine1:'123 Test St',city:'Blaine',state:'MN',postalCode:'55434',country:'US' };
function route({status='COMPLETED', total=2000}={}) {
  const calls = {orders:0,payments:0};
  const mocks = {
    'next/server': { NextResponse: { json: (body, options={}) => ({body,status:options.status || 200}) } },
    '@/lib/square': { LOCATION_ID:'sandbox-location', ordersApi:{createOrder:async () => { calls.orders++; return {result:{order:{id:'test-order',totalMoney:{amount:BigInt(total)}}}};}}, paymentsApi:{createPayment:async () => {calls.payments++;return {result:{payment:{id:'test-payment',status}}};}} },
    '@/lib/catalog': {fetchProducts:async () => [{ name:'Product',variations:[{id:'v',name:'One size',price:1000,inventory:3}] }]},
    '@/lib/email/send': {OWNER_EMAIL:'owner@example.com',sendEmail:async () => ({ok:false,error:'disabled'})},
    '@/lib/email/templates': {orderConfirmationEmail:()=>({}),ownerNewOrderEmail:()=>({})},
  };
  const {POST} = load('app/api/square/payment/route.ts', mocks);
  return {calls, post:(overrides={})=>POST({json:async()=>({sourceId:'test-token',items:[{variationId:'v',quantity:2}],shippingMethodId:'pickup',shippingAddress:{...address},...overrides})})};
}
test('duplicate lines cannot bypass inventory', async () => {
  const r=route(); const res=await r.post({items:[{variationId:'v',quantity:2},{variationId:'v',quantity:2}]});
  assert.equal(res.status,409);assert.equal(r.calls.orders,0);assert.equal(r.calls.payments,0);
});
test('invalid shipping destination is rejected before Square', async () => {
  const r=route();const res=await r.post({shippingMethodId:'standard',shippingAddress:{...address,country:'CA'}});
  assert.equal(res.status,400);assert.equal(r.calls.orders,0);
});
test('invalid email is rejected before Square', async () => {
  const r=route();const res=await r.post({shippingAddress:{...address,email:'bad'}});
  assert.equal(res.status,400);assert.equal(r.calls.orders,0);
});
test('higher Square total never charges', async () => {
  const r=route({total:2500});const res=await r.post(); assert.equal(res.status,409);assert.equal(r.calls.payments,0);
});
for (const status of ['FAILED','CANCELED','PENDING','APPROVED']) {
 test(`payment ${status} cannot produce success`,async()=>{const r=route({status});const res=await r.post();assert.equal(res.status,409);assert.notEqual(res.body.success,true);});
}
test('completed payment preserves order but reports failed email honestly', async () => {
  const r=route();const res=await r.post();assert.equal(res.status,200);assert.equal(res.body.success,true);assert.equal(res.body.emailed,false);assert.equal(r.calls.payments,1);
});
