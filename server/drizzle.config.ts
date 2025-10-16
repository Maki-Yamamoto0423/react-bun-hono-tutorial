import type { Config } from 'drizzle-kit';

export default {
  schema: './db/schema/*.ts',
  out: './server/drizzle',
  dialect: 'postgresql',
  dbCredentials: {
    url: process.env.DATABASE_URL!,
  },
} satisfies Config;

/*
Drizzle Kit のバージョンアップにより指定方法が変わったため、Samおじさんと書き方違う項目
・driver: 'pg'
・dbCredentials: {
  connectionString: process.env.DATABASE_URL!
}
*/
