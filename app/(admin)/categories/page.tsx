"use client";
import { VerticalDotsIcon } from "@/components/icons";
import CreateCategoryModal from "@/components/ui/CreateCategoryModal";
import ImageModal from "@/components/ui/ImageModal";
import {
  deleteCategory,
  getCategories,
  updateCategories,
} from "@/services/category.service";
import { uploadImage } from "@/services/cdn.service";

import { ICategory } from "@/types/category";
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
  Input,
  Dropdown,
  DropdownTrigger,
  Button,
  DropdownMenu,
  DropdownItem,
  addToast,
  useDisclosure,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  Image,
  ModalFooter,
  Checkbox,
} from "@heroui/react";
import { Pencil, SearchIcon } from "lucide-react";
import { useCallback, useEffect, useState } from "react";

export default function Categories() {
  const [page, setPage] = useState(1);
  const rowsPerPage = 10;
  const [isLoading, setIsLoading] = useState(false);
  const [categories, setCategories] = useState<ICategory[]>([]);
  const [categoriesCount, setCategoriesCount] = useState<number>(0);
  const [refreshCounter, setRefreshCounter] = useState(0);
  const [isEditing, setIsEditing] = useState(false);
  const [initialCategories, setinitialCategories] = useState<ICategory[]>([]);
  const [hasUpdates, setHasUpdates] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<ICategory | null>(
    null
  );

  const pages = Math.ceil(categoriesCount / rowsPerPage);

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
    const fetchCategories = async () => {
      try {
        setIsLoading(true);
        const response = await getCategories(page, rowsPerPage, filterValue);
        setCategories(response.data.data.categories);
        setCategoriesCount(response.data.data.count);
        setinitialCategories(response.data.data.categories);
      } catch (error) {
        console.error("Failed to fetch categories:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCategories();
  }, [page, rowsPerPage, filterValue, refreshCounter]);

  const {
    isOpen: isCreateCategoryModalOpen,
    onOpen: onOpenCreateCategoryModal,
    onClose: onCloseCreateCategoryModal,
  } = useDisclosure();

  const {
    isOpen: isDeleteCategoryModalOpen,
    onOpen: onOpenDeleteCategoryModal,
    onClose: onCloseDeleteCategoryModal,
  } = useDisclosure();
  const handleOpenDeleteCategoryModal = (category: ICategory) => {
    setSelectedCategory(category);
    onOpenDeleteCategoryModal();
  };

  const saveChanges = async () => {
    try {
      const updatedCategories = categories
        .map((category) => {
          const initialItem = initialCategories.find(
            (initialCategory) => category._id === initialCategory._id
          );

          if (JSON.stringify(category) === JSON.stringify(initialItem))
            return null;

          const updatedItem = Object.entries(category).reduce(
            (acc, [key, value]) => {
              if (key === "order") {
                acc[key] = Number(value);
              } else if (
                key !== "_id" &&
                value !== (initialItem?.[key as keyof ICategory] as unknown)
              ) {
                acc[key] = value;
              }
              return acc;
            },
            { _id: category._id } as Record<string, unknown>
          );
          return Object.keys(updatedItem).length ? updatedItem : null;
        })
        .filter(Boolean) as unknown as ICategory[];
      await updateCategories(updatedCategories);
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

  useEffect(() => {
    const hasChanges =
      JSON.stringify(categories) !== JSON.stringify(initialCategories);
    setHasUpdates(hasChanges);
  }, [categories]);

  const handleDelete = async () => {
    try {
      await deleteCategory(selectedCategory?._id!);
      onCloseDeleteCategoryModal();
      addToast({
        title: "Item deleted",
        description: "Item has been deleted successfully",
        color: "success",
        timeout: 5000,
        shouldShowTimeoutProgress: true,
      });
    } catch (error) {
      console.log(error);
      addToast({
        title: "Item deleted",
        description: "Item has been deleted successfully",
        color: "success",
        timeout: 5000,
        shouldShowTimeoutProgress: true,
      });
    } finally {
      setRefreshCounter((prev) => prev + 1);
    }
  };
  const onUpdateCategory = (index: number, key: string, value: any) => {
    setCategories((prevCategories) => {
      const updatedCategories = [...prevCategories];
      const keys = key.split(".");
      const updatedCategory = { ...updatedCategories[index] };

      let current: any = updatedCategory;
      for (let i = 0; i < keys.length - 1; i++) {
        current[keys[i]] = { ...current[keys[i]] };
        current = current[keys[i]];
      }

      current[keys[keys.length - 1]] = value;
      updatedCategories[index] = updatedCategory;

      return updatedCategories;
    });
  };

  const {
    isOpen: isImageModalOpen,
    onOpen: onImageModalOpen,
    onClose: onCloseImageModal,
  } = useDisclosure();

  const handleOpenImageModal = (category: ICategory) => {
    setSelectedCategory(category);
    onImageModalOpen();
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
      </div>

      <Table
        aria-label="Categories Table"
        topContent={
          <div className="flex justify-between">
            <span className="text-sm">
              Showing {categoriesCount ? categoriesCount : 0} Categories
            </span>
            <div className="flex justify-center gap-2">
              <Button
                onPress={() => {
                  setIsEditing((prev) => !prev);
                  setCategories(initialCategories);
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
              <Button onPress={onOpenCreateCategoryModal} color="primary">
                New Item
              </Button>
              <Button
                isIconOnly={true}
                onPress={() => {
                  if (isEditing) {
                    // revert to inital items
                    setCategories(initialCategories);
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
          <TableColumn>IMAGE</TableColumn>
          <TableColumn>TITLE</TableColumn>
          <TableColumn>ORDER</TableColumn>
          <TableColumn>STATUS</TableColumn>
          <TableColumn>ACTIONS</TableColumn>
        </TableHeader>

        <TableBody
          items={categories ?? []}
          loadingContent={<Spinner />}
          isLoading={isLoading}
        >
          {categories &&
            categories.map((category, index) => (
              <TableRow key={category._id}>
                <TableCell>
                  {isEditing ? (
                    <div className="flex flex-col items-start max-w-[77px]">
                      <Image
                        src={category.image}
                        alt={category.name}
                        width={77}
                        height={77}
                        className="mb-2 rounded"
                      />
                      <input
                        type="file"
                        accept="image/*"
                        onChange={async (e) => {
                          const file = e.target.files?.[0];
                          if (!file) return;

                          try {
                            const imageUrl = await uploadImage(file);
                            onUpdateCategory(index, "image", imageUrl);
                          } catch (err) {
                            console.error("Image upload failed", err);
                            addToast({
                              title: "Image Upload Failed",
                              description:
                                "An error occurred while uploading the image.",
                              color: "danger",
                              timeout: 4000,
                            });
                          }
                        }}
                      />
                    </div>
                  ) : (
                    <Image
                      src={category.image}
                      alt={category.name}
                      width={77}
                      height={77}
                      className="rounded"
                      onClick={() => handleOpenImageModal(category)}
                    />
                  )}
                </TableCell>
                <TableCell>
                  {isEditing ? (
                    <Input
                      className="w-full"
                      value={category.name}
                      onValueChange={(value) =>
                        onUpdateCategory(index, "name", value)
                      }
                    >
                      {category.name}
                    </Input>
                  ) : (
                    category.name
                  )}
                </TableCell>
                <TableCell>
                  {isEditing ? (
                    <Input
                      className="w-full"
                      type="number"
                      value={String(category.order)}
                      onValueChange={(value) =>
                        onUpdateCategory(index, "order", value)
                      }
                    >
                      {category.order}
                    </Input>
                  ) : (
                    category.order
                  )}
                </TableCell>
                <TableCell>
                  {isEditing ? (
                    <div className="flex items-center gap-2">
                      <Checkbox
                        isSelected={category?.active}
                        onValueChange={(value) =>
                          onUpdateCategory(index, "active", value)
                        }
                      />
                    </div>
                  ) : (
                    <Chip
                      className="capitalize"
                      color={category.active ? "success" : "danger"}
                      size="sm"
                      variant="flat"
                    >
                      {category.active ? "Active" : "Inactive"}
                    </Chip>
                  )}
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
                          key="delete"
                          color="danger"
                          onPress={() =>
                            handleOpenDeleteCategoryModal(category)
                          }
                        >
                          Delete
                        </DropdownItem>
                      </DropdownMenu>
                    </Dropdown>
                  </div>
                </TableCell>
              </TableRow>
            ))}
        </TableBody>
      </Table>
      <CreateCategoryModal
        isOpen={isCreateCategoryModalOpen}
        onCloseCreateCategoryModal={onCloseCreateCategoryModal}
        setRefreshCounter={setRefreshCounter}
      />
      <Modal
        isOpen={isDeleteCategoryModalOpen}
        size="md"
        onClose={onCloseDeleteCategoryModal}
      >
        <ModalContent>
          {() => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                Confirmation
              </ModalHeader>
              <ModalBody>
                <Image
                  src={selectedCategory?.image}
                  alt={selectedCategory?.name}
                  width={500}
                  height={500}
                />
                Are you sure you want to delete {selectedCategory?.name}?
              </ModalBody>
              <ModalFooter>
                <Button color="danger" onPress={handleDelete}>
                  Delete
                </Button>
                <Button onPress={onCloseDeleteCategoryModal}>Cancel</Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
      <ImageModal
        selectedItem={selectedCategory}
        isOpen={isImageModalOpen}
        onClose={onCloseImageModal}
      />
    </div>
  );
}
