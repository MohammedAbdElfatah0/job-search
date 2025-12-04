import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import configLoad from './config/env/env.dev';
import { AuthModule } from './module';
import { CommenModule } from './shared/module/commen.module';
import { UserModule } from './module/user/user.module';

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
    AuthModule,
    CommenModule,
    UserModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule { }
