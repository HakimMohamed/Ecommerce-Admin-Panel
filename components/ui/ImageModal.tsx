import { IItem } from "@/types/item";
import { Modal, ModalBody, ModalContent, ModalHeader } from "@heroui/react";
import Image from "next/image";
import React from "react";

const ImageModal = ({
  selectedItem,
  isOpen,
  onClose,
}: {
  selectedItem: IItem | null;
  isOpen: boolean;
  onClose: () => void;
}) => {
  return (
    <Modal isOpen={isOpen} size="md" onClose={onClose}>
      <ModalContent>
        {() => (
          <>
            <ModalHeader className="flex flex-col gap-1">
              {selectedItem && selectedItem.name}
            </ModalHeader>
            <ModalBody>
              {selectedItem && (
                <Image
                  src={selectedItem?.image}
                  alt={selectedItem?.name}
                  width={500}
                  height={500}
                />
              )}
            </ModalBody>
          </>
        )}
      </ModalContent>
    </Modal>
  );
};

export default ImageModal;
