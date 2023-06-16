import { ApiResponse } from './response.interface';

export class ResponseHelper {
  static success<T>(data: T, message: string = 'Success'): ApiResponse<T> {
    return {
      statusCode: 200,
      message: message,
      data,
    };
  }

  static error<T>(code: number, message: string): ApiResponse<T> {
    return {
      statusCode: code,
      message: message,
      data: null,
    };
  }
}
