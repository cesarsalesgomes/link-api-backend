import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { VehicleDTO } from './vehicle.dto';
import { Vehicle } from './vehicle.model';
import { VehicleExceptions } from './vehicle.exceptions';
import { RemoteService, FipeBrand } from '../remote/remote.service';

@Injectable()
export class VehicleBO {
  constructor(
    @InjectModel('Vehicle')
    private readonly VehicleModel: Model<Vehicle>,
    private readonly remoteService: RemoteService
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

  /**
   * Retornar modelo Fipe da Marca.
   *
   * @param brand string
   * @returns FipeBrand
   */
  public async getFipeBrand(brand: string): Promise<FipeBrand> {
    const brands = await this.remoteService.getBrands();

    const fipeBrand = brands.find((b) => b.nome.toLowerCase() === brand.toLowerCase());

    if (!fipeBrand) {
      throw new InternalServerErrorException({ message: VehicleExceptions.BRAND_NOT_FOUND });
    }

    return fipeBrand;
  }
}
