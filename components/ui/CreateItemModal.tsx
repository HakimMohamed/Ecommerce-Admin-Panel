import { uploadImage } from "@/services/cdn.service";
import { addItem } from "@/services/items.service";
import { IItem } from "@/types/item";
import {
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Input,
  Textarea,
  Checkbox,
  Divider,
  addToast,
  Alert,
} from "@heroui/react";
import Image from "next/image";
import { useState } from "react";

function CreateItemModal({
  isOpen,
  onCloseCreateItemModal,
  setRefreshCounter,
}: {
  isOpen: boolean;
  onCloseCreateItemModal: () => void;
  setRefreshCounter: React.Dispatch<React.SetStateAction<number>>;
}) {
  const [itemName, setItemName] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [price, setPrice] = useState("");
  const [discountEnabled, setDiscountEnabled] = useState(false);
  const [discount, setDiscount] = useState("");
  const [image, setImage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [active, setActive] = useState(true);

  // State for symmetry alert message
  const [symmetryAlert, setSymmetryAlert] = useState<string | null>(null);

  const onSubmit = async (newItem: any) => {
    setIsLoading(true);
    try {
      await addItem(newItem);
      addToast({
        title: "Item added",
        description: "Item has been added successfully",
        color: "success",
        timeout: 5000,
        shouldShowTimeoutProgress: true,
      });
      setRefreshCounter((refreshCounter) => refreshCounter + 1);
      onCloseCreateItemModal();
    } catch (error) {
      console.log(error);
      addToast({
        title: "Failed to add item",
        description: "An error occurred while adding item",
        color: "danger",
        timeout: 5000,
        shouldShowTimeoutProgress: true,
      });
    } finally {
      setIsLoading(false);
    }
  };

  function handleSubmit(e: { preventDefault: () => void }) {
    e.preventDefault();
    const newItem: Partial<Omit<IItem, "_id">> = {
      name: itemName,
      description,
      category,
      price: parseFloat(price) || 0,
      discount: {
        value: parseFloat(discount) || 0,
        active: discountEnabled,
      },
      image: image || "",
      active,
    };

    onSubmit(newItem);
  }

  function isValidUrl(image: string): boolean {
    try {
      const url = new URL(image);
      return url.protocol === "http:" || url.protocol === "https:";
    } catch {
      return false;
    }
  }

  return (
    <Modal isOpen={isOpen} size="lg" onClose={onCloseCreateItemModal}>
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader className="flex flex-col gap-1">
              <h2 className="text-xl font-semibold">Add New Item</h2>
            </ModalHeader>
            <form onSubmit={handleSubmit}>
              <ModalBody>
                <div className="grid gap-6">
                  <div className="space-y-2">
                    <p className="text-sm font-medium">Name*</p>
                    <Input
                      placeholder="Enter item name"
                      value={itemName}
                      onChange={(e) => setItemName(e.target.value)}
                      variant="bordered"
                      isRequired
                      className="w-full"
                    />
                  </div>

                  <div className="space-y-2">
                    <p className="text-sm font-medium">Description*</p>
                    <Textarea
                      placeholder="Enter item description"
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      variant="bordered"
                      isRequired
                      className="w-full min-h-24"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <p className="text-sm font-medium">Category*</p>
                      <Input
                        placeholder="Enter category"
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                        variant="bordered"
                        isRequired
                        className="w-full"
                      />
                    </div>

                    <div className="space-y-2">
                      <p className="text-sm font-medium">Price*</p>
                      <Input
                        type="number"
                        placeholder="0.00"
                        value={price}
                        onChange={(e) => setPrice(e.target.value)}
                        startContent={
                          <div className="flex items-center">
                            <span className="text-gray-400 text-sm">EGP</span>
                          </div>
                        }
                        variant="bordered"
                        isRequired
                        min="0"
                        step="0.1"
                        className="w-full"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Checkbox
                        isSelected={discountEnabled}
                        onValueChange={setDiscountEnabled}
                      />
                      <p className="text-sm font-medium">Enable Discount</p>
                    </div>

                    {discountEnabled && (
                      <Input
                        type="number"
                        placeholder="Discount percentage"
                        value={discount}
                        onChange={(e) => setDiscount(e.target.value)}
                        endContent={
                          <div className="flex items-center">
                            <span className="text-gray-400 text-sm">%</span>
                          </div>
                        }
                        variant="bordered"
                        min="0"
                        max="100"
                        step="1"
                        className="w-full"
                      />
                    )}
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Checkbox isSelected={active} onValueChange={setActive} />
                      <p className="text-sm font-medium">Active</p>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <p className="text-sm font-medium">Image*</p>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={async (e) => {
                        const file = e.target.files?.[0];
                        if (!file) return;

                        const img = new window.Image();
                        const objectUrl = URL.createObjectURL(file);
                        img.src = objectUrl;

                        img.onload = async () => {
                          if (img.naturalWidth !== img.naturalHeight) {
                            setSymmetryAlert(
                              "Image might look bad and affect other items. Center focused images with symmetrical dimensions is better."
                            );
                          } else {
                            setSymmetryAlert(null);
                          }
                          URL.revokeObjectURL(objectUrl);
                          setIsLoading(true);
                          try {
                            const uploadedUrl = await uploadImage(file);
                            setImage(uploadedUrl);
                          } catch (err) {
                            console.error("Image upload failed", err);
                            addToast({
                              title: "Image Upload Failed",
                              description:
                                "Could not upload image. Please try again.",
                              color: "danger",
                              timeout: 5000,
                            });
                          } finally {
                            setIsLoading(false);
                          }
                        };

                        img.onerror = (error) => {
                          console.error("Error loading image", error);
                          addToast({
                            title: "Image Load Error",
                            description:
                              "Failed to load image. Please select another image.",
                            color: "danger",
                            timeout: 5000,
                          });
                        };
                      }}
                      className="w-full"
                    />

                    {image && isValidUrl(image) && (
                      <div className="mt-2 relative h-48 w-full border rounded-md overflow-hidden">
                        <Image
                          src={image}
                          alt="Item preview"
                          layout="fill"
                          objectFit="contain"
                          className="p-2"
                        />
                      </div>
                    )}

                    {image && !isValidUrl(image) && (
                      <p className="mt-2 text-red-600 text-sm">
                        Please enter a valid image URL
                      </p>
                    )}

                    {symmetryAlert && (
                      <Alert color="warning" title="Warning Alert">
                        {symmetryAlert}
                      </Alert>
                    )}
                  </div>
                </div>
              </ModalBody>

              <Divider className="my-2" />

              <ModalFooter>
                <Button color="danger" variant="light" onPress={onClose}>
                  Cancel
                </Button>
                <Button color="primary" type="submit" isLoading={isLoading}>
                  Add Item
                </Button>
              </ModalFooter>
            </form>
          </>
        )}
      </ModalContent>
    </Modal>
  );
}

export default CreateItemModal;
