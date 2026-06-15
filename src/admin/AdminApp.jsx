import { Routes, Route, Navigate } from 'react-router-dom'
import { useAdmin } from './hooks/useAdmin'
import { useToast } from './hooks/useToast'
import Toast from './components/Toast'
import AdminLogin from './pages/AdminLogin'
import ForgotPassword from './pages/ForgotPassword'
import Dashboard from './pages/Dashboard'
import ProductManagement from './pages/ProductManagement'
import ContentManagement from './pages/ContentManagement'
import ImageManagement from './pages/ImageManagement'
import './admin.css'

/**
 * ProtectedRoute - redirects to /admin if not authenticated
 */
function ProtectedRoute({ admin, loading, children }) {
  if (loading) {
    return (
      <div className="admin-root flex items-center justify-center min-h-screen">
        <div className="text-center">
          <span className="adm-spinner mx-auto" style={{ width: 40, height: 40, borderWidth: 3 }} />
          <p className="text-sm mt-4" style={{ color: 'var(--adm-text-3)' }}>Verifying session…</p>
        </div>
      </div>
    )
  }
  if (!admin) return <Navigate to="/admin" replace />
  return children
}

export default function AdminApp() {
  const { admin, loading, authFetch, logout } = useAdmin()
  const toast = useToast()

  // Shared props for all protected pages
  const pageProps = { admin, onLogout: logout, authFetch, toast }

  return (
    <div className="admin-root">
      <Toast toasts={toast.toasts} remove={toast.remove} />

      <Routes>
        {/* Public admin routes */}
        <Route path="/"               element={<AdminLogin />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />

        {/* Protected admin routes */}
        <Route path="/dashboard" element={
          <ProtectedRoute admin={admin} loading={loading}>
            <Dashboard {...pageProps} />
          </ProtectedRoute>
        } />
        <Route path="/products" element={
          <ProtectedRoute admin={admin} loading={loading}>
            <ProductManagement {...pageProps} />
          </ProtectedRoute>
        } />
        <Route path="/content" element={
          <ProtectedRoute admin={admin} loading={loading}>
            <ContentManagement {...pageProps} />
          </ProtectedRoute>
        } />
        <Route path="/images" element={
          <ProtectedRoute admin={admin} loading={loading}>
            <ImageManagement {...pageProps} />
          </ProtectedRoute>
        } />

        {/* Catch-all: redirect unknown /admin/* to login */}
        <Route path="*" element={<Navigate to="/admin" replace />} />
      </Routes>
    </div>
  )
}
