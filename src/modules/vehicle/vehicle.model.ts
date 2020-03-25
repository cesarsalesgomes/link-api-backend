import { Schema, Document } from 'mongoose';

export const VehicleSchema = new Schema({
  vehicle: {
    type: String,
    trim: true,
    required: true
  },
  brand: {
    type: String,
    trim: true,
    required: true
  },
  year: {
    type: Number,
    required: true
  },
  description: {
    type: String,
    trim: true,
    required: true
  },
  created: {
    type: Date,
    required: true
  },
  updated: {
    type: Date,
    required: true
  }
});

// Chave secundária
VehicleSchema.index({
  vehicle: 1,
  brand: 1,
  year: 1,
  description: 1
}, {
  unique: true
});

export interface Vehicle extends Document {
  vehicle: string;
  brand: string;
  year: number;
  description: string;
  created: Date;
  updated: Date;
}
