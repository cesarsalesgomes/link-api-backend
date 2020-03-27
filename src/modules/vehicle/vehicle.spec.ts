import { Test } from '@nestjs/testing';
import { ConfigModule } from '@nestjs/config';
import { VehicleController } from './vehicle.controller';
import { VehicleDTO } from './vehicle.dto';
import { VehicleModule } from './vehicle.module';
import { DatabaseTestModule } from '../database/database-test.module';
import { VehicleService } from './vehicle.service';
import { VehicleBO } from './vehicle.bo';
import { RemoteModule } from '../remote/remote.module';
import { RemoteService, FipeDetails } from '../remote/remote.service';

describe('Veículos CRUD', () => {
  let vehicleDTO: VehicleDTO;
  let vehicleService: VehicleService;
  let vehicleController: VehicleController;
  let vehicleBO: VehicleBO;
  let remoteService: RemoteService;

  beforeAll(async () => {
    /**
     * Inicializa módulo com base de dados em memória
     */
    const moduleRef = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({ isGlobal: true }),
        DatabaseTestModule,
        VehicleModule,
        RemoteModule
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
    vehicleBO = moduleRef.get<VehicleBO>(VehicleBO);
    remoteService = moduleRef.get<RemoteService>(RemoteService);
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

    it('Checa retorno dos veículos da base por paginação.', async () => {
      const vehiclePolo2020 = { ...vehicleDTO, year: 2020 };
      const vehiclePolo2021 = { ...vehicleDTO, year: 2021 };
      const vehiclePolo2022 = { ...vehicleDTO, year: 2022 };
      const vehiclePolo2023 = { ...vehicleDTO, year: 2023 };
      const vehiclePolo2024 = { ...vehicleDTO, year: 2024 };

      await vehicleController.createVehicle(vehicleDTO);
      await vehicleController.createVehicle(vehiclePolo2020);
      await vehicleController.createVehicle(vehiclePolo2021);
      await vehicleController.createVehicle(vehiclePolo2022);
      await vehicleController.createVehicle(vehiclePolo2023);
      await vehicleController.createVehicle(vehiclePolo2024);

      // Página: 0 - Tamanho da página: 3
      const { vehicles, total } = await vehicleController.getVehiclesPaginated(0, 3);

      expect(vehicles).toEqual(
        expect.arrayContaining([
          expect.objectContaining(vehicleDTO),
          expect.objectContaining(vehiclePolo2020),
          expect.objectContaining(vehiclePolo2021)
        ])
      );
      expect(total).toEqual(6);

      // Página: 1 - Tamanho da página: 3
      expect((await vehicleController.getVehiclesPaginated(1, 3))?.vehicles).toEqual(
        expect.arrayContaining([
          expect.objectContaining(vehiclePolo2022),
          expect.objectContaining(vehiclePolo2023),
          expect.objectContaining(vehiclePolo2024)
        ])
      );
    });

    it('Checa retorno dos veículos da base por paginação + filtro.', async () => {
      await vehicleController.createVehicle(vehicleDTO);

      const { vehicles } = await vehicleController.getVehiclesPaginated(0, 1, 'Polo');

      expect(vehicles).toEqual(
        expect.arrayContaining([
          expect.objectContaining(vehicleDTO)
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

  describe('Atualização', () => {
    it('Atualiza os dados de um veículo | Checa se campo de data de atualização foi alterado.', async () => {
      const vehicle = await vehicleController.createVehicle(vehicleDTO);

      const oldDate = vehicle.updated;

      // Aguarda 1 segundo para que data atualizada seja diferente da data criada
      await new Promise((resolve) => setTimeout(resolve, 1000));

      await vehicleController.updateVehicle(vehicle.id, new VehicleDTO({ year: 2020 }));

      const updatedVehicle = await vehicleService.findById(vehicle.id);

      expect(updatedVehicle.year).toEqual(2020);
      expect(updatedVehicle.updated).not.toEqual(oldDate);
    });
  });

  describe('Busca do código FIPE de uma marca', () => {
    it('Código FIPE da marca retornado com sucesso.', async () => {
      const fipeBrand = await vehicleBO.getFipeBrand('Audi');

      expect(fipeBrand).toStrictEqual(fipeBrand);
    });

    it('Código FIPE da marca não encontrado.', async () => {
      await expect(vehicleBO.getFipeBrand('Marca inexistente')).rejects.toThrow();
    });
  });

  describe('Bulk Create', () => {
    const fipeDetailVehicle: FipeDetails = {
      Valor: 'R$ 12.336,00',
      Marca: 'Audi',
      Modelo: '100 2.8 V6',
      AnoModelo: 1995,
      Combustivel: 'Gasolina',
      CodigoFipe: '008030-6',
      MesReferencia: 'março de 2020 ',
      TipoVeiculo: 1,
      SiglaCombustivel: 'G'
    };

    it('Verifica se um veículo foi adicionado com sucesso.', async () => {
      jest.spyOn(remoteService, 'getBrands').mockImplementation(async () => [{
        nome: 'Audi',
        codigo: '6'
      }]);
      jest.spyOn(remoteService, 'getBrandModels').mockImplementation(async () => [{
        nome: '100 2.8 V6',
        codigo: 43
      }]);
      jest.spyOn(remoteService, 'getModelYears').mockImplementation(async () => [{
        nome: '2001 Gasolina',
        codigo: '2001-1'
      }]);
      jest.spyOn(remoteService, 'getModelDetails').mockImplementation(async () => fipeDetailVehicle);

      const vehicles = await vehicleController.bulkCreateVehicles('Audi');

      expect(vehicles).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            vehicle: fipeDetailVehicle.Modelo,
            brand: fipeDetailVehicle.Marca,
            year: fipeDetailVehicle.AnoModelo,
            description: `Valor: ${fipeDetailVehicle.Valor} | Combustível: ${fipeDetailVehicle.Combustivel}`
          })
        ])
      );
    });
  });
});
