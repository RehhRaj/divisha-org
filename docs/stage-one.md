# Stage 1 data and API contract

| Record | Responsibility | Constraint |
|---|---|---|
| BusinessType | Configurable industry classification | Unique slug |
| Tenant | Business instance and access boundary | Unique panel slug, foreign key to business type |
| Domain | Public hostname for a tenant | Globally unique and case-insensitive |
| Website | Editable draft and public snapshot | One website per tenant |
| Capability | Platform-owned action identifier | Unique code |
| Role | Tenant-owned capability set | Unique role name within tenant |
| Membership | User assignment to a tenant role | Unique user and role pair |
| AuditEvent | Successful tenant draft and publish activity | Actor, tenant, action, target, request ID and timestamp |

A platform user provisions tenants and assigns roles. Tenant actions resolve an
active tenant and authenticated actor into an immutable context. The Kernel
checks the requested capability against membership for that tenant. Draft and
publish writes use a transaction with a row lock and write an audit event inside
the same transaction.

Next.js reads the incoming public host and sends
`GET /api/page/?host=<hostname>` to Django. Django looks up an active tenant
and returns the published title, description, template key and business type.
Unknown, suspended or unpublished websites return 404. Draft content and
membership records are private. Both services log the same request ID. Django Ninja exposes the OpenAPI schema
and interactive documentation at /api/openapi.json and /api/docs in local mode.

The database owns tenant and website configuration. Django's template registry
validates available template keys, and Next.js maps those keys to bundled layouts.
The two layouts in this stage share a simple page structure and have distinct
themes. The public website serves the homepage.
