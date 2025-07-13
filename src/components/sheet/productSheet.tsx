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

export function ProductAddSheet() {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline">+ Product </Button>
      </SheetTrigger>
      <SheetTitle>{""}</SheetTitle>
      <SheetContent className="p-0">
        <aside className="h-screen max-w-sm w-full bg-gray-100">
          <div className="flex justify-between px-4 py-2">
            <span className="text-lg font-semibold">Edit products</span>
            <span>:</span>
          </div>
          <hr className="border-gray-400" />
          <div className="my-2 flex items-center justify-between space-x-4 p-2">
            <img
              src="https://picsum.photos/200"
              alt=""
              className="size-24 w-fit rounded-lg"
            />

            <div className="w-full space-y-2">
              <Input
                type="text"
                name="product_name"
                placeholder="Product Name"
                className="w-full border"
              />
              <Textarea
                name="Description"
                id=""
                placeholder="Description"
                className="w-full border"
              />
            </div>
          </div>
          <div className="w-full bg-gray-300 p-1"></div>

          {/* <!-- //price section  --> */}
          <div className="space-y-2 p-4">
            <div className="flex justify-between">
              <span className="text-lg font-semibold">Price</span>
              <div className="space-x-2 rounded-lg border px-4">
                <span>Simple</span>
                <span className="border-l px-2">Varients</span>
              </div>
            </div>

            <Input
              type="text"
              name="product_price"
              placeholder="NPR 0.00"
              className="w-full border"
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

        <SheetFooter>
          <SheetClose asChild>
            <Button type="submit">Save changes</Button>
          </SheetClose>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
