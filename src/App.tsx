
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/auth/AuthContext';
import { ClientProvider } from './contexts/clients';
import { PermissionProvider } from './contexts/permissions/PermissionContext';
import { DeliveryProvider } from './contexts/deliveries/DeliveryContext';
import { ShipmentProvider } from './contexts/shipments';
import { UserProvider } from './contexts/users/UserContext';
import { CompanyProvider } from './contexts/company/CompanyContext';
import { SystemProvider } from './contexts/system/SystemContext';
import { UserSettingsProvider } from './contexts/user-settings/UserSettingsContext';
import { CalendarProvider } from './contexts/calendar/CalendarContext';
import { ProductProvider } from './contexts/products/ProductContext';
import { VehicleProvider } from './contexts/vehicles/VehicleContext';
import { FinancialProvider } from './contexts/financial';
import { Layout } from './components/Layout';
import { ProtectedRoute } from './components/ProtectedRoute';
import { Toaster } from './components/ui/toaster';
import { Toaster as SonnerToaster } from 'sonner';

// Pages
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import DeliveryDashboard from './pages/DeliveryDashboard';
import FinancialDashboard from './pages/FinancialDashboard';
import Deliveries from './pages/Deliveries';
import Shipments from './pages/Shipments';
import ShipmentDetail from './pages/ShipmentDetail';
import Reports from './pages/Reports';
import Clients from './pages/Clients';
import ClientDetail from './pages/ClientDetail';
import Employees from './pages/Employees';
import ContractorRegister from './pages/ContractorRegister';
import Users from './pages/Users';
import Settings from './pages/Settings';
import PriceTables from './pages/PriceTables';
import Cities from './pages/Cities';
import UserSettings from './pages/UserSettings';
import Calendar from './pages/Calendar';
import Financial from './pages/Financial';
import Products from './pages/Products';
import Vehicles from './pages/Vehicles';
import VehicleDetail from './pages/VehicleDetail';
import VehicleFuel from './pages/VehicleFuel';
import VehicleMaintenance from './pages/VehicleMaintenance';
import VehicleTires from './pages/VehicleTires';
import VehicleLogbook from './pages/VehicleLogbook';
import FinancialReportsPage from './pages/accounts/FinancialReportsPage';
import PayableAccountsPage from './pages/accounts/PayableAccountsPage';
import ReceivableAccountsPage from './pages/accounts/ReceivableAccountsPage';
import NotFound from './pages/NotFound';

function App() {
  return (
    <Router>
      <AuthProvider>
        <UserProvider>
          <PermissionProvider>
            <SystemProvider>
              <UserSettingsProvider>
                <CompanyProvider>
                  <ClientProvider>
                    <DeliveryProvider>
                      <ShipmentProvider>
                        <CalendarProvider>
                          <ProductProvider>
                            <VehicleProvider>
                              <Routes>
                                <Route path="/login" element={<Login />} />
                                <Route path="/" element={
                                  <ProtectedRoute>
                                    <Layout>
                                      <Dashboard />
                                    </Layout>
                                  </ProtectedRoute>
                                } />
                                <Route path="/dashboard" element={
                                  <ProtectedRoute>
                                    <Layout>
                                      <Dashboard />
                                    </Layout>
                                  </ProtectedRoute>
                                } />
                                <Route path="/delivery-dashboard" element={
                                  <ProtectedRoute>
                                    <Layout>
                                      <DeliveryDashboard />
                                    </Layout>
                                  </ProtectedRoute>
                                } />
                                <Route path="/financial-dashboard" element={
                                  <ProtectedRoute>
                                    <Layout>
                                      <FinancialDashboard />
                                    </Layout>
                                  </ProtectedRoute>
                                } />
                                <Route path="/deliveries" element={
                                  <ProtectedRoute>
                                    <Layout>
                                      <Deliveries />
                                    </Layout>
                                  </ProtectedRoute>
                                } />
                                <Route path="/shipments" element={
                                  <ProtectedRoute>
                                    <Layout>
                                      <Shipments />
                                    </Layout>
                                  </ProtectedRoute>
                                } />
                                <Route path="/shipments/:id" element={
                                  <ProtectedRoute>
                                    <Layout>
                                      <ShipmentDetail />
                                    </Layout>
                                  </ProtectedRoute>
                                } />
                                <Route path="/reports" element={
                                  <ProtectedRoute>
                                    <Layout>
                                      <Reports />
                                    </Layout>
                                  </ProtectedRoute>
                                } />
                                <Route path="/clients" element={
                                  <ProtectedRoute>
                                    <Layout>
                                      <Clients />
                                    </Layout>
                                  </ProtectedRoute>
                                } />
                                <Route path="/clients/:id" element={
                                  <ProtectedRoute>
                                    <Layout>
                                      <ClientDetail />
                                    </Layout>
                                  </ProtectedRoute>
                                } />
                                <Route path="/employees" element={
                                  <ProtectedRoute>
                                    <Layout>
                                      <Employees />
                                    </Layout>
                                  </ProtectedRoute>
                                } />
                                <Route path="/contractor-register" element={
                                  <ProtectedRoute>
                                    <Layout>
                                      <ContractorRegister />
                                    </Layout>
                                  </ProtectedRoute>
                                } />
                                <Route path="/users" element={
                                  <ProtectedRoute>
                                    <Layout>
                                      <Users />
                                    </Layout>
                                  </ProtectedRoute>
                                } />
                                <Route path="/settings" element={
                                  <ProtectedRoute>
                                    <Layout>
                                      <Settings />
                                    </Layout>
                                  </ProtectedRoute>
                                } />
                                <Route path="/price-tables" element={
                                  <ProtectedRoute>
                                    <Layout>
                                      <PriceTables />
                                    </Layout>
                                  </ProtectedRoute>
                                } />
                                <Route path="/cities" element={
                                  <ProtectedRoute>
                                    <Layout>
                                      <Cities />
                                    </Layout>
                                  </ProtectedRoute>
                                } />
                                <Route path="/user-settings" element={
                                  <ProtectedRoute>
                                    <Layout>
                                      <UserSettings />
                                    </Layout>
                                  </ProtectedRoute>
                                } />
                                <Route path="/calendar" element={
                                  <ProtectedRoute>
                                    <Layout>
                                      <Calendar />
                                    </Layout>
                                  </ProtectedRoute>
                                } />
                                <Route path="/financial" element={
                                  <ProtectedRoute>
                                    <Layout>
                                      <Financial />
                                    </Layout>
                                  </ProtectedRoute>
                                } />
                                <Route path="/products" element={
                                  <ProtectedRoute>
                                    <Layout>
                                      <Products />
                                    </Layout>
                                  </ProtectedRoute>
                                } />
                                <Route path="/vehicles" element={
                                  <ProtectedRoute>
                                    <Layout>
                                      <Vehicles />
                                    </Layout>
                                  </ProtectedRoute>
                                } />
                                <Route path="/vehicles/:id" element={
                                  <ProtectedRoute>
                                    <Layout>
                                      <VehicleDetail />
                                    </Layout>
                                  </ProtectedRoute>
                                } />
                                <Route path="/vehicles/:vehicleId/fuel" element={
                                  <ProtectedRoute>
                                    <Layout>
                                      <VehicleFuel />
                                    </Layout>
                                  </ProtectedRoute>
                                } />
                                <Route path="/vehicles/:vehicleId/maintenance" element={
                                  <ProtectedRoute>
                                    <Layout>
                                      <VehicleMaintenance />
                                    </Layout>
                                  </ProtectedRoute>
                                } />
                                <Route path="/vehicles/:vehicleId/tires" element={
                                  <ProtectedRoute>
                                    <Layout>
                                      <VehicleTires />
                                    </Layout>
                                  </ProtectedRoute>
                                } />
                                <Route path="/vehicles/:vehicleId/logbook" element={
                                  <ProtectedRoute>
                                    <Layout>
                                      <VehicleLogbook />
                                    </Layout>
                                  </ProtectedRoute>
                                } />
                                
                                {/* Financial Accounts Routes */}
                                <Route path="/accounts/reports" element={
                                  <ProtectedRoute>
                                    <Layout>
                                      <FinancialReportsPage />
                                    </Layout>
                                  </ProtectedRoute>
                                } />
                                <Route path="/accounts/payable" element={
                                  <ProtectedRoute>
                                    <Layout>
                                      <PayableAccountsPage />
                                    </Layout>
                                  </ProtectedRoute>
                                } />
                                <Route path="/accounts/receivable" element={
                                  <ProtectedRoute>
                                    <Layout>
                                      <ReceivableAccountsPage />
                                    </Layout>
                                  </ProtectedRoute>
                                } />
                                
                                <Route path="*" element={<NotFound />} />
                              </Routes>
                            </VehicleProvider>
                          </ProductProvider>
                        </CalendarProvider>
                      </ShipmentProvider>
                    </DeliveryProvider>
                  </ClientProvider>
                </CompanyProvider>
              </UserSettingsProvider>
            </SystemProvider>
          </PermissionProvider>
        </UserProvider>
      </AuthProvider>
      <Toaster />
      <SonnerToaster />
    </Router>
  );
}

export default App;
