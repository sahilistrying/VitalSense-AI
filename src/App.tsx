import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Navigation } from "@/components/Navigation";
import { AuthProvider } from "@/context/AuthContext";
import { HealthProvider } from "@/context/HealthContext";
import { Dashboard } from "@/pages/Dashboard";
import { SymptomChecker } from "@/pages/SymptomChecker";
import { Results } from "@/pages/Results";
import { DoctorLocator } from "@/pages/DoctorLocator";
import { History } from "@/pages/History";
import { AIAssistant } from "@/pages/AIAssistant";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <AuthProvider>
        <HealthProvider>
          <BrowserRouter>
            <div className="min-h-screen bg-background">
              <Navigation />
              <main>
                <Routes>
                  <Route path="/" element={<Dashboard />} />
                  <Route path="/symptoms" element={<SymptomChecker />} />
                  <Route path="/results" element={<Results />} />
                  <Route path="/doctors" element={<DoctorLocator />} />
                  <Route path="/history" element={<History />} />
                  <Route path="/assistant" element={<AIAssistant />} />
                  {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </main>
            </div>
            <Toaster />
            <Sonner />
          </BrowserRouter>
        </HealthProvider>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
