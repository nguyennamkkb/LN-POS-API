
import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class EmailEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({nullable: false, type: 'int'})
  user_id: number;

  @Column({  nullable: false,length: 10, type: 'varchar'})
  otp: string;

  @Column({ default: 1, type: 'int' }) //1: chua su dung, 2 da su dung
  status: number;

  @Column({ default: 1, type: 'int' }) // toi da den 3
  count: number;

  @Column({ type: 'bigint' })
  createAt: number;

  @Column({ type: 'bigint' })
  updateAt: number;
}
