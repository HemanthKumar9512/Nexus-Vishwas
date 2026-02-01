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

const CLIENT_ID =
  "956130682286-l2j2gu0a69nv8t8t1b0sgr7mi48uhqb5.apps.googleusercontent.com";

function connectWatchWithGoogle() {
  const scopes = [
    "https://www.googleapis.com/auth/fitness.heart_rate.read",
    "https://www.googleapis.com/auth/fitness.activity.read",
  ].join(" ");

  const authUrl =
    "https://accounts.google.com/o/oauth2/v2/auth" +
    "?response_type=token" +
    `&client_id=${CLIENT_ID}` +
    "&redirect_uri=https://nexus-vishwas.web.app" +
    `&scope=${encodeURIComponent(scopes)}`;

  window.location.href = authUrl;
}

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
      <Wearables onConnectWatch={connectWatchWithGoogle} />
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
