import { AppError } from "../helpers/appError";
import { hashPassword, comparePassword } from "../helpers/hash";
import { ResponseHandler } from "../helpers/responseHandler";
import { generateToken } from "../helpers/tokenHandler";
import {
  OrganizationData,
  otpActionTypes,
  RegistrationData,
  Role,
  VerificationData,
} from "../interfaces/authInterface";
import { Response } from "../interfaces/indexInterface";
import { User } from "../models/user.model";
import { Op } from "sequelize";
import { userSerializer } from "../serializers/user.serializer";
import { sendVerificationEmail } from "../helpers/sendMail";
import { generateOtp } from "../helpers";
import { VerificationCode } from "../models/verificationcode.model";
import { Organization } from "../models/organization.model";
import { orgSerializer } from "../serializers/organization.serializer";
import e from "express";

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
      role: Role.USER,
      password: hashedPassword,
      organization,
    };
    const createUser = await User.create(newUser);

    // send verification email logic can be added here
    const code = await fetchValidCode(); // 6-digit OTP

    // save code to the db
    await VerificationCode.create({
      user: createUser.id.toString(),
      code,
      action: otpActionTypes.EMAIL_VERIFICATION,
      expiresAt: new Date(Date.now() + 30 * 60 * 1000), // 30 minutes from now
    });

    await sendVerificationEmail({
      to: cleanEmail,
      subject: "Verify your account",
      htmlTemplate: "registration.template",
      variables: { code, name: firstName + " " + lastName },
    });

    // generate token
    const token = generateToken(
      {
        userId: createUser.id,
        username: newUser.username,
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

    if (!userExists.isVerified) {
      return AppError.unauthorized("Kindly verify your account to proceed");
    }

    const verifyPassword = await comparePassword(password, userExists.password);
    if (!verifyPassword) {
      return AppError.unauthorized("Invalid credentials");
    }

    // generate token
    const token = generateToken(
      {
        userId: userExists.id,
        username: userExists.username,
      },
      "1d"
    );

    return ResponseHandler.success("Login successful", {
      ...userSerializer(userExists),
      token,
    });
  } catch (error: any) {
    return AppError.internal();
  }
};

const verifyCode = async (payload: { code: string }): Promise<Response> => {
  // Verification logic here
  console.log("verify code with data:", payload);
  const { code } = payload;

  try {
    const now = new Date();
    const existingCode = await getCode({
      expiresAt: { [Op.gt]: now },
      code,
      isDeleted: false,
    });

    if (!existingCode) {
      return AppError.badRequest("Invalid or expired code");
    }

    let data = {};
    switch (existingCode.action) {
      case otpActionTypes.EMAIL_VERIFICATION:
        return await verifyUserRegistration({
          user: Number(existingCode.user),
        });
      case otpActionTypes.ORG_EMAIL_VERIFICATION:
        return await verifyOrgRegistration({
          user: Number(existingCode.user),
        });
      case otpActionTypes.FORGOT_PASSWORD:
        const userDetails = await User.findOne({
          where: { id: existingCode.user, isDeleted: false },
          attributes: ["email"],
        });
        data = { email: userDetails?.email || "", entity: "user" };
        break;
      case otpActionTypes.ORG_FORGOT_PASSWORD:
        const orgDetails = await Organization.findOne({
          where: { id: existingCode.user, isActive: true },
          attributes: ["email"],
        });
        data = { email: orgDetails?.email || "", entity: "organization" };
        break;
      default:
        break;
    }

    // expire the code
    await VerificationCode.update(
      { isDeleted: true },
      {
        where: {
          user: existingCode.user,
          code,
        },
      }
    );

    return ResponseHandler.success("OTP verified successfully", data);
  } catch (error: any) {
    return AppError.internal();
  }
};

const initiateForgotPasswordService = async (payload: {
  email: string;
  entity: string;
}) => {
  // Forgot password logic here
  console.log("initiate forgot password with data:", payload);
  const { email, entity } = payload;

  try {
    let user: User | Organization | null = null;
    let name = "";
    if (entity === "organization") {
      user = await Organization.findOne({
        where: { email, isActive: true },
        attributes: ["id", "name"],
      });
      name = user?.name || "";
    } else {
      user = await User.findOne({
        where: { email, isDeleted: false },
        attributes: ["id", "firstName", "lastName"],
      });
      name = `${user?.firstName} ${user?.lastName}` || "";
    }

    if (!user) {
      return AppError.notFound(
        `${
          entity === "organization" ? "Organization" : "User"
        } with this email does not exist`
      );
    }

    const code = await fetchValidCode(); // 6-digit OTP

    // save code to the db
    await VerificationCode.create({
      user: user.id.toString(),
      code,
      action:
        entity === "organization"
          ? otpActionTypes.ORG_FORGOT_PASSWORD
          : otpActionTypes.FORGOT_PASSWORD,
      expiresAt: new Date(Date.now() + 30 * 60 * 1000), // 30 minutes from now
    });

    await sendVerificationEmail({
      to: email,
      subject: "Reset your password",
      htmlTemplate: "forgotPassword.template",
      variables: {
        code,
        name,
      },
    });

    return ResponseHandler.success(
      "Password reset code sent to your email successfully"
    );
  } catch (error: any) {
    return AppError.internal(error.message);
  }
};

const resetPasswordService = async (payload: {
  email: string;
  password: string;
  entity: string;
}) => {
  // Reset password logic here
  console.log("reset password with data:", payload);
  const { email, password, entity } = payload;

  const hashedPassword = await hashPassword(password);
  try {
    if (entity === "organization") {
      const updateOrgPassword = await Organization.update(
        { password: hashedPassword },
        {
          where: {
            email,
            isActive: true,
          },
        }
      );

      if (updateOrgPassword[0] === 0) {
        return AppError.notFound("Organization with this email does not exist");
      }

      return ResponseHandler.success("Password reset successfully");
    }

    const updatePassword = await User.update(
      { password: hashedPassword },
      {
        where: {
          email,
        },
      }
    );

    if (updatePassword[0] === 0) {
      return AppError.notFound("User with this email does not exist");
    }

    return ResponseHandler.success("Password reset successfully");
  } catch (error: any) {
    return AppError.internal();
  }
};

// internal functions
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
  action: otpActionTypes;
  expiresAt: Date;
  user: string;
} | null> => {
  // Fetch code logic here
  const code = await VerificationCode.findOne({
    where,
    attributes: ["code", "action", "expiresAt", "user"],
  });

  return code;
};

const verifyUserRegistration = async (
  payload: VerificationData
): Promise<Response> => {
  // Verification logic here
  console.log("verifyUserRegistration user with data:", payload);
  const { user } = payload;

  try {
    await User.update(
      { isVerified: true },
      {
        where: {
          id: user,
        },
      }
    );

    return ResponseHandler.success("User verified successfully");
  } catch (error: any) {
    return AppError.internal();
  }
};

const verifyOrgRegistration = async (
  payload: VerificationData
): Promise<Response> => {
  // Verification logic here
  console.log("verifyOrgRegistration org with data:", payload);
  const { user } = payload;

  try {
    await Organization.update(
      { isVerified: true },
      {
        where: {
          id: user,
        },
      }
    );

    return ResponseHandler.success("Organization verified successfully");
  } catch (error: any) {
    return AppError.internal();
  }
};

const organizationRegistrationService = async (
  registrationPayload: OrganizationData
): Promise<Response> => {
  // Organization Registration logic here
  try {
    console.log("Registering organization with data:", registrationPayload);
    const { email, name, password, domain, description } = registrationPayload;

    const organizationExists = await Organization.findOne({
      where: { email, isActive: true },
      attributes: ["id"],
    });

    if (organizationExists) {
      return AppError.badRequest("Organization already exists");
    }

    const cleanEmail = email.trim().toLowerCase();
    // hash password
    const hashedPassword = await hashPassword(password);

    // Simulate organization creation
    const newOrg = {
      name,
      email: cleanEmail,
      domain,
      description,
      password: hashedPassword,
    };
    const createOrganization = await Organization.create(newOrg);

    // send verification email logic can be added here
    const code = await fetchValidCode(); // 6-digit OTP

    // save code to the db
    await VerificationCode.create({
      user: createOrganization.id.toString(),
      code,
      action: otpActionTypes.ORG_EMAIL_VERIFICATION,
      expiresAt: new Date(Date.now() + 30 * 60 * 1000), // 30 minutes from now
    });

    await sendVerificationEmail({
      to: cleanEmail,
      subject: "Verify your organization account",
      htmlTemplate: "registration.template",
      variables: { code, name },
    });

    // generate token
    const token = generateToken(
      {
        orgId: createOrganization.id,
        name: newOrg.name,
      },
      "1d"
    );

    return ResponseHandler.created("Organization registered successfully", {
      ...orgSerializer(createOrganization),
      token,
    });
  } catch (error: any) {
    return AppError.internal(error.message);
  }
};

const organizationLoginService = async (
  payload: OrganizationData
): Promise<Response> => {
  // Organization Login logic here
  console.log("Login organization with data:", payload);
  try {
    const { email, password } = payload;
    const orgExists = await Organization.findOne({
      where: { email, isActive: true },
      attributes: {
        exclude: ["createdAt", "updatedAt"],
      },
    });

    if (!orgExists) {
      return AppError.unauthorized("Invalid credentials");
    }

    if (!orgExists.isVerified) {
      return AppError.unauthorized(
        "Kindly verify your organization account to proceed"
      );
    }

    const verifyPassword = await comparePassword(password, orgExists.password);
    if (!verifyPassword) {
      return AppError.unauthorized("Invalid credentials");
    }

    // generate token
    const token = generateToken(
      {
        orgId: orgExists.id,
        name: orgExists.name,
      },
      "1d"
    );

    return ResponseHandler.success("Organization login successful", {
      ...orgSerializer(orgExists),
      token,
    });
  } catch (error: any) {
    return AppError.internal();
  }
};

export {
  registrationService,
  loginService,
  verifyCode,
  initiateForgotPasswordService,
  resetPasswordService,
  organizationRegistrationService,
  organizationLoginService,
};
