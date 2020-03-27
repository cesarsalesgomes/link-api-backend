import {
  Controller, Post, Body, Get, Param, Delete, Put, Query, ParseIntPipe
} from '@nestjs/common';
import { ApiOperation } from '@nestjs/swagger';
import { Vehicle } from './vehicle.model';
import { VehicleDTO } from './vehicle.dto';
import { VehicleService } from './vehicle.service';

@Controller('vehicles')
export class VehicleController {
  constructor(private readonly vehicleService: VehicleService) { }

  @Post('/')
  @ApiOperation({ summary: 'Cria um veículo' })
  public async createVehicle(@Body() vehicle: VehicleDTO): Promise<Vehicle> {
    return this.vehicleService.create(vehicle);
  }

  @Post('/bulk')
  @ApiOperation({ summary: 'Cria veículos em lote informando a marca desejada (Máximo de 20 veículos)' })
  public async bulkCreateVehicles(@Query('brand') brand?: string): Promise<Vehicle[]> {
    return this.vehicleService.bulkCreateFipeBrandVehicles(brand);
  }

  @Get('/paginated')
  @ApiOperation({ summary: 'Pesquisa paginada de veículos com filtros' })
  public async getVehiclesPaginated(
    @Query('pageIndex', new ParseIntPipe()) pageIndex: number,
    @Query('pageSize', new ParseIntPipe()) pageSize: number,
    @Query('vehicle') vehicle?: string,
    @Query('brand') brand?: string,
    @Query('year') year?: number,
    @Query('description') description?: string
  ): Promise<{ vehicles: Vehicle[], total: number }> {
    return this.vehicleService.getPaginated(pageIndex, pageSize, {
      vehicle, brand, year, description
    });
  }

  @Get('/')
  @ApiOperation({ summary: 'Retorna todos os veículos da base' })
  public async getVehicles(): Promise<Vehicle[]> {
    return this.vehicleService.getAll();
  }

  @Get('/:id')
  @ApiOperation({ summary: 'Detalha um veículo' })
  public async getVehicle(@Param('id') idVehicle): Promise<Vehicle> {
    return this.vehicleService.findById(idVehicle);
  }

  @Delete('/:id')
  @ApiOperation({ summary: 'Deleta um veículo' })
  public async deleteVehicle(@Param('id') idVehicle): Promise<Vehicle> {
    return this.vehicleService.deleteVehicle(idVehicle);
  }

  @Put('/:id')
  @ApiOperation({ summary: 'Atualiza um veículo' })
  public async updateVehicle(@Param('id') idVehicle, @Body() vehicle: VehicleDTO): Promise<Vehicle> {
    return this.vehicleService.updateVehicle(idVehicle, vehicle);
  }
}
