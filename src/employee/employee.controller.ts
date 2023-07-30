import {
  Controller,
  Get,
  Post,
  Body,
  Put,
  Param,
  Delete,
  Query,
  Headers,
} from "@nestjs/common";
import { EmployeeService } from "./employee.service";
import { EmployeeEntity } from "./entity/employee.entity";
import { ResponseHelper } from "helper/common/response.helper";
import { ApiResponse } from "helper/common/response.interface";
import { UpdateResult } from "typeorm/query-builder/result/UpdateResult";
import { Common } from "./../../helper/common/common";
import { UserEntity } from "src/user/entity/user.entity";
import { UserService } from "src/user/user.service";
import { DeleteResult } from "typeorm";
import { JWTUtil } from "src/auth/JWTUtil";
import { Public } from "src/auth/public.decorator";

@Controller("employee")
export class EmployeeController {
  constructor(
    private readonly service: EmployeeService,
    private readonly userService: UserService,
    private readonly jwtUtil: JWTUtil,
  ) {}

  @Post()
  async create(@Body() body): Promise<ApiResponse<EmployeeEntity>> {
    try {
      if (await Common.verifyRequest(body.cksRequest, body.timeRequest)) {
        const employee = await this.service.findByPhone(body.phone);
        if (employee) {
          return ResponseHelper.error(0, "Số điện thoại đã được sử dụng");
        }
        const user = await this.userService.findById(body.store_id);
        if (user) {
          body.keySearch =
            Common.removeAccents(body.fullName) +
            Common.removeAccents(body.address) +
            body.phone;
          const res = await this.service.create(body);
          return ResponseHelper.success(res);
        } else {
          return ResponseHelper.error(0, "Mã cửa hàng không tồn tại");
        }
      }
    } catch (error) {
      return ResponseHelper.error(0, error);
    }
  }

  // @Public()
  @Get()
  async findAll(
    @Query("page") page: number = 1,
    @Query("limit") limit: number = 10,
    @Query() query,
    @Headers('Authorization') auth: string
  ): Promise<ApiResponse<EmployeeEntity[]>> {
    try {

      if (await Common.verifyRequest(query.cksRequest, query.timeRequest)) {
        const [res, totalCount] = await this.service.findAll(
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
  ): Promise<ApiResponse<EmployeeEntity>> {
    try {
      if (await Common.verifyRequest(query.cksRequest, query.timeRequest)) {
        const res = await this.service.findOne(param.id);
        return ResponseHelper.success(res);
      }
    } catch (error) {
      return ResponseHelper.error(0, error);
    }
  }
  @Put()
  async update(@Body() body: any): Promise<ApiResponse<UpdateResult>> {
    try {
      if (await Common.verifyRequest(body.cksRequest, body.timeRequest)) {
        const employee = await this.service.findOne(body.id)
        if (employee == null) {
          return ResponseHelper.error(0, "Lỗi");
        }
        delete body["cksRequest"];
        delete body["timeRequest"];
        const res = await this.service.update(body);
        return ResponseHelper.success(res);
      }
    } catch (error) {
      return ResponseHelper.error(0, error);
    }
  }

  @Delete(":id")
  async remove(@Param() param, @Query() query) {
    try {
      if (await Common.verifyRequest(query.cksRequest, query.timeRequest)) {
        const employee = await this.service.findOne(param.id)
        const res = await this.service.remove(param.id);
        return ResponseHelper.success(res);
      }
    } catch (error) {
      return ResponseHelper.error(0, error);
    }
  }
}
