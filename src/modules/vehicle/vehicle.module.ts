import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Utils } from '../../utils';
import { VehicleController } from './vehicle.controller';
import { VehicleService } from './vehicle.service';
import { VehicleSchema } from './vehicle.model';
import { VehicleBO } from './vehicle.bo';
import { RemoteModule } from '../remote/remote.module';

@Module({
  imports: [MongooseModule.forFeature([{ name: 'Vehicle', schema: VehicleSchema }]), RemoteModule],
  controllers: [VehicleController],
  providers: [VehicleService, VehicleBO, Utils]
})
export class VehicleModule { }
