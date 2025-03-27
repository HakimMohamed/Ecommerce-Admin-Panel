import api from "@/lib/api";
import { AxiosResponse } from "axios";

export const getTickets = async (
  page: number,
  pageSize: number,
  filterValue: string
): Promise<AxiosResponse> => {
  return api.get(
    `/api/tickets?page=${page}&pageSize=${pageSize}&searchText=${filterValue}`
  );
};
