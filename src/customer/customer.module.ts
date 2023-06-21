import { Module } from '@nestjs/common';
import { CustomerService } from './customer.service';
import { CustomerController } from './customer.controller';
import { TypeOrmModule } from '@nestjs/typeorm/dist/typeorm.module';
import { CustomerEntity } from './entity/customer.entity';
import { UserEntity } from 'src/user/entity/user.entity';
import { UserService } from 'src/user/user.service';

@Module({
  imports: [TypeOrmModule.forFeature([CustomerEntity,UserEntity])],
  providers: [CustomerService,UserService],
  controllers: [CustomerController]
})
export class CustomerModule {}
