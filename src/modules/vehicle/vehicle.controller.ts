import {
  Controller, Post, Body, Get, Param, Delete, Put, Query, ParseIntPipe
} from '@nestjs/common';
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

  @Get('/paginated')
  public async getVehiclesPaginated(
    @Query('pageIndex', new ParseIntPipe()) pageIndex?: number,
    @Query('pageSize', new ParseIntPipe()) pageSize?: number
  ): Promise<{ vehicles: Vehicle[], total: number }> {
    return this.vehicleService.getPaginated(pageIndex, pageSize);
  }

  @Get('/')
  public async getVehicles(): Promise<Vehicle[]> {
    return this.vehicleService.getAll();
  }

  @Get('/:id')
  public async getVehicle(@Param('id') idVehicle): Promise<Vehicle> {
    return this.vehicleService.findById(idVehicle);
  }

  @Delete('/:id')
  public async deleteVehicle(@Param('id') idVehicle): Promise<Vehicle> {
    return this.vehicleService.deleteVehicle(idVehicle);
  }

  @Put('/:id')
  public async updateVehicle(@Param('id') idVehicle, @Body() vehicle: VehicleDTO): Promise<Vehicle> {
    return this.vehicleService.updateVehicle(idVehicle, vehicle);
  }
}
