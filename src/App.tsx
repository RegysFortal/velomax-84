
import React from 'react';
import { BrowserRouter, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ThemeProvider } from "./components/ThemeProvider";
import { AuthProvider } from './contexts/auth/AuthContext';
import { ActivityLogProvider } from './contexts/ActivityLogContext';
import { DeliveriesProvider } from './contexts/deliveries/DeliveriesProvider';
import { ShipmentsProvider } from './contexts/shipments';
import { ClientsProvider } from './contexts';
import { PriceTablesProvider } from './contexts/priceTables';
import { CitiesProvider } from './contexts/CitiesContext';
import { FinancialProvider } from './contexts/financial'; // Updated import path
import { BudgetProvider } from './contexts/budget';
import { LogbookProvider } from './contexts/LogbookContext';
import PrivateRoute from './components/PrivateRoute';
import { AppLayout } from './components/AppLayout';
import Index from './pages/Index';
import Login from './pages/Login';
import NotFound from './pages/NotFound';
import Activities from './pages/Activities';
import Deliveries from './pages/Deliveries';
import Employees from './pages/Employees';
import Vehicles from './pages/Vehicles';
import Logbooks from './pages/Logbooks';
import Maintenance from './pages/Maintenance';
import Financial from './pages/Financial';
import FinancialDashboard from './pages/FinancialDashboard';
import Shipments from './pages/shipments/ShipmentsPage';
import ShipmentReports from './pages/ShipmentReports';
import Budgets from './pages/Budgets';
import Clients from './pages/Clients';
import Cities from './pages/Cities';
import PriceTables from './pages/PriceTables';
import Users from './pages/Users';
import Reports from './pages/Reports';
import { ProductsPage, EntriesPage, ExitsPage, DashboardPage } from './pages/inventory';
import Dashboard from './pages/Dashboard';
import FinancialReportsPage from './pages/accounts/FinancialReportsPage';
import PayableAccountsPage from './pages/accounts/PayableAccountsPage';
import ReceivableAccountsPage from './pages/accounts/ReceivableAccountsPage';
import ActivityLogs from './pages/ActivityLogs';
import Contractors from './pages/Contractors';
import Logbook from './pages/Logbook';
import Settings from './pages/Settings';

function App() {
  const queryClient = new QueryClient();

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <AuthProvider>
          <ActivityLogProvider>
            <CitiesProvider>
              <PriceTablesProvider>
                <ClientsProvider>
                  <FinancialProvider>
                    <ShipmentsProvider>
                      <DeliveriesProvider>
                        <BudgetProvider>
                          <LogbookProvider>
                            <BrowserRouter>
                              <Routes>
                                <Route path="/" element={<Navigate to="/login" replace />} />
                                <Route path="/login" element={<Login />} />
                                <Route
                                  element={
                                    <PrivateRoute>
                                      <AppLayout>
                                        <Dashboard />
                                      </AppLayout>
                                    </PrivateRoute>
                                  }
                                  path="/dashboard"
                                />
                                <Route
                                  element={
                                    <PrivateRoute>
                                      <AppLayout>
                                        <Outlet />
                                      </AppLayout>
                                    </PrivateRoute>
                                  }
                                >
                                  <Route path="activities" element={<Activities />} />
                                  <Route path="deliveries" element={<Deliveries />} />
                                  <Route path="employees" element={<Employees />} />
                                  <Route path="vehicles" element={<Vehicles />} />
                                  <Route path="logbooks" element={<Logbooks />} />
                                  <Route path="logbook" element={<Logbook />} />
                                  <Route path="maintenance" element={<Maintenance />} />
                                  <Route path="financial" element={<Financial />} />
                                  <Route path="financial-dashboard" element={<FinancialDashboard />} />
                                  <Route path="shipments" element={<Shipments />} />
                                  <Route path="shipment-reports" element={<ShipmentReports />} />
                                  <Route path="budgets" element={<Budgets />} />
                                  <Route path="clients" element={<Clients />} />
                                  <Route path="cities" element={<Cities />} />
                                  <Route path="price-tables" element={<PriceTables />} />
                                  <Route path="users" element={<Users />} />
                                  <Route path="reports" element={<Reports />} />
                                  <Route path="accounts/reports" element={<FinancialReportsPage />} />
                                  <Route path="accounts/payable" element={<PayableAccountsPage />} />
                                  <Route path="accounts/receivable" element={<ReceivableAccountsPage />} />
                                  <Route path="activity-logs" element={<ActivityLogs />} />
                                  <Route path="contractors" element={<Contractors />} />
                                  <Route path="settings" element={<Settings />} />
                                  
                                  <Route path="inventory/products" element={<ProductsPage />} />
                                  <Route path="inventory/entries" element={<EntriesPage />} />
                                  <Route path="inventory/exits" element={<ExitsPage />} />
                                  <Route path="inventory/dashboard" element={<DashboardPage />} />
                                  
                                  <Route path="*" element={<NotFound />} />
                                </Route>
                              </Routes>
                            </BrowserRouter>
                          </LogbookProvider>
                        </BudgetProvider>
                      </DeliveriesProvider>
                    </ShipmentsProvider>
                  </FinancialProvider>
                </ClientsProvider>
              </PriceTablesProvider>
            </CitiesProvider>
          </ActivityLogProvider>
        </AuthProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
