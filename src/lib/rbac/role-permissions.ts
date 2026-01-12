import { Permission } from "./permission";
import { UserRoles, UserRoleTypes } from "./roles";

export const ROLE_PERMISSIONS: Record<UserRoleTypes, Permission[]> = {
  [UserRoles.OWNER]: [
    ...Object.values(Permission), // owner can do everything
  ],
  [UserRoles.MANAGER]: [
    Permission.READ_RESTAURANT_INFO,
    Permission.READ_CATEGORY_INFO,
    Permission.READ_PRODUCT_INFO,

    Permission.READ_ORDER_INFO,
    Permission.CREATE_ORDER,
    Permission.UPDATE_ORDER_STATUS,
    Permission.CANCEL_ORDER,
    Permission.REFUND_ORDER_PAYMENT,

    Permission.CREATE_STAFF_INVITE,
    Permission.READ_STAFF_INVITE_INFO,
  ],

  [UserRoles.STAFF]: [
    Permission.READ_RESTAURANT_INFO,
    Permission.READ_CATEGORY_INFO,
    Permission.READ_PRODUCT_INFO,

    Permission.READ_ORDER_INFO,
    Permission.CREATE_ORDER,
    Permission.UPDATE_ORDER_STATUS,
    Permission.CANCEL_ORDER,
    // Permission.REFUND_ORDER_PAYMENT,

    // Permission.READ_STAFF_INVITE_INFO,
  ],

  [UserRoles.KITCHEN]: [
    Permission.READ_RESTAURANT_INFO,
    Permission.READ_CATEGORY_INFO,
    Permission.READ_PRODUCT_INFO,

    Permission.READ_ORDER_INFO,
    Permission.UPDATE_ORDER_STATUS,
    // Permission.CANCEL_ORDER,
  ],

  [UserRoles.CUSTOMER]: [
    Permission.READ_RESTAURANT_INFO,
    Permission.READ_CATEGORY_INFO,
    Permission.READ_PRODUCT_INFO,
    Permission.CREATE_ORDER,
  ],
};
