import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UserModule } from 'src/user/user.module';
import { JwtModule } from '@nestjs/jwt';
import { jwtConstants } from './constants';
import { UserService } from 'src/user/user.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from 'src/user/entity/user.entity';
import { APP_GUARD } from '@nestjs/core';
import { AuthGuard } from './auth.guard';
import { EmailEntity } from 'src/email/entity/email.entity';
import { EmailModule } from 'src/email/email.module';
import { EmailService } from 'src/email/email.service';


@Module({
  imports: [
    UserModule,
    TypeOrmModule.forFeature([UserEntity,EmailEntity]),
    JwtModule.register({
      global: true,
      secret: jwtConstants.secret,
      signOptions: { expiresIn: '1d' },
    }),
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    UserService,
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
    EmailService
  ],
})
export class AuthModule {}
