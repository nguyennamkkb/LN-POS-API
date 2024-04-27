import { AuthService } from "./auth.service";
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
} from "@nestjs/common";
import { ResponseHelper } from "helper/common/response.helper";
import { ApiResponse } from "helper/common/response.interface";
import { UpdateResult } from "typeorm/query-builder/result/UpdateResult";
import { Common } from "helper/common/common";
import { UserEntity } from "src/user/entity/user.entity";
import { AuthGuard } from "./auth.guard";
import { Public } from "./public.decorator";
import { EmailService } from "src/email/email.service";


@Controller("auth")
export class AuthController {
  constructor(
    private authService: AuthService,
    private emailService: EmailService
  ) {}

  @Public()
  @Post("signin")
  async signIn(@Body() item): Promise<ApiResponse<any>> {
    try {

  
      const mk = Common.MD5Hash(process.env.KEY_APP + item.password);

      
      const status = await Common.verifyRequest(
        item.cksRequest,
        item.timeRequest
      );
      if (!status) {
        return ResponseHelper.error(0, "cks");
      }
      if (
        item.email == undefined ||
        item.email == "" ||
        item.email.length < 6 ||
        mk == undefined ||
        mk == "" ||
        mk.length < 6
      ) {
        return ResponseHelper.error(
          0,
          "Kiểm tra lại số điện thoại hoặc mật khẩu"
        );
      }

      const res = await this.authService.signIn(item.email, mk);
      if (res) {
        if (res.status == 0) {
          const emailotp = await this.emailService.createOtp(res.id);
          if (emailotp.length != 6)
            return ResponseHelper.error(
              2,
              "Quá số lần gửi, vui lòng chờ 5 phút!"
            );
          this.emailService.sendEmail(
            res.email,
            "Mã xác nhận: " + emailotp + " - QSalon - QUETNHANH.VN",
            "Mã xác nhận của tài khoản "+res.email+" là: " +
              emailotp +
              " \nThời hạn 5 phút có thể sử dụng mã \nCảm ơn đã sử dụng ứng dụng quản lý Salon/Spa \nXin liên hệ cho tôi theo email/skype: quetnhanh.vn@gmail.com"
          );
          return ResponseHelper.error(199, "Da gui otp vao email");
        } else if (res.status == 1) {
          delete res["password"];
          delete res["sell_id"];
          delete res["sell_number"];
          delete res["createAt"];
          delete res["updateAt"];

          return ResponseHelper.success(res);
        }
      }
      return ResponseHelper.error(
        0,
        "Kiểm tra lại số điện thoại hoặc mật khẩu"
      );
    } catch (error) {
      return ResponseHelper.error(0, error);
    }
  }
}
