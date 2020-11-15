import { NestAuthModule } from '@authentification/nest-auth';
import { HttpModule, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { databaseConnection } from './database.config';

@Module({
  controllers: [AppController],
  imports: [
    ConfigModule.forRoot({
      envFilePath: 'config-auth.env',
      isGlobal: true,
    }),
    TypeOrmModule.forRoot({
      autoLoadEntities: true,
      ...databaseConnection,
    }),
    HttpModule,
    NestAuthModule,
  ],
})
export class AppModule {}
