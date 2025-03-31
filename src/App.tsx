
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import { PriceTablesProvider } from "./contexts/PriceTablesContext";
import { ClientsProvider } from "./contexts/ClientsContext";
import { DeliveriesProvider } from "./contexts/DeliveriesContext";
import { CitiesProvider } from "./contexts/CitiesContext";
import { FinancialProvider } from "./contexts/FinancialContext";
import { LogbookProvider } from "./contexts/LogbookContext";

// Pages
import Index from "./pages/Index";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Clients from "./pages/Clients";
import PriceTables from "./pages/PriceTables";
import Deliveries from "./pages/Deliveries";
import Reports from "./pages/Reports";
import Cities from "./pages/Cities";
import Financial from "./pages/Financial";
import Settings from "./pages/Settings";
import NotFound from "./pages/NotFound";
import Logbook from "./pages/Logbook";
import Vehicles from "./pages/Vehicles";
import Employees from "./pages/Employees";
import Maintenance from "./pages/Maintenance";

// Create a client
const queryClient = new QueryClient();

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <AuthProvider>
          <PriceTablesProvider>
            <ClientsProvider>
              <CitiesProvider>
                <FinancialProvider>
                  <DeliveriesProvider>
                    <LogbookProvider>
                      <BrowserRouter>
                        <Routes>
                          <Route path="/login" element={<Login />} />
                          <Route path="/dashboard" element={<Dashboard />} />
                          <Route path="/clients" element={<Clients />} />
                          <Route path="/price-tables" element={<PriceTables />} />
                          <Route path="/deliveries" element={<Deliveries />} />
                          <Route path="/reports" element={<Reports />} />
                          <Route path="/cities" element={<Cities />} />
                          <Route path="/financial" element={<Financial />} />
                          <Route path="/settings" element={<Settings />} />
                          <Route path="/logbook" element={<Logbook />} />
                          <Route path="/vehicles" element={<Vehicles />} />
                          <Route path="/employees" element={<Employees />} />
                          <Route path="/maintenance" element={<Maintenance />} />
                          <Route path="/" element={<Index />} />
                          {/* 404 Route */}
                          <Route path="*" element={<NotFound />} />
                        </Routes>
                      </BrowserRouter>
                    </LogbookProvider>
                  </DeliveriesProvider>
                </FinancialProvider>
              </CitiesProvider>
            </ClientsProvider>
          </PriceTablesProvider>
        </AuthProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
