import { Controller, Post, Body } from "@nestjs/common";
import { Common } from "helper/common/common";
import { ResponseHelper } from "helper/common/response.helper";
import { ApiResponse } from "helper/common/response.interface";
import { Public } from "src/auth/public.decorator";
import { UserEntity } from "src/user/entity/user.entity";
import { UserService } from "src/user/user.service";
import { EmailService } from "./email.service";
import { InputCommon } from "helper/common/inputCommon";

@Controller("email")
export class EmailController {
  constructor(
    private readonly emailService: EmailService,
    private readonly userService: UserService
  ) {}

  @Post("send")
  async sendEmail(@Body() data: { to: string; subject: string; text: string }) {
    this.emailService.sendEmail(data.to, data.subject, data.text);
    return { success: true, message: "Email sent successfully." };
  }
  @Post()
  async checkOTP(@Body() item): Promise<ApiResponse<any>> {
    try {
      if (await Common.verifyRequest(item.cksRequest, item.timeRequest)) {

        if (await InputCommon.checkInputNormal([item.email,item.otpString]) == false) {
          return ResponseHelper.error(0, "Thiếu thông tin");
        }

        if (item.email == "" || item.email == null || item.email == undefined) {
          return ResponseHelper.error(0, "Khong tim thay tai khoan");
        }
        const user = await this.userService.findById(item.email);

        if (user == null)
          return ResponseHelper.error(0, "Khong tim thay tai khoan");

        const otp = await this.emailService.checkOtp(user.id, item.otpString);

        if (otp == false) return ResponseHelper.error(0, "Sai OTP");

        const userUpdate = new UserEntity();
        userUpdate.status = 1;
        userUpdate.id = user.id;

        const updateUser = await this.userService.update(userUpdate);
        return ResponseHelper.success(updateUser);
      }
    } catch (error) {
      return ResponseHelper.error(0, error);
    }
  }
}
