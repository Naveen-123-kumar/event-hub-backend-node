// export enum UserRole {
//   SUPER_ADMIN = "super_admin",
//   ORGANIZATION_ADMIN = "organization_admin",
//   EVENT_MANAGER = "event_manager",
//   CUSTOMER = "customer",
//   SUPPORT_AGENT = "support_agent",
// }

// export enum Permission {
//   ORGANIZATION_CREATE = "organization:create",
//   ORGANIZATION_VIEW = "organization:view",
//   ORGANIZATION_UPDATE = "organization:update",
//   ORGANIZATION_DELETE = "organization:delete",

//   USER_CREATE = "user:create",
//   USER_VIEW = "user:view",
//   USER_UPDATE = "user:update",
//   USER_DELETE = "user:delete",
//   USER_ASSIGN_ROLE = "user:assign_role",

//   EVENT_CREATE = "event:create",
//   EVENT_VIEW = "event:view",
//   EVENT_UPDATE = "event:update",
//   EVENT_DELETE = "event:delete",
//   EVENT_PUBLISH = "event:publish",

//   REGISTRATION_VIEW = "registration:view",

//   BOOKING_CREATE = "booking:create",
//   BOOKING_VIEW_OWN = "booking:view_own",
//   BOOKING_CANCEL_OWN = "booking:cancel_own",

//   REPORT_PLATFORM_VIEW = "report:platform_view",
//   REPORT_ORGANIZATION_VIEW = "report:organization_view",

//   SUPPORT_VIEW = "support:view",
//   SUPPORT_MANAGE = "support:manage",
// }

// export const ROLE_PERMISSIONS = {
//   SUPER_ADMIN: [
//     Permission.ORGANIZATION_CREATE,
//     Permission.ORGANIZATION_VIEW,
//     Permission.ORGANIZATION_UPDATE,
//     Permission.ORGANIZATION_DELETE,

//     Permission.USER_CREATE,
//     Permission.USER_VIEW,
//     Permission.USER_UPDATE,
//     Permission.USER_DELETE,
//     Permission.USER_ASSIGN_ROLE,

//     Permission.EVENT_VIEW,
//   ],

//   ORGANIZATION_ADMIN: [
//     Permission.USER_CREATE,
//     Permission.USER_VIEW,
//     Permission.USER_UPDATE,
//     Permission.USER_DELETE,

//     Permission.EVENT_CREATE,
//     Permission.EVENT_VIEW,
//     Permission.EVENT_UPDATE,
//     Permission.EVENT_DELETE,
//     Permission.EVENT_PUBLISH,
//   ],

//   EVENT_MANAGER: [
//     Permission.EVENT_CREATE,
//     Permission.EVENT_VIEW,
//     Permission.EVENT_UPDATE,
//     Permission.EVENT_DELETE,
//     Permission.EVENT_PUBLISH,
//   ],

//   CUSTOMER: [Permission.EVENT_VIEW],
// };
export enum UserRole {
  SUPER_ADMIN = "super_admin",
  ORGANIZATION_ADMIN = "organization_admin",
  EVENT_MANAGER = "event_manager",
  CUSTOMER = "customer",
  SUPPORT_AGENT = "support_agent",
}

export enum Permission {
  ORGANIZATION_CREATE = "organization:create",
  ORGANIZATION_VIEW = "organization:view",
  ORGANIZATION_UPDATE = "organization:update",
  ORGANIZATION_DELETE = "organization:delete",

  USER_CREATE = "user:create",
  USER_VIEW = "user:view",
  USER_UPDATE = "user:update",
  USER_DELETE = "user:delete",
  USER_ASSIGN_ROLE = "user:assign_role",

  EVENT_CREATE = "event:create",
  EVENT_VIEW = "event:view",
  EVENT_UPDATE = "event:update",
  EVENT_DELETE = "event:delete",
  EVENT_PUBLISH = "event:publish",

  TICKET_CREATE = "ticket:create",
  TICKET_VIEW = "ticket:view",
  TICKET_UPDATE = "ticket:update",
  TICKET_DELETE = "ticket:delete",

  REGISTRATION_VIEW = "registration:view",

  BOOKING_CREATE = "booking:create",
  BOOKING_VIEW_OWN = "booking:view_own",
  BOOKING_CANCEL_OWN = "booking:cancel_own",
  BOOKING_VIEW = "booking:view",
  BOOKING_MANAGE = "booking:manage",

  PAYMENT_CREATE = "payment:create",
  PAYMENT_VIEW_OWN = "payment:view_own",
  PAYMENT_VIEW = "payment:view",
  PAYMENT_MANAGE = "payment:manage",

  REPORT_PLATFORM_VIEW = "report:platform_view",
  REPORT_ORGANIZATION_VIEW = "report:organization_view",

  SUPPORT_VIEW = "support:view",
  SUPPORT_MANAGE = "support:manage",
}

export const ROLE_PERMISSIONS = {
  SUPER_ADMIN: [
    Permission.ORGANIZATION_CREATE,
    Permission.ORGANIZATION_VIEW,
    Permission.ORGANIZATION_UPDATE,
    Permission.ORGANIZATION_DELETE,

    Permission.USER_CREATE,
    Permission.USER_VIEW,
    Permission.USER_UPDATE,
    Permission.USER_DELETE,
    Permission.USER_ASSIGN_ROLE,

    Permission.EVENT_VIEW,

    Permission.TICKET_VIEW,

    Permission.BOOKING_VIEW,
    Permission.BOOKING_MANAGE,
    Permission.REGISTRATION_VIEW,

    Permission.PAYMENT_VIEW,
    Permission.PAYMENT_MANAGE,

    Permission.REPORT_PLATFORM_VIEW,

    Permission.SUPPORT_VIEW,
    Permission.SUPPORT_MANAGE,
  ],

  ORGANIZATION_ADMIN: [
    Permission.USER_CREATE,
    Permission.USER_VIEW,
    Permission.USER_UPDATE,
    Permission.USER_DELETE,

    Permission.EVENT_CREATE,
    Permission.EVENT_VIEW,
    Permission.EVENT_UPDATE,
    Permission.EVENT_DELETE,
    Permission.EVENT_PUBLISH,

    Permission.TICKET_CREATE,
    Permission.TICKET_VIEW,
    Permission.TICKET_UPDATE,
    Permission.TICKET_DELETE,

    Permission.BOOKING_VIEW,
    Permission.BOOKING_MANAGE,
    Permission.REGISTRATION_VIEW,

    Permission.PAYMENT_VIEW,

    Permission.REPORT_ORGANIZATION_VIEW,

    Permission.SUPPORT_VIEW,
  ],

  EVENT_MANAGER: [
    Permission.EVENT_CREATE,
    Permission.EVENT_VIEW,
    Permission.EVENT_UPDATE,
    Permission.EVENT_DELETE,
    Permission.EVENT_PUBLISH,

    Permission.TICKET_CREATE,
    Permission.TICKET_VIEW,
    Permission.TICKET_UPDATE,
    Permission.TICKET_DELETE,

    Permission.BOOKING_VIEW,
    Permission.REGISTRATION_VIEW,

    Permission.REPORT_ORGANIZATION_VIEW,
  ],

  CUSTOMER: [
    Permission.EVENT_VIEW,

    Permission.TICKET_VIEW,

    Permission.BOOKING_CREATE,
    Permission.BOOKING_VIEW_OWN,
    Permission.BOOKING_CANCEL_OWN,

    Permission.PAYMENT_CREATE,
    Permission.PAYMENT_VIEW_OWN,
  ],

  SUPPORT_AGENT: [
    Permission.USER_VIEW,

    Permission.EVENT_VIEW,
    Permission.TICKET_VIEW,

    Permission.BOOKING_VIEW,
    Permission.REGISTRATION_VIEW,

    Permission.PAYMENT_VIEW,

    Permission.SUPPORT_VIEW,
    Permission.SUPPORT_MANAGE,
  ],
};
