"use client";

import { ImageUp, Info, MapPin } from "lucide-react";
import React, { useEffect, useState } from "react";
import ContactSection from "./ContactSection";
import { Button } from "../ui/button";
import ShareButton from "../ui/sharebutton";
import { Restaurant } from "@/lib/types/resturant-types";
import { createBrowserSupabaseClient } from "@/lib/supabase/client";
import { toast } from "react-toastify";
import { UserRoles } from "@/lib/rbac/roles";
import { ActionGuard } from "@/lib/rbac/actionGurad";
import { Permission } from "@/lib/rbac/permission";

interface TopSectionProps {
  restaurant: Restaurant;
}

const TopSection: React.FC<TopSectionProps> = ({ restaurant }) => {
  const [logoUrl, setLogoUrl] = useState(
    restaurant?.logo_url || "/Images/logo.png"
  );
  const [bannerUrl, setBannerUrl] = useState(
    restaurant?.banner_url || "https://picsum.photos/1200/300"
  );
  const [name, setName] = useState(restaurant?.name);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    setLogoUrl(restaurant?.logo_url || "/Images/logo.png");
    setBannerUrl(restaurant?.banner_url || "https://picsum.photos/1200/300");
    setName(restaurant?.name);
  }, [restaurant]);

  // Generic API update function
  const updateRestaurantField = async (
    field: "name" | "logo_url" | "banner_url",
    value: string
  ) => {
    setIsSaving(true);
    try {
      const res = await fetch(`/api/restaurant?restaurantId=${restaurant.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ [field]: value }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data?.error || "Failed to update");
      }

      // Update local state
      if (field === "name") setName(value);
      if (field === "logo_url") setLogoUrl(value);
      if (field === "banner_url") setBannerUrl(value);

      toast.success(
        `${field.replace("_", " ").toUpperCase()} updated successfully`
      );
    } catch (err: any) {
      console.error(err);
      toast.error(err.message || "Update failed");
    } finally {
      setIsSaving(false);
    }
  };

  const handleNameBlur = () => {
    if (name !== restaurant?.name) {
      updateRestaurantField("name", name!);
    }
  };

  const uploadImage = async (file: File, type: "logo" | "banner") => {
    if (!file) return;

    try {
      const supabase = createBrowserSupabaseClient();

      // Remove spaces and special chars from filename
      const safeFileName = file.name
        .replace(/\s+/g, "-")
        .replace(/[^a-zA-Z0-9.-]/g, "");
      const filePath = `${type}/${restaurant.id}-${safeFileName}`;

      // Immediately preview in browser
      const previewUrl = URL.createObjectURL(file);
      if (type === "logo") setLogoUrl(previewUrl);
      if (type === "banner") setBannerUrl(previewUrl);

      // Check user
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) throw new Error("User not found");

      // Upload to Supabase Storage
      const { error: uploadError } = await supabase.storage
        .from("restaurant-images-storage")
        .upload(filePath, file, { upsert: true });

      if (uploadError) {
        toast.error(uploadError.message);
        return;
      }

      // Get public URL (works if bucket is public)
      const { data } = supabase.storage
        .from("restaurant-images-storage")
        .getPublicUrl(filePath);

      if (!data?.publicUrl) {
        toast.error("Failed to get image public URL");
        return;
      }

      const publicUrl = data.publicUrl;

      // Update DB with the permanent URL
      const { error: dbError } = await supabase
        .from("restaurants")
        .update({ [`${type}_url`]: publicUrl })
        .eq("id", restaurant.id);

      if (dbError) {
        toast.error(dbError.message || "Failed to update image URL");
        return;
      }

      toast.success("Image uploaded successfully");
    } catch (err) {
      console.error(err);
      toast.error("Failed to upload image");
    }
  };

  return (
    <section className="flex flex-col">
      {/* Banner */}
      <div className="h-40 md:h-48 w-full relative">
        <img
          src={bannerUrl}
          alt="Banner"
          className="h-full w-full rounded-b-sm object-cover"
        />
        <ActionGuard action={Permission.UPDATE_RESTAURANT}>
          <label className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-12 h-12 flex items-center justify-center rounded-full bg-white cursor-pointer hover:scale-125 transition-transform">
            <ImageUp className="text-blue-600" />
            <input
              type="file"
              className="hidden"
              accept="image/*"
              onChange={(e) =>
                e.target.files && uploadImage(e.target.files[0], "banner")
              }
            />
          </label>
        </ActionGuard>
      </div>

      {/* Heading Section */}
      <div className="-mt-6 z-10 w-full flex items-center px-4 space-x-4 sm:space-x-8 border-b border-input pb-4">
        {/* Logo */}
        <div className="relative flex items-center bg-gray-200 rounded-xl p-1 min-w-16">
          <img
            src={logoUrl}
            alt="Logo"
            className="rounded-xl object-cover w-16 h-16 sm:w-24 sm:h-24"
          />
          <ActionGuard action={Permission.UPDATE_RESTAURANT}>
            <label className="absolute left-1/2 bottom-0 -translate-x-1/2 w-8 h-8 flex items-center justify-center rounded-full bg-white cursor-pointer hover:scale-125 transition-transform">
              <ImageUp className="text-blue-600" />
              <input
                type="file"
                className="hidden"
                accept="image/*"
                onChange={(e) =>
                  e.target.files && uploadImage(e.target.files[0], "logo")
                }
              />
            </label>
          </ActionGuard>
        </div>

        {/* Content */}
        <div className="flex flex-wrap w-full items-center justify-end mt-5 ml-0">
          {/* Name & Share */}
          <div className="flex flex-grow flex-col p-2">
            <div className="flex flex-col sm:flex-row gap-2 sm:items-baseline text-xl font-bold space-x-6">
              <ActionGuard action={Permission.UPDATE_RESTAURANT} mode="disable">
                <input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  onBlur={handleNameBlur}
                  className="text-xl md:text-3xl sm:text-4xl font-bold border-b border-gray-300 focus:outline-none"
                />
              </ActionGuard>

              {isSaving && (
                <span className="text-sm text-gray-500">Saving...</span>
              )}

              <div className="flex items-center space-x-4 font-bold">
                <Info />
                <ShareButton />
              </div>
            </div>

            {/* Location */}
            <div className="flex space-x-1 mt-2 w-full sm:min-w-40 justify-center border px-2 text-gray-400 border-input rounded-sm text-sm items-center">
              <MapPin size={14} />
              <span>Location</span>
            </div>
          </div>

          {/* Contact */}
          <div className="hidden sm:flex flex-grow justify-end mt-2 space-x-4">
            <ContactSection />
          </div>
        </div>
      </div>
    </section>
  );
};

export default TopSection;
