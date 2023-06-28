
import { JwtService } from "@nestjs/jwt";
export class JWTUtil {
    
    constructor(private readonly jwtService: JwtService) {}
    decode(auth: string): Access{
        const jwt = auth.replace('Bearer ', '');
        return this.jwtService.decode(jwt, { json: true }) as Access;
    }
    getIdShop(s: string): number{
        return Number(s.substring(32,s.length))
      }
}
class Access {
    shop: string
    key: string
    iat: number
    exp: number
}