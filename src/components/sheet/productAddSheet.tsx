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
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Textarea } from "../ui/textarea";
import { useEffect, useMemo, useState } from "react";
import { Target } from "lucide-react";
import { toast } from "react-toastify";
import { useProductActions } from "@/hooks/products/useProductActions";
import { uploadProductImages } from "@/lib/actions/uploadImages";
import { FileUploader } from "../file-uploader";
import { useProductSheet } from "@/app/stores/useProductSheet";
import { useQuery, useQueryClient } from "@tanstack/react-query"; // ✅ Import
import { ProductCategoryTypes } from "@/lib/types/menu-types";
import { getCategoriesAPI } from "@/services/categoryServices";
import SubmitButton from "../ui/SubmitButton";

export function ProductAddSheet() {
  const { isOpen, productId, categoryId, mode, closeSheet, openAddSheet } =
    useProductSheet();

  const { data: categories } = useQuery<ProductCategoryTypes[]>({
    queryKey: ["categories"],
    queryFn: getCategoriesAPI,
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
  const [images, setImages] = useState<File[]>([]);

  useEffect(() => {
    if (product && mode === "edit") {
      setName(product.name);
      setDescription(product.description);
      setPrice((product.price / 100).toString()); // Convert cents to dollars
      // Handle existing images if needed
    } else {
      // Reset for add mode
      setName("");
      setDescription("");
      setPrice("");
      setImages([]);
    }
  }, [product, mode]);

  const { addProduct, updateProduct } = useProductActions(); // ✅ Single declaration

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!categoryId) return;

    // ✅ Handle both add and edit
    if (mode === "edit" && productId) {
      // Update existing product
      updateProduct.mutate(
        {
          product_id: productId,
          name,
          description,
          price: Number(price) * 100, // Convert to cents
          category_id: categoryId,
        },
        {
          onSuccess: async (updatedProduct) => {
            if (images.length > 0) {
              const urls = await uploadProductImages(updatedProduct.id, images);
              await fetch("/api/menu/products/images", {
                method: "POST",
                body: JSON.stringify({
                  productId: updatedProduct.id,
                  ImageName: updatedProduct.name,
                  images: urls,
                }),
              });
            }
            queryClient.invalidateQueries({ queryKey: ["categories"] });
            closeSheet();
          },
        }
      );
    } else {
      // Add new product
      addProduct.mutate(
        {
          name,
          description,
          price: Number(price) * 100, // Convert to cents
          category_id: categoryId,
        },
        {
          onSuccess: async (product) => {
            if (images.length > 0) {
              const urls = await uploadProductImages(product.id, images);
              await fetch("/api/menu/products/images", {
                method: "POST",
                body: JSON.stringify({
                  productId: product.id,
                  ImageName: product.name,
                  images: urls,
                }),
              });
            }
            queryClient.invalidateQueries({ queryKey: ["categories"] });

            closeSheet();
          },
        }
      );
    }
  };

  // ✅ Add conditional rendering
  if (!isOpen) return null;
  return (
    <Sheet open={isOpen} onOpenChange={closeSheet}>
      <SheetTitle></SheetTitle>
      <SheetContent className="h-full overflow-y-auto p-0">
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
                <FileUploader
                  files={images}
                  onChange={setImages}
                  multiple={true}
                />
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
              isLoading={updateProduct.isPending}
              className="mx-auto"
            >
              {mode === "edit" ? "Update" : "Add"}
            </SubmitButton>
          </SheetFooter>
        </form>
      </SheetContent>
    </Sheet>
  );
}
