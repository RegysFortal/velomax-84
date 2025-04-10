
import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import './App.css';
import LoginPage from './pages/Login';
import { useAuth } from '@/contexts/auth/AuthContext';
import DashboardPage from './pages/Dashboard';
import ClientsPage from './pages/Clients';
import { Toaster } from '@/components/ui/toaster';
import { ThemeProvider } from '@/contexts/ThemeContext';
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
import { BudgetProvider } from './contexts/BudgetContext';
import { ClientsProvider } from './contexts/clients/ClientsContext';

function App() {
  const { user, loading } = useAuth();
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    // Only set ready after the initial auth check
    if (!loading) {
      setIsReady(true);
    }
  }, [loading]);

  if (!isReady) {
    return null; // or a loading spinner
  }

  return (
    <ClientsProvider>
      <BudgetProvider>
        <Router>
          <Routes>
            <Route path="/" element={!user ? <LoginPage /> : <Navigate to="/dashboard" />} />
            <Route path="/login" element={!user ? <LoginPage /> : <Navigate to="/dashboard" />} />
            
            {/* Protected routes */}
            <Route path="/dashboard" element={user ? <DashboardPage /> : <Navigate to="/login" />} />
            <Route path="/clients" element={user ? <ClientsPage /> : <Navigate to="/login" />} />
            <Route path="/profile" element={user ? <ProfilePage /> : <Navigate to="/login" />} />
            <Route path="/vehicles" element={user ? <VehiclesPage /> : <Navigate to="/login" />} />
            <Route path="/deliveries" element={user ? <DeliveriesPage /> : <Navigate to="/login" />} />
            <Route path="/shipments" element={user ? <ShipmentsPage /> : <Navigate to="/login" />} />
            <Route path="/employees" element={user ? <EmployeesPage /> : <Navigate to="/login" />} />
            <Route path="/maintenance" element={user ? <MaintenancePage /> : <Navigate to="/login" />} />
            <Route path="/logbook" element={user ? <LogbookPage /> : <Navigate to="/login" />} />
            <Route path="/settings" element={user ? <SettingsPage /> : <Navigate to="/login" />} />
            <Route path="/activity-logs" element={user ? <ActivityLogsPage /> : <Navigate to="/login" />} />
            <Route path="/financial" element={user ? <FinancialPage /> : <Navigate to="/login" />} />
            <Route path="/reports" element={user ? <ReportsPage /> : <Navigate to="/login" />} />
            <Route path="/shipment-reports" element={user ? <ShipmentReportsPage /> : <Navigate to="/login" />} />
            <Route path="/price-tables" element={user ? <PriceTablesPage /> : <Navigate to="/login" />} />
            <Route path="/cities" element={user ? <CitiesPage /> : <Navigate to="/login" />} />
            <Route path="/budgets" element={user ? <BudgetsPage /> : <Navigate to="/login" />} />
            
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
          <Toaster />
        </Router>
      </BudgetProvider>
    </ClientsProvider>
  );
}

export default App;
