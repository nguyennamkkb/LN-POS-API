import {
  Controller,
  Get,
  Post,
  Body,
  Put,
  Param,
  Delete,
  Query,
} from '@nestjs/common';
import { CustomerService } from './customer.service';
import { CustomerEntity } from './entity/customer.entity';
import { ResponseHelper } from 'helper/common/response.helper';
import { ApiResponse } from 'helper/common/response.interface';
import { UpdateResult } from 'typeorm/query-builder/result/UpdateResult';
import { Common } from './../../helper/common/common'
import { UserService } from 'src/user/user.service';

@Controller('customer')
export class CustomerController {
  constructor(private readonly services: CustomerService, private readonly userService: UserService) { }

  @Post()
  async create(
    @Body() item: CustomerEntity,
  ): Promise<ApiResponse<CustomerEntity>> {
    try {
      const user = await this.userService.findById(item.store_id);
      if (user.length > 0) {
        item.keySearch = Common.removeAccents(item.fullName) + Common.removeAccents(item.address) + item.phone
        const res = await this.services.create(item);
        return ResponseHelper.success(res);
      }else{
        return ResponseHelper.error(0, "Mã cửa hàng không tồn tại");
      }


    } catch (error) {
      return ResponseHelper.error(0, error);
    }
  }

  @Get()
  async findAll(
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
    @Query() params,
  ): Promise<ApiResponse<CustomerEntity[]>> {
    try {
      const [res, totalCount] = await this.services.findAll(page, limit, params);
      return {
        statusCode: 200,
        message: 'Thành công!',
        data: res,
        meta: {
          totalCount,
          currentPage: page,
          totalPages: Math.ceil(totalCount / limit),
        },
      };
    } catch (error) {
      return ResponseHelper.error(0, error);
    }
  }

  @Get(':id')
  async findOne(@Param() param): Promise<ApiResponse<CustomerEntity[]>> {
    try {
      const res = await this.services.findOne(param.id);
      return ResponseHelper.success(res);
    } catch (error) {
      return ResponseHelper.error(0, error);
    }
  }
  @Put()
  async update(
    @Body() item: CustomerEntity,
  ): Promise<ApiResponse<UpdateResult>> {
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
