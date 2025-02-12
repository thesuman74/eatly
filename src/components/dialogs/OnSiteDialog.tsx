import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
} from "../ui/select";
import { SelectValue } from "@radix-ui/react-select";

export function OnsiteDialog({ name }: { name: string }) {
  return (
    <Dialog>
      <DialogTrigger
        asChild
        className="cursor-pointer hover:scale-105 duration-300 "
      >
        <button className="mx-2 min-w-[150px] flex-1 rounded-sm bg-blue-500 py-2 text-white cursor-pointer">
          <span>🛄</span>
          <span>{name}</span>
        </button>
      </DialogTrigger>
      <DialogContent className="max-w-lg w-[600px] h-[80vh] items-start flex flex-col ">
        <DialogHeader>
          <DialogTitle>🛄 On Site</DialogTitle>
          <DialogDescription>
            Please fill the necessary details for On Site
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4 w-full">
          <div className="flex justify-between items-center border border-input active:border-blue-500 rounded-md px-2 py-2">
            <div className="flex flex-col">
              <span className="font-bold text-md">Bill summary</span>
              <div className="flex space-x-2 text-xs">
                <span>8 Products</span>
                <span>Rs. 5000</span>
              </div>
            </div>
            <span>{">"}</span>
          </div>
          <div className="items-center gap-4 w-full">
            <Input
              id="username"
              className="col-span-3"
              placeholder="Add Comment (Optional)"
            />
          </div>
        </div>

        <div className="w-full">
          <div className="space-x-4 items-center">
            <span>Payment Method</span>
            <span className="text-xs text-gray-500">
              Payment method is coordinated afterward
            </span>
          </div>
          <div>
            <Select>
              <SelectTrigger>
                <SelectValue placeholder="Select a Payment Method" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectItem value="cash">Cash</SelectItem>
                  <SelectItem value="card">Card</SelectItem>
                  <SelectItem value="paypal">Paypal</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
        </div>

        <DialogFooter className="w-full  flex   my-auto">
          <Button type="submit" className="w-full">
            To order (Rs 1000)
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
