import {
  Controller,
  Get,
  Post,
  Body,
  Put,
  Param,
  Delete,
  Query,
  Res,
} from "@nestjs/common";
import { Response } from "express";
import * as path from "path";
import { Public } from "src/auth/public.decorator";
import { ImageUtil } from "../../helper/util/image.util";
import { ApiResponse } from "helper/common/response.interface";
import { ResponseHelper } from "helper/common/response.helper";
import { imageRequest } from "./entity/image.request";
import { Common } from "helper/common/common";
import { writeLogToFile } from "helper/common/logger";

@Controller("images")
export class ImagesController {
  @Public()
  @Get("viewimage/:filename")
  async viewImage(
    @Param("filename") filename: string,
    @Res() res: Response
  ): Promise<void> {
    try {
      const imagePath = path.join(
        __dirname,
        "..",
        "..",
        "..",
        "upload",
        filename + ".jpeg"
      );
      res.sendFile(imagePath);
    } catch (error) {
      writeLogToFile(`viewImage catch error ${JSON.stringify(error)}`);
    }
  }

  @Public()
  @Post("uploadimage")
  async uploadimage(@Body() body: imageRequest): Promise<ApiResponse<any>> {
    try {
      if (Common.verifyRequest(body.cksRequest, body.timeRequest)) {
        const url = await ImageUtil.saveImage(body.base64Image);
        if (url) return ResponseHelper.success(url)
        else return ResponseHelper.error(0, "Lỗi");
      } else return ResponseHelper.error(0, "Lỗi");
    } catch (error) {
      return ResponseHelper.error(0, error);
    }
  }
}
