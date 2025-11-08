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
  isVerified: boolean;
  isDeleted: boolean;
}
