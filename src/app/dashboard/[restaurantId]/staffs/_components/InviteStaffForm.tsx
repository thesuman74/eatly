"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { STAFFROLES, StaffRole } from "@/lib/types/staff-types";
import { Label } from "@/components/ui/label";
import { ST } from "next/dist/shared/lib/utils";
import { Loader2 } from "lucide-react";

interface InviteStaffFormProps {
  onSubmit: (email: string, role: StaffRole) => void;
  isLoading?: boolean;
}

export const InviteStaffForm = ({
  onSubmit,
  isLoading,
}: InviteStaffFormProps) => {
  const [email, setEmail] = useState("");
  const [role, setRole] = useState<StaffRole>("staff");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(email, role);
    setEmail(""); // clear form
    setRole(STAFFROLES.STAFF);
  };

  return (
    <div className="mb-6 p-4 border rounded-md bg-background max-w-xl">
      <h2 className="text-2xl font-bold mb-4">Invite staffs</h2>

      <div>
        <form className=" flex space-x-4" onSubmit={handleSubmit}>
          {/* Email */}
          <Input
            placeholder="Staff Email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <div className="flex items-center space-x-2">
            <Label className="text-sm">Role: </Label>

            {/* Role */}
            <Select
              value={role}
              onValueChange={(val: StaffRole) => setRole(val)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select Role" />
              </SelectTrigger>
              <SelectContent>
                {Object.values(STAFFROLES).map((roleOption) => (
                  <SelectItem
                    key={roleOption}
                    value={roleOption}
                    className="capitalize"
                  >
                    {roleOption}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Submit Button */}
          <Button type="submit" className="">
            {isLoading && <Loader2 className="animate-spin mr-2" />} Send Invite
          </Button>
        </form>
      </div>
    </div>
  );
};
