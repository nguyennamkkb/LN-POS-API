import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from 'src/user/entity/user.entity';
import { UserService } from 'src/user/user.service';
import { EmailController } from './email.controlelr';
import { EmailService } from './email.service';
import { EmailEntity } from './entity/email.entity';



@Module({
    imports: [TypeOrmModule.forFeature([EmailEntity,UserEntity])],
    providers: [EmailService,UserService],
    controllers: [EmailController]
})
export class EmailModule {}
