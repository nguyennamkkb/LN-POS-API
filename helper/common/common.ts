import { writeLogToFile } from "./logger";

var md5 = require('md5');
export class Common {
  static keyApp: string = 'XY50829317681RT3RUH3EZZ84'; //50829317681RT3RUH3EZ
  static AppName: String = 'Base-Api'
  static getKeyApp(): string {
    return this.keyApp.substring(2, this.keyApp.length - 3)
  }
  static removeAccents(str: string): string {
    var AccentsMap = [
      'aàảãáạăằẳẵắặâầẩẫấậ',
      'AÀẢÃÁẠĂẰẲẴẮẶÂẦẨẪẤẬ',
      'dđ',
      'DĐ',
      'eèẻẽéẹêềểễếệ',
      'EÈẺẼÉẸÊỀỂỄẾỆ',
      'iìỉĩíị',
      'IÌỈĨÍỊ',
      'oòỏõóọôồổỗốộơờởỡớợ',
      'OÒỎÕÓỌÔỒỔỖỐỘƠỜỞỠỚỢ',
      'uùủũúụưừửữứự',
      'UÙỦŨÚỤƯỪỬỮỨỰ',
      'yỳỷỹýỵ',
      'YỲỶỸÝỴ',
    ];
    for (var i = 0; i < AccentsMap.length; i++) {
      var re = new RegExp('[' + AccentsMap[i].substr(1) + ']', 'g');
      var char = AccentsMap[i][0];
      str = str.replace(re, char);
    }
    return str;
  }
  static checkRequest(timeRequest: number, cks: string): boolean {
    const now = Date.now();

    if (now - timeRequest > 10000) {
      return false;
    }
    const cksCalculate: string = this.MD5Hash(this.keyApp + timeRequest);

    if (cksCalculate != cks) {
      return false;
    }
    return true;
  }
  static MD5Hash(s: string): string {
    return md5(s);
  }
  static makeRandomStringWithLength(length: number): string {
    let result = '';
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const charactersLength = characters.length;
    let counter = 0;
    while (counter < length) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
      counter += 1;
    }
    return result;
  }
  static getCurrentTime(): string {
    const currentDate = new Date();
    const day = String(currentDate.getDate()).padStart(2, '0');
    const month = String(currentDate.getMonth() + 1).padStart(2, '0'); // Month is zero-based
    const year = String(currentDate.getFullYear());
    const hours = String(currentDate.getHours()).padStart(2, '0');
    const minutes = String(currentDate.getMinutes()).padStart(2, '0');
    const seconds = String(currentDate.getSeconds()).padStart(2, '0');

    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
  }
  static getFileLogName(): string {
    const currentDate = new Date();
    const day = String(currentDate.getDate()).padStart(2, '0');
    const month = String(currentDate.getMonth() + 1).padStart(2, '0'); // Month is zero-based
    const year = String(currentDate.getFullYear());

    return `${year}-${month}-${day}`;
  }

  static async verifyRequest(cksRequest: String, timeRequest: number): Promise<boolean> {
    try {
      const dataCks = this.getKeyApp() + timeRequest
      const cksApp = this.MD5Hash(dataCks)
      writeLogToFile(`verifyRequest cksRequest:${cksRequest}, cksApp:${cksApp}, keyapp:${this.getKeyApp()}, timeRequest:${timeRequest}`)
      // if (cksApp == cksRequest) {
      //   return true
      // } else {
      //   return false
      // }
      return true
    } catch (error) {
      writeLogToFile(`verifyRequest catch ${error}`)
      return  false
    }
  }
}
