
import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import './App.css';
import LoginPage from './pages/Login';
import { AuthProvider } from '@/contexts/auth/AuthContext';
import DashboardPage from './pages/Dashboard';
import ClientsPage from './pages/Clients';
import { Toaster } from '@/components/ui/toaster';
import ProfilePage from './pages/Profile';
import VehiclesPage from './pages/Vehicles';
import DeliveriesPage from './pages/Deliveries';
import ShipmentsPage from './pages/Shipments';
import EmployeesPage from './pages/Employees';
import MaintenancePage from './pages/Maintenance';
import LogbookPage from './pages/Logbook';
import SettingsPage from './pages/Settings';
import NotFoundPage from './pages/NotFound';
import ActivityLogsPage from './pages/ActivityLogs';
import FinancialPage from './pages/Financial';
import ReportsPage from './pages/Reports';
import ShipmentReportsPage from './pages/ShipmentReports';
import PriceTablesPage from './pages/PriceTables';
import CitiesPage from './pages/Cities';
import BudgetsPage from './pages/Budgets';
import { 
  BudgetProvider, 
  ClientsProvider,
  DeliveriesProvider, 
  ActivityLogProvider,
  PriceTablesProvider,
  CitiesProvider,
  ShipmentsProvider,
  FinancialProvider,
  LogbookProvider 
} from './contexts';

function App() {
  return (
    <Router>
      <AuthProvider>
        <ActivityLogProvider>
          <ClientsProvider>
            <PriceTablesProvider>
              <CitiesProvider>
                <DeliveriesProvider>
                  <ShipmentsProvider>
                    <FinancialProvider>
                      <LogbookProvider>
                        <BudgetProvider>
                          <Routes>
                            {/* Redirect from root to login page */}
                            <Route path="/" element={<Navigate to="/login" replace />} />
                            <Route path="/login" element={<LoginPage />} />
                            
                            {/* Protected routes */}
                            <Route path="/dashboard" element={<DashboardPage />} />
                            <Route path="/clients" element={<ClientsPage />} />
                            <Route path="/profile" element={<ProfilePage />} />
                            <Route path="/vehicles" element={<VehiclesPage />} />
                            <Route path="/deliveries" element={<DeliveriesProvider><DeliveriesPage /></DeliveriesProvider>} />
                            <Route path="/shipments" element={<ShipmentsPage />} />
                            <Route path="/employees" element={<EmployeesPage />} />
                            <Route path="/maintenance" element={<MaintenancePage />} />
                            <Route path="/logbook" element={<LogbookPage />} />
                            <Route path="/settings" element={<SettingsPage />} />
                            <Route path="/activity-logs" element={<ActivityLogsPage />} />
                            <Route path="/financial" element={<FinancialPage />} />
                            <Route path="/reports" element={<ReportsPage />} />
                            <Route path="/shipment-reports" element={<ShipmentReportsPage />} />
                            <Route path="/price-tables" element={<PriceTablesPage />} />
                            <Route path="/cities" element={<CitiesPage />} />
                            <Route path="/budgets" element={<BudgetsPage />} />
                            
                            <Route path="*" element={<NotFoundPage />} />
                          </Routes>
                          <Toaster />
                        </BudgetProvider>
                      </LogbookProvider>
                    </FinancialProvider>
                  </ShipmentsProvider>
                </DeliveriesProvider>
              </CitiesProvider>
            </PriceTablesProvider>
          </ClientsProvider>
        </ActivityLogProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;
