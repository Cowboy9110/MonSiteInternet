import { Link } from "wouter";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuList,
} from "@/components/ui/navigation-menu";
import { Button } from "@/components/ui/button";

const navItems = [
  { path: "/", label: "CV" },
  { path: "/contact", label: "Contact" },
  { path: "/api/download-cv", label: "Download CV" } // Added download link
];

export default function Navigation() {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-sm border-b">
      <nav className="container mx-auto px-6 h-20 flex items-center">
        <Link href="/" className="flex items-center gap-3 hover:opacity-80 transition-all duration-300 cursor-pointer">
          <span className="font-bold text-xl tracking-tight text-foreground">
            Imad Bouzalmata
          </span>
        </Link>
        <NavigationMenu className="ml-auto">
          <NavigationMenuList className="gap-2">
            {navItems.map(({ path, label }) => (
              <NavigationMenuItem key={path}>
                <Link href={path}>
                  <Button variant="ghost">{label}</Button>
                </Link>
              </NavigationMenuItem>
            ))}
          </NavigationMenuList>
        </NavigationMenu>
      </nav>
    </header>
  );
}