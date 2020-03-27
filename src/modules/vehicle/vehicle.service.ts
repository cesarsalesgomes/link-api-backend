import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Utils } from '../../utils';
import { VehicleDTO } from './vehicle.dto';
import { Vehicle } from './vehicle.model';
import { VehicleBO } from './vehicle.bo';

@Injectable()
export class VehicleService {
  constructor(
    @InjectModel('Vehicle')
    private readonly VehicleModel: Model<Vehicle>,
    private readonly vehicleBO: VehicleBO,
    private readonly utils: Utils
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

  public async getPaginated(pageIndex: number, pageSize: number): Promise<{ vehicles: Vehicle[], total: number }> {
    const limit = pageSize;
    const skip = pageIndex * pageSize;

    const total = await this.VehicleModel.countDocuments();
    const vehicles = await this.VehicleModel.find({}, {}, { skip, limit });

    return {
      total,
      vehicles
    };
  }
}
