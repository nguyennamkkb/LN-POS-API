import { Injectable, UnauthorizedException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { Common } from "helper/common/common";
import { UserService } from "src/user/user.service";

@Injectable()
export class AuthService {
  constructor(
    private usersService: UserService,
    private jwtService: JwtService
  ) {}

  async signIn(email: string, pass: string): Promise<any> {

    
    const user = await this.usersService.findOneByEmailPassword(email, pass);
   
    
    if (!user) {
      throw new UnauthorizedException();
    }

    const time = Date.now();
    const payload = {
      role: user.role,
      id: user.id,

      email: user.email,
      time: time,
      key: Common.MD5Hash(
    
          user.email +
          time +
          Common.getKeyApp() +
          user.id +
          user.role
      ),
    };
    user["access_token"] = await this.jwtService.signAsync(payload);
    return user;
  }
}
