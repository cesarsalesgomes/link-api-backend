/* eslint-disable no-await-in-loop */
/* eslint-disable no-param-reassign */
/* eslint-disable no-restricted-syntax */
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Utils } from '../../utils';
import { VehicleDTO } from './vehicle.dto';
import { Vehicle } from './vehicle.model';
import { VehicleBO } from './vehicle.bo';
import { RemoteService } from '../remote/remote.service';


@Injectable()
export class VehicleService {
  private MAX_CARS_BULK_CREATE = 20; // Máximo de carros criados em uma chamada em lote

  constructor(
    @InjectModel('Vehicle')
    private readonly VehicleModel: Model<Vehicle>,
    private readonly vehicleBO: VehicleBO,
    private readonly utils: Utils,
    private readonly remoteService: RemoteService
  ) { }

  public async create(vehicleDTO: VehicleDTO): Promise<Vehicle> {
    await this.vehicleBO.checkExistingVehicle(vehicleDTO);

    const currentDate = this.utils.getCurrentDate();

    const newVehicle = new this.VehicleModel({
      ...vehicleDTO,
      created: currentDate,
      updated: currentDate
    });

    return newVehicle.save();
  }

  public async findOne(): Promise<Vehicle> {
    return this.VehicleModel.findOne();
  }

  public async deleteAll(): Promise<void> {
    await this.VehicleModel.deleteMany({});
  }

  public async getAll(): Promise<Vehicle[]> {
    return this.VehicleModel.find({});
  }

  public async findById(id: string): Promise<Vehicle> {
    return this.VehicleModel.findById(id);
  }

  public async deleteVehicle(id: string): Promise<Vehicle> {
    return this.VehicleModel.findByIdAndDelete(id);
  }

  public async updateVehicle(id: string, vehicleDTO: VehicleDTO): Promise<Vehicle> {
    await this.vehicleBO.checkExistingVehicle(vehicleDTO);

    const updated = this.utils.getCurrentDate();

    return this.VehicleModel.findByIdAndUpdate(id, { ...vehicleDTO, updated }, { new: true });
  }

  public async getPaginated(pageIndex: number, pageSize: number, vehicleDTO: VehicleDTO): Promise<{ vehicles: Vehicle[], total: number }> {
    const limit = pageSize;
    const skip = pageIndex * pageSize;

    // Remove propriedades indefinidas (Mongoose considera como um valor)
    for (const [key, value] of Object.entries(vehicleDTO)) {
      if (!value) delete vehicleDTO[key];
    }

    const total = await this.VehicleModel.countDocuments(vehicleDTO);
    const vehicles = await this.VehicleModel.find(vehicleDTO, {}, { skip, limit });

    return {
      total,
      vehicles
    };
  }

  public async bulkCreateFipeBrandVehicles(brand: string): Promise<Vehicle[]> {
    const vehicles: Vehicle[] = [];

    const fipeBrand = await this.vehicleBO.getFipeBrand(brand);
    const fipeBrandModels = await this.remoteService.getBrandModels(fipeBrand.codigo);

    for (const brandModel of fipeBrandModels) {
      const fipeModelYears = await this.remoteService.getModelYears(fipeBrand.codigo, String(brandModel.codigo));

      for (const modelYear of fipeModelYears) {
        const modelDetail = await this.remoteService.getModelDetails(fipeBrand.codigo, String(brandModel.codigo), modelYear.codigo);
        const currentDate = this.utils.getCurrentDate();

        vehicles.push(new this.VehicleModel({
          vehicle: modelDetail.Modelo,
          brand: modelDetail.Marca,
          year: modelDetail.AnoModelo,
          description: `Valor: ${modelDetail.Valor} | Combustível: ${modelDetail.Combustivel}`,
          created: currentDate,
          updated: currentDate
        }));

        if (vehicles.length === this.MAX_CARS_BULK_CREATE) return this.VehicleModel.insertMany(vehicles);
      }
    }

    return this.VehicleModel.insertMany(vehicles);
  }
}
