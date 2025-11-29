import { sign, SignOptions, verify } from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

const { JSON_SECRET } = process.env;

export const generateToken = (
  payload: Record<string, any>,
  expiresIn: string
) => {
  return sign(payload, JSON_SECRET as string, { expiresIn } as SignOptions);
};

export const verifyToken = (token: string) => {
  try {
    return verify(token, JSON_SECRET as string);
  } catch (error) {
    return null;
  }
};
