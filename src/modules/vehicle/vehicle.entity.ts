import {
  Entity, Column, PrimaryGeneratedColumn, Check
} from 'typeorm';

@Entity({
  name: 'TB_VHC'
})
@Check('"year" >= 0')
export class Stock {
  @PrimaryGeneratedColumn()
  id: string;

  @Column()
  vehicle: string;

  @Column()
  brand: string;

  @Column()
  year: number;

  @Column()
  description: string;

  @Column()
  created: Date;

  @Column()
  updated: Date;
}
