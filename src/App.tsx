import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/hooks/useAuth";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { HealthChatbot } from "@/components/chat/HealthChatbot";
import { MobileNav } from "@/components/layout/MobileNav";
import Dashboard from "./pages/Dashboard";
import Wearables from "./pages/Wearables";
import Predictions from "./pages/Predictions";
import Hospitals from "./pages/Hospitals";
import Appointments from "./pages/Appointments";
import Circles from "./pages/Circles";
import Emergency from "./pages/Emergency";
import Medicine from "./pages/Medicine";
import Auth from "./pages/Auth";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/auth" element={<Auth />} />
            <Route
              path="/"
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/wearables"
              element={
                <ProtectedRoute>
                  <Wearables />
                </ProtectedRoute>
              }
            />
            <Route
              path="/medicine"
              element={
                <ProtectedRoute>
                  <Medicine />
                </ProtectedRoute>
              }
            />
            <Route
              path="/predictions"
              element={
                <ProtectedRoute>
                  <Predictions />
                </ProtectedRoute>
              }
            />
            <Route
              path="/hospitals"
              element={
                <ProtectedRoute>
                  <Hospitals />
                </ProtectedRoute>
              }
            />
            <Route
              path="/appointments"
              element={
                <ProtectedRoute>
                  <Appointments />
                </ProtectedRoute>
              }
            />
            <Route
              path="/circles"
              element={
                <ProtectedRoute>
                  <Circles />
                </ProtectedRoute>
              }
            />
            <Route
              path="/emergency"
              element={
                <ProtectedRoute>
                  <Emergency />
                </ProtectedRoute>
              }
            />
            <Route path="*" element={<NotFound />} />
          </Routes>
          <MobileNav />
          <HealthChatbot />
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
