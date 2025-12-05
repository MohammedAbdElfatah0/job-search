import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { MongooseModule } from '@nestjs/mongoose';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { CloudinaryProvider } from './config';
import configLoad from './config/env/env.dev';
import { AuthModule, UserModule } from './module';
import { CommenModule } from './shared';

@Module({
  imports: [
    //connect with .env
    ConfigModule.forRoot(
      {
        isGlobal: true,
        load: [configLoad]

      },
    ),
    //connect with mongoose
    MongooseModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        uri: configService.get("db").url,
      })
    }),
    ThrottlerModule.forRoot({
      throttlers: [
        {
          ttl: 60000,//1min
          limit: 5,//5 request per min
        },
      ],
    }),

    CommenModule,
    AuthModule,
    UserModule,
  ],
  controllers: [],
  providers: [
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard
    },
  
    CloudinaryProvider,
  ],
  exports: [CloudinaryProvider]
})
export class AppModule { }
