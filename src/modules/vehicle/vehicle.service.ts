import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Utils } from '../../utils';
import { VehicleDTO } from './vehicle.dto';
import { Vehicle } from './vehicle.model';

@Injectable()
export class VehicleService {
  constructor(
    @InjectModel('Vehicle')
    private readonly VehicleModel: Model<Vehicle>,
    private readonly utils: Utils
  ) { }

  public async create(vehicleDTO: VehicleDTO): Promise<Vehicle> {
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
}
