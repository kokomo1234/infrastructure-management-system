
import { useState } from "react";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { 
  Bell, 
  Globe, 
  LogOut, 
  Menu, 
  Settings, 
  User
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { ThemeToggle } from "@/components/theme/ThemeToggle";

export function AppHeader() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [language, setLanguage] = useState("fr");

  const toggleLanguage = () => {
    setLanguage(language === "fr" ? "en" : "fr");
    // In a real app, you would trigger language change across the app
  };

  return (
    <header className="border-b bg-background p-4 flex items-center">
      <div className="flex items-center lg:w-1/3">
        <SidebarTrigger className="lg:hidden mr-2">
          <Menu className="h-6 w-6" />
        </SidebarTrigger>
      </div>
      
      <div className="flex-1 flex justify-center lg:w-1/3">
        <h1 className="font-bold text-xl md:text-2xl">
          Infrastructure Dashboard
        </h1>
      </div>

      <div className="flex items-center justify-end space-x-2 lg:w-1/3">
        <ThemeToggle />
        
        <Button 
          variant="ghost" 
          size="icon"
          onClick={toggleLanguage}
          title={language === "fr" ? "Switch to English" : "Passer au français"}
        >
          <Globe className="h-5 w-5" />
          <span className="sr-only">Toggle Language</span>
        </Button>
        
        <Button variant="ghost" size="icon">
          <Bell className="h-5 w-5" />
          <span className="sr-only">Notifications</span>
        </Button>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="relative h-8 w-8 rounded-full">
              <Avatar className="h-8 w-8">
                <AvatarImage src="" alt={user?.email || "User"} />
                <AvatarFallback>
                  {user?.email?.charAt(0).toUpperCase() || "U"}
                </AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56" align="end" forceMount>
            <DropdownMenuLabel className="font-normal">
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-medium leading-none">{user?.email}</p>
                <p className="text-xs leading-none text-muted-foreground">
                  Utilisateur connecté
                </p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => navigate("/profile")}>
              <User className="mr-2 h-4 w-4" />
              <span>Profile</span>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => navigate("/settings")}>
              <Settings className="mr-2 h-4 w-4" />
              <span>Settings</span>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem 
              onClick={() => {
                logout();
                navigate('/login');
              }}
            >
              <LogOut className="mr-2 h-4 w-4" />
              <span>Log out</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
