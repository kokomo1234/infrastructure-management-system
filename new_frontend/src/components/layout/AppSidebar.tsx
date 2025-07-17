
import { useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  SidebarRail,
  useSidebar,
} from "@/components/ui/sidebar";
import { 
  Home, 
  Server, 
  Building2, 
  Wrench, 
  Calendar, 
  Users, 
  Settings, 
  FileText, 
  ClipboardList,
  FolderKanban,
  ChevronRight,
  Network,
  UserCog,
  Phone
} from "lucide-react";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";

const mainNavItems = [
  { title: "Tableau de bord", url: "/", icon: Home },
  { title: "Sites", url: "/sites", icon: Building2 },
  { title: "Équipements", url: "/equipment", icon: Server },
  { title: "Appels de service", url: "/work-orders", icon: Wrench },
  { title: "Maintenance", url: "/maintenance", icon: Calendar },
  { title: "Entrepreneurs", url: "/contractors", icon: Users },
  { title: "Gestion de projet", url: "/project-management", icon: FolderKanban },
  { title: "Journaux", url: "/logs", icon: FileText },
];

const planificationItems = [
  { title: "Gestion des gardes", url: "/standby", icon: Phone },
  { title: "Gestion du personnel", url: "/personnel-management", icon: UserCog },
];

const adminNavItems = [
  { title: "Administration", url: "/admin", icon: Settings },
  { title: "Structure hiérarchique", url: "/hierarchy", icon: Network },
];

export function AppSidebar() {
  const location = useLocation();
  const { state } = useSidebar();
  const [adminOpen, setAdminOpen] = useState(false);
  const [planificationOpen, setPlanificationOpen] = useState(true);
  
  const isActive = (path: string) => location.pathname === path;
  const isCollapsed = state === "collapsed";

  return (
    <Sidebar variant="inset" className="border-r">
      <SidebarHeader className="border-b px-6 py-4">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
            <Server className="h-4 w-4 text-primary-foreground" />
          </div>
          {!isCollapsed && (
            <div className="flex flex-col">
              <span className="text-sm font-semibold">GestionTech</span>
              <span className="text-xs text-muted-foreground">Infrastructure</span>
            </div>
          )}
        </div>
      </SidebarHeader>
      
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Navigation</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {mainNavItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton 
                    asChild 
                    isActive={isActive(item.url)}
                    className="w-full"
                  >
                    <NavLink to={item.url} className="flex items-center gap-3">
                      <item.icon className="h-4 w-4" />
                      {!isCollapsed && <span>{item.title}</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <Collapsible open={planificationOpen} onOpenChange={setPlanificationOpen}>
            <CollapsibleTrigger asChild>
              <SidebarGroupLabel className="flex items-center justify-between cursor-pointer hover:bg-sidebar-accent hover:text-sidebar-accent-foreground rounded-md px-2 py-1">
                <div className="flex items-center gap-2">
                  <ClipboardList className="h-4 w-4" />
                  Planification
                </div>
                <ChevronRight className={`h-4 w-4 transition-transform ${planificationOpen ? 'rotate-90' : ''}`} />
              </SidebarGroupLabel>
            </CollapsibleTrigger>
            <CollapsibleContent>
              <SidebarGroupContent>
                <SidebarMenu>
                  {planificationItems.map((item) => (
                    <SidebarMenuItem key={item.title}>
                      <SidebarMenuButton 
                        asChild 
                        isActive={isActive(item.url)}
                        className="w-full ml-4"
                      >
                        <NavLink to={item.url} className="flex items-center gap-3">
                          <item.icon className="h-4 w-4" />
                          {!isCollapsed && <span>{item.title}</span>}
                        </NavLink>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            </CollapsibleContent>
          </Collapsible>
        </SidebarGroup>

        <SidebarGroup>
          <Collapsible open={adminOpen} onOpenChange={setAdminOpen}>
            <CollapsibleTrigger asChild>
              <SidebarGroupLabel className="flex items-center justify-between cursor-pointer hover:bg-sidebar-accent hover:text-sidebar-accent-foreground rounded-md px-2 py-1">
                Administration
                <ChevronRight className={`h-4 w-4 transition-transform ${adminOpen ? 'rotate-90' : ''}`} />
              </SidebarGroupLabel>
            </CollapsibleTrigger>
            <CollapsibleContent>
              <SidebarGroupContent>
                <SidebarMenu>
                  {adminNavItems.map((item) => (
                    <SidebarMenuItem key={item.title}>
                      <SidebarMenuButton 
                        asChild 
                        isActive={isActive(item.url)}
                        className="w-full"
                      >
                        <NavLink to={item.url} className="flex items-center gap-3">
                          <item.icon className="h-4 w-4" />
                          {!isCollapsed && <span>{item.title}</span>}
                        </NavLink>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            </CollapsibleContent>
          </Collapsible>
        </SidebarGroup>
      </SidebarContent>
      
      <SidebarRail />
    </Sidebar>
  );
}
