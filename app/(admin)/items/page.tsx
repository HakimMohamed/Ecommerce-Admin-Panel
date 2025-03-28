"use client";
import { getItems } from "@/services/items.service";
import { IItem } from "@/types/item";
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Pagination,
  Spinner,
  Input,
} from "@heroui/react";
import { SearchIcon } from "lucide-react";
import Image from "next/image";
import { useCallback, useEffect, useState } from "react";

export default function Items() {
  const [page, setPage] = useState(1);
  const rowsPerPage = 10;
  const [isLoading, setIsLoading] = useState(false);
  const [items, setItems] = useState<IItem[]>([]);
  const [itemsCount, setItemsCount] = useState<number>(0);

  const pages = Math.ceil(itemsCount / rowsPerPage);

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
    const fetchItems = async () => {
      try {
        setIsLoading(true);
        const response = await getItems(page, rowsPerPage, filterValue);
        console.log(response.data.data.items);
        setItems(response.data.data.items);
        setItemsCount(response.data.data.count);
      } catch (error) {
        console.error("Failed to fetch tickets:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchItems();
  }, [page, rowsPerPage, filterValue]);

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
      </div>

      <Table
        aria-label="Tickets Table"
        topContent={
          <span className="text-sm">
            Showing {itemsCount ? itemsCount : 0} items
          </span>
        }
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
          <TableColumn>IMAGE</TableColumn>
          <TableColumn>NAME</TableColumn>
          <TableColumn>DESCRIPTION</TableColumn>
          <TableColumn>CATEGORY</TableColumn>
          <TableColumn>PRICE</TableColumn>
          <TableColumn>DISCOUNT</TableColumn>
        </TableHeader>
        <TableBody
          items={items ?? []}
          loadingContent={<Spinner />}
          isLoading={isLoading}
        >
          {items &&
            items.map((item) => (
              <TableRow key={item._id}>
                <TableCell>
                  <Image
                    src={item.image}
                    alt={item.name}
                    width={50}
                    height={50}
                  />
                </TableCell>
                <TableCell>{item.name}</TableCell>
                <TableCell>{item.description}</TableCell>
                <TableCell>{item.category}</TableCell>
                <TableCell>{item.price}</TableCell>
                <TableCell>
                  {item?.discount?.active
                    ? `${item.discount.value}%`
                    : "No Discount"}
                </TableCell>
              </TableRow>
            ))}
        </TableBody>
      </Table>
    </div>
  );
}
