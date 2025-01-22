
import { Link, useLocation } from "wouter";
import { cn } from "@/lib/utils";
import { Download, ChevronDown } from "lucide-react";
import { Button } from "./ui/button";
import { motion } from "framer-motion";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";

type NavLink = {
  href: string;
  label: string;
};

const navLinks: NavLink[] = [
  { href: "/", label: "CV" },
];

const navigationVariants = {
  initial: { y: -20, opacity: 0 },
  animate: { y: 0, opacity: 1, transition: { duration: 0.5 } },
};

const logoVariants = {
  initial: { x: -20, opacity: 0 },
  animate: { x: 0, opacity: 1, transition: { duration: 0.5, delay: 0.2 } },
};

const linkVariants = {
  initial: { y: -10, opacity: 0 },
  animate: (index: number) => ({
    y: 0,
    opacity: 1,
    transition: { duration: 0.3, delay: 0.1 * (index + 1) },
  }),
};

const buttonVariants = {
  initial: { scale: 0.8, opacity: 0 },
  animate: { scale: 1, opacity: 1, transition: { duration: 0.3, delay: 0.5 } },
};

export default function Navigation() {
  const [location] = useLocation();

  const handleDownloadCV = (e: React.MouseEvent) => {
    e.preventDefault();
    window.open('/api/download-cv', '_blank');
  };

  return (
    <motion.nav
      variants={navigationVariants}
      initial="initial"
      animate="animate"
      className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-lg border-b border-border/40"
    >
      <div className="container mx-auto px-6 h-20 flex items-center justify-between">
        <motion.div variants={logoVariants}>
          <Link href="/" className="flex items-center gap-3 hover:opacity-80 transition-all duration-300">
            <span className="font-bold text-xl tracking-tight text-foreground">
              Imad Bouzalmata
            </span>
          </Link>
        </motion.div>

        <div className="flex items-center space-x-6">
          {navLinks.map((link, index) => (
            <motion.div
              key={link.href}
              custom={index}
              variants={linkVariants}
            >
              <Link href={link.href} className="relative py-2 transition-colors hover:text-primary">
                <span className={cn(
                  location === link.href
                    ? "text-primary font-medium"
                    : "text-muted-foreground"
                )}>
                  {link.label}
                  {location === link.href && (
                    <motion.div
                      layoutId="underline"
                      className="absolute left-0 right-0 h-0.5 bg-primary bottom-0"
                      transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                    />
                  )}
                </span>
              </Link>
            </motion.div>
          ))}

          <motion.div variants={buttonVariants}>
            <a
              href="/CV_Imad_Bouzalmata.pdf"
              download="CV_Imad_Bouzalmata.pdf"
              target="_blank"
              rel="noopener noreferrer"
              onClick={handleDownloadCV}
            >
              <Button
                variant="outline"
                size="sm"
                className="hover:bg-primary/10"
              >
                <Download className="h-4 w-4 mr-2" />
                Télécharger mon CV
              </Button>
            </a>
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="ml-2">
                  Lettres de recommandation
                  <ChevronDown className="ml-2 h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem asChild>
                  <a 
                    href="/attached_assets/Lettre recommandation Imad GRTgaz.pdf" 
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Recommandation GRTgaz
                  </a>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <a 
                    href="/attached_assets/Lettre recommandation Imad Fiducial.pdf" 
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Recommandation Fiducial
                  </a>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </motion.div>
        </div>
      </div>
    </motion.nav>
  );
}
