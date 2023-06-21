import { Injectable } from '@nestjs/common';
import * as fs from 'fs-extra';
import { Common } from 'helper/common/common';
import * as sharp from 'sharp';


@Injectable()
export class ImageUtil {
  static async saveImage(base64Data: string): Promise<string> {
    const matches = base64Data.match(/^data:image\/([a-z]+);base64,(.+)$/i);

    if (!matches || matches.length !== 3) {
      throw new Error('Invalid base64 format');
    }

    const fileExtension = matches[1];
    const base64Image = matches[2];
    const fileName = `${Common.makeRandomStringWithLength(5)+Date.now()}.jpeg`;
    const filePath = `upload/${fileName}`;

    // Convert base64 to buffer
    const fileBuffer = Buffer.from(base64Image, 'base64');

    // Compress the image
    const compressedImageBuffer = await sharp(fileBuffer)
      .resize({ width: 800, withoutEnlargement: true })
      .jpeg({ quality: 70 })
      .toBuffer();

    // Write the compressed image buffer to file
    await fs.writeFile(filePath, compressedImageBuffer);

    return filePath;
  }
}
