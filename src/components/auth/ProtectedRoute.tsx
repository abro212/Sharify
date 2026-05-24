import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import { ShieldCheck } from 'lucide-react';

export const ProtectedRoute: React.FC = () => {
  const { session, loading } = useAuthStore();

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center">
        <ShieldCheck className="h-12 w-12 text-primary animate-pulse mb-4" />
        <p className="text-gray-500 font-medium">Authenticating...</p>
      </div>
    );
  }

  if (!session) {
    // Redirect to login if there is no active session
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
};
