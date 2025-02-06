export interface MenuItemTypes {
  // id: string;
  title: string;
  description: string;
  price: string;
  image: string;
}

export interface MenuCategoryTypes {
  id: string
  name: string
  items: MenuItemTypes[]
}

