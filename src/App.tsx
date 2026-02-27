import { useEffect } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
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

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

const App = () => {
  // Global error handler to prevent white screens from unhandled promise rejections
  useEffect(() => {
    const handleRejection = (event: PromiseRejectionEvent) => {
      console.warn("Suppressed unhandled rejection:", event.reason?.message || event.reason);
      event.preventDefault();
    };
    window.addEventListener("unhandledrejection", handleRejection);
    return () => window.removeEventListener("unhandledrejection", handleRejection);
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/auth" element={<Navigate to="/" replace />} />
            <Route path="/wearables" element={<Wearables onConnectWatch={connectWatchWithGoogle} />} />
            <Route path="/medicine" element={<Medicine />} />
            <Route path="/predictions" element={<Predictions />} />
            <Route path="/hospitals" element={<Hospitals />} />
            <Route path="/appointments" element={<Appointments />} />
            <Route path="/circles" element={<Circles />} />
            <Route path="/emergency" element={<Emergency />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
          <MobileNav />
          <HealthChatbot />
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
