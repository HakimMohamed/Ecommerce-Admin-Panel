import api from "@/lib/api";
import { AxiosResponse } from "axios";

export const AuthService = {
  login: async (email: string, password: string): Promise<AxiosResponse> => {
    return api.post(`/api/auth/login`, { email, password });
  },
  verifyOtp: async (email: string, otp: string): Promise<AxiosResponse> => {
    return api.post(`/api/auth/otp/verify`, { email, otp });
  },
};
