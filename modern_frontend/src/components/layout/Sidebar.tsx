import { NavLink, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Building2, 
  Wrench, 
  ClipboardList, 
  Calendar,
  Settings,
  Shield,
  LogOut
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

const navigation = [
  { name: 'Tableau de bord', href: '/dashboard', icon: LayoutDashboard },
  { name: 'Sites', href: '/sites', icon: Building2 },
  { name: 'Équipements', href: '/equipment', icon: Wrench },
  { name: 'Ordres de travail', href: '/work-orders', icon: ClipboardList },
  { name: 'Maintenance', href: '/maintenance', icon: Calendar },
  { name: 'Administration', href: '/administration', icon: Shield },
  { name: 'Paramètres', href: '/settings', icon: Settings },
];

export const Sidebar = () => {
  const location = useLocation();
  const { user, logout } = useAuth();

  return (
    <div className="flex flex-col h-full bg-white border-r border-gray-200">
      {/* Logo */}
      <div className="flex items-center h-16 px-6 border-b border-gray-200">
        <div className="flex items-center">
          <Building2 className="h-8 w-8 text-primary" />
          <span className="ml-2 text-lg font-semibold text-gray-900">
            Infrastructure
          </span>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 py-6 space-y-1">
        {navigation.map((item) => {
          const isActive = location.pathname === item.href;
          return (
            <NavLink
              key={item.name}
              to={item.href}
              className={cn(
                'sidebar-nav-item',
                isActive && 'active'
              )}
            >
              <item.icon className="h-5 w-5 mr-3" />
              {item.name}
            </NavLink>
          );
        })}
      </nav>

      {/* User info and logout */}
      <div className="border-t border-gray-200 p-4">
        <div className="flex items-center mb-3">
          <div className="flex-shrink-0">
            <div className="h-8 w-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-medium">
              {user?.first_name?.[0] || user?.email?.[0] || 'U'}
            </div>
          </div>
          <div className="ml-3 min-w-0 flex-1">
            <p className="text-sm font-medium text-gray-900 truncate">
              {user?.display_name || `${user?.first_name} ${user?.last_name}` || user?.email}
            </p>
            <p className="text-xs text-gray-500 truncate">
              {user?.department || 'Infrastructure'}
            </p>
          </div>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={logout}
          className="w-full justify-start text-gray-600 hover:text-gray-900"
        >
          <LogOut className="h-4 w-4 mr-2" />
          Déconnexion
        </Button>
      </div>
    </div>
  );
};
