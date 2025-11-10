import { Request, Response } from "express";
import {
  loginService,
  registrationService,
  verifyUserRegistration,
} from "../services/authService";
import { RegistrationData } from "../interfaces/authInterface";

const registerController = async (req: Request, res: Response) => {
  const data = req.body as RegistrationData;
  const { status, result } = await registrationService(data);
  return res.status(status).json(result);
};

const loginController = async (req: Request, res: Response) => {
  const data = req.body as Pick<RegistrationData, "username" | "password">;
  const { status, result } = await loginService(data);
  return res.status(status).json(result);
};

const verifyUserRegistrationController = async (
  req: Request,
  res: Response
) => {
  const data = req.body as { username: string; code: string };
  const { status, result } = await verifyUserRegistration(data);
  return res.status(status).json(result);
};

export {
  registerController,
  loginController,
  verifyUserRegistrationController,
};
