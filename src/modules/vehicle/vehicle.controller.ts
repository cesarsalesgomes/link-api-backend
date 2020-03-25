import { Controller, Post, Body } from '@nestjs/common';
import { Vehicle } from './vehicle.model';
import { VehicleDTO } from './vehicle.dto';
import { VehicleService } from './vehicle.service';

@Controller('vehicles')
export class VehicleController {
  constructor(private readonly vehicleService: VehicleService) { }

  @Post('/')
  public async createVehicle(@Body() vehicle: VehicleDTO): Promise<Vehicle> {
    return this.vehicleService.create(vehicle);
  }
}
