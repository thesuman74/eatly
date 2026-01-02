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

interface InviteStaffFormProps {
  onSubmit: (email: string, role: StaffRole) => void;
}

export const InviteStaffForm = ({ onSubmit }: InviteStaffFormProps) => {
  const [email, setEmail] = useState("");
  const [role, setRole] = useState<StaffRole>("staff");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(email, role);
    setEmail(""); // clear form
    setRole(STAFFROLES.STAFF);
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <Card className="w-full max-w-sm p-6">
        <CardHeader>
          <CardTitle className="text-xl font-bold text-center">
            Invite Staff
          </CardTitle>
        </CardHeader>

        <CardContent>
          <form className="space-y-4" onSubmit={handleSubmit}>
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

            {/* Email */}
            <Input
              placeholder="Staff Email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />

            {/* Submit Button */}
            <Button type="submit" className="w-full">
              Send Invite
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};
