import { Logger, Module } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { ModelDefinition, MongooseModule } from "@nestjs/mongoose";

@Module({
    imports: [
        MongooseModule.forRootAsync({
            useFactory: (configService: ConfigService) => ({
                uri: configService.getOrThrow<string>('MONGODB_URI'),
                connectionFactory: (connection) => {
                    Logger.log('Database connected', 'MongooseModule');
                    return connection;
                },
            }),
            inject: [ ConfigService ]
        }),
    ],
    providers: [],
    exports: []
})
export class DatabaseModule {
    static forFeature(modules: ModelDefinition[]) {
        return MongooseModule.forFeature(modules);
    }
}