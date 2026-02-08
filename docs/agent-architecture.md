## Architecture & Routing

### App Router Only
- Use the app directory for routes.
- Do not use pages or _app.tsx.

### Project Layout
- app: route segments, layouts, and pages.
- lib: shared utilities and helpers.
- db: database setup and schema.
- public: static assets only.

### Conventions
- Use layout.tsx for shared UI.
- Keep server-only logic out of client components.
