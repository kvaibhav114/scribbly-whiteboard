import { createRoot } from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import App from './App';
import Dashboard from './pages/Dashboard';
import Whiteboard from './pages/Whiteboard';
import ProtectedRoute from './components/ProtectedRoute';
import keycloak from './auth/keycloak';
import { ReactKeycloakProvider } from '@react-keycloak/web';
import 'bootstrap/dist/css/bootstrap.min.css';
import './index.css';
createRoot(document.getElementById('root')!).render(
  <ReactKeycloakProvider authClient={keycloak}>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />} />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/whiteboard/:sessionId"
          element={
            <ProtectedRoute>
              <Whiteboard />
            </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  </ReactKeycloakProvider>
);