import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { UserEntity } from './entity/user.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JWTUtil } from 'src/auth/JWTUtil';
import { EmailService } from 'src/email/email.service';
import { EmailEntity } from 'src/email/entity/email.entity';

@Module({
  imports: [TypeOrmModule.forFeature([UserEntity,EmailEntity])],
  providers: [UserService,JWTUtil,EmailService],
  controllers: [UserController]
})
export class UserModule {}
