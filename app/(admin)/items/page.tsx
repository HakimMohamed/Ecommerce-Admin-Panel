"use client";
import CreateItemModal from "@/components/ui/CreateItemModal";
import ImageModal from "@/components/ui/ImageModal";
import ItemActions from "@/components/ui/ItemActions";
import { getItems, updateItems } from "@/services/items.service";
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
  Button,
  useDisclosure,
  addToast,
  Checkbox,
} from "@heroui/react";
import { Pencil, SearchIcon } from "lucide-react";
import Image from "next/image";
import { useCallback, useEffect, useState } from "react";

export default function Items() {
  const [page, setPage] = useState(1);
  const rowsPerPage = 10;
  const [isLoading, setIsLoading] = useState(false);
  const [items, setItems] = useState<IItem[]>([]);
  const [initialItems, setinitialItems] = useState<IItem[]>([]);
  const [itemsCount, setItemsCount] = useState<number>(0);
  const [isEditing, setIsEditing] = useState(false);
  const [refreshCounter, setRefreshCounter] = useState(0);
  const [selectedItem, setSelectedItem] = useState<IItem | null>(null);

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
        setItems(response.data.data.items);
        setinitialItems(response.data.data.items);
        setItemsCount(response.data.data.count);
      } catch (error) {
        console.error("Failed to fetch tickets:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchItems();
  }, [page, rowsPerPage, filterValue, refreshCounter]);

  const [hasUpdates, setHasUpdates] = useState(false);

  useEffect(() => {
    const hasChanges = JSON.stringify(items) !== JSON.stringify(initialItems);
    setHasUpdates(hasChanges);
  }, [items]);

  const onUpdateItem = (index: number, key: string, value: any) => {
    setItems((prevItems) => {
      const updatedItems = [...prevItems];
      const keys = key.split(".");
      const updatedItem = { ...updatedItems[index] };

      let current: any = updatedItem;
      for (let i = 0; i < keys.length - 1; i++) {
        current[keys[i]] = { ...current[keys[i]] };
        current = current[keys[i]];
      }

      current[keys[keys.length - 1]] = value;
      updatedItems[index] = updatedItem;

      return updatedItems;
    });
  };

  const saveChanges = async () => {
    try {
      const updatedItems = items
        .map((item) => {
          const initialItem = initialItems.find(
            (initialItem) => item._id === initialItem._id
          );

          if (JSON.stringify(item) === JSON.stringify(initialItem)) return null;

          const updatedItem = Object.entries(item).reduce(
            (acc, [key, value]) => {
              if (
                key !== "_id" &&
                value !== initialItem?.[key as keyof IItem]
              ) {
                acc[key] = value;
              }
              return acc;
            },
            { _id: item._id } as Record<string, unknown>
          );
          return Object.keys(updatedItem).length ? updatedItem : null;
        })
        .filter(Boolean) as unknown as IItem[];

      await updateItems(updatedItems);
      addToast({
        title: "Items updated",
        description: "Items have been updated successfully",
        color: "success",
        timeout: 5000,
        shouldShowTimeoutProgress: true,
      });
    } catch (error) {
      console.log(error);
      addToast({
        title: "Failed to update items",
        description: "An error occurred while updating items",
        color: "danger",
        timeout: 5000,
        shouldShowTimeoutProgress: true,
      });
    } finally {
      setRefreshCounter(refreshCounter + 1);
      setIsEditing(false);
    }
  };

  const handleOpen = (item: IItem) => {
    setSelectedItem(item);
    onImageModalOpen();
  };

  const {
    isOpen: isImageModalOpen,
    onOpen: onImageModalOpen,
    onClose: onImageModalClose,
  } = useDisclosure();

  const {
    isOpen: isCreateItemModalOpen,
    onOpen: onOpenCreateItemModal,
    onClose: onCloseCreateItemModal,
  } = useDisclosure();
  return (
    <div className="flex flex-col w-full gap-4">
      <div className="flex justify-between w-full gap-4">
        <Input
          isClearable
          className="w-full sm:max-w-[44%]"
          placeholder="Search by name..."
          startContent={<SearchIcon />}
          value={filterValue}
          onClear={() => onClear()}
          onValueChange={onSearchChange}
        />
      </div>

      <Table
        aria-label="Tickets Table"
        topContent={
          <div className="flex justify-between">
            <span className="text-sm">
              Showing {itemsCount ? itemsCount : 0} items
            </span>
            <div className="flex justify-center gap-2">
              <Button
                onPress={() => {
                  setIsEditing((prev) => !prev);
                  setItems(initialItems);
                }}
                isDisabled={!hasUpdates}
              >
                Cancel
              </Button>
              <Button
                onPress={saveChanges}
                isDisabled={!hasUpdates}
                color="secondary"
              >
                Save Changes
              </Button>
              <Button onPress={onOpenCreateItemModal} color="primary">
                New Item
              </Button>
              <Button
                isIconOnly={true}
                onPress={() => {
                  if (isEditing) {
                    // revert to inital items
                    setItems(initialItems);
                  }

                  setIsEditing((prev) => !prev);
                }}
              >
                <Pencil />
              </Button>
            </div>
          </div>
        }
        bottomContent={
          <div className="flex w-full justify-center">
            {isLoading ? (
              <p>calculating...</p>
            ) : (
              <Pagination
                isCompact
                showControls
                showShadow
                color="secondary"
                page={page}
                initialPage={1}
                total={pages}
                onChange={(page) => setPage(page)}
              />
            )}
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
          <TableColumn>ACTIONS</TableColumn>
        </TableHeader>
        <TableBody
          items={items ?? []}
          loadingContent={<Spinner />}
          isLoading={isLoading}
        >
          {items &&
            items.map((item, index) => (
              <TableRow key={item._id}>
                <TableCell onClick={() => handleOpen(item)}>
                  <Image
                    src={item.image}
                    alt={item.name}
                    width={77}
                    height={77}
                  />
                </TableCell>
                <TableCell>
                  {isEditing ? (
                    <Input
                      className="w-full"
                      value={item.name}
                      onValueChange={(value) =>
                        onUpdateItem(index, "name", value)
                      }
                    >
                      {item.name}
                    </Input>
                  ) : (
                    item.name
                  )}
                </TableCell>
                <TableCell>
                  {isEditing ? (
                    <Input
                      className="w-full"
                      value={item.description}
                      onValueChange={(value) =>
                        onUpdateItem(index, "description", value)
                      }
                    >
                      {item.description}
                    </Input>
                  ) : (
                    item.description
                  )}
                </TableCell>
                <TableCell>
                  {isEditing ? (
                    <Input
                      className="w-full"
                      value={item.category}
                      onValueChange={(value) =>
                        onUpdateItem(index, "category", value)
                      }
                    >
                      {item.category}
                    </Input>
                  ) : (
                    item.category
                  )}
                </TableCell>
                <TableCell>
                  {isEditing ? (
                    <Input
                      className="w-full"
                      value={String(item.price)}
                      type="number"
                      onValueChange={(value) =>
                        onUpdateItem(index, "price", value)
                      }
                    >
                      {item.price}
                    </Input>
                  ) : (
                    item.price
                  )}
                </TableCell>
                <TableCell>
                  {isEditing ? (
                    <div className="flex items-center gap-2">
                      <Checkbox
                        isSelected={item?.discount?.active}
                        onValueChange={(value) =>
                          onUpdateItem(index, "discount.active", value)
                        }
                      />
                      <Input
                        className="w-full"
                        type="number"
                        value={String(item?.discount?.value ?? 0)}
                        onValueChange={(value) =>
                          onUpdateItem(index, "discount.value", Number(value))
                        }
                      />
                    </div>
                  ) : item?.discount?.active ? (
                    `${item.discount.value}%`
                  ) : (
                    "No Discount"
                  )}
                </TableCell>

                <TableCell>
                  <ItemActions
                    item={item}
                    setRefreshCounter={setRefreshCounter}
                    isCreateItemModalOpen={isCreateItemModalOpen}
                    onOpenCreateItemModal={onOpenCreateItemModal}
                    onCloseCreateItemModal={onCloseCreateItemModal}
                  />
                </TableCell>
              </TableRow>
            ))}
        </TableBody>
      </Table>
      <CreateItemModal
        isOpen={isCreateItemModalOpen}
        onCloseCreateItemModal={onCloseCreateItemModal}
        setRefreshCounter={setRefreshCounter}
      />
      <ImageModal
        selectedItem={selectedItem}
        isOpen={isImageModalOpen}
        onClose={onImageModalClose}
      />
    </div>
  );
}
