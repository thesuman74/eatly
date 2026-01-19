import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetOverlay,
  SheetPortal,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Textarea } from "../ui/textarea";
import { useEffect, useMemo, useState } from "react";
import { Loader, Target } from "lucide-react";
import { toast } from "react-toastify";
import { useProductActions } from "@/hooks/products/useProductActions";
import { uploadProductImages } from "@/lib/actions/uploadImages";
import { FileUploader } from "../file-uploader";
import { useProductSheet } from "@/stores/ui/productSheetStore";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import {
  ProductCategoryTypes,
  ProductImageTypes,
} from "@/lib/types/menu-types";
import { getCategoriesAPI } from "@/services/categoryServices";
import SubmitButton from "../ui/SubmitButton";
import { set } from "react-hook-form";
import { useRestaurantStore } from "@/stores/admin/restaurantStore";
import ImageFetcherButton from "../ImageFetcher";

type ProductImageItem =
  | { type: "file"; file: File }
  | { type: "url"; url: string };
export function ProductAddSheet() {
  const { isOpen, productId, categoryId, mode, closeSheet, openAddSheet } =
    useProductSheet();

  const restaurantId = useRestaurantStore((state) => state.restaurantId);

  const { data: categories } = useQuery<ProductCategoryTypes[]>({
    queryKey: ["categories"],
    queryFn: () => getCategoriesAPI(restaurantId),
  });

  const queryClient = useQueryClient();

  const product = useMemo(() => {
    if (!categories || !categoryId || !productId || mode === "add") return null;
    const category = categories.find((cat) => cat.id === categoryId);
    return category?.products.find((p) => p.id === productId) || null;
  }, [categories, categoryId, productId, mode]);

  // ✅ Initialize form state
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [images, setImages] = useState<ProductImageItem[]>([]);
  const [existingImages, setExistingImages] = useState<ProductImageTypes[]>([]);
  const [deletingImages, setDeletingImages] = useState<{
    [key: string]: boolean;
  }>({});

  useEffect(() => {
    if (product && mode === "edit") {
      setName(product.name);
      setDescription(product.description);
      setPrice(product.price.toString()); // Convert cents to dollars
      setExistingImages(product.images || []); // ⬅️ HERE

      // Handle existing images if needed
    } else {
      // Reset for add mode
      setName("");
      setDescription("");
      setPrice("");
      setImages([]);
      setExistingImages([]); // reset
    }
  }, [product, mode]);

  const { addProduct, updateProduct } = useProductActions(); // ✅ Single declaration

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!categoryId) return;

    // if (!name || !description || !price || !categoryId) {
    //   toast.error("All fields are required");
    //   return;
    // }

    // Prepare payload
    const payload = {
      name,
      description: description?.trim() || "",
      price: Number(price),
      category_id: categoryId,
      images: images, // only uploaded files
    };

    if (mode === "edit" && productId) {
      updateProduct.mutate(
        { ...payload, product_id: productId },
        {
          onSuccess: () => {
            setImages([]); // Clear uploaded images
            closeSheet(); // Close sheet
          },
          onError: (err: any) => {
            toast.error(err.message || "Failed to update product");
          },
        },
      );
    } else {
      addProduct.mutate(payload, {
        onSuccess: () => {
          setImages([]); // Clear uploaded images
          closeSheet(); // Close sheet
        },
        onError: (err: any) => {
          toast.error(err.message || "Failed to add product");
        },
      });
    }
  };

  const handleDeleteImage = async (imageId: string) => {
    setDeletingImages((prev) => ({ ...prev, [imageId]: true }));

    try {
      const res = await fetch(
        `/api/menu/products/images?imageId=${imageId}&restaurantId=${restaurantId}`,
        {
          method: "DELETE",
        },
      );

      if (res.ok) {
        // ✅ Update state correctly depending on shape
        setExistingImages((prev) => prev.filter((img) => img.id !== imageId));

        queryClient.invalidateQueries({ queryKey: ["categories"] });
        toast.success("Image deleted");
        setImages([]); // Clear uploaded images if needed
      } else {
        toast.error("Failed to delete image");
      }
    } catch (error) {
      console.log(error);
    } finally {
      setDeletingImages((prev) => ({ ...prev, [imageId]: false }));
    }
  };

  const handleImageFetch = (url: string) => {
    if (!url) return;
    setImages([{ type: "url", url }]);
  };

  console.log("images", images);

  return (
    <Sheet
      open={isOpen}
      onOpenChange={(open) => {
        if (!open) closeSheet();
      }}
    >
      <SheetTitle></SheetTitle>

      <SheetContent className=" overflow-y-auto p-0">
        <form onSubmit={handleSubmit}>
          <aside className=" max-w-sm min-w-[300px] bg-gray-100">
            <div className="flex justify-between px-4 py-2">
              <span className="text-lg font-semibold">
                {mode === "edit" ? "Edit Product" : "Add Product"}
              </span>
              <span>:</span>
            </div>
            <hr className="border-gray-400" />
            <div className="my-2 flex flex-col items-center justify-between space-x-4 p-2">
              <div className="w-full space-y-2">
                <Input
                  type="text"
                  name="product_name"
                  placeholder="Product Name"
                  className="w-full border"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
                <Textarea
                  name="Description"
                  id=""
                  placeholder="Description"
                  className="w-full border"
                  value={description || ""}
                  onChange={(e) => setDescription(e.target.value)}
                />
                <div className="flex space-x-2 items-center">
                  <FileUploader
                    files={images
                      .filter(
                        (img): img is { type: "file"; file: File } =>
                          img.type === "file",
                      )
                      .map((img) => img.file)}
                    onChange={(files) =>
                      setImages(files.map((file) => ({ type: "file", file })))
                    }
                    multiple={false}
                  />

                  {images.map((img, idx) => {
                    const src =
                      img.type === "file"
                        ? URL.createObjectURL(img.file)
                        : img.url;
                    return (
                      <div key={idx} className="relative w-24 h-24">
                        <img
                          src={src}
                          className="w-full h-full object-cover rounded-md border"
                        />
                        <button
                          type="button"
                          onClick={() =>
                            setImages((prev) =>
                              prev.filter((_, i) => i !== idx),
                            )
                          }
                          className="absolute top-1 right-1 bg-red-500 text-white text-xs rounded-full px-1"
                        >
                          ✕
                        </button>
                      </div>
                    );
                  })}

                  {mode === "edit" && existingImages.length > 0 && (
                    <>
                      <div className="space-y-2">
                        <Label className="font-semibold">Existing Images</Label>

                        <div className="flex">
                          <div className="flex flex-wrap gap-3">
                            {existingImages.map((img) => (
                              <div key={img.id} className="relative w-24 h-24">
                                <img
                                  src={img.url}
                                  alt={img.alt || "image"}
                                  className="w-full h-full object-cover rounded-md border"
                                />

                                <button
                                  type="button"
                                  onClick={() => handleDeleteImage(img.id)}
                                  className="absolute top-1 right-1 bg-red-500 text-white text-xs rounded-full px-1"
                                >
                                  ✕
                                </button>
                                {deletingImages[img.id] && (
                                  <span className="absolute inset-0 bg-black/30 flex items-center justify-center">
                                    <Loader
                                      className="animate-spin"
                                      width={24}
                                      height={24}
                                      aria-label="loader"
                                    />
                                  </span>
                                )}
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </>
                  )}
                </div>
                <div className="flex">
                  {/* Button to fetch random image */}
                  {name && (
                    <ImageFetcherButton
                      productName={name}
                      buttonText="Fetch Random Image"
                      onImageFetched={handleImageFetch}
                      className="ml-2"
                    />
                  )}
                </div>
              </div>
            </div>
            <div className="w-full bg-gray-300 p-1"></div>

            {/* <!-- //price section  --> */}
            <div className="space-y-2 p-4">
              <div className="flex justify-between">
                <Label className="text-lg font-semibold">Price</Label>
                <div className="space-x-2 rounded-lg border px-4">
                  <span>Simple</span>
                  <span className="border-l px-2">Varients</span>
                </div>
              </div>

              <Input
                type="number"
                name="product_price"
                placeholder="NPR 0.00"
                className="w-full border"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
              />

              <div className="flex flex-wrap items-center space-y-2 space-x-2 text-sm text-nowrap">
                <button className="rounded-md bg-green-500 px-3 py-1 text-white">
                  Available
                </button>
                <button className="rounded-md bg-gray-200 px-4 py-1 text-gray-700">
                  + Discount
                </button>
                <button className="rounded-md bg-gray-200 px-3 py-1 text-gray-700">
                  + Cost
                </button>
                <button className="rounded-md bg-gray-200 px-3 py-1 text-gray-700">
                  + Packaging
                </button>
                <button className="rounded-md bg-gray-200 px-3 py-1 text-gray-700">
                  + SKU
                </button>
              </div>
            </div>

            <div className="my-2 w-full bg-gray-300 p-1"></div>

            {/* <!-- stock control  --> */}
            <div className="flex items-center justify-between px-4">
              <span className="text-gray-700">Stock Control</span>
              <input type="checkbox" className="toggle-checkbox" />
            </div>
            <div className="my-2 w-full bg-gray-300 p-1"></div>

            <div className="space-y-2 px-4">
              <span className="text-lg font-semibold">Add Modifier</span>
              <div className="flex items-center space-x-2">
                <input
                  type="text"
                  placeholder="Ingredients, flavors, cutlery..."
                  className="flex-1 rounded-md border p-1 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
                <button className="rounded-md bg-blue-500 px-4 py-2 text-white">
                  +
                </button>
              </div>
            </div>

            <div className="my-2 w-full bg-gray-300 p-1"></div>

            <div className="space-y-2 px-4">
              <span className="text-lg font-semibold">Kitchen</span>
              <p className="text-sm text-gray-500">
                Select the area where you prepare your product (optional).
              </p>
              <select className="w-full rounded-md border p-1 focus:ring-2 focus:ring-blue-500 focus:outline-none">
                <option>Main kitchen</option>
              </select>
            </div>
          </aside>

          <SheetFooter className=" py-2 w-full mt-4 flex  ">
            <SubmitButton
              className="w-40 mx-auto"
              disabled={mode === "edit" ? updateProduct.isPending : false}
              isLoading={
                mode === "edit" ? updateProduct.isPending : addProduct.isPending
              }
            >
              {mode === "edit" ? "Update" : "Add"}
            </SubmitButton>
          </SheetFooter>
        </form>
      </SheetContent>
    </Sheet>
  );
}
