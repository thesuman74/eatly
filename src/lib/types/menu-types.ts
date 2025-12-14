export interface MenuItemsTypes {
  // id: string;
  title: string;
  description: string;
  price: string;
  image: string;
}

export interface ProductImageTypes {
  alt: string;
  id: string;
  is_primary: boolean;
  product_id: string;
  sort_order: number;
  url: string;
}

export interface ProductTypes {
  available: boolean;
  category_id: string;
  currency: string;
  description: string;
  id: string;
  isVisible: boolean;
  name: string;
  position: number;
  price: number; // in cents
  slug: string;
  images: ProductImageTypes[];
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
