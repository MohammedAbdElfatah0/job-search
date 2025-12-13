import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { GraphQLModule } from '@nestjs/graphql';
import { MongooseModule } from '@nestjs/mongoose';
import { ThrottlerModule } from '@nestjs/throttler';
import { join } from 'path';
import { GqlThrottlerGuard } from './common/guard/graphql.throttler.guard';
import { CloudinaryProvider } from './config';
import configLoad from './config/env/env.dev';
import { AuthModule, UserModule } from './module';
import { AdminModule } from './module/admin/admin.module';
import { CompanyModule } from './module/compeny/company.module';
import { JobModule } from './module/job/job.module';
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
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: join(process.cwd(), 'src/schema.gql'),
      context: ({ req, res }) => ({ req, res }),
      playground: false,
      introspection: true,
    }),
    CommenModule,
    AuthModule,
    UserModule,
    CompanyModule,
    JobModule,
    AdminModule
  ],
  controllers: [],
  providers: [
    {
      provide: APP_GUARD,
      useClass: GqlThrottlerGuard
    },

    CloudinaryProvider,
  ],
  exports: [CloudinaryProvider]
})
export class AppModule { }
