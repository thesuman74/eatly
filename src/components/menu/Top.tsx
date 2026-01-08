import { Info, MapPin, Share2 } from "lucide-react";
import React from "react";
import ContactSection from "./ContactSection";
import { Button } from "../ui/button";
import ShareButton from "../ui/sharebutton";

interface topProps {
  restaurant: {
    banner_url: string;
    logo_url: string;
    name: string;
    id: string;
  };
}

const Top = ({ restaurant }: topProps) => {
  const banner = restaurant?.banner_url || "https://picsum.photos/1200/300";
  const logoUrl = restaurant?.logo_url || "/Images/logo.png";
  const nameText = restaurant?.name || "Your Restaurant";

  return (
    <>
      <section className="flex flex-col ">
        {/* <!-- banner image --> */}
        <div className=" h-40 md:h-48 w-full ">
          <img
            src={banner}
            alt={nameText + "banner"}
            className="h-full w-full rounded-b-sm object-cover"
          />
        </div>

        {/* <!-- heading  --> */}
        <div className="  -mt-6 z-10  w-full flex items-center px-4 space-x-4 sm:space-x-8 border-b border-input pb-4">
          <div className="flex size-16 sm:size-24 md:size-32 items-center border bg-muted rounded-xl p-1 min-w-16">
            <img
              src={logoUrl}
              alt={nameText}
              className="rounded-xl object-cover object-top size-full"
            />
          </div>

          {/* <!-- Content section --> */}
          <div className="flex flex-wrap w-full items-center justify-end mt-5 ml-0 ">
            {/* <!-- Text section --> */}
            <div className="flex flex-grow   flex-col p-2 ">
              <div className="text-xl font-bold flex-col sm:flex gap-2      sm:items-baseline  space-x-6 ">
                <h2 className="text-xl md:text-3xl sm:text-4xl ">{nameText}</h2>
                <div className="space-x-4 flex ml-0   items-center  font-bold ">
                  <Info />

                  <ShareButton />
                </div>
              </div>
              <div className="flex space-x-1 mt-2 w-full sm:min-w-40 justify-center  border px-2 text-gray-400 border-input rounded-sm text-sm items-center">
                <MapPin size={14} />
                <span> Location </span>
              </div>
            </div>

            <div className=" flex-grow   justify-end mt-2 hidden sm:flex  space-x-4">
              <ContactSection />
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default Top;
