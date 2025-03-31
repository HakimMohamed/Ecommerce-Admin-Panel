import api from "@/lib/api";
import { AxiosResponse } from "axios";

export const getBannerSettings = async (): Promise<AxiosResponse> => {
  return api.get(`/api/banner-settings`);
};

export const updateBannerSettings = async (
  bannerText: string,
  bannerColor: string,
  textColor: string
): Promise<AxiosResponse> => {
  return api.patch(`/api/banner-settings`, {
    text: bannerText,
    color: bannerColor,
    textColor,
  });
};
