import {
    IsString,
    IsNotEmpty,
    Length,
    Matches,
    IsEmail,
    Min,
    Max,
    IsNumber
  } from "class-validator";
  
  export class UserRequest {
    id: number;
    storeName: string;
  
    @IsString()
    @IsNotEmpty()
    @Length(10, 15)
    @Matches(/^[0-9]+$/)
    phone: string;
  
    @IsString()
    address: string;
  
    
    bankCode: string;
    accountNumber: string;

    email: string;
  
    @IsNotEmpty()
    password: string;
      
    status: number;
  
    @IsString()
    @IsNotEmpty()
    cksRequest: string;
  
    @IsNotEmpty()
    @IsNumber()
    timeRequest: number;
    
    createAt: number;
    updateAt: number;
  }