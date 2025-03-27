"use client";
import { capitalize } from "@/lib/utils";
import { getTickets } from "@/services/tickets.service";
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

  const pages = Math.ceil(ticketsCount / rowsPerPage);

  const statusColorMap: Record<
    "open" | "in-progress" | "closed",
    ChipProps["color"]
  > = {
    open: "danger",
    "in-progress": "warning",
    closed: "success",
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
  }, [page, rowsPerPage, filterValue, statusFilter]);

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
            <Pagination
              isCompact
              showControls
              showShadow
              color="secondary"
              page={page}
              total={pages}
              onChange={(page) => setPage(page)}
            />
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
              </TableRow>
            ))}
        </TableBody>
      </Table>
    </div>
  );
}
