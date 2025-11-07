import { AppError } from "../helpers/appError";
import { ResponseCodes } from "../helpers/responseCodes";
import { ResponseHandler } from "../helpers/responseHandler";
import { RegistrationData } from "../interfaces/authInterface";
import { Response } from "../interfaces/indexInterface";

const registrationService = async (
  registrationPayload: RegistrationData
): Promise<Response> => {
  // Registration logic here
  try {
    return ResponseHandler.created("User registered successfully");
  } catch (error: any) {
    console.error("Registration error:", error.response);
    return error.response;
  }
};

export { registrationService };
