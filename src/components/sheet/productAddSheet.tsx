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
import { useState } from "react";
import { Target } from "lucide-react";
import { toast } from "react-toastify";
import { useProductActions } from "@/hooks/products/useProductActions";
import { uploadProductImages } from "@/lib/actions/uploadImages";

export function ProductAddSheet({ categoryId }: { categoryId: string }) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [images, setImages] = useState<File[]>([]);

  const [isopen, setIsopen] = useState(false);

  const { addProduct } = useProductActions();

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    addProduct.mutate(
      {
        name,
        description,
        price: Number(price),
        category_id: categoryId,
      },
      {
        onSuccess: async (product) => {
          if (images.length > 0) {
            const urls = await uploadProductImages(product.id, images);
            console.log("Uploaded URLs:", urls);

            // Insert URLs into product_images table
            const res = await fetch("/api/menu/products/images", {
              method: "POST",
              body: JSON.stringify({
                productId: product.id,
                ImageName: product.name,
                images: urls,
              }),
            });

            const data = await res.json();
            console.log("Image upload response:", data);
          }
          setName("");
          setDescription("");
          setPrice("");
          setImages([]);

          setIsopen(false);
        },
      }
    );
  };

  return (
    <Sheet open={isopen} onOpenChange={setIsopen}>
      <SheetTrigger asChild>
        <Button variant="outline" onClick={() => setIsopen(true)}>
          + Product
        </Button>
      </SheetTrigger>
      <SheetTitle></SheetTitle>
      <SheetContent className="h-full overflow-y-auto p-0">
        <form onSubmit={handleSubmit}>
          <aside className=" max-w-sm min-w-[300px] bg-gray-100">
            <div className="flex justify-between px-4 py-2">
              <span className="text-lg font-semibold">Add products</span>
              <span>:</span>
            </div>
            <hr className="border-gray-400" />
            <div className="my-2 flex items-center justify-between space-x-4 p-2">
              <div className="p-4">
                <Label className="font-medium">Images</Label>

                <div className="mt-2">
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={(e) => {
                      if (e.target.files) {
                        setImages(Array.from(e.target.files));
                      }
                    }}
                    className="block w-full text-sm"
                  />
                </div>

                {/* PREVIEWS */}
                {images.length > 0 && (
                  <div className="flex gap-3 mt-3 overflow-x-auto">
                    {images.map((img, idx) => (
                      <img
                        key={idx}
                        src={URL.createObjectURL(img)}
                        className="w-20 h-20 rounded-md object-cover border"
                      />
                    ))}
                  </div>
                )}
              </div>

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
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
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
            <Button type="submit" className="mx-auto">
              Save changes
            </Button>
          </SheetFooter>
        </form>
      </SheetContent>
    </Sheet>
  );
}
