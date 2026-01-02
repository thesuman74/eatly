"use client";

import React, { useState } from "react";
import { Eye, EyeOff, Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import { StaffRole, STAFFROLES } from "@/lib/types/staff-types";
import {
  createStaffSchema,
  type CreateStaffInput,
} from "@/lib/schemas/staff.schema";

interface CreateStaffModalProps {
  isOpen: boolean;
  onClose: () => void;
  isLoading: boolean;
  onSubmit: (data: CreateStaffInput) => void;
}

export const CreateStaffModal = ({
  isOpen,
  onClose,
  onSubmit,
  isLoading,
}: CreateStaffModalProps) => {
  const [form, setForm] = useState<CreateStaffInput>({
    full_name: "",
    email: "",
    phone: "",
    password: "",
    role: "staff",
  });

  const [errors, setErrors] = useState<
    Partial<Record<keyof CreateStaffInput, string>>
  >({});

  const [showPassword, setShowPassword] = useState(false);

  if (!isOpen) return null;

  const handleChange = <K extends keyof CreateStaffInput>(
    key: K,
    value: CreateStaffInput[K]
  ) => {
    setForm((prev) => ({ ...prev, [key]: value }));
    setErrors((prev) => ({ ...prev, [key]: undefined }));
  };

  const handleSubmit = () => {
    const result = createStaffSchema.safeParse(form);

    if (!result.success) {
      const fieldErrors = result.error.flatten().fieldErrors;
      setErrors({
        full_name: fieldErrors.full_name?.[0],
        email: fieldErrors.email?.[0],
        phone: fieldErrors.phone?.[0],
        password: fieldErrors.password?.[0],
        role: fieldErrors.role?.[0],
      });
      return;
    }

    onSubmit(result.data);
  };

  return (
    <Card className="fixed top-1/2 left-1/2 w-full max-w-sm -translate-x-1/2 -translate-y-1/2">
      <CardHeader>
        <CardTitle className="text-2xl font-bold">Create User</CardTitle>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Role */}
        <Select
          value={form.role}
          onValueChange={(val: StaffRole) => handleChange("role", val)}
          disabled={isLoading}
        >
          <SelectTrigger className="capitalize">
            <SelectValue placeholder="Select role" />
          </SelectTrigger>
          <SelectContent>
            {Object.values(STAFFROLES).map((role) => (
              <SelectItem key={role} value={role} className="capitalize">
                {role}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {errors.role && <p className="text-sm text-red-500">{errors.role}</p>}

        {/* Full Name */}
        <Input
          placeholder="Full Name"
          value={form.full_name}
          onChange={(e) => handleChange("full_name", e.target.value)}
          disabled={isLoading}
        />
        {errors.full_name && (
          <p className="text-sm text-red-500">{errors.full_name}</p>
        )}

        {/* Email */}
        <Input
          placeholder="email@example.com"
          type="email"
          value={form.email}
          onChange={(e) => handleChange("email", e.target.value)}
          disabled={isLoading}
        />
        {errors.email && <p className="text-sm text-red-500">{errors.email}</p>}

        {/* Phone */}
        <Input
          placeholder="Phone"
          type="tel"
          value={form.phone ?? ""}
          onChange={(e) => handleChange("phone", e.target.value)}
          disabled={isLoading}
        />
        {errors.phone && <p className="text-sm text-red-500">{errors.phone}</p>}

        {/* Password */}
        <div className="relative">
          <Input
            placeholder="Password"
            type={showPassword ? "text" : "password"}
            value={form.password}
            onChange={(e) => handleChange("password", e.target.value)}
            disabled={isLoading}
          />
          <button
            type="button"
            onClick={() => setShowPassword((prev) => !prev)}
            className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground"
          >
            {showPassword ? <Eye size={16} /> : <EyeOff size={16} />}
          </button>
        </div>
        {errors.password && (
          <p className="text-sm text-red-500">{errors.password}</p>
        )}

        <Button className="w-full" onClick={handleSubmit} disabled={isLoading}>
          {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Create User
        </Button>
      </CardContent>
    </Card>
  );
};
