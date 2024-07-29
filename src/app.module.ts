import { Module } from '@nestjs/common';
import { DatabaseModule } from './common/database/database.module';
import { UserModule } from './modules/user/user.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import * as Joi from 'joi';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { join } from 'path';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { LoggerModule } from 'nestjs-pino';
import { AuthModule } from './modules/auth/auth.module';
import { ChatModule } from './modules/chat/chat.module';
import { MessageModule } from './modules/chat/message/message.module';
import { PubSubModule } from './common/pubSub/pubSub.module';
import { DateScalar } from './common/scalars/date.scalars';

@Module({
  imports: [
    /// Configration setup
    ConfigModule.forRoot({
      cache: true,
      envFilePath: `.env.${process.env.NODE_ENV || 'development'}`,
      isGlobal: true,
      validationSchema: Joi.object({
        NODE_ENV: Joi.string()
          .valid('development', 'production')
          .default('development'),
        PORT: Joi.number().port().default(3000),
        MONGODB_URI: Joi.string().required(),
        GRAPHQL_PLAYGROUND: Joi.boolean().required(),
        AT_SECRET: Joi.string().required(),
        RT_SECRET: Joi.string().required(),
      })
    }),

    /// Graphql setup
    GraphQLModule.forRootAsync<ApolloDriverConfig>({
      driver: ApolloDriver,
      useFactory: (configService: ConfigService) => ({
        autoSchemaFile: join(process.cwd(), 'src/schema.gql'),
        playground: configService.getOrThrow<boolean>('GRAPHQL_PLAYGROUND'),
        introspection: configService.getOrThrow<string>('NODE_ENV') !== 'production',
        context: ({ req, res }) => ({ req, res }),
        csrfPrevention: true,
        subscriptions: {
          'subscriptions-transport-ws': true,
          'graphql-ws': true
        }
      }),
      imports: [],
      inject: [ConfigService],
    }),

    /// Logger setUp
    LoggerModule.forRootAsync({
      useFactory: (configService: ConfigService) => {
        const isProduction = configService.getOrThrow('NODE_ENV') === 'production';

        return {
          pinoHttp: {
            // we will remove pino-pretty in production since it might slow down the app
            transport: isProduction
              ? undefined
              : {
                target: 'pino-pretty',
                options: {
                  singleLine: true,
                },
              },
            // debug might be too verbose for production
            level: isProduction ? 'info' : 'debug',
          },
        };
      },
      inject: [ConfigService],
    }),

    DatabaseModule,
    PubSubModule,
    UserModule,
    AuthModule,
    ChatModule,
    MessageModule
  ],
  controllers: [
    AppController
  ],
  providers: [
    AppService,
    DateScalar
  ],
})
export class AppModule { }
