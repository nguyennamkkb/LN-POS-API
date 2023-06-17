import {
  Controller,
  Get,
  Post,
  Body,
  Put,
  Param,
  Delete,
  Query,
  Patch,
} from '@nestjs/common';
import { UserService } from './user.service';
import { UserEntity } from './user.entity/user.entity';
import { ResponseHelper } from 'helper/common/response.helper';
import { ApiResponse } from 'helper/common/response.interface';
import { UpdateResult } from 'typeorm/query-builder/result/UpdateResult';
import { Common } from 'helper/common/common';
import { Public } from 'src/auth/public.decorator';
import { ImageUtil } from '../../helper/util/image.util';

const fs = require('fs');

import { writeLogToFile } from './../../helper/common/logger';

@Controller('user')
export class UserController {
  constructor(private readonly services: UserService) { }


  @Public()
  @Post()
  async create(@Body() item: UserEntity): Promise<ApiResponse<UserEntity>> {
    try {
      writeLogToFile(`UserController signup input ${JSON.stringify(item)}`)
      const findUSer = await this.services.findByPhone(item.phone);
      if (findUSer.length == 0) {
        const mk = Common.MD5Hash(Common.keyApp+item.password)
        item.password = mk
        const res = await this.services.create(item);
        return ResponseHelper.success(res);
      } else {
        return ResponseHelper.error(0, 'Số điện thoại đã tồn tại');
      }
    } catch (error) {
      return ResponseHelper.error(0, error);
    }
  }
  @Public()
  @Post('checkuser')
  async checkuser(@Body() item: UserEntity): Promise<ApiResponse<UserEntity>> {
    try {
      writeLogToFile(`UserController checkuser input ${JSON.stringify(item)}`)
      const findUSer = await this.services.findByPhone(item.phone);
      if (findUSer.length > 0) {
        return ResponseHelper.error(0, 'Số điện thoại đã tồn tại');
      } else {
        return ResponseHelper.customise(1, "OK");
      }
    } catch (error) {
      return ResponseHelper.error(0, error);
    }
  }

  @Get()
  async findAll(
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
    @Query() params
  ): Promise<ApiResponse<UserEntity[]>> {
    try {
      writeLogToFile(`UserController findAll input ${JSON.stringify(params)}`)
      const [res, totalCount] = await this.services.findAll(
        page,
        limit,
      );
      var response = {
        statusCode: 200,
        message: 'Thành công!',
        data: res,
        meta: {
          totalCount,
          currentPage: page,
          totalPages: Math.ceil(totalCount / limit),
        },
      }
      writeLogToFile(`UserController findAll res ${JSON.stringify(response)}`)
      return response;

    } catch (error) {
      writeLogToFile(`UserController findAll catch ${JSON.stringify(error)}`)
      return ResponseHelper.error(0, error);
    }
  }

  @Get(':id')
  async findOne(@Param() param): Promise<ApiResponse<UserEntity>> {
    try {
      const res = await this.services.findOne(param.id);
      return ResponseHelper.success(res);
    } catch (error) {
      return ResponseHelper.error(0, error);
    }
  }

  @Put()
  async update(@Body() item: UserEntity): Promise<ApiResponse<UpdateResult>> {
    try {
      const res = await this.services.update(item);
      return ResponseHelper.success(res);
    } catch (error) {
      return ResponseHelper.error(0, error);
    }
  }

  @Delete(':id')
  async remove(@Param() param) {
    try {
      const res = await this.services.remove(param.id);
      return ResponseHelper.success(res);
    } catch (error) {
      return ResponseHelper.error(0, error);
    }
  }
}
