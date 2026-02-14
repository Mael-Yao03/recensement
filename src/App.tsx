import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import ThankYou from "./pages/ThankYou";
import NotFound from "./pages/NotFound";
import RegistrationForm from "./pages/RegistrationForm";
import ChildrenRegistrationForm from "./pages/ChildrenRegistrationForm";
import UpdateMember from "./pages/UpdateMember";

// Admin imports
import { AdminLayout, ProtectedRoute } from "./components/admin";
import {
  AdminLogin,
  AdminDashboard,
  AdminUsers,
  AdminRoles,
  AdminMembers,
} from "./pages/admin";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          {/* Routes publiques */}
          <Route path="/" element={<Index />} />
          <Route path="/registration" element={<RegistrationForm />} />
          <Route path="/registration-children" element={<ChildrenRegistrationForm />} />
          <Route path="/update-member" element={<UpdateMember />} />
          <Route path="/thank-you" element={<ThankYou />} />

          {/* Routes Admin */}
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route
            path="/admin"
            element={
              <ProtectedRoute>
                <AdminLayout />
              </ProtectedRoute>
            }
          >
            <Route
              path="dashboard"
              element={
                <ProtectedRoute requiredPermissions={['view_dashboard']}>
                  <AdminDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="members"
              element={
                <ProtectedRoute requiredPermissions={['view_members', 'view_children']}>
                  <AdminMembers />
                </ProtectedRoute>
              }
            />
            <Route
              path="users"
              element={
                <ProtectedRoute requiredPermissions={['view_users']}>
                  <AdminUsers />
                </ProtectedRoute>
              }
            />
            <Route
              path="roles"
              element={
                <ProtectedRoute requiredPermissions={['view_roles']}>
                  <AdminRoles />
                </ProtectedRoute>
              }
            />
          </Route>

          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
