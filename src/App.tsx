import { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { LandingPage } from './pages/LandingPage';
import { Dashboard } from './pages/Dashboard';
import { Chat } from './pages/Chat';
import { ZakatCalculator } from './pages/ZakatCalculator';
import { Profile } from './pages/Profile';
import { Login } from './pages/Login';
import { SignUp } from './pages/SignUp';
import { HealthCheck } from './pages/HealthCheck';
import { Pricing } from './pages/Pricing';
import { AdminDashboard } from './pages/AdminDashboard';
import { Goals } from './pages/Goals';
import { RibaDetox } from './pages/RibaDetox';
import { Screener } from './pages/Screener';
import { AkadAnalyzer } from './pages/AkadAnalyzer';
import { FamilyDashboard } from './pages/FamilyDashboard';
import { QurbanSaver } from './pages/QurbanSaver';
import { Cashflow } from './pages/Cashflow';
import { ZakatTaxReport } from './pages/ZakatTaxReport';
import { WasiatGenerator } from './pages/WasiatGenerator';
import { AuthCallback } from './pages/AuthCallback';
import { ProtectedRoute } from './components/auth/ProtectedRoute';
import { RequireRole } from './components/auth/RequireRole';
import { useAuthStore } from './store/authStore';
import { useSettingsStore } from './store/settingsStore';
import { supabase } from './lib/supabase';

function App() {
  const { setSession } = useAuthStore();
  const { settings, fetchSettings, subscribeToRealtime, unsubscribeFromRealtime } = useSettingsStore();

  useEffect(() => {
    // Fetch global configuration and CMS settings once on load
    fetchSettings();

    // Start Realtime subscription so logo/CMS changes propagate live
    subscribeToRealtime();

    // Check active session on initial load
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    // Listen for auth state changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => {
      subscription.unsubscribe();
      unsubscribeFromRealtime();
    };
  }, [setSession, fetchSettings, subscribeToRealtime, unsubscribeFromRealtime]);

  // Dynamically update document favicon in the DOM
  useEffect(() => {
    if (settings.favicon_url) {
      let link: HTMLLinkElement | null = document.querySelector("link[rel*='icon']");
      if (!link) {
        link = document.createElement('link');
        link.rel = 'icon';
        document.getElementsByTagName('head')[0].appendChild(link);
      }
      
      link.href = settings.favicon_url;
      
      const fileExt = settings.favicon_url.split('.').pop()?.split('?')[0]?.toLowerCase();
      if (fileExt === 'svg') {
        link.type = 'image/svg+xml';
      } else if (fileExt === 'png') {
        link.type = 'image/png';
      } else {
        link.type = 'image/x-icon';
      }
    }
  }, [settings.favicon_url]);

  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/upgrade" element={<Pricing />} />
        <Route path="/auth/callback" element={<AuthCallback />} />


        {/* Protected Routes */}
        <Route element={<ProtectedRoute />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/cashflow" element={<Cashflow />} />
          <Route path="/chat" element={<Chat />} />
          <Route path="/zakat" element={<ZakatCalculator />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/health-check" element={<HealthCheck />} />
          <Route path="/goals" element={<Goals />} />
          <Route path="/riba-detox" element={
            <RequireRole allowedRoles={['plus', 'pro', 'family', 'admin']} fallbackMessage="This premium feature requires a Plus plan or higher.">
              <RibaDetox />
            </RequireRole>
          } />
          <Route path="/screener" element={
            <RequireRole allowedRoles={['plus', 'pro', 'family', 'admin']} fallbackMessage="Fitur premium Asset Screener memerlukan langganan Plus atau lebih tinggi.">
              <Screener />
            </RequireRole>
          } />
          <Route path="/qurban-saver" element={
            <RequireRole allowedRoles={['plus', 'pro', 'family', 'admin']} fallbackMessage="Fitur Qurban & Aqiqah Auto-Saver memerlukan langganan Plus atau lebih tinggi.">
              <QurbanSaver />
            </RequireRole>
          } />
          <Route path="/akad-analyzer" element={
            <RequireRole allowedRoles={['pro', 'family', 'admin']} fallbackMessage="Klausul Akad Analyzer premium memerlukan langganan Pro atau lebih tinggi.">
              <AkadAnalyzer />
            </RequireRole>
          } />
          <Route path="/zakat-tax-report" element={
            <RequireRole allowedRoles={['pro', 'family', 'admin']} fallbackMessage="Fitur Zakat-to-Tax Report Generator memerlukan langganan Pro atau lebih tinggi.">
              <ZakatTaxReport />
            </RequireRole>
          } />
          <Route path="/family-dashboard" element={
            <RequireRole allowedRoles={['family', 'admin']} fallbackMessage="Baitul Mal Keluarga premium memerlukan langganan Family Plan.">
              <FamilyDashboard />
            </RequireRole>
          } />
          <Route path="/wasiat-generator" element={
            <RequireRole allowedRoles={['family', 'admin']} fallbackMessage="Digital Wasiat Generator premium memerlukan langganan Family Plan.">
              <WasiatGenerator />
            </RequireRole>
          } />
          
          {/* Admin Only Routes */}
          <Route path="/admin" element={
            <RequireRole allowedRoles={['admin']} fallbackMessage="You do not have administrative privileges.">
              <AdminDashboard />
            </RequireRole>
          } />
          <Route path="/admin-dashboard" element={
            <RequireRole allowedRoles={['admin']} fallbackMessage="You do not have administrative privileges.">
              <AdminDashboard />
            </RequireRole>
          } />
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;

