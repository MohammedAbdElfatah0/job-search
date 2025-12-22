import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { GraphQLModule } from '@nestjs/graphql';
import { MongooseModule } from '@nestjs/mongoose';
import { ThrottlerModule } from '@nestjs/throttler';
import { join } from 'path';
import { AppController } from './app.controller';
import { GqlThrottlerGuard } from './common/guard/graphql.throttler.guard';
import { CloudinaryProvider } from './config';
import configLoad from './config/env/env.dev';
import { AuthModule, UserModule } from './module';
import { AdminModule } from './module/admin/admin.module';
import { CompanyModule } from './module/compeny/company.module';
import { RealTimeModule } from './module/gateway/gateway.module';
import { JobModule } from './module/job/job.module';
import { CommenModule } from './shared';
import { ScheduleModule } from '@nestjs/schedule';
import { TasksModule } from './module/tasks/tasks.module';
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
      useFactory: async (configService: ConfigService) => ({
        uri: configService.get("db").url,
        useNewUrlParser: true,
        useUnifiedTopology: true,
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
    //cron job
    ScheduleModule.forRoot(),
    TasksModule,
    //graphql
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      // autoSchemaFile: true,
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
    AdminModule,
    //socketio
    RealTimeModule
  ],
  controllers: [
    AppController
  ],
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
