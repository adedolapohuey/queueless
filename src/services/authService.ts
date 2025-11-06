import {
  RegistrationData,
  RegistrationResponse,
} from "../interfaces/authInterface";

const registrationService = async (
  registrationPayload: RegistrationData
): Promise<RegistrationResponse> => {
  // Registration logic here
  try {
    console.log("Registering user:", registrationPayload);
    return { status: 201, result: "User registered successfully" };
  } catch (error) {
    return { status: 500, result: "Registration failed" };
  }
};

export { registrationService };
