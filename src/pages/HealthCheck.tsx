import React from 'react';
import { DashboardContainer } from '../components/layout/DashboardContainer';
import { FinancialHealthForm } from '../components/forms/FinancialHealthForm';

export const HealthCheck: React.FC = () => {
  return (
    <DashboardContainer>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Financial Health Check Syariah</h1>
        <p className="text-gray-500">Evaluate your financial standing based on Islamic principles.</p>
      </div>

      <FinancialHealthForm />
    </DashboardContainer>
  );
};
