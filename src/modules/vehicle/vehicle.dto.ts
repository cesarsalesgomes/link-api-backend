import { IsNumber, IsNotEmpty, IsString } from 'class-validator';

export class VehicleDTO {
  @IsNotEmpty()
  @IsString()
  vehicle: string;

  @IsNotEmpty()
  @IsString()
  brand: string;

  @IsNotEmpty()
  @IsNumber()
  year: number;

  @IsNotEmpty()
  @IsString()
  description: string;

  constructor(partial: Partial<VehicleDTO>) {
    Object.assign(this, partial);
  }
}
