import { DataSource } from 'typeorm';
import { catalogEntities } from './entities.js';
import { CreateCatalogSchema1735689600000 } from './migrations/1735689600000-CreateCatalogSchema.js';
import { SnakeNamingStrategy } from './snake-naming.strategy.js';

function requireEnv(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Missing ${name}. Check backend/.env.`);
  }

  return value;
}

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: requireEnv('DB_HOST'),
  port: Number(requireEnv('DB_PORT')),
  username: requireEnv('DB_USER'),
  password: requireEnv('DB_PASSWORD'),
  database: requireEnv('DB_NAME'),
  ssl: { rejectUnauthorized: true },
  namingStrategy: new SnakeNamingStrategy(),
  entities: catalogEntities,
  migrations: [CreateCatalogSchema1735689600000],
  synchronize: false,
});
