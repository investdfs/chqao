import { NavigationMenu, NavigationMenuItem, NavigationMenuList, NavigationMenuTrigger, NavigationMenuContent, NavigationMenuLink } from "@/components/ui/navigation-menu";
import { useNavigate } from "react-router-dom";
import { Hero } from "@/components/landing/Hero";
import { Features } from "@/components/landing/Features";
import { Stats } from "@/components/landing/Stats";

const Index = () => {
  const navigate = useNavigate();
  const isPreview = window.location.hostname.includes('preview');

  return (
    <div className="min-h-screen bg-white">
      {isPreview && (
        <nav className="bg-white shadow-sm py-4 sticky top-0 z-50">
          <div className="container mx-auto px-4">
            <NavigationMenu>
              <NavigationMenuList className="flex-wrap justify-center">
                <NavigationMenuItem>
                  <NavigationMenuTrigger>Páginas</NavigationMenuTrigger>
                  <NavigationMenuContent>
                    <div className="grid gap-3 p-4 min-w-[200px]">
                      <NavigationMenuLink 
                        className="cursor-pointer block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                        onClick={() => navigate("/")}
                      >
                        Início
                      </NavigationMenuLink>
                      <NavigationMenuLink 
                        className="cursor-pointer block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                        onClick={() => navigate("/login")}
                      >
                        Login
                      </NavigationMenuLink>
                      <NavigationMenuLink 
                        className="cursor-pointer block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                        onClick={() => navigate("/register")}
                      >
                        Registro
                      </NavigationMenuLink>
                    </div>
                  </NavigationMenuContent>
                </NavigationMenuItem>
              </NavigationMenuList>
            </NavigationMenu>
          </div>
        </nav>
      )}

      <Hero />
      <Features />
      <Stats />
    </div>
  );
};

export default Index;