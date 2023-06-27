import { Injectable } from "@nestjs/common/decorators";
import { JwtService } from "@nestjs/jwt";

@Injectable()
export class JWTUtil {
    constructor(private readonly jwtService: JwtService) {}
    decode(auth: string): Access{
        const jwt = auth.replace('Bearer ', '');
        return this.jwtService.decode(jwt, { json: true }) as Access;
    }
}
class Access {
    shop: string
    key: string
    iat: number
    exp: number
}