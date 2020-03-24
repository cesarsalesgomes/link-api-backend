import { Test, TestingModule } from '@nestjs/testing';
import { VehicleController } from './vehicle.controller';
import { VehicleDTO } from './vehicle.dto';
import { VehicleService } from './vehicle.service';

describe('Veículos CRUD', () => {
  let vehicleController: VehicleController;
  let newVehicle: VehicleDTO;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [VehicleController],
      providers: [VehicleService]
    }).compile();

    vehicleController = module.get<VehicleController>(VehicleController);
    newVehicle = new VehicleDTO({
      id: '1k13kjl10',
      vehicle: 'Polo',
      brand: 'Volkswagen',
      year: 2019,
      description: '1.6 MSI',
      created: new Date(),
      updated: new Date()
    });
  });


  describe('Criação', () => {
    it('Veículo gerado com SUCESSO.', () => {
      expect(vehicleController.createVehicle(newVehicle)).toStrictEqual(newVehicle);
    });

    it('EXCEÇÃO: veículo existente.', () => {
      expect(() => vehicleController.createVehicle(newVehicle)).toThrowError();
    });
  });
});
