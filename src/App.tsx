import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { SettingsProvider } from './context/SettingsContext';
import Layout from './layouts/Layout';
import Login from './pages/Login';
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

              <Route
                path="dashboard"
                element={<Dashboard />}
              />

              <Route
                path="settings"
                element={<Settings />}
              />
            </Route>
          </Routes>
        </AuthProvider>
      </SettingsProvider>
    </Router>
  );
}

export default App;
