import { motion, HTMLMotionProps } from "framer-motion";
import { cn } from "@/lib/utils";

interface SectionTransitionProps extends HTMLMotionProps<"div"> {
  children: React.ReactNode; // Contenu du composant
  delay?: number; // Délai facultatif pour l'animation
}

export function SectionTransition({ 
  children, 
  className,
  delay = 0,
  ...props 
}: SectionTransitionProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }} // Départ de l'animation
      whileInView={{ 
        opacity: 1, 
        y: 0, // Apparition avec mouvement vers le haut
        transition: {
          duration: 0.6,
          ease: "easeOut",
          delay: delay, // Ajout d'un délai si spécifié
        },
      }}
      viewport={{ once: true, margin: "-100px" }} // Animation uniquement lors de l'entrée dans la vue
      className={cn("w-full", className)} // Classes CSS dynamiques
      {...props} // Props supplémentaires
    >
      {children}
    </motion.div>
  );
}
