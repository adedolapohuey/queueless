export interface RegistrationResponse {
  status: number;
  result: string;
}

export interface LoginResponse {
  status: number;
  result: string;
}

export interface RegistrationData {
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  organization: string;
  password: string;
}
