import { writeLogToFile } from './logger';
import { ApiResponse } from './response.interface';

export class ResponseHelper {
  static success<T>(data: T, message: string = 'Success'): ApiResponse<T> {
    const res = {
      statusCode: 200,
      message: message,
      data,
    }
    writeLogToFile(`Response success ${JSON.stringify(res)}`)
    return res
  }

  static error<T>(code: number, message: string): ApiResponse<T> {

    const res = {
      statusCode: code,
      message: message,
      data: null,
    }
    writeLogToFile(`Response error ${JSON.stringify(res)}`)
    return res
  }
  static customise<T>(code: number, message: string): ApiResponse<T> {

    const res = {
      statusCode: code,
      message: message,
      data: null,
    }
    writeLogToFile(`Response customise ${JSON.stringify(res)}`)
    return res
  }
}
