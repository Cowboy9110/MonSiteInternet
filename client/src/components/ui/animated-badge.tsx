import { motion, HTMLMotionProps } from "framer-motion";
import { cn } from "@/lib/utils";

interface AnimatedBadgeProps extends HTMLMotionProps<"div"> {
  icon: React.ComponentType; // Le type pour un composant React représentant une icône
  label: string; // Le label texte du badge
}

export function AnimatedBadge({ icon: Icon, label, className, ...props }: AnimatedBadgeProps) {
  return (
    <motion.div
      className={cn(
        "flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/5 text-primary hover:bg-primary/10 transition-colors cursor-pointer group",
        className
      )}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.2,
        ease: "easeOut",
      }}
      {...props}
    >
      <motion.div
        initial={{ rotate: 0 }}
        whileHover={{ rotate: 360 }}
        transition={{ duration: 0.5 }}
      >
        <Icon className="w-4 h-4" />
      </motion.div>
      <motion.span
        className="text-sm font-medium"
        initial={{ x: -10, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ delay: 0.1 }}
      >
        {label}
      </motion.span>
    </motion.div>
  );
}
