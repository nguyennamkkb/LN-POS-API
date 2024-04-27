import { JwtService } from "@nestjs/jwt";
import e from "express";

export class JWTUtil {
  constructor(private jwtService: JwtService) {}

  async decode(auth: string): Promise<Access> {
    try {
        const jwt = auth.replace("Bearer ", "");
        // console.log(jwt)
        return this.jwtService.decode(jwt, { json: true }) as Access;
    } catch (error) {
        // console.log(error)
    }
   
  }
}
class Access {
  role:string;
  id: string;
  email: string;
  time: string;
  key: string;
}
