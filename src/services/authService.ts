import { AppError } from "../helpers/appError";
import { hashPassword, comparePassword } from "../helpers/hash";
import { ResponseHandler } from "../helpers/responseHandler";
import { generateToken } from "../helpers/tokenHandler";
import { RegistrationData } from "../interfaces/authInterface";
import { Response } from "../interfaces/indexInterface";
import { User } from "../models/user.model";
import { Op } from "sequelize";
import { userSerializer } from "../serializers/user.serializer";

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

    console.log("userExists:", userExists);
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
    console.log("User registered successfully:", createUser);

    // generate token
    const token = generateToken(
      {
        email: createUser.email,
        username: createUser.username,
      },
      "1d"
    );

    return ResponseHandler.created("User registered successfully", {
      ...userSerializer(createUser),
      token,
    });
  } catch (error: any) {
    return AppError.internal(error.message);
  }
};

const loginService = async (
  payload: Pick<RegistrationData, "username" | "password">
) => {
  // Login logic here
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

export { registrationService, loginService };
