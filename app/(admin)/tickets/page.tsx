"use client";
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
} from "@heroui/react";
import { useEffect, useState } from "react";

export default function Tickets() {
  const [page, setPage] = useState(1);
  const rowsPerPage = 10;
  const [isLoading, setIsLoading] = useState(false);
  const [tickets, setTickets] = useState<ITicket[]>([]);
  const [ticketsCount, setTicketsCount] = useState<number>(0);

  const pages = Math.ceil(ticketsCount / rowsPerPage);

  useEffect(() => {
    const fetchTickets = async () => {
      try {
        setIsLoading(true);
        const response = await getTickets(page, rowsPerPage);
        setTickets(response.data.data.tickets);
        setTicketsCount(response.data.data.count);
      } catch (error) {
        console.error("Failed to fetch tickets:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchTickets();
  }, [page, rowsPerPage]);

  const statusColorMap: Record<
    "open" | "in-progress" | "closed",
    ChipProps["color"]
  > = {
    open: "success",
    "in-progress": "warning",
    closed: "danger",
  };

  return (
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
  );
}
