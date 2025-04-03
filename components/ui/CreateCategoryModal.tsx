import { addCategory } from "@/services/category.service";
import { uploadImage } from "@/services/cdn.service";
import { ICategory } from "@/types/category";
import {
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Input,
  Checkbox,
  Divider,
  addToast,
} from "@heroui/react";
import Image from "next/image";
import { useState } from "react";

function CreateCategoryModal({
  isOpen,
  onCloseCreateCategoryModal,
  setRefreshCounter,
}: {
  isOpen: boolean;
  onCloseCreateCategoryModal: () => void;
  setRefreshCounter: React.Dispatch<React.SetStateAction<number>>;
}) {
  const [categoryName, setCategoryName] = useState("");
  const [order, setOrder] = useState("");
  const [active, setActive] = useState(true);
  const [image, setImage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const onSubmit = async (newCategory: Partial<Omit<ICategory, "_id">>) => {
    setIsLoading(true);
    try {
      await addCategory(newCategory);
      addToast({
        title: "Category added",
        description: "Category has been added successfully",
        color: "success",
        timeout: 5000,
        shouldShowTimeoutProgress: true,
      });
      setRefreshCounter((prev) => prev + 1);
      onCloseCreateCategoryModal();
    } catch (error) {
      console.error(error);
      addToast({
        title: "Failed to add category",
        description: "An error occurred while adding category",
        color: "danger",
        timeout: 5000,
        shouldShowTimeoutProgress: true,
      });
    } finally {
      setIsLoading(false);
    }
  };

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const newCategory: Partial<Omit<ICategory, "_id">> = {
      name: categoryName,
      order: parseInt(order) || 0,
      active,
      image: image || "",
    };

    onSubmit(newCategory);
  }

  function isValidUrl(imageUrl: string): boolean {
    try {
      const url = new URL(imageUrl);
      return url.protocol === "http:" || url.protocol === "https:";
    } catch {
      return false;
    }
  }

  return (
    <Modal isOpen={isOpen} size="lg" onClose={onCloseCreateCategoryModal}>
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader className="flex flex-col gap-1">
              <h2 className="text-xl font-semibold">Add New Category</h2>
            </ModalHeader>
            <form onSubmit={handleSubmit}>
              <ModalBody>
                <div className="grid gap-6">
                  <div className="space-y-2">
                    <p className="text-sm font-medium">Name*</p>
                    <Input
                      placeholder="Enter category name"
                      value={categoryName}
                      onChange={(e) => setCategoryName(e.target.value)}
                      variant="bordered"
                      isRequired
                      className="w-full"
                    />
                  </div>

                  <div className="space-y-2">
                    <p className="text-sm font-medium">Order*</p>
                    <Input
                      type="number"
                      placeholder="Enter order"
                      value={order}
                      onChange={(e) => setOrder(e.target.value)}
                      variant="bordered"
                      isRequired
                      min="0"
                      step="1"
                      className="w-full"
                    />
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
                      }}
                      className="w-full"
                    />

                    {image && isValidUrl(image) && (
                      <div className="mt-2 relative h-48 w-full border rounded-md overflow-hidden">
                        <Image
                          src={image}
                          alt="Category preview"
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
                  </div>
                </div>
              </ModalBody>

              <Divider className="my-2" />

              <ModalFooter>
                <Button color="danger" variant="light" onPress={onClose}>
                  Cancel
                </Button>
                <Button color="primary" type="submit" isLoading={isLoading}>
                  Add Category
                </Button>
              </ModalFooter>
            </form>
          </>
        )}
      </ModalContent>
    </Modal>
  );
}

export default CreateCategoryModal;
