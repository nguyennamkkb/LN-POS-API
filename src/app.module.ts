import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { ConfigModule } from '@nestjs/config';

import {databaseConfig} from '../config/database.config'
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { RoleModule } from './role/role.module';
import { CustomerModule } from './customer/customer.module';
import { EmployeeModule } from './employee/employee.module';
import { BooksModule } from './books/books.module';
import { ProductModule } from './product/product.module';
import { ImagesController } from './image/images.controller';
import { TestController } from './test/test.controller';
import { EmailModule } from './email/email.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forRoot({
      type: "mysql",
      host: process.env.DATABASE_HOST,
      port: 3306,
      username: process.env.DATABASE_USER,
      password: process.env.DATABASE_PASS,
      database: process.env.DATABASE_NAME,
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
    EmailModule
  ],
  controllers: [ImagesController, TestController]
  
})
export class AppModule { }
