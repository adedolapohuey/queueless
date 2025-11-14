export interface RegistrationData {
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  organization: string;
  password: string;
}

export interface FullRegistrationData extends RegistrationData {
  id: number;
  role: Role;
  isVerified: boolean;
  isDeleted: boolean;
}

export interface LoginData {
  username: string;
  password: string;
}

export interface VerificationData {
  user: number;
}

export enum otpActionTypes {
  EMAIL_VERIFICATION = "email_verification",
  FORGOT_PASSWORD = "forgot_password",
  DEFAULT = "",
}

export enum Role {
  USER = "user",
  ADMIN = "admin",
}
