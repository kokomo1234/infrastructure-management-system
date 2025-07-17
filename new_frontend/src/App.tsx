
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/sonner";
import { ThemeProvider } from "@/components/theme/ThemeProvider";
import { AuthProvider } from "@/context/AuthContext";
import { AppLayout } from "@/components/layout/AppLayout";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";

// Pages
import Index from "@/pages/Index";
import Dashboard from "@/pages/Dashboard";
import Sites from "@/pages/Sites";
import Equipment from "@/pages/Equipment";
import WorkOrders from "@/pages/WorkOrders";
import Maintenance from "@/pages/Maintenance";
import Contractors from "@/pages/Contractors";
import StandbySchedulePage from "@/pages/StandbySchedulePage";
import PersonnelManagementPage from "@/pages/PersonnelManagementPage";
import ProjectManagement from "@/pages/ProjectManagement";
import HierarchyPage from "@/pages/HierarchyPage";
import Logs from "@/pages/Logs";
import Administration from "@/pages/Administration";
import Settings from "@/pages/Settings";
import Login from "@/pages/Login";
import DCSystemPage from "@/pages/DCSystemPage";
import NotFound from "@/pages/NotFound";

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <AuthProvider>
          <Router>
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route path="/" element={<Index />} />
              <Route path="/" element={
                <ProtectedRoute>
                  <AppLayout />
                </ProtectedRoute>
              }>
                <Route path="dashboard" element={<Dashboard />} />
                <Route path="sites" element={<Sites />} />
                <Route path="equipment" element={<Equipment />} />
                <Route path="work-orders" element={<WorkOrders />} />
                <Route path="maintenance" element={<Maintenance />} />
                <Route path="contractors" element={<Contractors />} />
                <Route path="standby" element={<StandbySchedulePage />} />
                <Route path="personnel-management" element={<PersonnelManagementPage />} />
                <Route path="project-management" element={<ProjectManagement />} />
                <Route path="hierarchy" element={<HierarchyPage />} />
                <Route path="logs" element={<Logs />} />
                <Route path="admin" element={<Administration />} />
                <Route path="settings" element={<Settings />} />
                <Route path="dc-system" element={<DCSystemPage />} />
              </Route>
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Router>
          <Toaster />
        </AuthProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
