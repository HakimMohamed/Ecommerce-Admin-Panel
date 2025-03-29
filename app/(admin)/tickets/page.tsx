"use client";
import { VerticalDotsIcon } from "@/components/icons";
import { capitalize } from "@/lib/utils";
import { getTickets, updateTicketStatus } from "@/services/tickets.service";
import { ITicket } from "@/types/tickets";
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
} from "@heroui/react";
import { ChevronDownIcon, SearchIcon } from "lucide-react";
import { useCallback, useEffect, useState } from "react";

export default function Tickets() {
  const [page, setPage] = useState(1);
  const rowsPerPage = 10;
  const [isLoading, setIsLoading] = useState(false);
  const [tickets, setTickets] = useState<ITicket[]>([]);
  const [ticketsCount, setTicketsCount] = useState<number>(0);
  const [statusFilter, setStatusFilter] = useState<Selection>("all");
  const [refreshCounter, setRefreshCounter] = useState(0);

  const pages = Math.ceil(ticketsCount / rowsPerPage);

  const statusColorMap: Record<
    "open" | "in-progress" | "closed",
    ChipProps["color"]
  > = {
    open: "warning",
    "in-progress": "success",
    closed: "primary",
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
    ticketId: string,
    newStatus: "open" | "in-progress" | "closed"
  ) => {
    try {
      await updateTicketStatus(ticketId, newStatus);
      addToast({
        title: "Ticket status updated",
        description: "Ticket status has been updated successfully",
        color: "success",
        timeout: 5000,
        shouldShowTimeoutProgress: true,
      });
    } catch (error) {
      addToast({
        title: "Failed to update ticket status",
        description: "An error occurred while updating ticket status",
        color: "danger",
        timeout: 5000,
        shouldShowTimeoutProgress: true,
      });
      console.error("Failed to update ticket status:", error);
    } finally {
      setRefreshCounter(refreshCounter + 1);
    }
  };

  useEffect(() => {
    const fetchTickets = async () => {
      try {
        setIsLoading(true);
        console.log(statusFilter);
        const response = await getTickets(
          page,
          rowsPerPage,
          filterValue,
          statusFilter
        );
        setTickets(response.data.data.tickets);
        setTicketsCount(response.data.data.count);
      } catch (error) {
        console.error("Failed to fetch tickets:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchTickets();
  }, [page, rowsPerPage, filterValue, statusFilter, refreshCounter]);

  const statusOptions = [
    { name: "Open", uid: "open" },
    { name: "In Progress", uid: "in-progress" },
    { name: "Closed", uid: "closed" },
  ];

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
        aria-label="Tickets Table"
        bottomContent={
          <div className="flex w-full justify-center">
            {isLoading ? (
              <Spinner />
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
          <TableColumn>USER EMAIL</TableColumn>
          <TableColumn>SUBJECT</TableColumn>
          <TableColumn>DESCRIPTION</TableColumn>
          <TableColumn>STATUS</TableColumn>
          <TableColumn>CREATED AT</TableColumn>
          <TableColumn>UPDATED AT</TableColumn>
          <TableColumn>CLOSED AT</TableColumn>
          <TableColumn>ACTIONS</TableColumn>
        </TableHeader>
        <TableBody
          items={tickets ?? []}
          loadingContent={<Spinner />}
          isLoading={isLoading}
        >
          {tickets &&
            tickets.map((ticket) => (
              <TableRow key={ticket._id}>
                <TableCell>{ticket.user?.email}</TableCell>
                <TableCell>{ticket.subject}</TableCell>
                <TableCell>{ticket.description}</TableCell>
                <TableCell>
                  <Chip
                    className="capitalize"
                    color={statusColorMap[ticket.status]}
                    size="sm"
                    variant="flat"
                  >
                    {ticket.status}
                  </Chip>
                </TableCell>
                <TableCell>
                  {new Date(ticket.createdAt).toLocaleDateString()}
                </TableCell>
                <TableCell>
                  {new Date(ticket.updatedAt).toLocaleDateString()}
                </TableCell>
                <TableCell>
                  {ticket.closedAt
                    ? new Date(ticket.closedAt).toLocaleDateString()
                    : "N/A"}
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
                          key="open"
                          color="danger"
                          onPress={() => {
                            onStatusUpdate(ticket._id, "open");
                          }}
                        >
                          Update Ticket To Open
                        </DropdownItem>
                        <DropdownItem
                          key="in-progress"
                          color="warning"
                          onPress={() => {
                            onStatusUpdate(ticket._id, "in-progress");
                          }}
                        >
                          Update Ticket To In Progress
                        </DropdownItem>
                        <DropdownItem
                          key="closed"
                          color="primary"
                          onPress={() => {
                            onStatusUpdate(ticket._id, "closed");
                          }}
                        >
                          Update Ticket To Closed
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
