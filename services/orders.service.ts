import api from "@/lib/api";
import { IOrder } from "@/types/order";
import { AxiosResponse } from "axios";
export const getOrders = async (
  page: number,
  pageSize: number,
  filterValue: string
): Promise<AxiosResponse> => {
  const params = new URLSearchParams({
    page: String(page),
    pageSize: String(pageSize),
    searchText: filterValue,
  });

  return api.get(`/api/orders?${params.toString()}`);
};

export const updateOrderStatus = async (
  orderId: string,
  newStatus: IOrder["status"]
): Promise<AxiosResponse> => {
  return api.patch(`/api/orders`, { orderId, newStatus });
};
