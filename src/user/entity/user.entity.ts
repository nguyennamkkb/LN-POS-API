import { Entity, Column, PrimaryGeneratedColumn, Long } from 'typeorm';

const dateNow: string = Date.now().toString();

@Entity()
export class UserEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  storeName: string;

  @Column({ length: 15, unique: true })
  phone: string;

  @Column()
  address: string;
  
  @Column({length: 10,nullable: true, default: null})
  bankCode: string;
  
  @Column({length: 30,nullable: true, default:""})
  accountNumber: string;

  @Column({nullable: true})
  email: string;

  @Column()
  password: string;

  @Column({ default: 1 })
  status: number;

  @Column({type: 'bigint'})
  createAt: number;
  

  @Column({type: 'bigint'})
  updateAt: number;
}
