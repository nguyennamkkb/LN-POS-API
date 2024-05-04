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
  Headers,
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
import { JWTUtil } from "src/auth/JWTUtil";
import { InputCommon } from "helper/common/inputCommon";
import { UserCommon } from "helper/common/UserCommon";
import { EmailService } from "src/email/email.service";
const fs = require("fs");

@Controller("user")
export class UserController {
  constructor(
    private readonly services: UserService,
    private readonly jwtUtil: JWTUtil,
    private readonly emailSservice: EmailService
  ) {}

  @Public()
  @Post()
  async create(@Body() item): Promise<ApiResponse<UserEntity>> {
    try {
      if (
        item.cksRequest == null ||
        item.cksRequest == undefined ||
        item.cksRequest == "" ||
        item.email == null ||
        item.email == "" ||
        item.email == undefined ||
        item.password == null ||
        item.password == "" ||
        item.password == undefined ||
        item.password.length < 6 ||
        (await UserCommon.verifyEmail(item.email)) == false
      ) {
        return ResponseHelper.error(0, "Dữ liệu không hợp lệ");
      }

      if (await Common.verifyRequest(item.cksRequest, item.timeRequest)) {
        const findUSer = await this.services.findByEmail(item.email);
        if (findUSer == null) {
          const mk = Common.MD5Hash(process.env.KEY_APP + item.password);
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
        writeLogToFile(
          `UserController checkuser input ${JSON.stringify(item)}`
        );

        if ((await InputCommon.checkEmail(item.email)) == false) {
          return ResponseHelper.error(0, "Dữ liệu không đúng");
        }

        const findEmail = await this.services.findByEmail(item.email);

        if (findEmail) {
          return ResponseHelper.error(0, "Số email đã tồn tại");
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
    @Query("limit") limit: number = 100,
    @Query() params,
    @Headers("Authorization") auth: string
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
  async update(
    @Body() body,
    @Headers("Authorization") auth: string
  ): Promise<ApiResponse<UpdateResult>> {
    try {
      writeLogToFile(`UserController update input ${JSON.stringify(body)}`);
      if (await Common.verifyRequest(body.cksRequest, body.timeRequest)) {
        delete body["cksRequest"];
        delete body["timeRequest"];
        console.log("update"+ JSON.stringify(body));
        delete body["access_token"];
        delete body["password"];
        delete body["email"];
        // delete body["password"];


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
        // const store_id = await Common.getIdShop(query.cksRequest)
        // if ( store_id != query.id) {
        //   return ResponseHelper.error(0, "Lỗi");
        // }
        const res = await this.services.remove(param.id);
        return ResponseHelper.success(res);
      }
    } catch (error) {
      return ResponseHelper.error(0, error);
    }
  }
  @Public()
  @Post("verify") // otp
  async verify(@Body() item): Promise<ApiResponse<any>> {
    try {
      if (
        (await InputCommon.checkInputNormal([item.email, item.otp])) == false
      ) {
        return ResponseHelper.error(0, "Thiếu thông tin");
      }
      const user = await this.services.findByEmail(item.email);

      if (user == null || user == undefined) {
        return ResponseHelper.error(0, "Tài khoản không tồn tại");
      }

      const otp = await this.emailSservice.getOtpById(user.id);

      if (!otp) return ResponseHelper.error(0, "Loi 1");

      const timeNow = Date.now();
      const hieu2ThoiGian = timeNow - otp.updateAt;
      // ////console.log(hieu2ThoiGian);

      if (hieu2ThoiGian <= 300000) {
        // ////console.log(otp.otp);
        // ////console.log(item.otp);

        if (otp.otp == item.otp) {
          user.updateAt = timeNow;
          user.status = 1;
          await this.services.update(user);
          return ResponseHelper.success("Xác thục thành công");
        }
      }
      return ResponseHelper.error(0, "Loi 2");
    } catch (error) {
      return ResponseHelper.error(0, error);
    }
  }
  @Public()
  @Post('sendOtpFogotPassword')
  async sendOtpFogotPassword(@Body() item): Promise<ApiResponse<any>> {
    try {
  
      const user = await this.services.findByEmail(item.email)
      if (user == null) {
        return ResponseHelper.error(0, "Tài khoản không tồn tại");
      }

      const emailotp = await this.emailSservice.createOtp(user.id)

      // if (emailotp.length != 6) return ResponseHelper.error(2, "Quá số lần gửi, vui lòng chờ 5 phút!");
      //console.log("emailotp:"+emailotp)
      this.emailSservice.sendEmail(user.email, "Mã xác nhận: " + emailotp + " - QSalon", "Mã xác nhận của bạn là: " + emailotp + " \nThời hạn sử dụng mã trong vòng 5 phút \nCảm ơn đã sử dụng ứng dụng \nXin liên hệ cho nhà phát triển theo email/skype: nguyennam.kkb@gmail.com")

      return ResponseHelper.error(199, "Đã gửi OTP vào email đăng ký");

    }
    catch (error) {
      return ResponseHelper.error(0, error);
    }
  }

  @Public()
  @Post('verifyChangePassword')
  async verifyChangePassword(@Body() item): Promise<ApiResponse<any>> {
    try {

      const user = await this.services.findByEmail(item.email)

      const otp = await this.emailSservice.getOtpById(user.id)

      if (!otp) return ResponseHelper.error(0, "Chưa có OTP");
      
      const timeNow = Date.now()
      const hieu2ThoiGian = timeNow - otp.updateAt
      // //console.log(hieu2ThoiGian);
      // //console.log(otp.otp);
      // //console.log(item.otp);

      if (hieu2ThoiGian <= 300000) {
        if (otp.otp == item.otp) {
          user.updateAt = timeNow
          user.status = 1
          user.password  = Common.MD5Hash(process.env.KEY_APP + item.password);
          await this.services.update(user)
          return ResponseHelper.success("Đổi mật khẩu thành công");
        }
      }
      return ResponseHelper.error(0, "OTP không đúng");
    }
    catch (error) {
      return ResponseHelper.error(0, error);
    }
  }
}
