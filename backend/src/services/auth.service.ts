import User from "../models/User.js";
import type {
  LoginInput,
  RegisterInput,
} from "../validators/auth.validator.js";
import { signAccessToken } from "../utils/jwt.js";

export class AuthError extends Error {
  statusCode: number;

  constructor(message: string, statusCode: number) {
    super(message);
    this.name = "AuthError";
    this.statusCode = statusCode;
  }
}

export async function registerUser(input: RegisterInput) {
  const existingUser = await User.findOne({
    email: input.email,
  });

  if (existingUser) {
    throw new AuthError(
      "An account with this email already exists",
      409,
    );
  }

  const user = await User.create({
    firstName: input.firstName,
    lastName: input.lastName,
    email: input.email,
    password: input.password,
  });

  const token = signAccessToken({
    userId: user.id,
    role: user.role,
  });

  return {
    user: user.toJSON(),
    token,
  };
}

export async function loginUser(input: LoginInput) {
  const user = await User.findOne({
    email: input.email,
  }).select("+password");

  if (!user) {
    throw new AuthError("Invalid email or password", 401);
  }

  if (!user.isActive) {
    throw new AuthError("This account has been deactivated", 403);
  }

  const passwordMatches = await user.comparePassword(input.password);

  if (!passwordMatches) {
    throw new AuthError("Invalid email or password", 401);
  }

  const token = signAccessToken({
    userId: user.id,
    role: user.role,
  });

  return {
    user: user.toJSON(),
    token,
  };
}
