import {
  Controller,
  Get,
  Post,
  Body,
  Put,
  Param,
  Delete,
  Query,
} from "@nestjs/common";
import { BooksService } from "./books.service";
import { BooksEntity } from "./entity/books.entity";
import { ResponseHelper } from "helper/common/response.helper";
import { ApiResponse } from "helper/common/response.interface";
import { UpdateResult } from "typeorm/query-builder/result/UpdateResult";
import { Common } from "./../../helper/common/common";
import { EmployeeService } from "src/employee/employee.service";
import { CustomerService } from "src/customer/customer.service";
import { UserService } from "src/user/user.service";

@Controller("books")
export class BooksController {
  constructor(
    private readonly services: BooksService,
    private readonly employeeServices: EmployeeService,
    private readonly customerServices: CustomerService,
    private readonly userServices: UserService
  ) {}

  @Post()
  async create(@Body() body): Promise<ApiResponse<BooksEntity>> {
    try {
      if (await Common.verifyRequest(body.cksRequest, body.timeRequest)) {
        const employee = await this.employeeServices.findOne(body.idEmployee);
        const customer = await this.customerServices.findOne(body.idCustomer);
        const user = await this.userServices.findOne(body.store_id);
        if (employee && customer && user) {
          const res = await this.services.create(body);
          return ResponseHelper.success(res);
        } else {
          return ResponseHelper.error(
            0,
            "Mã cửa hàng/nhân viên/khach hàng không tồn tại"
          );
        }
      }
    } catch (error) {
      return ResponseHelper.error(0, error);
    }
  }

  @Get()
  async findAll(
    @Query("page") page: number = 1,
    @Query("limit") limit: number = 10,
    @Query() query
  ): Promise<ApiResponse<BooksEntity[]>> {
    try {
      if (await Common.verifyRequest(query.cksRequest, query.timeRequest)) {
        const [res, totalCount] = await this.services.findAll(
          page,
          limit,
          query
        );
        return {
          statusCode: 200,
          message: "Thành công!",
          data: res,
          meta: {
            totalCount,
            currentPage: page,
            totalPages: Math.ceil(totalCount / limit),
          },
        };
      }
    } catch (error) {
      return ResponseHelper.error(0, error);
    }
  }

  @Get(":id")
  async findOne(
    @Param() param,
    @Query() query
  ): Promise<ApiResponse<BooksEntity>> {
    try {
      if (await Common.verifyRequest(query.cksRequest, query.timeRequest)) {
        const res = await this.services.findOne(param.id);
        return ResponseHelper.success(res);
      }
    } catch (error) {
      return ResponseHelper.error(0, error);
    }
  }
  @Put()
  async update(@Body() body): Promise<ApiResponse<any>> {
    try {
      if (await Common.verifyRequest(body.cksRequest, body.timeRequest)) {
        const book = await this.services.findOne(body.id);
        if (book.status == 4) {
          return ResponseHelper.error(0, "Lỗi");
        }
        const updateBook = await this.services.update(body);
        
        if (updateBook.affected == 1 && book.status != 4 && body.status == 4) {
          const customer = await this.customerServices.findOne(body.idCustomer);
          customer.loyalty = customer.loyalty + book.amount;
          const updateCustomer = await this.customerServices.update(customer);

          if (updateCustomer.affected == 1) {
            return ResponseHelper.success(200, "Thành công");
          }
        } else if (updateBook.affected == 1) {
          return ResponseHelper.success(updateBook);
        }
      }
      return ResponseHelper.error(0, "Lỗi");
    } catch (error) {
      return ResponseHelper.error(0, error);
    }
  }

  @Delete(":id")
  async remove(@Param() param, @Query() query) {
    try {
      if (await Common.verifyRequest(query.cksRequest, query.timeRequest)) {
        const res = await this.services.remove(param.id);
        return ResponseHelper.success(res);
      }
    } catch (error) {
      return ResponseHelper.error(0, error);
    }
  }
}
