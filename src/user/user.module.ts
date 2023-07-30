import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { UserEntity } from './entity/user.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JWTUtil } from 'src/auth/JWTUtil';

@Module({
  imports: [TypeOrmModule.forFeature([UserEntity])],
  providers: [UserService,JWTUtil],
  controllers: [UserController]
})
export class UserModule {}
