import { AppDataSource } from './data-source.js';

await AppDataSource.initialize();

try {
  const applied = await AppDataSource.runMigrations();
  console.log(`Applied ${applied.length} migration(s).`);
} finally {
  await AppDataSource.destroy();
}
