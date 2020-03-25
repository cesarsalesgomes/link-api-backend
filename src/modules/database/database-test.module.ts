import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';

@Module({
  imports: [MongooseModule.forRootAsync({
    useFactory: async () => {
      const uri = await new MongoMemoryServer().getConnectionString();

      return {
        uri,
        useNewUrlParser: true,
        useUnifiedTopology: true
      };
    }
  })]
})
export class DatabaseTestModule { }
