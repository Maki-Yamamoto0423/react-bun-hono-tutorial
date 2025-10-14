import { drizzle } from 'drizzle-orm/postgres-js';
import { migrate } from 'drizzle-orm/postgres-js/migrator';
import postgres from 'postgres';

async function runMigrations() {
  console.log('🌐 Connecting to Neon database...');

  if (!process.env.DATABASE_URL) {
    console.error('❌ DATABASE_URL environment variable is required');
    console.log('📝 Please add your Neon DATABASE_URL to .env file');
    process.exit(1);
  }

  // Neon用の設定
  const migrationClient = postgres(process.env.DATABASE_URL, {
    max: 1,
    ssl: 'require', // Neonでは通常SSL必須
  });

  try {
    console.log('📦 Running migrations to Neon...');

    await migrate(drizzle(migrationClient), {
      migrationsFolder: './server/drizzle',
    });

    console.log('✅ Migrations completed on Neon!');
  } catch (error) {
    console.error('❌ Migration failed:', error);
    throw error;
  } finally {
    await migrationClient.end();
    console.log('🔌 Neon connection closed');
  }
}

runMigrations().catch(console.error);
