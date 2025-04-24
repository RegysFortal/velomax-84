
import React from 'react';
import { BrowserRouter, Routes, Route, Outlet } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ThemeProvider } from "./components/ThemeProvider";
import { AuthProvider } from './contexts/auth/AuthContext';
import { ActivityLogProvider } from './contexts/ActivityLogContext';
import { DeliveriesProvider } from './contexts/deliveries/DeliveriesProvider';
import { ShipmentsProvider } from './contexts/shipments';
import { ClientsProvider } from './contexts';
import { PriceTablesProvider } from './contexts/priceTables';
import { CitiesProvider } from './contexts/CitiesContext';
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
import Shipments from './pages/Shipments';
import Budgets from './pages/Budgets';
import Clients from './pages/Clients';
import Cities from './pages/Cities';
import PriceTables from './pages/PriceTables';
import Users from './pages/Users';
import { ProductsPage, EntriesPage, ExitsPage, DashboardPage } from './pages/inventory';
import Dashboard from './pages/Dashboard';

function App() {
  const queryClient = new QueryClient();

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <AuthProvider>
          <ActivityLogProvider>
            {/* Placing CitiesProvider before PriceTablesProvider since some components might need both */}
            <CitiesProvider>
              <PriceTablesProvider>
                <ClientsProvider>
                  <ShipmentsProvider>
                    <DeliveriesProvider>
                      <BrowserRouter>
                        <Routes>
                          <Route path="/" element={<Index />} />
                          <Route path="/login" element={<Login />} />
                          <Route path="/dashboard" element={<Dashboard />} />
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
                            <Route path="maintenance" element={<Maintenance />} />
                            <Route path="financial" element={<Financial />} />
                            <Route path="shipments" element={<Shipments />} />
                            <Route path="budgets" element={<Budgets />} />
                            <Route path="clients" element={<Clients />} />
                            <Route path="cities" element={<Cities />} />
                            <Route path="price-tables" element={<PriceTables />} />
                            <Route path="users" element={<Users />} />
                            
                            {/* Inventory routes */}
                            <Route path="inventory/products" element={<ProductsPage />} />
                            <Route path="inventory/entries" element={<EntriesPage />} />
                            <Route path="inventory/exits" element={<ExitsPage />} />
                            <Route path="inventory/dashboard" element={<DashboardPage />} />
                            
                            <Route path="*" element={<NotFound />} />
                          </Route>
                        </Routes>
                      </BrowserRouter>
                    </DeliveriesProvider>
                  </ShipmentsProvider>
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
