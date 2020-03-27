import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { VehicleDTO } from './vehicle.dto';
import { Vehicle } from './vehicle.model';
import { VehicleExceptions } from './vehicle.exceptions';

@Injectable()
export class VehicleBO {
  constructor(
    @InjectModel('Vehicle')
    private readonly VehicleModel: Model<Vehicle>
  ) { }

  /**
   * Lança exceção caso veículo existente na base de dados.
   *
   * @param vehicleDTO VehicleDTO
   */
  public async checkExistingVehicle(vehicleDTO: VehicleDTO): Promise<void> {
    const vehicle = await this.VehicleModel.findOne(vehicleDTO);

    if (vehicle) {
      throw new InternalServerErrorException({ message: VehicleExceptions.VEHICLE_ALREADY_EXISTS });
    }
  }
}
