import { Permission } from "./permission";
import { UserRoles } from "./roles";

export const ROLE_PERMISSIONS: Record<UserRoles, Permission[]> = {
  [UserRoles.OWNER]: [
    ...Object.values(Permission), // owner can do everything
  ],

  [UserRoles.STAFF]: [
    Permission.READ_RESTAURANT_INFO,
    Permission.READ_CATEGORY_INFO,
    Permission.READ_PRODUCT_INFO,
    Permission.READ_ORDER_INFO,
    Permission.UPDATE_ORDER_STATUS,
  ],

  [UserRoles.KITCHEN]: [
    Permission.READ_RESTAURANT_INFO,
    Permission.READ_CATEGORY_INFO,
    Permission.READ_PRODUCT_INFO,
    Permission.READ_ORDER_INFO,
    Permission.UPDATE_ORDER_STATUS,
  ],

  [UserRoles.CUSTOMER]: [
    Permission.READ_RESTAURANT_INFO,
    Permission.READ_CATEGORY_INFO,
    Permission.READ_PRODUCT_INFO,
    Permission.CREATE_ORDER,
  ],
};
