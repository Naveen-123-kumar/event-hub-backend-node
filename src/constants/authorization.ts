import { UserRole, Permission } from "../modules/auth/auth.types";

export const ROLE_PERMISSIONS: Record<UserRole, Permission[]> = {
  [UserRole.SUPER_ADMIN]: [
    Permission.ORGANIZATION_CREATE,
    Permission.ORGANIZATION_VIEW,
    Permission.ORGANIZATION_UPDATE,
    Permission.ORGANIZATION_DELETE,

    Permission.USER_CREATE,
    Permission.USER_VIEW,
    Permission.USER_UPDATE,
    Permission.USER_DELETE,
    Permission.USER_ASSIGN_ROLE,

    Permission.EVENT_CREATE,
    Permission.EVENT_VIEW,
    Permission.EVENT_UPDATE,
    Permission.EVENT_DELETE,
    Permission.EVENT_PUBLISH,

    Permission.REGISTRATION_VIEW,

    Permission.BOOKING_VIEW_OWN,
    Permission.BOOKING_CREATE,
    Permission.BOOKING_CANCEL_OWN,

    Permission.REPORT_PLATFORM_VIEW,
    Permission.REPORT_ORGANIZATION_VIEW,

    Permission.SUPPORT_VIEW,
    Permission.SUPPORT_MANAGE,
  ],

  [UserRole.ORGANIZATION_ADMIN]: [
    Permission.USER_CREATE,
    Permission.USER_VIEW,
    Permission.USER_UPDATE,
    Permission.USER_ASSIGN_ROLE,

    Permission.EVENT_CREATE,
    Permission.EVENT_VIEW,
    Permission.EVENT_UPDATE,
    Permission.EVENT_DELETE,
    Permission.EVENT_PUBLISH,

    Permission.REGISTRATION_VIEW,

    Permission.BOOKING_VIEW_OWN,
    Permission.BOOKING_CREATE,
    Permission.BOOKING_CANCEL_OWN,

    Permission.REPORT_ORGANIZATION_VIEW,

    Permission.SUPPORT_VIEW,
    Permission.SUPPORT_MANAGE,
  ],

  [UserRole.EVENT_MANAGER]: [
    Permission.EVENT_CREATE,
    Permission.EVENT_VIEW,
    Permission.EVENT_UPDATE,
    Permission.EVENT_PUBLISH,

    Permission.REGISTRATION_VIEW,
  ],

  [UserRole.CUSTOMER]: [
    Permission.EVENT_VIEW,
    Permission.BOOKING_CREATE,
    Permission.BOOKING_VIEW_OWN,
    Permission.BOOKING_CANCEL_OWN,
  ],

  [UserRole.SUPPORT_AGENT]: [
    Permission.EVENT_VIEW,

    Permission.BOOKING_VIEW_OWN,

    Permission.SUPPORT_VIEW,
    Permission.SUPPORT_MANAGE,
  ],
};
