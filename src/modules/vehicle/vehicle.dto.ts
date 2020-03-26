import { IsNumber, IsString, IsOptional } from 'class-validator';

export class VehicleDTO {
  @IsString()
  @IsOptional()
  vehicle?: string;

  @IsString()
  @IsOptional()
  brand?: string;

  @IsNumber()
  @IsOptional()
  year?: number;

  @IsString()
  @IsOptional()
  description?: string;

  constructor(partial: Partial<VehicleDTO>) {
    Object.assign(this, partial);
  }
}
