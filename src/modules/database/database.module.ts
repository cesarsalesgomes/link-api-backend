import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [MongooseModule.forRootAsync({
    imports: [ConfigModule],
    useFactory: async (configService: ConfigService) => ({
      uri: configService.get('MONGODB_URL'),
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true
    }),
    inject: [ConfigService]
  })]
})
export class DatabaseModule { }
