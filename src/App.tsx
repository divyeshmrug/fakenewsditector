import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
// Temporarily disabled Clerk authentication
// import { SignedIn, SignedOut, RedirectToSignIn } from '@clerk/clerk-react';
import { AuthProvider } from './context/AuthContext';
import { SettingsProvider } from './context/SettingsContext';
import Layout from './layouts/Layout';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Settings from './pages/Settings';

function App() {
  return (
    <Router>
      <SettingsProvider>
        <AuthProvider>
          <Routes>
            <Route path="/" element={<Layout />}>
              <Route index element={<Navigate to="/dashboard" replace />} />
              <Route path="login" element={<Login />} />
              <Route path="register" element={<Register />} />

              {/* TEMPORARILY DISABLED CLERK - Direct access for development */}
              <Route path="dashboard" element={<Dashboard />} />
              <Route path="settings" element={<Settings />} />

              {/* Original Clerk-protected routes (commented out for now)
              <Route
                path="dashboard"
                element={
                  <>
                    <SignedIn>
                      <Dashboard />
                    </SignedIn>
                    <SignedOut>
                      <RedirectToSignIn />
                    </SignedOut>
                  </>
                }
              />
              <Route
                path="settings"
                element={
                  <>
                    <SignedIn>
                      <Settings />
                    </SignedIn>
                    <SignedOut>
                      <RedirectToSignIn />
                    </SignedOut>
                  </>
                }
              />
              */}
            </Route>
          </Routes>
        </AuthProvider>
      </SettingsProvider>
    </Router>
  );
}

export default App;
