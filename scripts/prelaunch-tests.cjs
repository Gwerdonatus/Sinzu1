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
const { normalizeCheckoutItems, paymentAttemptKeys } = load('lib/checkout-validation.ts');
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
function route({status='COMPLETED', total=2000, inventory=3, paid=false, losePaymentResponse=false}={}) {
  const calls = {orders:0,payments:0,orderKeys:[],paymentKeys:[],emailKeys:[]};
  let completed = paid;
  const mocks = {
    'next/server': { NextResponse: { json: (body, options={}) => ({body,status:options.status || 200}) } },
    '@/lib/square': { LOCATION_ID:'sandbox-location', ordersApi:{
      createOrder:async (request) => {calls.orders++;calls.orderKeys.push(request.idempotencyKey);return {result:{order:{id:'test-order',totalMoney:{amount:BigInt(total)}}}};},
      retrieveOrder:async()=>({result:{order:{id:'test-order',tenders:completed?[{paymentId:'test-payment'}]:[]}}})
    }, paymentsApi:{
      getPayment:async()=>({result:{payment:{id:'test-payment',status:'COMPLETED'}}}),
      createPayment:async (request) => {calls.payments++;calls.paymentKeys.push(request.idempotencyKey); if(status==='COMPLETED')completed=true;if(losePaymentResponse)throw new Error('Response lost after Square captured');return {result:{payment:{id:'test-payment',status}}};}
    } },
    '@/lib/catalog': {fetchProducts:async () => [{ name:'Product',variations:[{id:'v',name:'One size',price:1000,inventory}] }]},
    '@/lib/email/send': {OWNER_EMAIL:'owner@example.com',sendEmail:async (args) => {calls.emailKeys.push(args.idempotencyKey);return {ok:false,error:'disabled'};}},
    '@/lib/email/templates': {orderConfirmationEmail:()=>({}),ownerNewOrderEmail:()=>({})},
  };
  const {POST} = load('app/api/square/payment/route.ts', mocks);
  return {calls, post:(overrides={})=>POST({json:async()=>({attemptId:'11111111-1111-4111-8111-111111111111',quotedTotal:2000,sourceId:'test-token',items:[{variationId:'v',quantity:2}],shippingMethodId:'pickup',shippingAddress:{...address},...overrides})})};
}
test('duplicate lines cannot bypass inventory', async () => {
  const r=route(); const res=await r.post({quotedTotal:4000,items:[{variationId:'v',quantity:2},{variationId:'v',quantity:2}]});
  assert.equal(res.status,409);assert.equal(r.calls.payments,0);
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

test('attempt keys stay stable and separate order/payment operations', () => {
 const id='11111111-1111-4111-8111-111111111111';
 assert.equal(paymentAttemptKeys(id).payment,paymentAttemptKeys(id).payment);
 assert.notEqual(paymentAttemptKeys(id).order,paymentAttemptKeys(id).payment);
 assert.throws(()=>paymentAttemptKeys('invalid'));
});
test('missing attempt cannot create an order or charge', async()=>{const r=route();const res=await r.post({attemptId:undefined});assert.equal(res.status,400);assert.equal(r.calls.orders,0);});
test('never charge more than the amount displayed to the customer',async()=>{const r=route();const res=await r.post({quotedTotal:1000});assert.equal(res.status,409);assert.equal(r.calls.orders,0);assert.equal(r.calls.payments,0);});
test('retry after a lost successful response reconciles without charging again',async()=>{
 const r=route({losePaymentResponse:true});
 const first=await r.post();assert.equal(first.status,500);assert.notEqual(first.body.resetAttempt,true);
 const retry=await r.post();assert.equal(retry.status,200);assert.equal(retry.body.success,true);
 assert.equal(r.calls.payments,1);assert.equal(r.calls.orderKeys[0],r.calls.orderKeys[1]);
});
test('a completed order is recovered even if the last unit was consumed',async()=>{
 const r=route({paid:true,inventory:0});const res=await r.post();assert.equal(res.status,200);assert.equal(r.calls.payments,0);
});
test('unpaid sold out order cannot charge',async()=>{
 const r=route({inventory:0});const res=await r.post();assert.equal(res.status,409);assert.equal(r.calls.payments,0);
});
function catalog({tracked=true,counts=[],fail=false,override}={}) {
 return load('lib/catalog.ts',{'@/lib/square':{
 LOCATION_ID:'location',
 catalogApi:{listCatalog:async()=>({result:{objects:[{id:'item',type:'ITEM',presentAtAllLocations:true,itemData:{name:'Test item',variations:[{id:'variation',itemVariationData:{name:'One size',priceMoney:{amount:1000n},trackInventory:tracked,locationOverrides:override===undefined?[]:[{locationId:'location',trackInventory:override}]}}]}}]}})},
 inventoryApi:{batchRetrieveInventoryCounts:async()=>{if(fail)throw new Error('Square unavailable');return {result:{counts}};}}
 }});
}
test('inventory request failure propagates instead of inventing stock',async()=>{await assert.rejects(()=>catalog({fail:true}).fetchProducts(true));});
test('tracked variation with no count is sold out',async()=>{const p=await catalog().fetchProducts(true);assert.equal(p[0].inventory,0);});
test('explicitly untracked items remain available',async()=>{const p=await catalog({tracked:false}).fetchProducts(true);assert.equal(p[0].inventory,999);});
test('location tracking override takes precedence',async()=>{const p=await catalog({tracked:false,override:true}).fetchProducts(true);assert.equal(p[0].inventory,0);});
test('live stock count is respected',async()=>{const p=await catalog({counts:[{catalogObjectId:'variation',state:'IN_STOCK',quantity:'2'}]}).fetchProducts(true);assert.equal(p[0].inventory,2);});
test('invalid count cannot enable checkout',async()=>{await assert.rejects(()=>catalog({counts:[{catalogObjectId:'variation',state:'IN_STOCK',quantity:'NaN'}]}).fetchProducts(true));});

test('pending payment retries reuse the same Square payment key',async()=>{
 const r=route({status:'PENDING'});const first=await r.post();const second=await r.post();
 assert.equal(first.status,409);assert.notEqual(first.body.resetAttempt,true);assert.equal(second.status,409);
 assert.equal(r.calls.paymentKeys[0],r.calls.paymentKeys[1]);
});
test('recovered success reuses email delivery keys',async()=>{
 const r=route();await r.post();await r.post();
 assert.equal(r.calls.payments,1);assert.equal(r.calls.emailKeys.length,4);
 assert.equal(r.calls.emailKeys[0],r.calls.emailKeys[2]);assert.equal(r.calls.emailKeys[1],r.calls.emailKeys[3]);assert.notEqual(r.calls.emailKeys[0],r.calls.emailKeys[1]);
});
