## Database (Drizzle + PostgreSQL)

### Files
- drizzle.config.ts defines dialect, schema path, and output directory.
- db/schema.ts defines tables and relations.
- db/index.ts exports the db instance.

### Rules
- Keep database operations in server-only contexts.
- Avoid direct SQL strings unless required.
- Keep migrations in the drizzle output directory.
