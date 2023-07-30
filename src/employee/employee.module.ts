import { Module } from '@nestjs/common';
import { EmployeeService } from './employee.service';
import { EmployeeController } from './employee.controller';
import { EmployeeEntity } from './entity/employee.entity';
import { TypeOrmModule } from '@nestjs/typeorm/dist/typeorm.module';
import { UserEntity } from 'src/user/entity/user.entity';
import { UserService } from 'src/user/user.service';
import { JWTUtil } from 'src/auth/JWTUtil';

@Module({
  imports: [TypeOrmModule.forFeature([EmployeeEntity, UserEntity])],
  providers: [EmployeeService, UserService,JWTUtil],
  controllers: [EmployeeController]
})
export class EmployeeModule {}
