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

  REGISTRATION_VIEW = "registration:view",

  BOOKING_CREATE = "booking:create",
  BOOKING_VIEW_OWN = "booking:view_own",
  BOOKING_CANCEL_OWN = "booking:cancel_own",

  REPORT_PLATFORM_VIEW = "report:platform_view",
  REPORT_ORGANIZATION_VIEW = "report:organization_view",

  SUPPORT_VIEW = "support:view",
  SUPPORT_MANAGE = "support:manage",
}
