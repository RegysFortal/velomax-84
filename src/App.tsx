
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from "@/components/ui/sonner";
import { ThemeProvider } from './contexts/ThemeContext';
import { AuthProvider } from './contexts/auth/AuthContext';
import { ClientsProvider } from './contexts/clients';
import { PriceTablesProvider } from './contexts/priceTables';
import { CitiesProvider } from './contexts/CitiesContext';
import { ShipmentsProvider } from './contexts/shipments';
import { DeliveriesProvider } from './contexts/deliveries/DeliveriesProvider';
import { FinancialProvider } from './contexts/FinancialContext';
import { ActivityLogProvider } from './contexts/ActivityLogContext';

import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Deliveries from './pages/Deliveries';
import ShipmentsPage from './pages/shipments/ShipmentsPage';
import ShipmentReports from './pages/ShipmentReports';
import Financial from './pages/Financial';
import FinancialDashboard from './pages/FinancialDashboard';
import PriceTables from './pages/PriceTables';
import Cities from './pages/Cities';
import Clients from './pages/Clients';
import Reports from './pages/Reports';
import Profile from './pages/Profile';
import Settings from './pages/Settings';
import ActivityLogs from './pages/ActivityLogs';
import Employees from './pages/Employees';
import Vehicles from './pages/Vehicles';
import Contractors from './pages/Contractors';
import NotFound from './pages/NotFound';
import Maintenance from './pages/Maintenance';
import Logbook from './pages/Logbook';
import Budgets from './pages/Budgets';
import Index from './pages/Index';

// New accounts pages
import PayableAccountsPage from './pages/accounts/PayableAccountsPage';
import ReceivableAccountsPage from './pages/accounts/ReceivableAccountsPage';
import FinancialReportsPage from './pages/accounts/FinancialReportsPage';

// Wrap in authentication
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  // For simplicity - we're just assuming authentication here
  return <>{children}</>;
};

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <ClientsProvider>
          <PriceTablesProvider>
            <CitiesProvider>
              <ShipmentsProvider>
                <DeliveriesProvider>
                  <FinancialProvider>
                    <ActivityLogProvider>
                      <Router>
                        <Routes>
                          <Route path="/" element={<Index />} />
                          <Route path="/login" element={<Login />} />
                          
                          <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
                          <Route path="/shipments" element={<ProtectedRoute><ShipmentsPage /></ProtectedRoute>} />
                          <Route path="/shipment-reports" element={<ProtectedRoute><ShipmentReports /></ProtectedRoute>} />
                          <Route path="/deliveries" element={<ProtectedRoute><Deliveries /></ProtectedRoute>} />
                          <Route path="/financial" element={<ProtectedRoute><Financial /></ProtectedRoute>} />
                          <Route path="/financial-dashboard" element={<ProtectedRoute><FinancialDashboard /></ProtectedRoute>} />
                          <Route path="/reports" element={<ProtectedRoute><Reports /></ProtectedRoute>} />
                          <Route path="/price-tables" element={<ProtectedRoute><PriceTables /></ProtectedRoute>} />
                          <Route path="/cities" element={<ProtectedRoute><Cities /></ProtectedRoute>} />
                          <Route path="/clients" element={<ProtectedRoute><Clients /></ProtectedRoute>} />
                          <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
                          <Route path="/settings" element={<ProtectedRoute><Settings /></ProtectedRoute>} />
                          <Route path="/activity-logs" element={<ProtectedRoute><ActivityLogs /></ProtectedRoute>} />
                          <Route path="/employees" element={<ProtectedRoute><Employees /></ProtectedRoute>} />
                          <Route path="/vehicles" element={<ProtectedRoute><Vehicles /></ProtectedRoute>} />
                          <Route path="/contractors" element={<ProtectedRoute><Contractors /></ProtectedRoute>} />
                          <Route path="/maintenance" element={<ProtectedRoute><Maintenance /></ProtectedRoute>} />
                          <Route path="/logbook" element={<ProtectedRoute><Logbook /></ProtectedRoute>} />
                          <Route path="/budgets" element={<ProtectedRoute><Budgets /></ProtectedRoute>} />
                          
                          {/* New financial accounts routes */}
                          <Route path="/accounts/payable" element={<ProtectedRoute><PayableAccountsPage /></ProtectedRoute>} />
                          <Route path="/accounts/receivable" element={<ProtectedRoute><ReceivableAccountsPage /></ProtectedRoute>} />
                          <Route path="/accounts/reports" element={<ProtectedRoute><FinancialReportsPage /></ProtectedRoute>} />
                          
                          <Route path="/404" element={<NotFound />} />
                          <Route path="*" element={<Navigate to="/404" replace />} />
                        </Routes>
                        <Toaster />
                      </Router>
                    </ActivityLogProvider>
                  </FinancialProvider>
                </DeliveriesProvider>
              </ShipmentsProvider>
            </CitiesProvider>
          </PriceTablesProvider>
        </ClientsProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
