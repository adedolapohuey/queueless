import { Response } from "../interfaces/indexInterface";
import { ResponseCodes } from "./responseCodes";

export class ResponseHandler {
  public readonly status: number;
  public readonly result: {
    status: number;
    message: string;
    data?: any;
  };

  constructor(message: string, statusCode = 500, data = {}) {
    this.status = statusCode;
    this.result = {
      status: statusCode,
      message,
      data,
    };
  }

  static success(message = "Success") {
    return new ResponseHandler(message, ResponseCodes.SUCCESS);
  }

  static created(message = "Created") {
    return new ResponseHandler(message, ResponseCodes.CREATED);
  }
}
