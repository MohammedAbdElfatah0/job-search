import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import configLoad from './config/env/env.dev';

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

    
  ],
  controllers: [],
  providers: [],
})
export class AppModule { }
