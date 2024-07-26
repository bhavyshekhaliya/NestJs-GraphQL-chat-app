import { Module } from '@nestjs/common';
import { DatabaseModule } from './common/database/database.module';
import { UserModule } from './modules/user/user.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import * as Joi from 'joi';
import { MongooseModule } from '@nestjs/mongoose';
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
          .valid('development','production')
          .default('development'),
        PORT: Joi.number().port().default(3000),  
        MONGODB_URI: Joi.string().required(),
        GRAPHQL_PLAYGROUND: Joi.boolean().required(),
        AT_SECRET: Joi.string().required(),
        RT_SECRET: Joi.string().required(), 
        THROTTLE_TTL: Joi.number(),
        THROTTLE_LIMIT: Joi.number(),
      }),
      validationOptions: {
        allowUnknown: true,
        abortEarly: true
      }
    }), 

    /// Graphql setup
    GraphQLModule.forRootAsync<ApolloDriverConfig>({
      driver: ApolloDriver,
      useFactory: async (configService: ConfigService) => ({
         autoSchemaFile: join(process.cwd(), 'src/schema.gql'),
         playground: configService.getOrThrow<boolean>('GRAPHQL_PLAYGROUND'),
         introspection: configService.getOrThrow<string>('NODE_ENV') !== 'production',
         context: ({ req, resp }) => ({ req, resp}),
        //  csrfPrevention: true,  
         subscriptions: {
            'graphql-ws': {
              onConnect: () => {
                console.log("Web Socket Connected.....");                
              }
            }
         }
      }),
      imports: [ ConfigModule ], 
      inject: [ ConfigService ],
    }),

    /// MongoDB setUp
    MongooseModule.forRootAsync({
      useFactory: async (configService: ConfigService) => ({        
        uri: configService.get<string>('MONGODB_URI'),
      }),
      imports: [ ConfigModule ],
      inject: [ ConfigService ],
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
export class AppModule {}
