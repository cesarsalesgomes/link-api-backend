import { Test } from '@nestjs/testing';
import { ConfigModule } from '@nestjs/config';
import { DatabaseTestModule } from '../database/database-test.module';
import {
  RemoteService, FipeBrand, FipeModel, FipeYear, FipeDetails
} from './remote.service';
import { RemoteModule } from './remote.module';

describe('Serviços remotos', () => {
  let remoteService: RemoteService;
  let FipeAudiBrand: FipeBrand;
  let FipeAudiModel: FipeModel;
  let FipeAudiYear: FipeYear;
  let FipeAudiDetails: FipeDetails;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({ isGlobal: true }),
        DatabaseTestModule,
        RemoteModule
      ]
    }).compile();

    remoteService = moduleRef.get<RemoteService>(RemoteService);

    // Audi Fipe Brand
    FipeAudiBrand = {
      nome: 'Audi',
      codigo: '6'
    };
    // Audi Fipe A4 Model
    FipeAudiModel = {
      nome: 'A4 1.8  Aut.',
      codigo: 68
    };
    // Audi Fipe A4 Year
    FipeAudiYear = {
      nome: '2001 Gasolina',
      codigo: '2001-1'
    };
    // Audi Fipe A4 Details
    FipeAudiDetails = {
      Valor: 'R$ 18.951,00',
      Marca: 'Audi',
      Modelo: 'A4 1.8  Aut.',
      AnoModelo: 2001,
      Combustivel: 'Gasolina',
      CodigoFipe: '008047-0',
      MesReferencia: 'março de 2020 ',
      TipoVeiculo: 1,
      SiglaCombustivel: 'G'
    };
  });

  describe('FIPE', () => {
    it('Checa marcas retornadas com sucesso.', async () => {
      const brands = await remoteService.getBrands();

      expect(brands).toEqual(
        expect.arrayContaining([
          expect.objectContaining(FipeAudiBrand)
        ])
      );
    });

    it('Checa modelos de uma marca retornados com sucesso.', async () => {
      const models = await remoteService.getBrandModels(FipeAudiBrand.codigo);

      expect(models).toEqual(
        expect.arrayContaining([
          expect.objectContaining(FipeAudiModel)
        ])
      );
    });

    it('Checa anos de um modelo retornados com sucesso.', async () => {
      const years = await remoteService.getModelYears(FipeAudiBrand.codigo, String(FipeAudiModel.codigo));

      expect(years).toEqual(
        expect.arrayContaining([
          expect.objectContaining(FipeAudiYear)
        ])
      );
    });

    it('Checa detalhes de um modelo retornado com sucesso.', async () => {
      const details = await remoteService.getModelDetails(FipeAudiBrand.codigo, String(FipeAudiModel.codigo), FipeAudiYear.codigo);

      expect(details).toStrictEqual(FipeAudiDetails);
    });
  });
});
