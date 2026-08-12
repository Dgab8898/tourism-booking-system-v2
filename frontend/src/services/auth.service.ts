import { apiRequest } from "./api";

export interface LoginResponse {
  success: boolean;
  message: string;
  data: {
    user: {
      _id: string;
      firstName: string;
      lastName: string;
      email: string;
      role: "customer" | "admin";
    };
    token: string;
  };
}

export async function login(
  email: string,
  password: string,
): Promise<LoginResponse> {
  return apiRequest<LoginResponse>("/api/auth/login", {
    method: "POST",
    body: JSON.stringify({
      email,
      password,
    }),
  });
}