
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";

// Context Providers
import { AuthProvider } from "./contexts/auth/AuthContext";
import { PriceTablesProvider } from "./contexts/PriceTablesContext";
import { ClientsProvider } from "./contexts/ClientsContext";
import { DeliveriesProvider } from "./contexts/DeliveriesContext";
import { CitiesProvider } from "./contexts/CitiesContext";
import { FinancialProvider } from "./contexts/FinancialContext";
import { LogbookProvider } from "./contexts/LogbookContext";
import { ShipmentsProvider } from "./contexts/ShipmentsContext";
import { ActivityLogProvider } from "./contexts/ActivityLogContext";

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
import Profile from "./pages/Profile";
import Shipments from "./pages/Shipments";
import ShipmentReports from "./pages/ShipmentReports";
import ActivityLogs from "./pages/ActivityLogs";

const App = () => {
  return (
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <ActivityLogProvider>
            <PriceTablesProvider>
              <ClientsProvider>
                <CitiesProvider>
                  <DeliveriesProvider>
                    <LogbookProvider>
                      <ShipmentsProvider>
                        <FinancialProvider>
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
                            <Route path="/profile" element={<Profile />} />
                            <Route path="/shipments" element={<Shipments />} />
                            <Route path="/shipment-reports" element={<ShipmentReports />} />
                            <Route path="/activity-logs" element={<ActivityLogs />} />
                            <Route path="/" element={<Index />} />
                            {/* 404 Route */}
                            <Route path="*" element={<NotFound />} />
                          </Routes>
                        </FinancialProvider>
                      </ShipmentsProvider>
                    </LogbookProvider>
                  </DeliveriesProvider>
                </CitiesProvider>
              </ClientsProvider>
            </PriceTablesProvider>
          </ActivityLogProvider>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  );
};

export default App;
