import { ResponseCodes } from "./responseCodes";

export class ResponseHandler {
  public readonly status: number;
  public readonly result: {
    status: number;
    message: string;
    data?: Record<string, any>;
  };

  constructor(message: string, statusCode = 500, data = {}) {
    this.status = statusCode;
    this.result = {
      status: statusCode,
      message,
      data,
    };
  }

  static success(message = "Success", data = {}) {
    return new ResponseHandler(message, ResponseCodes.SUCCESS, data);
  }

  static created(message = "Created", data = {}) {
    return new ResponseHandler(message, ResponseCodes.CREATED, data);
  }
}
