import {
  addToast,
  Button,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  useDisclosure,
} from "@heroui/react";
import React from "react";
import { VerticalDotsIcon } from "../icons";
import { IItem } from "@/types/item";
import Image from "next/image";
import { deleteItem } from "@/services/items.service";

const ItemActions = ({
  item,
  setRefreshCounter,
}: {
  item: IItem;
  setRefreshCounter: React.Dispatch<React.SetStateAction<number>>;
  isCreateItemModalOpen: boolean;
  onOpenCreateItemModal: () => void;
  onCloseCreateItemModal: () => void;
}) => {
  const { isOpen, onOpen, onClose } = useDisclosure();

  const handleDelete = async () => {
    try {
      await deleteItem(item._id);
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
  return (
    <>
      <div className="relative flex justify-end items-center gap-2">
        <Dropdown className="bg-background border-1 border-default-200">
          <DropdownTrigger>
            <Button isIconOnly radius="full" size="sm" variant="light">
              <VerticalDotsIcon className="text-default-400" />
            </Button>
          </DropdownTrigger>
          <DropdownMenu>
            <DropdownItem key="open" color="danger" onPress={onOpen}>
              Delete
            </DropdownItem>
          </DropdownMenu>
        </Dropdown>
      </div>
      <Modal isOpen={isOpen} size="md" onClose={onClose}>
        <ModalContent>
          {() => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                Confirmation
              </ModalHeader>
              <ModalBody>
                <Image
                  src={item.image}
                  alt={item.name}
                  width={500}
                  height={500}
                />
                Are you sure you want to delete {item.name}?
              </ModalBody>
              <ModalFooter>
                <Button color="danger" onPress={handleDelete}>
                  Delete
                </Button>
                <Button onPress={onClose}>Cancel</Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
};

export default ItemActions;
