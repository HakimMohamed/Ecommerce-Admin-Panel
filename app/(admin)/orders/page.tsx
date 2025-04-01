"use client";
import { VerticalDotsIcon } from "@/components/icons";
import { capitalize } from "@/lib/utils";
import { getOrders, updateOrderStatus } from "@/services/orders.service";
import { IOrder } from "@/types/order";
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Pagination,
  Spinner,
  Chip,
  ChipProps,
  Input,
  Dropdown,
  DropdownTrigger,
  Button,
  DropdownMenu,
  DropdownItem,
  Selection,
  addToast,
  Tooltip,
} from "@heroui/react";
import { ChevronDownIcon, SearchIcon } from "lucide-react";
import { useCallback, useEffect, useState } from "react";

export default function Orders() {
  const [page, setPage] = useState(1);
  const rowsPerPage = 10;
  const [isLoading, setIsLoading] = useState(false);
  const [orders, setTickets] = useState<IOrder[]>([]);
  const [ordersCount, setOrdersCount] = useState<number>(0);
  const [statusFilter, setStatusFilter] = useState<Selection>("all");
  const [refreshCounter, setRefreshCounter] = useState(0);

  const pages = Math.ceil(ordersCount / rowsPerPage);

  const statusColorMap: Record<
    "pending" | "active" | "delivered" | "cancelled",
    ChipProps["color"]
  > = {
    pending: "warning",
    active: "primary",
    delivered: "success",
    cancelled: "danger",
  };
  const [filterValue, setFilterValue] = useState("");

  const onSearchChange = useCallback((value?: string) => {
    if (value) {
      setFilterValue(value);
      setPage(1);
    } else {
      setFilterValue("");
    }
  }, []);

  const onClear = useCallback(() => {
    setFilterValue("");
    setPage(1);
  }, []);

  const onStatusUpdate = async (
    orderId: string,
    newStatus: IOrder["status"]
  ) => {
    try {
      await updateOrderStatus(orderId, newStatus);
      addToast({
        title: "Ticket status updated",
        description: "Ticket status has been updated successfully",
        color: "success",
        timeout: 5000,
        shouldShowTimeoutProgress: true,
      });
    } catch (error) {
      addToast({
        title: "Failed to update order status",
        description: "An error occurred while updating order status",
        color: "danger",
        timeout: 5000,
        shouldShowTimeoutProgress: true,
      });
      console.error("Failed to update order status:", error);
    } finally {
      setRefreshCounter(refreshCounter + 1);
    }
  };

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setIsLoading(true);
        const response = await getOrders(page, rowsPerPage, filterValue);
        setTickets(response.data.data.orders);
        setOrdersCount(response.data.data.count);
      } catch (error) {
        console.error("Failed to fetch orders:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchOrders();
  }, [page, rowsPerPage, filterValue, statusFilter, refreshCounter]);

  const statusOptions = [
    { name: "Pending", uid: "pending" },
    { name: "Active", uid: "active" },
    { name: "Delivered", uid: "delivered" },
    { name: "Cancelled", uid: "cancelled" },
  ];

  const paymentStatusColorMap: Record<
    "pending" | "success",
    ChipProps["color"]
  > = {
    pending: "warning",
    success: "success",
  };

  return (
    <div className="flex flex-col w-full gap-4">
      <div className="flex justify-between w-full gap-4">
        <Input
          isClearable
          className="w-full sm:max-w-[44%]"
          placeholder="Search by email..."
          startContent={<SearchIcon />}
          value={filterValue}
          onClear={() => onClear()}
          onValueChange={onSearchChange}
        />
        <Dropdown>
          <DropdownTrigger className="hidden sm:flex">
            <Button
              endContent={<ChevronDownIcon className="text-small" />}
              variant="flat"
            >
              Status
            </Button>
          </DropdownTrigger>
          <DropdownMenu
            disallowEmptySelection
            aria-label="Table Columns"
            closeOnSelect={false}
            selectedKeys={statusFilter}
            selectionMode="multiple"
            onSelectionChange={setStatusFilter}
          >
            {statusOptions.map((status) => (
              <DropdownItem key={status.uid} className="capitalize">
                {capitalize(status.name)}
              </DropdownItem>
            ))}
          </DropdownMenu>
        </Dropdown>
      </div>

      <Table
        aria-label="Orders Table"
        bottomContent={
          <div className="flex w-full justify-center">
            {isLoading ? (
              <p className="mt-4">Calculating...</p>
            ) : (
              <Pagination
                isCompact
                showControls
                showShadow
                color="secondary"
                initialPage={1}
                page={page}
                total={pages}
                onChange={(page) => setPage(page)}
              />
            )}
          </div>
        }
      >
        <TableHeader>
          <TableColumn>ORDER ID</TableColumn>
          <TableColumn>USER</TableColumn>
          <TableColumn>EMAIL</TableColumn>
          <TableColumn>STATUS</TableColumn>
          <TableColumn>SHIPPING</TableColumn>
          <TableColumn>PAYMENT</TableColumn>
          <TableColumn>TOTAL</TableColumn>
          <TableColumn>ACTIONS</TableColumn>
        </TableHeader>

        <TableBody
          items={orders ?? []}
          loadingContent={<Spinner />}
          isLoading={isLoading}
        >
          {orders?.map((order) => (
            <TableRow key={order._id}>
              <TableCell>
                <Tooltip content={order._id}>
                  <span className="text-sm">{order.orderId || "1234"}</span>
                </Tooltip>
              </TableCell>
              <TableCell>
                {order.user?.name.first + " " + order.user?.name.last}
              </TableCell>
              <TableCell>{order.user?.email}</TableCell>
              <TableCell>
                <Chip
                  className="capitalize"
                  color={statusColorMap[order.status]}
                  size="sm"
                  variant="flat"
                >
                  {order.status}
                </Chip>
              </TableCell>
              <TableCell>
                <div className="text-sm">
                  <p>
                    {order.shippingAddress.city}, {order.shippingAddress.region}
                  </p>
                  <p>{order.shippingAddress.country}</p>
                </div>
              </TableCell>
              <TableCell>
                <div className="flex flex-col gap-1 text-sm">
                  <span className="font-medium capitalize text-default-700">
                    {order.payment.method === "cod"
                      ? "Cash on Delivery"
                      : "Online Payment"}
                  </span>
                  <Chip
                    size="sm"
                    variant="flat"
                    color={paymentStatusColorMap[order.payment.status]}
                    className="w-fit capitalize"
                  >
                    {order.payment.status}
                  </Chip>
                </div>
              </TableCell>

              <TableCell>
                <div className="text-sm font-semibold">
                  {order.price.total.toFixed(2)} EGP
                </div>
              </TableCell>
              <TableCell>
                <div className="relative flex justify-end items-center gap-2">
                  <Dropdown className="bg-background border-1 border-default-200">
                    <DropdownTrigger>
                      <Button
                        isIconOnly
                        radius="full"
                        size="sm"
                        variant="light"
                      >
                        <VerticalDotsIcon className="text-default-400" />
                      </Button>
                    </DropdownTrigger>
                    <DropdownMenu>
                      <DropdownItem
                        key="pending"
                        onPress={() => onStatusUpdate(order._id, "pending")}
                      >
                        Mark as Pending
                      </DropdownItem>
                      <DropdownItem
                        key="active"
                        onPress={() => onStatusUpdate(order._id, "active")}
                      >
                        Mark as Active
                      </DropdownItem>
                      <DropdownItem
                        key="delivered"
                        onPress={() => onStatusUpdate(order._id, "delivered")}
                      >
                        Mark as Delivered
                      </DropdownItem>
                      <DropdownItem
                        key="cancelled"
                        color="danger"
                        onPress={() => onStatusUpdate(order._id, "cancelled")}
                      >
                        Cancel Order
                      </DropdownItem>
                    </DropdownMenu>
                  </Dropdown>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
