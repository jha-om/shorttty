import { BrowserRouter, Route, Routes } from "react-router-dom";
import { AuthProvider } from "./contexts/context";
import AppLayout from "./layout/app-layout";
import Auth from "./pages/auth";
import Dashboard from "./pages/dashboard";
import Home from "./pages/home";
import Link from "./pages/link";
import RedirectLink from "./pages/redirect-link";
import { ProtectedRoute } from "./components/RouteProtection";


function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <AppLayout>
          <Routes>
            {/* unprotected routes */}
            <Route path="/" element={<Home />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="/redirect/:id" element={<RedirectLink />} />
            {/* protected routes */}
            <Route
              path="/link/:id"
              element={
                <ProtectedRoute>
                  <Link />
                </ProtectedRoute>
              } />
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              } />
          </Routes>
        </AppLayout>
      </BrowserRouter>
    </AuthProvider>
  )
} export default App