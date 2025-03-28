import api from "@/lib/api";
import { AxiosResponse } from "axios";
export const getItems = async (
  page: number,
  pageSize: number,
  filterValue: string
): Promise<AxiosResponse> => {
  const params = new URLSearchParams({
    page: String(page),
    pageSize: String(pageSize),
    searchText: filterValue,
  });

  return api.get(`/api/items?${params.toString()}`);
};
