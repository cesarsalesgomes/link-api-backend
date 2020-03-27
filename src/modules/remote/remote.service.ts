import { Injectable, HttpService, InternalServerErrorException } from '@nestjs/common';
import { RemoteExceptions } from './remote.exceptions';

export interface FipeBrand {
  nome: string;
  codigo: string;
}

export interface FipeModel {
  nome: string;
  codigo: number;
}

export interface FipeYear {
  nome: string;
  codigo: string;
}

@Injectable()
export class RemoteService {
  constructor(private httpService: HttpService) { }

  async getBrands(): Promise<FipeBrand[]> {
    let brands: FipeBrand[];

    try {
      brands = (await this.httpService.get('https://parallelum.com.br/fipe/api/v1/carros/marcas').toPromise())?.data;
    } catch (error) {
      throw new InternalServerErrorException({ message: RemoteExceptions.FIPE_FETCH_ERROR });
    }

    return brands;
  }

  async getBrandModels(brand: string): Promise<FipeModel[]> {
    let models: FipeModel[];

    try {
      models = (await this.httpService.get(`https://parallelum.com.br/fipe/api/v1/carros/marcas/${brand}/modelos`).toPromise())?.data?.modelos;
    } catch (error) {
      throw new InternalServerErrorException({ message: RemoteExceptions.FIPE_FETCH_ERROR });
    }

    return models;
  }

  async getModelYears(brand: string, model: string): Promise<FipeYear[]> {
    let years: FipeYear[];

    try {
      years = (await this.httpService.get(`https://parallelum.com.br/fipe/api/v1/carros/marcas/${brand}/modelos/${model}/anos`).toPromise())?.data;
    } catch (error) {
      throw new InternalServerErrorException({ message: RemoteExceptions.FIPE_FETCH_ERROR });
    }

    return years;
  }
}
