export interface MenuItemsTypes {
  // id: string;
  title: string;
  description: string;
  price: string;
  image: string;
}

export interface ProductImageTypes {
  url: string;
  alt: string;
}

export interface ProductTypes {
  id: string;
  name: string;
  slug: string;
  description: string;
  price: number; // in cents
  currency: string;
  image: ProductImageTypes;
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
