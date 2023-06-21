import {
    IsString,
    IsNotEmpty,
    Length,
    Matches,
    IsEmail,
    Min,
    Max,
    IsNumber,
    IsInt
  } from "class-validator";
  
  export class UserRequest {
    id: number;
    @IsString()
    storeName: string;
  
    @IsString()
    @Length(10, 15)
    @Matches(/^[0-9]+$/)
    phone: string;
  
    @IsString()
    address: string;
  
    bankCode: string;
    accountNumber: string;
  
    @IsEmail()
    email: string;
  
    password: string;

    @IsInt()
    @Max(1)
    status: number;
  
    @IsString()
    cksRequest: string;
  
    @IsNumber()
    timeRequest: number;
    
    createAt: number;
    updateAt: number;
  }