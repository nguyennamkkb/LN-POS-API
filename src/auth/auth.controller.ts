import { AuthService } from './auth.service';
import {
  Controller,
  Get,
  Post,
  Body,
  Put,
  Param,
  Delete,
  Query,
  UseGuards,
  Request,
} from '@nestjs/common';
import { ResponseHelper } from 'helper/common/response.helper';
import { ApiResponse } from 'helper/common/response.interface';
import { UpdateResult } from 'typeorm/query-builder/result/UpdateResult';
import { Common } from 'helper/common/common';
import { UserEntity } from 'src/user/entity/user.entity';
import { AuthGuard } from './auth.guard';
import { Public } from './public.decorator';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Public()
  @Post('signin')
  async signIn(@Body() item): Promise<ApiResponse<UserEntity>> {
    try {
      
      const mk = Common.MD5Hash(Common.keyApp+item.password)
      const res = await this.authService.signIn(item.phone, mk)
      if (res) {
        return ResponseHelper.success(res);
      }else {
        return ResponseHelper.error(0, "Kiểm tra lại số điện thoại hoặc mật khẩu");
      }
      // return ResponseHelper.success(res);
      
    } catch (error) {
      return ResponseHelper.error(0, error);
    }
  }

}
