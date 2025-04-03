import api from "@/lib/api";
import { ICategory } from "@/types/category";
import { AxiosResponse } from "axios";

export const getCategories = async (
  page: number,
  pageSize: number,
  filterValue: string
): Promise<AxiosResponse> => {
  const params = new URLSearchParams({
    page: String(page),
    pageSize: String(pageSize),
    searchText: filterValue,
  });
  return api.get(`/api/categories?${params.toString()}`);
};

export const updateCategories = async (
  updatedCategories: ICategory[]
): Promise<AxiosResponse> => {
  return api.patch(`/api/categories`, updatedCategories);
};

export const addCategory = async (
  newCategory: Partial<Omit<ICategory, "_id">>
): Promise<AxiosResponse> => {
  return api.post(`/api/categories`, newCategory);
};

export const deleteCategory = async (
  categoryId: string
): Promise<AxiosResponse> => {
  return api.delete(`/api/categories?categoryId=${categoryId}`);
};
