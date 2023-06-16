import { Module } from '@nestjs/common';
import { BooksService } from './books.service';
import { BooksController } from './books.controller';
import { BooksEntity } from './books.entity/books.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EmployeeEntity } from 'src/employee/employee.entity/employee.entity';
import { CustomerEntity } from 'src/customer/customer.entity/customer.entity';
import { EmployeeService } from 'src/employee/employee.service';
import { CustomerService } from 'src/customer/customer.service';
import { UserEntity } from 'src/user/user.entity/user.entity';
import { UserService } from 'src/user/user.service';

@Module({
  imports: [TypeOrmModule.forFeature([BooksEntity, UserEntity, EmployeeEntity,CustomerEntity])],
  providers: [BooksService, UserService, EmployeeService, CustomerService],
  controllers: [BooksController]
})
export class BooksModule {}
