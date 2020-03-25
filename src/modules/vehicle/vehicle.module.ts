import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Utils } from '../../utils';
import { VehicleController } from './vehicle.controller';
import { VehicleService } from './vehicle.service';
import { VehicleSchema } from './vehicle.model';

@Module({
  imports: [MongooseModule.forFeature([{ name: 'Vehicle', schema: VehicleSchema }])],
  controllers: [VehicleController],
  providers: [VehicleService, Utils]
})
export class VehicleModule { }
