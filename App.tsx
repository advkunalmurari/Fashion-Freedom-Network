import React, { useState, useEffect, Suspense } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { PayPalScriptProvider } from "@paypal/react-paypal-js";
import { Layout } from './components/Layout';
import { supabase } from './supabase';
import { MOCK_TALENT_POOL, MOCK_POSTS } from './constants';

const Home = React.lazy(() => import('./components/Home').then(m => ({ default: m.Home })));
const Directory = React.lazy(() => import('./components/Directory').then(m => ({ default: m.Directory })));
const ProfilePage = React.lazy(() => import('./components/ProfilePage').then(m => ({ default: m.ProfilePage })));
const ApplyNow = React.lazy(() => import('./components/ApplyNow').then(m => ({ default: m.ApplyNow })));
const Feed = React.lazy(() => import('./components/Feed').then(m => ({ default: m.Feed })));
const Marketplace = React.lazy(() => import('./components/Marketplace').then(m => ({ default: m.Marketplace })));
const Messaging = React.lazy(() => import('./components/Messaging').then(m => ({ default: m.Messaging })));
const UnifiedProtocolFeed = React.lazy(() => import('./components/UnifiedProtocolFeed').then(m => ({ default: m.UnifiedProtocolFeed })));
const Explore = React.lazy(() => import('./components/Explore').then(m => ({ default: m.Explore })));
const Castings = React.lazy(() => import('./components/Castings').then(m => ({ default: m.Castings })));
const Network = React.lazy(() => import('./components/Network').then(m => ({ default: m.Network })));
const Motion = React.lazy(() => import('./components/Motion').then(m => ({ default: m.Motion })));
const Events = React.lazy(() => import('./components/Events').then(m => ({ default: m.Events })));
const Journal = React.lazy(() => import('./components/Journal').then(m => ({ default: m.Journal })));
const MyProfile = React.lazy(() => import('./components/MyProfile').then(m => ({ default: m.MyProfile })));
const PostDetail = React.lazy(() => import('./components/PostDetail').then(m => ({ default: m.PostDetail })));
const Photoshoots = React.lazy(() => import('./components/Photoshoots').then(m => ({ default: m.Photoshoots })));
const Brands = React.lazy(() => import('./components/Brands').then(m => ({ default: m.Brands })));
const BrandDashboard = React.lazy(() => import('./components/BrandDashboard').then(m => ({ default: m.BrandDashboard })));
const RegisterProfessional = React.lazy(() => import('./components/RegisterProfessional').then(m => ({ default: m.RegisterProfessional })));
const PrivacyPolicy = React.lazy(() => import('./components/LegalPages').then(m => ({ default: m.PrivacyPolicy })));
const TermsAndConditions = React.lazy(() => import('./components/LegalPages').then(m => ({ default: m.TermsAndConditions })));
const RefundPolicy = React.lazy(() => import('./components/LegalPages').then(m => ({ default: m.RefundPolicy })));
const CookiePolicy = React.lazy(() => import('./components/LegalPages').then(m => ({ default: m.CookiePolicy })));
const AboutPage = React.lazy(() => import('./components/InfoPages').then(m => ({ default: m.AboutPage })));
const FAQPage = React.lazy(() => import('./components/InfoPages').then(m => ({ default: m.FAQPage })));
const CommunityGuidelines = React.lazy(() => import('./components/InfoPages').then(m => ({ default: m.CommunityGuidelines })));
const PricingPage = React.lazy(() => import('./components/InfoPages').then(m => ({ default: m.PricingPage })));
const VerificationPage = React.lazy(() => import('./components/VerificationNode').then(m => ({ default: m.VerificationNode })));
const PortfolioAudit = React.lazy(() => import('./components/PortfolioAuditEngine').then(m => ({ default: m.PortfolioAuditEngine })));
const ContactPage = React.lazy(() => import('./components/Contact').then(m => ({ default: m.ContactPage })));
const ActivityLedger = React.lazy(() => import('./components/ActivityLedger').then(m => ({ default: m.ActivityLedger })));
const ReportProblem = React.lazy(() => import('./components/ReportProblem').then(m => ({ default: m.ReportProblem })));
const AccountSwitcher = React.lazy(() => import('./components/AccountSwitcher').then(m => ({ default: m.AccountSwitcher })));
const Editorial = React.lazy(() => import('./components/Editorial').then(m => ({ default: m.Editorial })));
const LoginPage = React.lazy(() => import('./pages/Login'));
const ForgotPasswordPage = React.lazy(() => import('./pages/ForgotPassword'));
const ResetPasswordPage = React.lazy(() => import('./pages/ResetPassword'));
const Settings = React.lazy(() => import('./components/Settings').then(m => ({ default: m.Settings })));
const RentalMarketplace = React.lazy(() => import('./components/RentalMarketplace').then(m => ({ default: m.RentalMarketplace })));
const MasterclassHub = React.lazy(() => import('./components/MasterclassHub').then(m => ({ default: m.MasterclassHub })));
const TalentMatchEngine = React.lazy(() => import('./components/TalentMatchEngine').then(m => ({ default: m.TalentMatchEngine })));
const CreatorEarningsDashboard = React.lazy(() => import('./components/CreatorEarningsDashboard').then(m => ({ default: m.CreatorEarningsDashboard })));
const TrendForecaster = React.lazy(() => import('./components/TrendForecaster').then(m => ({ default: m.TrendForecaster })));
const CastingBoard = React.lazy(() => import('./components/CastingBoard').then(m => ({ default: m.CastingBoard })));
const BrandProfilePage = React.lazy(() => import('./components/BrandProfilePage').then(m => ({ default: m.BrandProfilePage })));
const EscrowTracker = React.lazy(() => import('./components/EscrowTracker').then(m => ({ default: m.EscrowTracker })));
const CollaborationHub = React.lazy(() => import('./components/CollaborationHub').then(m => ({ default: m.CollaborationHub })));
const PressRoom = React.lazy(() => import('./components/PressRoom').then(m => ({ default: m.PressRoom })));
const ProjectWarRoom = React.lazy(() => import('./components/ProjectWarRoom').then(m => ({ default: m.ProjectWarRoom })));
const AgencyCommandCenter = React.lazy(() => import('./components/AgencyCommandCenter').then(m => ({ default: m.AgencyCommandCenter })));
const TrendLab = React.lazy(() => import('./components/TrendLab').then(m => ({ default: m.TrendLab })));
const SavedHub = React.lazy(() => import('./components/SavedHub').then(m => ({ default: m.SavedHub })));
const VerifiedCertificate = React.lazy(() => import('./components/VerifiedCertificate').then(m => ({ VerifiedCertificate: m.VerifiedCertificate })));

// Loading Fallback Spinner
const PageLoader = () => (
  <div className="flex h-screen w-full items-center justify-center">
    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-ffn-primary"></div>
  </div>
);

// Inner Application Component bounded by Router
const Application: React.FC = () => {
  const [user, setUser] = useState<any>(null);
  const [isSessionLoading, setIsSessionLoading] = useState(true);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) setUser(session.user);
      setIsSessionLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session ? session.user : null);
      setIsSessionLoading(false);
    });

    const savedTheme = localStorage.getItem('ffn_theme');
    if (savedTheme === 'dark') {
      setIsDarkMode(true);
      document.body.classList.add('dark-protocol');
    }

    return () => subscription.unsubscribe();
  }, []);

  const toggleDarkMode = () => {
    const newMode = !isDarkMode;
    setIsDarkMode(newMode);
    localStorage.setItem('ffn_theme', newMode ? 'dark' : 'light');
    if (newMode) document.body.classList.add('dark-protocol');
    else document.body.classList.remove('dark-protocol');
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setUser(null);
    navigate('/login');
  };

  if (isSessionLoading) {
    return <PageLoader />;
  }

  return (
    <div className={isDarkMode ? 'dark-protocol-active' : ''}>
      <Layout
        currentUser={user}
        onLogout={handleLogout}
        isDarkMode={isDarkMode}
        onToggleDarkMode={toggleDarkMode}
      >
        <Suspense fallback={<PageLoader />}>
          <Routes>
            <Route path="/" element={user ? <Home onApply={() => navigate('/register-professional')} onDirectory={() => navigate('/directory')} onRegisterProfessional={() => navigate('/register-professional')} /> : <Navigate to="/login" replace />} />
            <Route path="/home" element={<Navigate to="/" replace />} />
            <Route path="/feed" element={<Feed onSelectPost={() => { }} />} />
            <Route path="/explore" element={<Explore />} />
            <Route path="/motion" element={<Motion />} />
            <Route path="/trend-lab" element={<TrendLab />} />
            <Route path="/directory" element={<Directory onSelectTalent={(id) => navigate('/profile-view/' + id)} onRegisterProfessional={() => navigate('/register-professional')} />} />
            <Route path="/shoots" element={<Photoshoots />} />
            <Route path="/brands" element={<Brands />} />
            <Route path="/brand-dashboard" element={<BrandDashboard user={user} onLogout={handleLogout} />} />
            <Route path="/castings" element={<Castings />} />
            <Route path="/marketplace" element={<Marketplace />} />
            <Route path="/rentals" element={<RentalMarketplace />} />
            <Route path="/academy" element={<MasterclassHub />} />
            <Route path="/match" element={<TalentMatchEngine />} />
            <Route path="/earnings" element={<CreatorEarningsDashboard />} />
            <Route path="/trends" element={<TrendForecaster />} />
            <Route path="/casting-board" element={<CastingBoard />} />
            <Route path="/brands/:brandId" element={<BrandProfilePage />} />
            <Route path="/escrow" element={<EscrowTracker />} />
            <Route path="/network" element={<Network />} />
            <Route path="/collabs" element={<CollaborationHub />} />
            <Route path="/press" element={<PressRoom />} />
            <Route path="/war-room/:projectId" element={<ProjectWarRoom />} />
            <Route path="/agency-dashboard" element={<AgencyCommandCenter />} />
            <Route path="/saved" element={<SavedHub />} />
            <Route path="/certificate/:id" element={<VerifiedCertificate user={MOCK_TALENT_POOL[0]} verificationDate="2025-03-01" trustScore={942} />} />

            <Route path="/editorial" element={<Editorial />} />
            <Route path="/settings" element={<Settings user={user} onLogout={handleLogout} />} />
            <Route path="/inbox" element={<UnifiedProtocolFeed />} />
            <Route path="/messages" element={<Navigate to="/inbox" replace />} />
            <Route path="/forgot-password" element={<ForgotPasswordPage />} />
            <Route path="/reset-password" element={<ResetPasswordPage />} />
            <Route path="/login" element={<LoginPage onLogin={(userData) => { setUser(userData); navigate('/'); }} />} />
            <Route path="/my-profile" element={<MyProfile user={user} onLogout={handleLogout} />} />
            <Route path="/register-professional" element={<RegisterProfessional onSuccess={(userData) => { setUser(userData); navigate('/'); }} />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="/privacy-policy" element={<PrivacyPolicy />} />
            <Route path="/terms-and-conditions" element={<TermsAndConditions />} />
            <Route path="/refund-policy" element={<RefundPolicy />} />
            <Route path="/cookie-policy" element={<CookiePolicy />} />
            <Route path="/faq" element={<FAQPage />} />
            <Route path="/community-guidelines" element={<CommunityGuidelines />} />
            <Route path="/pricing" element={<PricingPage onRegister={() => navigate('/register-professional')} />} />
            <Route path="/verification" element={<VerificationPage />} />
            <Route path="/portfolio-audit" element={<PortfolioAudit />} />
            <Route path="/profile-view/:id" element={<ProfilePage user={MOCK_TALENT_POOL[0]} onBack={() => navigate('/directory')} />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Suspense>
      </Layout>
    </div>
  );
};

const App: React.FC = () => {
  return (
    <PayPalScriptProvider options={{ "client-id": import.meta.env.VITE_PAYPAL_CLIENT_ID || 'test' }}>
      <BrowserRouter>
        <Application />
      </BrowserRouter>
    </PayPalScriptProvider>
  );
};

export default App;
