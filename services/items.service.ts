import api from "@/lib/api";
import { IItem } from "@/types/item";
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

export const updateItems = async (
  updatedItems: IItem[]
): Promise<AxiosResponse> => {
  return api.patch(`/api/items`, updatedItems);
};
