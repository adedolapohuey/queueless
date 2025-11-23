import { Request, Response } from "express";
import {
  initiateForgotPasswordService,
  loginService,
  organizationLoginService,
  organizationRegistrationService,
  registrationService,
  resetPasswordService,
  verifyCode,
} from "../services/authService";
import {
  OrganizationData,
  RegistrationData,
} from "../interfaces/authInterface";

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

const verifyCodeController = async (req: Request, res: Response) => {
  const data = req.body as { username: string; code: string };
  const { status, result } = await verifyCode(data);
  return res.status(status).json(result);
};

const initiateForgotPasswordController = async (
  req: Request,
  res: Response
) => {
  const data = req.body as { email: string; entity: string };
  const { status, result } = await initiateForgotPasswordService(data);
  return res.status(status).json(result);
};

const resetPasswordController = async (req: Request, res: Response) => {
  const data = req.body as { email: string; password: string };
  const { status, result } = await resetPasswordService(data);
  return res.status(status).json(result);
};

// organization controllers
const registerOrganizationController = async (req: Request, res: Response) => {
  const data = req.body as OrganizationData;
  const { status, result } = await organizationRegistrationService(data);
  return res.status(status).json(result);
};

const loginOrganizationController = async (req: Request, res: Response) => {
  const data = req.body as OrganizationData;
  const { status, result } = await organizationLoginService(data);
  return res.status(status).json(result);
};

export {
  registerController,
  loginController,
  verifyCodeController,
  initiateForgotPasswordController,
  resetPasswordController,
  registerOrganizationController,
  loginOrganizationController,
};
