export class VehicleDTO {
  vehicle: string;

  brand: string;

  year: number;

  description: string;

  constructor(partial: Partial<VehicleDTO>) {
    Object.assign(this, partial);
  }
}
