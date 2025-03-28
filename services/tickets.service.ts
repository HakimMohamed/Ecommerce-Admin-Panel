import api from "@/lib/api";
import { AxiosResponse } from "axios";
import { Selection } from "@heroui/react";
export const getTickets = async (
  page: number,
  pageSize: number,
  filterValue: string,
  statusFilter: Selection | "all"
): Promise<AxiosResponse> => {
  const params = new URLSearchParams({
    page: String(page),
    pageSize: String(pageSize),
    searchText: filterValue,
  });
  if (statusFilter !== "all") {
    params.set("status", Array.from(statusFilter).join(","));
  }
  return api.get(`/api/tickets?${params.toString()}`);
};

export const updateTicketStatus = async (
  id: string,
  status: "open" | "in-progress" | "closed"
): Promise<AxiosResponse> => {
  return api.patch(`/api/tickets`, { ticketId: id, status });
};
