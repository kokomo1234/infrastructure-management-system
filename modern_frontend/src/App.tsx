import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "sonner";
import { ThemeProvider } from "@/components/theme/ThemeProvider";
import { AuthProvider } from "@/context/AuthContext";
import { AppLayout } from "@/components/layout/AppLayout";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import ErrorBoundary from "@/components/ErrorBoundary";
import { ProductionDebugger } from "@/components/debug/ProductionDebugger";

// Pages
import Index from "@/pages/Index";
import Dashboard from "@/pages/Dashboard";
import Sites from "@/pages/Sites";
import Equipment from "@/pages/Equipment";
import WorkOrders from "@/pages/WorkOrders";
import Maintenance from "@/pages/Maintenance";
import Administration from "@/pages/Administration";
import Settings from "@/pages/Settings";
import Login from "@/pages/Login";
import NotFound from "@/pages/NotFound";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      retry: 1,
    },
  },
});

function App() {
  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider>
          <Router>
            <AuthProvider>
              <Routes>
                <Route path="/login" element={<Login />} />
                <Route path="/" element={<Index />} />
                {/* Legacy route redirects */}
                <Route path="/dashboard" element={<Navigate to="/app/dashboard" replace />} />
                <Route path="/sites" element={<Navigate to="/app/sites" replace />} />
                <Route path="/equipment" element={<Navigate to="/app/equipment" replace />} />
                <Route path="/work-orders" element={<Navigate to="/app/work-orders" replace />} />
                <Route path="/maintenance" element={<Navigate to="/app/maintenance" replace />} />
                <Route path="/administration" element={<Navigate to="/app/administration" replace />} />
                <Route path="/settings" element={<Navigate to="/app/settings" replace />} />
                <Route path="/app" element={
                  <ProtectedRoute>
                    <AppLayout />
                  </ProtectedRoute>
                }>
                  <Route path="dashboard" element={<Dashboard />} />
                  <Route path="sites" element={<Sites />} />
                  <Route path="equipment" element={<Equipment />} />
                  <Route path="work-orders" element={<WorkOrders />} />
                  <Route path="maintenance" element={<Maintenance />} />
                  <Route path="administration" element={<Administration />} />
                  <Route path="settings" element={<Settings />} />
                </Route>
                <Route path="*" element={<NotFound />} />
              </Routes>
              <Toaster 
                position="top-right" 
                richColors 
                closeButton
                toastOptions={{
                  duration: 4000,
                }}
              />
              <ProductionDebugger />
            </AuthProvider>
          </Router>
        </ThemeProvider>
      </QueryClientProvider>
    </ErrorBoundary>
  );
}

export default App;
