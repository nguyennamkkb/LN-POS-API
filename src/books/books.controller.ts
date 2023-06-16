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
import { BooksService } from './books.service';
import { BooksEntity } from './books.entity/books.entity';
import { ResponseHelper } from 'helper/common/response.helper';
import { ApiResponse } from 'helper/common/response.interface';
import { UpdateResult } from 'typeorm/query-builder/result/UpdateResult';
import { Common } from './../../helper/common/common';
import { EmployeeService } from 'src/employee/employee.service';
import { CustomerService } from 'src/customer/customer.service';
import { UserService } from 'src/user/user.service';


@Controller('books')
export class BooksController {
  constructor(private readonly services: BooksService, private readonly employeeServices: EmployeeService, private readonly customerServices: CustomerService, private readonly userServices: UserService ) {}

  @Post()
  async create(@Body() item: BooksEntity): Promise<ApiResponse<BooksEntity>> {
    try {
      const employee = await this.employeeServices.findOne(item.idEmployee)
      const customer =  await this.customerServices.findOne(item.idCustomer)
      const user =  await this.userServices.findOne(item.store_id)

      if (employee.length > 0 && customer.length > 0 && user ) {
        const res = await this.services.create(item);
        return ResponseHelper.success(res);
      }else {
        return ResponseHelper.error(0, "Mã cửa hàng/nhân viên/khach hàng không tồn tại");
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
  ): Promise<ApiResponse<BooksEntity[]>> {
    try {
      const [res, totalCount] = await this.services.findAll(
        page,
        limit,
        params,
      );
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
  async findOne(@Param() param): Promise<ApiResponse<BooksEntity[]>> {
    try {
      const res = await this.services.findOne(param.id);
      return ResponseHelper.success(res);
    } catch (error) {
      return ResponseHelper.error(0, error);
    }
  }
  @Put()
  async update(@Body() item: BooksEntity): Promise<ApiResponse<UpdateResult>> {
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
