import React from "react";
import { motion } from "framer-motion";

interface BouncingTextProps {
  text: string;
  className?: string;
}

const BouncingText = ({ text, className }: BouncingTextProps) => {
  const bounceAnimation = {
    x: [0, -5, 5, -1, 2, 0],
    transition: {
      duration: 0.6,
      ease: "easeInOut",
    },  
  };

  return (
    <motion.h1 className={`${className} `} key={text} animate={bounceAnimation}>
      {text}
    </motion.h1>
  );
};

export default BouncingText;
