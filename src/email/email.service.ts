import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Common } from "helper/common/common";
import { writeLogToFile } from "helper/common/logger";
import * as nodemailer from "nodemailer";
import { emit } from "process";
import { Repository } from "typeorm";
import emailConfig from "./email.config";
import { EmailEntity } from "./entity/email.entity";

@Injectable()
export class EmailService {
  private transporter: nodemailer.Transporter;

  constructor(
    @InjectRepository(EmailEntity) private repository: Repository<EmailEntity>
  ) {
    this.transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: parseInt(process.env.SMTP_PORT, 10),

      secure: false, // Set to true if using port 465
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });
  }
  async createOtp(user_id: number): Promise<string> {
    try {
      const otp = await Common.generateRandomNumberString(6);
      const timeNow = Date.now();
      const otpCoSan = await this.getOtpById(user_id);
      if (otpCoSan) {
        const hieu2ThoiGian = timeNow - otpCoSan.createAt;

        if (hieu2ThoiGian >= 300000) {
          var email = new EmailEntity();
          email.user_id = user_id;
          email.otp = otp;
          email.status = 1;
          email.count = 1;
          email.createAt = Date.now();
          email.updateAt = Date.now();
          const emailOtp = await this.repository.update(otpCoSan.id, email);
          return otp;
        } else {
          if (otpCoSan.count > 3) {
            return "";
          }

          var email = new EmailEntity();
          email.count = otpCoSan.count + 1;
          email.updateAt = Date.now();
          await this.repository.update(otpCoSan.id, email);
          return otpCoSan.otp;
        }
      } else {
        var email = new EmailEntity();
        email.user_id = user_id;
        email.otp = otp;
        email.status = 1;
        email.createAt = Date.now();
        email.updateAt = Date.now();
        const emailOtp = await this.repository.save(email);
        return otp;
      }
    } catch (error) {
      writeLogToFile(error);
    }
  }

  async sendEmail(to: string, subject: string, text: string): Promise<boolean> {
    const mailOptions = {
      from: "quetnhanh@gmail.com",
      to,
      subject,
      text,
    };

    try {
      await this.transporter.sendMail(mailOptions);

      return true;
    } catch (error) {
      return error;
    }
    return false;
  }
  async checkOtp(user_id: number, otpString: string): Promise<boolean> {
    const res = await this.repository.findOne({
      where: { user_id: user_id, otp: otpString },
    });
    return res ? true : false;
  }
  async getOtpById(user_id: number): Promise<EmailEntity> {
    const res = await this.repository.findOne({ where: { user_id: user_id } });
    return res ? res : null;
  }
}
