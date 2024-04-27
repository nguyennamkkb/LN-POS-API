import { BooksEntity } from 'src/books/entity/books.entity';
import { Entity, Column, PrimaryGeneratedColumn, OneToOne, JoinColumn, OneToMany, ManyToOne } from 'typeorm';

@Entity()
export class EmployeeEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  store_id: number;

  @Column()
  fullName: string;

  @Column({ length: 15 })
  phone: string;

  @Column({ type: 'int', width: 1, default: 0 })
  gender: number;

  @Column({ type: 'bigint', nullable: true })
  birthday: string;

  @Column({ nullable: true })
  address: string;


  @Column({ type: 'text', nullable: true })
  image: string;

  @Column({ default: 1 })
  type: number;

  @Column()
  keySearch: string;

  @Column({ type: 'int',default: 0 })
  luotKhach: number;

  @Column({ default: 1 })
  status: number;

  @Column({ type: 'bigint' })
  createAt: string;

  @Column({ type: 'bigint' })
  updateAt: string;

  @OneToMany(() => BooksEntity, (book) => book.employee) // specify inverse side as a second parameter
  books: BooksEntity
}
