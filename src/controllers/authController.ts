import { Request, Response } from "express";
import { registrationService } from "../services/authService";
import { RegistrationData } from "../interfaces/authInterface";

const registerController = async (req: Request, res: Response) => {
  const data = req.body as RegistrationData;
  const { status, result } = await registrationService(data);
  return res.status(status).json(result);
};

const loginController = (req: Request, res: Response) => {
  res.status(200).json({ message: "Auth controller response" });
};

export { registerController, loginController };
