
import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class ProductEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({nullable: false})
  store_id: number;

  @Column()
  name: string;

  @Column({ width: 11 })
  price: number;

  @Column({ type: 'text', nullable: true  })
  note: string;

  @Column({ width: 11, default: 1 })
  point: number;

  @Column({ type: 'text', nullable: true })
  image: string;

  @Column({ default: 1 })
  status: number;

  @Column({ type: 'bigint' })
  createAt: string;

  @Column({ type: 'bigint' })
  updateAt: string;
}
