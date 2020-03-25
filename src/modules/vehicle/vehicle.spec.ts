import { Test } from '@nestjs/testing';
import { ConfigModule } from '@nestjs/config';
import { VehicleController } from './vehicle.controller';
import { VehicleDTO } from './vehicle.dto';
import { VehicleModule } from './vehicle.module';
import { DatabaseTestModule } from '../database/database-test.module';
import { VehicleService } from './vehicle.service';

describe('Veículos CRUD', () => {
  let vehicleDTO: VehicleDTO;
  let vehicleService: VehicleService;
  let vehicleController: VehicleController;

  beforeAll(async () => {
    /**
     * Inicializa módulo com base de dados em memória
     */
    const moduleRef = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({ isGlobal: true }),
        DatabaseTestModule,
        VehicleModule
      ]
    }).compile();

    vehicleDTO = new VehicleDTO({
      vehicle: 'Polo',
      brand: 'Volkswagen',
      year: 2019,
      description: '1.6 MSI'
    });

    vehicleService = moduleRef.get<VehicleService>(VehicleService);
    vehicleController = moduleRef.get<VehicleController>(VehicleController);
  });

  beforeEach(async () => {
    /* Limpa base de dados antes de cada teste */
    await vehicleService.deleteAll();
  });

  describe('Criação', () => {
    it('Veículo criado com sucesso.', async () => {
      await vehicleController.createVehicle(vehicleDTO);
      const vehicle = await vehicleService.findOne();

      expect(vehicle).toBeDefined();
    });

    it('Lança exceção caso mesmo veículo for criado novamente.', async () => {
      await vehicleController.createVehicle(vehicleDTO);
      await expect(vehicleController.createVehicle(vehicleDTO)).rejects.toThrow();
    });
  });
});
