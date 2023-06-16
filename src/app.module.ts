import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import {databaseConfig} from '../config/database.config'
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { RoleModule } from './role/role.module';
import { CustomerModule } from './customer/customer.module';
import { EmployeeModule } from './employee/employee.module';
import { BooksModule } from './books/books.module';
import { ProductModule } from './product/product.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      port: 3306,
      username: 'root',
      password: databaseConfig.password,
      database: 'ln_pos_db',
      entities: [__dirname + '/**/*.entity{.ts,.js}'],
      synchronize: true,
    }),
    AuthModule,
    UserModule,
    RoleModule,
    AuthModule,
    CustomerModule,
    EmployeeModule,
    BooksModule,
    ProductModule,
  ]
})
export class AppModule { }
