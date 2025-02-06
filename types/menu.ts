export interface MenuItemTypes {
  id: string
  name: string
  description: string
  price: number
  image: string
  category: string
}

export interface MenuCategoryTypes {
  id: string
  name: string
  items: MenuItemTypes[]
}

