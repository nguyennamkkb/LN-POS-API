import { CustomerEntity } from 'src/customer/customer.entity/customer.entity';
import { EmployeeEntity } from 'src/employee/employee.entity/employee.entity';
import { Entity, Column, PrimaryGeneratedColumn, OneToOne, JoinColumn, ManyToOne } from 'typeorm';

@Entity()
export class BooksEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  store_id: number;

  @Column({ type: 'bigint' })
  start: string;

  @Column({ width: 11 })
  idEmployee: number;

  @Column({ width: 11 })
  idCustomer: number;

  @Column({ type: 'longtext', nullable: false })
  listService: String;

  @Column({ width: 11 })
  amount: number;

  @Column({ default: 1 })
  status: number;

  @Column({ type: 'bigint' })
  createAt: string;

  @Column({ type: 'bigint' })
  updateAt: string;
  
  @ManyToOne(() => EmployeeEntity, employee => employee.books)
  @JoinColumn({ name: 'idEmployee' })
  employee: EmployeeEntity;

    
  @ManyToOne(() => CustomerEntity, customer => customer.books)
  @JoinColumn({name: 'idCustomer'})
  customer: CustomerEntity;
}
