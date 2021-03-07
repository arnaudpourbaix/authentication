import { NestAuthModule, VALIDATION_SCHEMA } from '@authentication/nest-auth';
import { HttpModule, Module } from '@nestjs/common';
import { ConfigModule, ConfigType } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import authConfig from './auth.config';
import { databaseConnection } from './database.config';
@Module({
  controllers: [AppController],
  imports: [
    ConfigModule.forRoot({
      validationSchema: VALIDATION_SCHEMA,
      envFilePath: 'config-auth.env',
      load: [authConfig],
      isGlobal: true,
    }),
    TypeOrmModule.forRoot({
      autoLoadEntities: true,
      ...databaseConnection,
    }),
    HttpModule,
    NestAuthModule.registerAsync({
      inject: [authConfig.KEY],
      useFactory: async (config: ConfigType<typeof authConfig>) => ({
        google: config.google,
        jwt: config.jwt,
      }),
    }),
  ],
})
export class AppModule {}
