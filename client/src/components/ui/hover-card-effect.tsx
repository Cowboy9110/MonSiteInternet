import { motion, HTMLMotionProps } from "framer-motion";
import { cn } from "@/lib/utils";
import React, { useState } from "react";

interface HoverCardEffectProps extends HTMLMotionProps<"div"> {
  children: React.ReactNode;
  className?: string;
}

export function HoverCardEffect({
  children,
  className,
  ...props
}: HoverCardEffectProps) {
  const [mousePos, setMousePos] = useState({ x: 50, y: 50 });
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setMousePos({ x, y });
  };

  return (
    <motion.div
      className={cn(
        "relative overflow-hidden rounded-lg bg-background/50 p-6 backdrop-blur-sm transition-colors hover:bg-background/60",
        className
      )}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.3,
        ease: [0.25, 0.1, 0.25, 1],
      }}
      {...props} // Props supplémentaires passées à motion.div
    >
      {/* Effet de survol */}
      <motion.div
        className="pointer-events-none absolute -inset-px rounded-lg opacity-0 transition duration-300"
        style={{
          background: `radial-gradient(600px circle at ${mousePos.x}% ${mousePos.y}%, rgba(var(--primary-rgb), 0.06), transparent 40%)`,
        }}
        animate={{
          opacity: isHovered ? 1 : 0,
          scale: isHovered ? 1 : 0.9,
        }}
        transition={{ duration: 0.2 }}
      />
      {/* Contenu */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        {children}
      </motion.div>
    </motion.div>
  );
}
