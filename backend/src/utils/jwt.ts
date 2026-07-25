import jwt, {
  type JwtPayload,
  type SignOptions,
} from "jsonwebtoken";

import { env } from "../config/env.js";

export interface AccessTokenPayload extends JwtPayload {
  userId: string;
  role: string;
}

type TokenClaims = Pick<AccessTokenPayload, "userId" | "role">;

const signOptions: SignOptions = {
  algorithm: "HS256",
  expiresIn: env.JWT_EXPIRES_IN as NonNullable<
    SignOptions["expiresIn"]
  >,
  issuer: "tourism-booking-system",
  audience: "tourism-booking-system-users",
};

export function signAccessToken(payload: TokenClaims): string {
  return jwt.sign(payload, env.JWT_SECRET, signOptions);
}

export function verifyAccessToken(token: string): AccessTokenPayload {
  const decoded = jwt.verify(token, env.JWT_SECRET, {
    algorithms: ["HS256"],
    issuer: "tourism-booking-system",
    audience: "tourism-booking-system-users",
  });

  if (
    typeof decoded === "string" ||
    typeof decoded.userId !== "string" ||
    typeof decoded.role !== "string"
  ) {
    throw new Error("Invalid access token payload");
  }

  return decoded as AccessTokenPayload;
}
