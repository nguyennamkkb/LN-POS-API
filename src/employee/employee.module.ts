import { Module } from '@nestjs/common';
import { EmployeeService } from './employee.service';
import { EmployeeController } from './employee.controller';
import { EmployeeEntity } from './employee.entity/employee.entity';
import { TypeOrmModule } from '@nestjs/typeorm/dist/typeorm.module';
import { UserEntity } from 'src/user/user.entity/user.entity';
import { UserService } from 'src/user/user.service';

@Module({
  imports: [TypeOrmModule.forFeature([EmployeeEntity, UserEntity])],
  providers: [EmployeeService, UserService],
  controllers: [EmployeeController]
})
export class EmployeeModule {}
