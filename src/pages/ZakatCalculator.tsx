import React, { useState } from 'react';
import { DashboardContainer } from '../components/layout/DashboardContainer';
import { ZakatCalculatorContent } from '../components/calculators/ZakatCalculatorContent';
import { FaraidhCalculator } from '../components/calculators/FaraidhCalculator';

import { RequireRole } from '../components/auth/RequireRole';

type ActiveTool = 'zakat' | 'faraidh';

export const ZakatCalculator: React.FC = () => {
  const [activeTool, setActiveTool] = useState<ActiveTool>('zakat');

  return (
    <DashboardContainer>
      <div className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Zakat & Faraidh</h1>
          <p className="text-gray-500">Calculate your obligations and understand your inheritance rights.</p>
        </div>
        
        {/* Master Toggle */}
        <div className="flex bg-white rounded-lg shadow-sm border border-gray-200 p-1">
          <button
            onClick={() => setActiveTool('zakat')}
            className={`px-6 py-2 text-sm font-medium rounded-md transition-colors ${
              activeTool === 'zakat' ? 'bg-primary text-white shadow-sm' : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Zakat Calculator
          </button>
          <button
            onClick={() => setActiveTool('faraidh')}
            className={`px-6 py-2 text-sm font-medium rounded-md transition-colors ${
              activeTool === 'faraidh' ? 'bg-primary text-white shadow-sm' : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Faraidh Simulator
          </button>
        </div>
      </div>

      {/* Conditionally Render the Active Tool */}
      {activeTool === 'zakat' ? (
        <ZakatCalculatorContent />
      ) : (
        <RequireRole 
          allowedRoles={['family', 'admin']} 
          fallbackMessage="The Faraidh (Inheritance) Simulator is a highly advanced tool available on the Family Plan."
        >
          <FaraidhCalculator />
        </RequireRole>
      )}
      
    </DashboardContainer>
  );
};
