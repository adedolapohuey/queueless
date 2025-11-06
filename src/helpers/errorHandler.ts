import { stat } from "fs";
import { Response } from "../interfaces/indexInterface";
import { ResponseCodes } from "./responseCodes";

// src/utils/AppError.ts
export class AppError extends Error {
  public readonly response: Response;

  constructor(message: string, statusCode = 500, isOperational = true) {
    super(message);
    this.response = {
      status: statusCode,
      result: {
        status: statusCode,
        message,
      },
    };
    Error.captureStackTrace(this, this.constructor);
  }

  static badRequest(message = "Bad Request") {
    return new AppError(message, ResponseCodes.BAD_REQUEST);
  }

  static unauthorized(message = "Unauthorized") {
    return new AppError(message, ResponseCodes.UNAUTHORIZED);
  }

  static forbidden(message = "Forbidden") {
    return new AppError(message, ResponseCodes.FORBIDDEN);
  }

  static notFound(message = "Not Found") {
    return new AppError(message, ResponseCodes.NOT_FOUND);
  }

  static internal(message = "Internal Server Error") {
    return new AppError(message, ResponseCodes.INTERNAL_SERVER_ERROR);
  }
}
