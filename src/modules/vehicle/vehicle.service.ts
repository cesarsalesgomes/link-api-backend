import { Injectable } from '@nestjs/common';
import { VehicleDTO } from './vehicle.dto';
import { Vehicle } from './vehicle.entity';

@Injectable()
export class VehicleService {
  public async create(vehicle: VehicleDTO): Promise<Vehicle> {
    return vehicle;
  }
}
