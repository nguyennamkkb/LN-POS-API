import { BooksEntity } from 'src/books/books.entity/books.entity';
import { Entity, Column, PrimaryGeneratedColumn, OneToOne, ManyToOne, OneToMany } from 'typeorm';

@Entity()
export class CustomerEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  store_id: number;

  @Column()
  fullName: string;

  @Column({ length: 15 })
  phone: string;

  @Column({ nullable: true })
  address: string;

  @Column({ type: 'bigint', nullable: true })
  birthday: string;

  @Column({ type: 'int', width: 1, default: 0 })
  gender: number;

  @Column({ type: 'text', nullable: true })
  image: string;

  @Column({ type: 'varchar', width: 150, nullable: true })
  email: string;

  @Column()
  keySearch: string;

  @Column({ type: 'int', default: 0 })
  loyalty: number;

  @Column({ default: 1 })
  status: number;

  @Column({ type: 'bigint' })
  createAt: string;

  @Column({ type: 'bigint' })
  updateAt: string;

  @OneToMany(() => BooksEntity, (book) => book.customer) // specify inverse side as a second parameter
  books: BooksEntity

}
