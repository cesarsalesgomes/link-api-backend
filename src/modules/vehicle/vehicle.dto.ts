import { IsNumber, IsString, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class VehicleDTO {
  @IsString()
  @IsOptional()
  @ApiProperty()
  vehicle?: string;

  @IsString()
  @IsOptional()
  @ApiProperty()
  brand?: string;

  @IsNumber()
  @IsOptional()
  @ApiProperty()
  year?: number;

  @IsString()
  @IsOptional()
  @ApiProperty()
  description?: string;

  constructor(partial: Partial<VehicleDTO>) {
    Object.assign(this, partial);
  }
}
