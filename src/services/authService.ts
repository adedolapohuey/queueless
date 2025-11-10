import { AppError } from "../helpers/appError";
import { hashPassword, comparePassword } from "../helpers/hash";
import { ResponseHandler } from "../helpers/responseHandler";
import { generateToken } from "../helpers/tokenHandler";
import {
  RegistrationData,
  VerificationData,
} from "../interfaces/authInterface";
import { Response } from "../interfaces/indexInterface";
import { User } from "../models/user.model";
import { Op } from "sequelize";
import { userSerializer } from "../serializers/user.serializer";
import { sendVerificationEmail } from "../helpers/sendMail";
import { generateOtp } from "../helpers";
import { VerificationCode } from "../models/verificationcode.model";

const registrationService = async (
  registrationPayload: RegistrationData
): Promise<Response> => {
  // Registration logic here
  try {
    console.log("Registering user with data:", registrationPayload);
    const { email, username, password, firstName, lastName, organization } =
      registrationPayload;

    const userExists = await User.findOne({
      where: { [Op.or]: [{ email }, { username }], isDeleted: false },
      attributes: ["id"],
    });

    if (userExists) {
      return AppError.badRequest("User already exists");
    }

    const cleanEmail = email.trim().toLowerCase();
    // hash password
    const hashedPassword = await hashPassword(password); // Replace with actual hashing logic

    // Simulate user creation
    const newUser = {
      username,
      email: cleanEmail,
      firstName,
      lastName,
      password: hashedPassword,
      organization,
    };
    const createUser = await User.create(newUser);

    // send verification email logic can be added here
    const code = await fetchValidCode(); // 6-digit OTP

    // save code to the db
    await VerificationCode.create({
      user: newUser.username,
      code,
      expiresAt: new Date(Date.now() + 30 * 60 * 1000), // 30 minutes from now
    });

    await sendVerificationEmail({
      to: cleanEmail,
      subject: "Verify your account",
      htmlTemplate: "registration.template",
      variables: { code, name: firstName + " " + lastName },
    });

    return ResponseHandler.created("User registered successfully", {
      ...userSerializer(createUser),
    });
  } catch (error: any) {
    return AppError.internal(error.message);
  }
};

const loginService = async (
  payload: Pick<RegistrationData, "username" | "password">
) => {
  // Login logic here
  console.log("Login user with data:", payload);
  try {
    const { username, password } = payload;
    const userExists = await User.findOne({
      where: { username, isDeleted: false },
      attributes: {
        exclude: ["isDeleted", "createdAt", "updatedAt"],
      },
    });

    if (!userExists) {
      return AppError.unauthorized("Invalid credentials");
    }

    const verifyPassword = await comparePassword(password, userExists.password);
    if (!verifyPassword) {
      return AppError.unauthorized("Invalid credentials");
    }

    // generate token
    const token = generateToken(
      {
        email: userExists.email,
        username: userExists.username,
      },
      "1d"
    );

    return ResponseHandler.success("Login successful", {
      ...userSerializer(userExists),
      token,
    });
  } catch (error: any) {
    return AppError.internal(error.message);
  }
};

const verifyUserRegistration = async (
  payload: VerificationData
): Promise<Response> => {
  // Verification logic here
  console.log("verifyUserRegistration user with data:", payload);
  const { username, code } = payload;

  try {
    const now = new Date();
    const existingCode = await getCode({
      user: username,
      expiresAt: { [Op.gt]: now },
      code,
      isDeleted: false,
    });

    if (!existingCode) {
      return AppError.badRequest("Invalid or expired code");
    }

    await VerificationCode.update(
      { isDeleted: true },
      {
        where: {
          user: username,
          code,
        },
      }
    );

    await User.update(
      { isVerified: true },
      {
        where: {
          username,
        },
      }
    );

    return ResponseHandler.success("Code verified successfully");
  } catch (error: any) {
    return AppError.internal(error.message);
  }
};

const fetchValidCode = async () => {
  // Check code validity logic here
  const code = generateOtp();
  const now = new Date();

  const isCodeAvailable = await getCode({
    expiresAt: { [Op.gt]: now },
    code,
    isDeleted: false,
  });

  if (isCodeAvailable) {
    fetchValidCode();
  }

  return code;
};

const getCode = async (
  where: any
): Promise<{
  code: string;
  expiresAt: Date;
  user?: string;
} | null> => {
  // Fetch code logic here
  const code = await VerificationCode.findOne({
    where,
    attributes: ["code", "expiresAt", "user"],
  });

  return code;
};

export { registrationService, loginService, verifyUserRegistration };
