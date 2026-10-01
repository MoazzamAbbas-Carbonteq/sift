import { AppDataSource } from '../data-source.js';
import { seedCatalog } from './seed.js';

await AppDataSource.initialize();

try {
  const counts = await seedCatalog(AppDataSource);
  console.log(
    `Seed complete: ${counts.categories} categories, ${counts.users} users, ${counts.activeCarts} active carts, ${counts.products} products.`,
  );
} finally {
  await AppDataSource.destroy();
}
