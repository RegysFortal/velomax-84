
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/auth/AuthContext';
import { ClientsProvider } from './contexts/clients';
import { DeliveriesProvider } from './contexts/deliveries/DeliveriesProvider';
import { ShipmentsProvider } from './contexts/shipments';
import { FinancialProvider } from './contexts/financial';
import { Toaster } from './components/ui/toaster';
import { Toaster as SonnerToaster } from 'sonner';

// Pages que existem
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import FinancialDashboard from './pages/FinancialDashboard';
import Shipments from './pages/Shipments';
import Reports from './pages/Reports';
import Clients from './pages/Clients';
import Employees from './pages/Employees';
import Users from './pages/Users';
import Settings from './pages/Settings';
import Cities from './pages/Cities';
import Financial from './pages/Financial';
import Vehicles from './pages/Vehicles';
import FinancialReportsPage from './pages/accounts/FinancialReportsPage';
import PayableAccountsPage from './pages/accounts/PayableAccountsPage';
import ReceivableAccountsPage from './pages/accounts/ReceivableAccountsPage';
import NotFound from './pages/NotFound';

// Componentes básicos para Layout e ProtectedRoute
const Layout = ({ children }: { children: React.ReactNode }) => (
  <div className="min-h-screen bg-background">
    {children}
  </div>
);

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  // Implementação básica - pode ser melhorada depois
  return <>{children}</>;
};

function App() {
  return (
    <Router>
      <AuthProvider>
        <ClientsProvider>
          <DeliveriesProvider>
            <ShipmentsProvider>
              <FinancialProvider>
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
                  <Route path="/financial-dashboard" element={
                    <ProtectedRoute>
                      <Layout>
                        <FinancialDashboard />
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
                  <Route path="/employees" element={
                    <ProtectedRoute>
                      <Layout>
                        <Employees />
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
                  <Route path="/cities" element={
                    <ProtectedRoute>
                      <Layout>
                        <Cities />
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
                  <Route path="/vehicles" element={
                    <ProtectedRoute>
                      <Layout>
                        <Vehicles />
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
              </FinancialProvider>
            </ShipmentsProvider>
          </DeliveriesProvider>
        </ClientsProvider>
      </AuthProvider>
      <Toaster />
      <SonnerToaster />
    </Router>
  );
}

export default App;
