import { useKeycloak } from '@react-keycloak/web';
import { Navigate } from 'react-router-dom';

import React from 'react';

interface ProtectedRouteProps {
  children: React.ReactNode;
}
const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const { keycloak, initialized } = useKeycloak();

  if (!initialized) return <div>Loading...</div>;
  if (!keycloak.authenticated) return <Navigate to="/" replace />;

  return children;
};

export default ProtectedRoute;