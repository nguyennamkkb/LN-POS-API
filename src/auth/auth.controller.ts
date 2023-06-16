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
import { UserEntity } from 'src/user/user.entity/user.entity';
import { AuthGuard } from './auth.guard';
import { Public } from './public.decorator';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Public()
  @Post('signin')
  async signIn(@Body() item: UserEntity): Promise<ApiResponse<UserEntity>> {
    try {
      const res = await this.authService.signIn(item.phone, item.password);
      return ResponseHelper.success(res);
    } catch (error) {
      return ResponseHelper.error(0, error);
    }
  }

  @Public()
  @Get('profile')
  getProfile(@Query() req) {
    try {
        const res = req;
        return ResponseHelper.success(res);
      } catch (error) {
        return ResponseHelper.error(0, error);
      }
  }
}
