import { Navigate, useLocation } from 'react-router-dom';
import { getSession } from '@/lib/storage';
import { ReactNode } from 'react';

interface ProtectedRouteProps {
  children: ReactNode;
  allowedRoles?: ('egresado' | 'coordinador')[];
}

const ProtectedRoute = ({ children, allowedRoles }: ProtectedRouteProps) => {
  const session = getSession();
  const location = useLocation();
  
  if (!session) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }
  
  if (allowedRoles && !allowedRoles.includes(session.rol)) {
    // Redirigir al dashboard correspondiente si no tiene permiso
    const redirectPath = session.rol === 'coordinador' 
      ? '/dashboard/coordinador' 
      : '/dashboard/egresado';
    return <Navigate to={redirectPath} replace />;
  }
  
  return <>{children}</>;
};

export default ProtectedRoute;
