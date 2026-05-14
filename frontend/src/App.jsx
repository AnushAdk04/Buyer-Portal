import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Suspense, lazy } from 'react';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import { CompareProvider } from './context/CompareContext';
import ProtectedRoute from './components/ProtectedRoute';
import ErrorBoundary from './components/ErrorBoundary';

// Lazy loaded components
const LandingPage = lazy(() => import('./pages/LandingPage'));
const AboutPage = lazy(() => import('./pages/AboutPage'));
const NotFoundPage = lazy(() => import('./pages/NotFoundPage'));
const LoginPage = lazy(() => import('./pages/LoginPage'));
const RegisterPage = lazy(() => import('./pages/RegisterPage'));
const DashboardPage = lazy(() => import('./pages/DashboardPage'));
const PropertyDetailsPage = lazy(() => import('./pages/PropertyDetailsPage'));
const ProfilePage = lazy(() => import('./pages/ProfilePage'));
const SellerProfilePage = lazy(() => import('./pages/SellerProfilePage'));
const InquiriesPage = lazy(() => import('./pages/InquiriesPage'));
const ComparisonPage = lazy(() => import('./pages/ComparisonPage'));
const AdminPage = lazy(() => import('./pages/AdminPage'));
const ForgotPasswordPage = lazy(() => import('./pages/ForgotPasswordPage'));
const ResetPasswordPage = lazy(() => import('./pages/ResetPasswordPage'));
const NotAdminPage = lazy(() => import('./pages/NotAdminPage'));
const TermsOfServicePage = lazy(() => import('./pages/TermsOfServicePage'));
const PrivacyPolicyPage = lazy(() => import('./pages/PrivacyPolicyPage'));

// Fallback Loader
const PageLoader = () => (
  <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-[#0f0f0f]">
    <span className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></span>
  </div>
);

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <CompareProvider>
          <BrowserRouter>
            <ErrorBoundary>
              <Suspense fallback={<PageLoader />}>
                <Routes>
                <Route path="/" element={<LandingPage />} />
                <Route path="/about" element={<AboutPage />} />
                <Route path="/terms" element={<TermsOfServicePage />} />
                <Route path="/privacy" element={<PrivacyPolicyPage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />
                <Route path="/forgot-password" element={<ForgotPasswordPage />} />
                <Route path="/reset-password/:token" element={<ResetPasswordPage />} />
                <Route
                  path="/dashboard"
                  element={
                    <ProtectedRoute>
                      <DashboardPage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/dashboard/compare"
                  element={
                    <ProtectedRoute>
                      <ComparisonPage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/dashboard/properties/:propertyId"
                  element={
                    <ProtectedRoute>
                      <PropertyDetailsPage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/dashboard/profile"
                  element={
                    <ProtectedRoute>
                      <ProfilePage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/dashboard/sellers/:sellerId"
                  element={
                    <ProtectedRoute>
                      <SellerProfilePage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/dashboard/inquiries"
                  element={
                    <ProtectedRoute>
                      <InquiriesPage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/admin"
                  element={
                    <ProtectedRoute requiredRole="admin">
                      <AdminPage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/not-admin"
                  element={
                    <ProtectedRoute>
                      <NotAdminPage />
                    </ProtectedRoute>
                  }
                />
                <Route path="*" element={<NotFoundPage />} />
              </Routes>
            </Suspense>
            </ErrorBoundary>
          </BrowserRouter>
        </CompareProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;