
import { Outlet } from "react-router-dom";
import { Toaster } from "@/components/ui/sonner";
import { AppSidebar } from "./AppSidebar";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppHeader } from "./AppHeader";

export function AppLayout() {
  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <AppSidebar />
        <div className="flex-1 flex flex-col">
          <AppHeader />
          <main className="flex-1 p-4 md:p-6 overflow-auto">
            <Outlet />
          </main>
        </div>
        <Toaster position="top-right" />
      </div>
    </SidebarProvider>
  );
}
