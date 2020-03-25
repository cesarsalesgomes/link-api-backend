import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { VehicleModule } from './modules/vehicle/vehicle.module';
import { DatabaseModule } from './modules/database/database.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    DatabaseModule,
    VehicleModule
  ],
  controllers: []
})
export class AppModule { }
