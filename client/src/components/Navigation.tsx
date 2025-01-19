import { Link, useLocation } from "wouter";
import { cn } from "@/lib/utils";
import { Download } from "lucide-react";
import { Button } from "./ui/button";
import { Avatar, AvatarImage } from "./ui/avatar";
import { motion } from "framer-motion";

export default function Navigation() {
  const [location] = useLocation();

  const links = [
    { href: "/", label: "CV" },
    { href: "/contact", label: "Contact" },
  ];

  const handleDownloadCV = () => {
    window.open("/CV_Imad_Bouzalmata_SS.pdf", "_blank");
  };

  return (
    <motion.nav
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-lg border-b border-border/40"
    >
      <div className="container mx-auto px-6 h-20 flex items-center justify-between">
        <motion.div
          initial={{ x: -20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <Link href="/" className="flex items-center gap-3 hover:opacity-80 transition-all duration-300 cursor-pointer">
            <span className="font-bold text-xl tracking-tight text-foreground">
              Imad Bouzalmata
            </span>
          </Link>
        </motion.div>

        <div className="flex items-center space-x-6">
          {links.map((link, index) => (
            <motion.div
              key={link.href}
              initial={{ y: -10, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.3, delay: 0.1 * (index + 1) }}
            >
              <Link href={link.href} className="relative py-2 transition-colors hover:text-primary cursor-pointer">
                <span
                  className={cn(
                    location === link.href
                      ? "text-primary font-medium"
                      : "text-muted-foreground"
                  )}
                >
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

          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.3, delay: 0.5 }}
          >
            <a 
              href="/CV_Imad_Bouzalmata_SS.pdf" 
              download="CV_Imad_Bouzalmata.pdf"
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => {
                e.preventDefault();
                window.open('/api/download-cv', '_blank');
              }}
            >
              <Button
                variant="outline"
                size="sm"
                className="hover:bg-primary/10"
              >
                <Download className="h-4 w-4 mr-2" />
                CV
              </Button>
            </a>
          </motion.div>
        </div>
      </div>
    </motion.nav>
  );
}