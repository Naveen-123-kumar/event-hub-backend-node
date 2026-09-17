Backend API for EventHub, a multi-tenant Event & Subscription Management Platform.

EventHub allows organizations to create and manage events, sell tickets and subscriptions, manage customers, process payments, send notifications, and monitor transactions.

POST /api/events
GET /api/events
GET /api/events/:eventId
PATCH /api/events/:eventId
PATCH /api/events/:eventId/publish
DELETE /api/events/:eventId

POST /api/tickets/events/:eventId
GET /api/tickets/events/:eventId
GET /api/tickets/:ticketId
PATCH /api/tickets/:ticketId
DELETE /api/tickets/:ticketId

POST /api/bookings
GET /api/bookings/me
GET /api/bookings/:bookingId
PATCH /api/bookings/:bookingId/cancel

POST /api/payments/create
POST /api/payments/verify
POST /api/payments/webhook
