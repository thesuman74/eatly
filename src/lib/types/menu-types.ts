export interface MenuItemsTypes {
  // id: string;
  title: string;
  description: string;
  price: string;
  image: string;
}

export interface ProductImageTypes {
  id: string;
  url: string;
  alt: string;
  is_primary: boolean;
  product_id: string;
  sort_order: number;
}

export interface ProductTypes {
  id: string;
  name: string;
  slug: string;
  description: string;
  price: number; // in cents
  currency: string;
  images: ProductImageTypes[];
  available: boolean;
  isVisible: boolean;
}

export interface ProductCategoryTypes {
  id: string;
  name: string;
  slug?: string;
  // description: string;
  position: number;
  products: ProductTypes[];
  isVisible: boolean;
  available: boolean;
}

export type OrderType = "onsite" | "pickup" | "delivery";
