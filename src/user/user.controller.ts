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
} from "@nestjs/common";
import { UserService } from "./user.service";
import { ResponseHelper } from "helper/common/response.helper";
import { ApiResponse } from "helper/common/response.interface";
import { UpdateResult } from "typeorm/query-builder/result/UpdateResult";
import { Common } from "helper/common/common";
import { Public } from "src/auth/public.decorator";
import { writeLogToFile } from "./../../helper/common/logger";
import { UserRequest } from "./user.entity/user.request";
import { UserEntity } from "./entity/user.entity";
const fs = require("fs");

@Controller("user")
export class UserController {
  constructor(private readonly services: UserService) {}

  @Public()
  @Post()
  async create(@Body() item): Promise<ApiResponse<UserEntity>> {
    try {
      if (await Common.verifyRequest(item.cksRequest, item.timeRequest)) {
        writeLogToFile(`UserController signup input ${JSON.stringify(item)}`);
        const findUSer = await this.services.findByPhone(item.phone);
        if (findUSer) {
          const mk = Common.MD5Hash(Common.keyApp + item.password);
          item.password = mk;
          const res = await this.services.create(item);
          return ResponseHelper.success(res);
        } else {
          return ResponseHelper.error(0, "Số điện thoại đã tồn tại");
        }
      } else {
        return ResponseHelper.error(0, "Sai cks");
      }
    } catch (error) {
      return ResponseHelper.error(0, error);
    }
  }
  @Public()
  @Post("checkuser")
  async checkuser(@Body() item: any): Promise<ApiResponse<UserEntity>> {
    try {
      if (await Common.verifyRequest(item.cksRequest, item.timeRequest)) {
        writeLogToFile(`UserController checkuser input ${JSON.stringify(item)}` );
        const findUSer = await this.services.findByPhone(item.phone);
        if (findUSer) {
          return ResponseHelper.error(0, "Số điện thoại đã tồn tại");
        } else {
          return ResponseHelper.customise(200, "OK");
        }
      } else {
        return ResponseHelper.error(0, "Sai cks");
      }
    } catch (error) {
      return ResponseHelper.error(0, error);
    }
  }

  @Get()
  async findAll(
    @Query("page") page: number = 1,
    @Query("limit") limit: number = 10,
    @Query() params
  ): Promise<ApiResponse<UserEntity[]>> {
    try {
      if (await Common.verifyRequest(params.cksRequest, params.timeRequest)) {
        writeLogToFile(
          `UserController findAll input ${JSON.stringify(params)}`
        );
        const [res, totalCount] = await this.services.findAll(page, limit);
        var response = {
          statusCode: 200,
          message: "Thành công!",
          data: res,
          meta: {
            totalCount,
            currentPage: page,
            totalPages: Math.ceil(totalCount / limit),
          },
        };
        writeLogToFile(
          `UserController findAll res ${JSON.stringify(response)}`
        );
        return response;
      }
    } catch (error) {
      writeLogToFile(`UserController findAll catch ${JSON.stringify(error)}`);
      return ResponseHelper.error(0, error);
    }
  }

  @Get(":id")
  async findOne(
    @Param() param,
    @Query() query
  ): Promise<ApiResponse<UserEntity>> {
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
  async update(@Body() body): Promise<ApiResponse<UpdateResult>> {
    try {
      writeLogToFile(`UserController update input ${JSON.stringify(body)}`);
      if (await Common.verifyRequest(body.cksRequest, body.timeRequest)) {
        delete body["cksRequest"];
        delete body["timeRequest"];
        const res = await this.services.update(body);
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
        const res = await this.services.remove(param.id);
        return ResponseHelper.success(res);
      }
    } catch (error) {
      return ResponseHelper.error(0, error);
    }
  }
}
