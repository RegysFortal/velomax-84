
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from '@/components/ui/toaster';
import { Toaster as Sonner } from '@/components/ui/sonner';
import { TooltipProvider } from '@/components/ui/tooltip';
import { ThemeProvider } from '@/components/ThemeProvider';
import { AppLayout } from '@/components/AppLayout';
import { PrivateRoute } from '@/components/PrivateRoute';
import Login from '@/pages/Login';
import Dashboard from '@/pages/Dashboard';
import { AuthProvider } from '@/contexts/auth/AuthContext';
import { ActivityLogProvider } from '@/contexts/ActivityLogContext';
import { AdminAreaProvider } from '@/contexts/AdminAreaContext';
import { DeliveriesProvider } from '@/contexts/deliveries';
import { ClientsProvider } from '@/contexts/clients';
import { BudgetProvider } from '@/contexts/budget';
import { PriceTablesProvider } from '@/contexts/priceTables';
import { CitiesProvider } from '@/contexts/cities';
import { ShipmentsProvider } from '@/contexts/shipments';
import { FinancialProvider } from '@/contexts/financial';
import { LogbookProvider } from '@/contexts/LogbookContext';

// Page imports
import { DeliveriesPage } from '@/pages/deliveries';
import { ShipmentsPage } from '@/pages/shipments';
import Budgets from '@/pages/Budgets';
import Clients from '@/pages/Clients';
import { PriceTablesPage } from '@/pages/PriceTables';
import Cities from '@/pages/Cities';
import Reports from '@/pages/Reports';
import ShipmentReports from '@/pages/ShipmentReports';
import Financial from '@/pages/Financial';
import FinancialDashboard from '@/pages/FinancialDashboard';
import { FinancialReportsPage } from '@/pages/accounts/FinancialReportsPage';
import { ReceivableAccountsPage } from '@/pages/accounts/ReceivableAccountsPage';
import { PayableAccountsPage } from '@/pages/accounts/PayableAccountsPage';
import Settings from '@/pages/Settings';
import Profile from '@/pages/Profile';
import Users from '@/pages/Users';
import Employees from '@/pages/Employees';
import Contractors from '@/pages/Contractors';
import Vehicles from '@/pages/Vehicles';
import Logbook from '@/pages/Logbook';
import Maintenance from '@/pages/Maintenance';
import NotFound from '@/pages/NotFound';

// Inventory imports
import { 
  ProductsPage as InventoryProductsPage, 
  EntriesPage as InventoryEntriesPage, 
  ExitsPage as InventoryExitsPage, 
  DashboardPage as InventoryDashboardPage 
} from '@/pages/inventory';

// Storage imports
import { 
  ProductsPage as StorageProductsPage, 
  EntriesPage as StorageEntriesPage, 
  ExitsPage as StorageExitsPage, 
  DashboardPage as StorageDashboardPage 
} from '@/pages/storage';

import './App.css';

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider defaultTheme="system" storageKey="vite-ui-theme">
        <TooltipProvider>
          <AuthProvider>
            <AdminAreaProvider>
              <ActivityLogProvider>
                <DeliveriesProvider>
                  <ClientsProvider>
                    <BudgetProvider>
                      <PriceTablesProvider>
                        <CitiesProvider>
                          <ShipmentsProvider>
                            <FinancialProvider>
                              <LogbookProvider>
                                <Router>
                                  <Routes>
                                    <Route path="/login" element={<Login />} />
                                    <Route path="/" element={<Navigate to="/dashboard" replace />} />
                                    
                                    <Route element={<AppLayout />}>
                                      <Route path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
                                      <Route path="/deliveries" element={<PrivateRoute><DeliveriesPage /></PrivateRoute>} />
                                      <Route path="/shipments" element={<PrivateRoute><ShipmentsPage /></PrivateRoute>} />
                                      <Route path="/budgets" element={<PrivateRoute><Budgets /></PrivateRoute>} />
                                      <Route path="/clients" element={<PrivateRoute><Clients /></PrivateRoute>} />
                                      <Route path="/price-tables" element={<PrivateRoute><PriceTablesPage /></PrivateRoute>} />
                                      <Route path="/cities" element={<PrivateRoute><Cities /></PrivateRoute>} />
                                      <Route path="/reports" element={<PrivateRoute><Reports /></PrivateRoute>} />
                                      <Route path="/shipment-reports" element={<PrivateRoute><ShipmentReports /></PrivateRoute>} />
                                      <Route path="/financial" element={<PrivateRoute><Financial /></PrivateRoute>} />
                                      <Route path="/financial-dashboard" element={<PrivateRoute><FinancialDashboard /></PrivateRoute>} />
                                      <Route path="/financial-reports" element={<PrivateRoute><FinancialReportsPage /></PrivateRoute>} />
                                      <Route path="/receivable-accounts" element={<PrivateRoute><ReceivableAccountsPage /></PrivateRoute>} />
                                      <Route path="/payable-accounts" element={<PrivateRoute><PayableAccountsPage /></PrivateRoute>} />
                                      <Route path="/settings" element={<PrivateRoute><Settings /></PrivateRoute>} />
                                      <Route path="/profile" element={<PrivateRoute><Profile /></PrivateRoute>} />
                                      <Route path="/users" element={<PrivateRoute><Users /></PrivateRoute>} />
                                      <Route path="/employees" element={<PrivateRoute><Employees /></PrivateRoute>} />
                                      <Route path="/contractors" element={<PrivateRoute><Contractors /></PrivateRoute>} />
                                      <Route path="/vehicles" element={<PrivateRoute><Vehicles /></PrivateRoute>} />
                                      <Route path="/logbook" element={<PrivateRoute><Logbook /></PrivateRoute>} />
                                      <Route path="/maintenance" element={<PrivateRoute><Maintenance /></PrivateRoute>} />
                                      
                                      {/* Inventory routes */}
                                      <Route path="/inventory/products" element={<PrivateRoute><InventoryProductsPage /></PrivateRoute>} />
                                      <Route path="/inventory/entries" element={<PrivateRoute><InventoryEntriesPage /></PrivateRoute>} />
                                      <Route path="/inventory/exits" element={<PrivateRoute><InventoryExitsPage /></PrivateRoute>} />
                                      <Route path="/inventory/dashboard" element={<PrivateRoute><InventoryDashboardPage /></PrivateRoute>} />
                                      
                                      {/* Storage routes */}
                                      <Route path="/storage/products" element={<PrivateRoute><StorageProductsPage /></PrivateRoute>} />
                                      <Route path="/storage/entries" element={<PrivateRoute><StorageEntriesPage /></PrivateRoute>} />
                                      <Route path="/storage/exits" element={<PrivateRoute><StorageExitsPage /></PrivateRoute>} />
                                      <Route path="/storage/dashboard" element={<PrivateRoute><StorageDashboardPage /></PrivateRoute>} />
                                      
                                      <Route path="*" element={<NotFound />} />
                                    </Route>
                                  </Routes>
                                </Router>
                                <Toaster />
                                <Sonner />
                              </LogbookProvider>
                            </FinancialProvider>
                          </ShipmentsProvider>
                        </CitiesProvider>
                      </PriceTablesProvider>
                    </BudgetProvider>
                  </ClientsProvider>
                </DeliveriesProvider>
              </ActivityLogProvider>
            </AdminAreaProvider>
          </AuthProvider>
        </TooltipProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
