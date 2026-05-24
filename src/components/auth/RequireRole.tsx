import React from 'react';
import { Link } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import { Lock, Crown } from 'lucide-react';

interface RequireRoleProps {
  allowedRoles: string[];
  children: React.ReactNode;
  fallbackMessage?: string;
}

export const RequireRole: React.FC<RequireRoleProps> = ({ 
  allowedRoles, 
  children, 
  fallbackMessage = "This is a premium feature. Upgrade your plan to access it." 
}) => {
  const { profile, session } = useAuthStore();
  
  // If not logged in, or if profile hasn't loaded yet
  if (!session) return null;
  
  // Default to 'free' if role is not set
  const currentRole = profile?.role || 'free';
  
  const isAuthorized = allowedRoles.includes(currentRole) || currentRole === 'admin';

  if (isAuthorized) {
    return <>{children}</>;
  }

  // Unauthorized State
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8 sm:p-12 text-center max-w-2xl mx-auto my-8 relative overflow-hidden">
      {/* Decorative gradient */}
      <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-accent to-yellow-300"></div>
      
      <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-accent/10 text-accent mb-6">
        <Lock className="w-10 h-10" />
      </div>
      
      <h3 className="text-2xl font-bold text-gray-900 mb-2">Premium Feature Locked</h3>
      <p className="text-gray-500 mb-8 max-w-md mx-auto">{fallbackMessage}</p>
      
      <Link 
        to="/upgrade" 
        className="inline-flex items-center justify-center bg-accent hover:bg-[#b08d45] text-white px-8 py-3 rounded-lg font-medium transition-colors shadow-md"
      >
        <Crown className="w-5 h-5 mr-2" />
        View Upgrade Plans
      </Link>
    </div>
  );
};
