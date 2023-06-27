import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Common } from 'helper/common/common';
import { UserService } from 'src/user/user.service';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UserService,
    private jwtService: JwtService,
  ) {}

  async signIn(phone: string, pass: string): Promise<any> {
    const user = await this.usersService.findOneByPhonePassword(phone, pass);
    if (!user) {
      throw new UnauthorizedException();
    }
    const payload = {
      shop: user.id+Common.makeRandomStringWithLength(5),
      key: Common.MD5Hash(
        user.phone + Common.makeRandomStringWithLength(5),
      ),
    };
    user['access_token'] = await this.jwtService.signAsync(payload)
    return user;
  }
}
