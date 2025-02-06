import { FaGlobe, FaInstagram } from "react-icons/fa6";
import { FaWhatsapp } from "react-icons/fa6";

import React from "react";
import { Button } from "../ui/button";
import Link from "next/link";

const ContactSection = () => {
  return (
    <div className="flex flex-wrap space-x-4 items-center ">
      <Link
        // href={
        //   details.website_link.startsWith("http")
        //     ? details.website_link
        //     : `http://${details.website_link}`
        // }
        href={"/"}
        target="_blank"
        rel="noopener noreferrer"
      >
        <FaGlobe size={24} />
      </Link>

      <Link href={"/"}>
        <FaInstagram size={24} />
      </Link>

      <Link href={"/"}>
        <FaWhatsapp size={24} />
      </Link>
    </div>
  );
};

export default ContactSection;
