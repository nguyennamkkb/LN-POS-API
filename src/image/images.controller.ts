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
} from '@nestjs/common';
import { Response } from 'express';
import * as path from 'path';
import { Public } from 'src/auth/public.decorator';
import { ImageUtil } from '../../helper/util/image.util';
import { ApiResponse } from 'helper/common/response.interface';
import { ResponseHelper } from 'helper/common/response.helper';
import { imageRequest } from './entity/image.request';
import { Common } from 'helper/common/common';

@Controller('images')
export class ImagesController {
    @Public()
    @Get('viewimage/:filename')
    async viewImage(@Param('filename') filename: string, @Res() res: Response): Promise<void> {
        const imagePath = path.join(__dirname, '..', '..', '..', 'upload', filename+'.jpeg');
        res.sendFile(imagePath);
    }

    @Public()
    @Post('uploadimage')
    async uploadimage(
        @Body() item:imageRequest,
    ): Promise<ApiResponse<any>> {
        try {
            if (Common.verifyRequest(item.cksRequest, item.timeRequest)) {
                const url = await ImageUtil.saveImage(item.base64Image);
                if (url) return ResponseHelper.success(url);
                else return ResponseHelper.error(0, "Lỗi upload");
            }else return ResponseHelper.error(0, "Sai cks");           
        } catch (error) {
            return ResponseHelper.error(0, error);
        }
    }
}
