import { authDatabaseMigrations } from '@authentication/nest-auth';
import { SqliteConnectionOptions } from 'typeorm/driver/sqlite/SqliteConnectionOptions';
import { UserRecord1604585956439 } from './migrations/1604585956439-UserRecord';

export const databaseConnection: SqliteConnectionOptions = {
  type: 'sqlite',
  database: `${process.env.APPDATA}/youtube-video-rating.db`,
  logging: false,
  synchronize: false,
  migrationsRun: true,
  migrations: [...authDatabaseMigrations, UserRecord1604585956439],
};
