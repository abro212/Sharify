import React, { useState } from 'react';
import { DashboardContainer } from '../components/layout/DashboardContainer';
import { ZakatCalculatorContent } from '../components/calculators/ZakatCalculatorContent';
import { FaraidhCalculator } from '../components/calculators/FaraidhCalculator';
import { RequireRole } from '../components/auth/RequireRole';
import { Calculator, Scale } from 'lucide-react';

type ActiveTool = 'zakat' | 'faraidh';

export const ZakatCalculator: React.FC = () => {
  const [activeTool, setActiveTool] = useState<ActiveTool>('zakat');

  return (
    <DashboardContainer pageTitle="Kalkulator Zakat & Faraidh">
      <div className="space-y-6">
        {/* Header Section */}
        <div className="mb-8">
          <h1 className="text-2xl font-extrabold text-slate-900 mb-2">Zakat & Faraidh</h1>
          <p className="text-sm text-slate-500">Hitung kewajiban zakat dan pelajari hak waris sesuai syariah dengan mudah.</p>
        </div>
        
        {/* Master Toggle - Pill Shape */}
        <div className="flex bg-slate-100 dark:bg-slate-800 rounded-2xl p-1.5 mb-8 shadow-inner">
          <button
            onClick={() => setActiveTool('zakat')}
            className={`flex-1 flex items-center justify-center py-2.5 px-4 text-sm font-bold rounded-xl transition-all duration-300 ${
              activeTool === 'zakat' 
                ? 'bg-white text-emerald-600 shadow-[0_2px_10px_rgb(0,0,0,0.05)]' 
                : 'text-slate-500 hover:text-slate-700'
            }`}
          >
            <Calculator className="w-4 h-4 mr-2" />
            Zakat
          </button>
          <button
            onClick={() => setActiveTool('faraidh')}
            className={`flex-1 flex items-center justify-center py-2.5 px-4 text-sm font-bold rounded-xl transition-all duration-300 ${
              activeTool === 'faraidh' 
                ? 'bg-white text-emerald-600 shadow-[0_2px_10px_rgb(0,0,0,0.05)]' 
                : 'text-slate-500 hover:text-slate-700'
            }`}
          >
            <Scale className="w-4 h-4 mr-2" />
            Faraidh
          </button>
        </div>

        {/* Content Section */}
        <div className="animate-fade-in">
          {activeTool === 'zakat' ? (
            <ZakatCalculatorContent />
          ) : (
            <RequireRole 
              allowedRoles={['family', 'admin']} 
              fallbackMessage="Simulator Faraidh (Waris) adalah fitur lanjutan yang tersedia eksklusif pada paket Family."
            >
              <FaraidhCalculator />
            </RequireRole>
          )}
        </div>
      </div>
    </DashboardContainer>
  );
};
