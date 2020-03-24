export class VehicleDTO {
  id: string;

  vehicle: string;

  brand: string;

  year: number;

  description: string;

  created: Date;

  updated: Date;

  constructor(partial: Partial<VehicleDTO>) {
    Object.assign(this, partial);
  }
}
