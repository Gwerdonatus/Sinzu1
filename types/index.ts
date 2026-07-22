export interface ProductVariation {
  id: string;          // Square variation ID (used for checkout + inventory)
  name: string;        // e.g. "S", "M", "L", "One size"
  price: number;       // in cents
  inventory: number;   // live count from Square
}

export interface Product {
  id: string;                 // Square item ID
  name: string;
  description?: string;
  price: number;              // lowest variation price, in cents
  originalPrice?: number;     // set when Square item name/desc marks a sale
  image: string;              // primary image URL from Square (or placeholder)
  images: string[];           // all Square images for the item
  category: string;           // Square category name (or "Shop")
  subcategory?: string;
  badge?: string;             // "Sale" | "New" etc. (derived from Square custom attribute / category)
  sizes: string[];            // variation names
  variations: ProductVariation[];
  inventory: number;          // total across variations
}

export interface CartItem {
  id: string;          // product (item) id
  name: string;
  price: number;       // cents — display only; server re-prices from Square at checkout
  quantity: number;
  image: string;
  size: string;
  variantId: string;   // Square variation ID — the source of truth at checkout
}

export interface ShippingAddress {
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  postalCode: string;
  country: string; // ISO-2, e.g. "US"
}
