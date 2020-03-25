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

  describe('Listagem', () => {
    it('Retorna todos os veículos da base.', async () => {
      const vehiclePolo2020 = { ...vehicleDTO, year: 2020 };
      const vehiclePolo2021 = { ...vehicleDTO, year: 2021 };

      await vehicleController.createVehicle(vehicleDTO);
      await vehicleController.createVehicle(vehiclePolo2020);
      await vehicleController.createVehicle(vehiclePolo2021);

      const vehicles = await vehicleController.getVehicles();

      expect(vehicles).toEqual(
        expect.arrayContaining([
          expect.objectContaining(vehicleDTO),
          expect.objectContaining(vehiclePolo2020),
          expect.objectContaining(vehiclePolo2021)
        ])
      );
    });
  });

  describe('Detalhe', () => {
    it('Retorna um veículo por id.', async () => {
      const vehicle = await vehicleController.createVehicle(vehicleDTO);

      const vehicleSearched = await vehicleController.getVehicle(vehicle.id);

      expect(vehicleSearched).toBeDefined();
    });
  });

  describe('Remoção', () => {
    it('Deleta um veículo por id.', async () => {
      let vehicle = await vehicleController.createVehicle(vehicleDTO);

      await vehicleController.deleteVehicle(vehicle.id);

      vehicle = await vehicleService.findOne();

      expect(vehicle).toBeNull();
    });
  });
});
