export function getDbUrl(): string {
  if (process.env.POSTGRES_URL) return process.env.POSTGRES_URL;
  if (process.env.DATABASE_URL) return process.env.DATABASE_URL;
  if (process.env.DATABASE_URL_UNPOOLED) return process.env.DATABASE_URL_UNPOOLED;

  const user = process.env.PGUSER;
  const password = process.env.PGPASSWORD;
  const host = process.env.PGHOST;
  const database = process.env.PGDATABASE;

  if (user && password && host && database) {
    return `postgresql://${user}:${encodeURIComponent(password)}@${host}/${database}?sslmode=require`;
  }

  // Build-time placeholder: real connection will fail at runtime but build succeeds
  return 'postgresql://placeholder:placeholder@localhost:5432/placeholder';
}
