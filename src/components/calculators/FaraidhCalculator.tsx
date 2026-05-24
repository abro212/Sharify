import React, { useState, useEffect } from 'react';
import { AlertTriangle, Users, Calculator } from 'lucide-react';

export const FaraidhCalculator: React.FC = () => {
  // Estate State
  const [totalAssets, setTotalAssets] = useState<number>(0);
  const [debts, setDebts] = useState<number>(0);
  const [wasiat, setWasiat] = useState<number>(0);

  // Heirs State
  const [deceasedGender, setDeceasedGender] = useState<'male' | 'female'>('male');
  const [spouseAlive, setSpouseAlive] = useState(false);
  const [numberOfWives, setNumberOfWives] = useState<number>(1);
  const [fatherAlive, setFatherAlive] = useState(false);
  const [motherAlive, setMotherAlive] = useState(false);
  const [sons, setSons] = useState<number>(0);
  const [daughters, setDaughters] = useState<number>(0);

  // Derived Estate Logic
  const remainingAfterDebts = Math.max(0, totalAssets - debts);
  const maxWasiatAllowed = remainingAfterDebts / 3;
  const isWasiatValid = wasiat <= maxWasiatAllowed;
  const distributableEstate = isWasiatValid ? Math.max(0, remainingAfterDebts - wasiat) : remainingAfterDebts;

  // Distribution State
  const [distribution, setDistribution] = useState<{
    heir: string;
    fractionStr: string;
    amount: number;
    notes?: string;
  }[]>([]);

  // Calculation Engine
  useEffect(() => {
    if (distributableEstate <= 0 || !isWasiatValid) {
      setDistribution([]);
      return;
    }

    const hasChildren = sons > 0 || daughters > 0;
    let allocations: { heir: string; share: number; fractionStr: string; notes?: string }[] = [];
    
    // 1. Spousal Share
    let spouseShare = 0;
    if (spouseAlive) {
      if (deceasedGender === 'male') {
        // Wife (or Wives) get 1/8 if children, 1/4 if no children
        spouseShare = hasChildren ? 1/8 : 1/4;
        allocations.push({
          heir: numberOfWives > 1 ? `Wives (${numberOfWives})` : 'Wife',
          share: spouseShare,
          fractionStr: hasChildren ? '1/8' : '1/4',
          notes: numberOfWives > 1 ? 'Share divided equally among wives' : ''
        });
      } else {
        // Husband gets 1/4 if children, 1/2 if no children
        spouseShare = hasChildren ? 1/4 : 1/2;
        allocations.push({
          heir: 'Husband',
          share: spouseShare,
          fractionStr: hasChildren ? '1/4' : '1/2'
        });
      }
    }

    // 2. Parents' Share
    let fatherShare = 0;
    let motherShare = 0;

    if (motherAlive) {
      // Mother gets 1/6 if children exist (simplified, omitting sibling rule)
      // If no children, 1/3.
      motherShare = hasChildren ? 1/6 : 1/3;
      allocations.push({
        heir: 'Mother',
        share: motherShare,
        fractionStr: hasChildren ? '1/6' : '1/3'
      });
    }

    if (fatherAlive) {
      if (hasChildren) {
        // Father gets 1/6 if children exist
        fatherShare = 1/6;
        allocations.push({
          heir: 'Father',
          share: fatherShare,
          fractionStr: '1/6',
          notes: sons === 0 ? '+ Asabah (Residue)' : ''
        });
      }
    }

    // Calculate fixed shares allocated so far
    let fixedSharesTotal = spouseShare + fatherShare + motherShare;
    let residue = Math.max(0, 1 - fixedSharesTotal);

    // 3. Children's Share ('Asabah)
    if (hasChildren) {
      if (sons > 0) {
        // Asabah Bil Ghair: Sons and Daughters take the residue. Ratio 2:1
        const totalParts = (sons * 2) + daughters;
        const partValue = residue / totalParts;

        if (sons > 0) {
          allocations.push({
            heir: `Sons (${sons})`,
            share: partValue * 2 * sons,
            fractionStr: 'Residue (2 parts/son)',
            notes: 'Divided equally among sons'
          });
        }
        if (daughters > 0) {
          allocations.push({
            heir: `Daughters (${daughters})`,
            share: partValue * daughters,
            fractionStr: 'Residue (1 part/daughter)',
            notes: 'Divided equally among daughters'
          });
        }
        residue = 0; // Residue consumed
      } else if (daughters > 0 && sons === 0) {
        // Daughters take fixed share if no sons: 1/2 for one, 2/3 for multiple
        const daughtersShare = daughters === 1 ? 1/2 : 2/3;
        // However, if the residue is smaller than their fixed share (Awl scenario), 
        // they take the remaining residue in this simplified MVP.
        const actualShare = Math.min(residue, daughtersShare);
        allocations.push({
          heir: `Daughters (${daughters})`,
          share: actualShare,
          fractionStr: daughters === 1 ? '1/2' : '2/3',
          notes: 'Divided equally among daughters'
        });
        residue = Math.max(0, residue - actualShare);
      }
    }

    // 4. Father Asabah (if no sons and residue remains)
    if (fatherAlive && residue > 0) {
      // Find father in allocations and add residue
      const fatherIndex = allocations.findIndex(a => a.heir === 'Father');
      if (fatherIndex !== -1) {
        allocations[fatherIndex].share += residue;
        residue = 0;
      } else {
        allocations.push({
          heir: 'Father',
          share: residue,
          fractionStr: 'Asabah (Residue)'
        });
        residue = 0;
      }
    }

    // 5. Remaining Residue (Baitul Mal / Radd - Simplified)
    if (residue > 0.001) {
      allocations.push({
        heir: 'Baitul Mal / Radd (Unallocated Residue)',
        share: residue,
        fractionStr: 'Remainder',
        notes: 'Consult an Ustadz for Radd distribution rules.'
      });
    }

    // Format the final array
    const formattedDistribution = allocations.map(a => ({
      ...a,
      amount: a.share * distributableEstate
    })).filter(a => a.amount > 0);

    setDistribution(formattedDistribution);

  }, [distributableEstate, isWasiatValid, deceasedGender, spouseAlive, numberOfWives, fatherAlive, motherAlive, sons, daughters]);


  return (
    <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
      {/* Left Column: Inputs */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 space-y-8">
        
        {/* Estate Section */}
        <div>
          <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
            <Calculator className="h-5 w-5 mr-2 text-primary" />
            1. The Estate
          </h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Total Assets (Rp)</label>
              <input
                type="number"
                value={totalAssets || ''}
                onChange={(e) => setTotalAssets(Number(e.target.value))}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Debts & Funeral Costs (Rp)</label>
              <input
                type="number"
                value={debts || ''}
                onChange={(e) => setDebts(Number(e.target.value))}
                className="w-full px-4 py-2 border border-red-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:outline-none"
              />
              <p className="text-xs text-red-500 mt-1">Debts must be settled before inheritance.</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Bequests / Wasiat (Rp)</label>
              <input
                type="number"
                value={wasiat || ''}
                onChange={(e) => setWasiat(Number(e.target.value))}
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:outline-none ${
                  !isWasiatValid ? 'border-red-500 focus:ring-red-500 bg-red-50' : 'border-gray-300 focus:ring-primary'
                }`}
              />
              {!isWasiatValid ? (
                <p className="text-xs text-red-600 mt-1 font-medium flex items-center">
                  <AlertTriangle className="h-3 w-3 mr-1" /> Wasiat cannot exceed 1/3 of the estate after debts (Max: Rp {Math.round(maxWasiatAllowed).toLocaleString('id-ID')}).
                </p>
              ) : (
                <p className="text-xs text-gray-500 mt-1">Cannot exceed 1/3 of remaining estate.</p>
              )}
            </div>
          </div>
        </div>

        {/* Heirs Section */}
        <div className="pt-6 border-t border-gray-100">
          <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
            <Users className="h-5 w-5 mr-2 text-accent" />
            2. Surviving Primary Heirs
          </h2>
          
          <div className="space-y-4">
            {/* Deceased Gender */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Gender of the Deceased</label>
              <div className="flex space-x-4">
                <label className="flex items-center">
                  <input type="radio" checked={deceasedGender === 'male'} onChange={() => setDeceasedGender('male')} className="text-primary focus:ring-primary" />
                  <span className="ml-2 text-sm">Male</span>
                </label>
                <label className="flex items-center">
                  <input type="radio" checked={deceasedGender === 'female'} onChange={() => setDeceasedGender('female')} className="text-primary focus:ring-primary" />
                  <span className="ml-2 text-sm">Female</span>
                </label>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 pt-2">
              {/* Spouse */}
              <div className="col-span-2 sm:col-span-1 p-3 border border-gray-200 rounded-lg">
                <label className="flex items-center space-x-2">
                  <input type="checkbox" checked={spouseAlive} onChange={(e) => setSpouseAlive(e.target.checked)} className="text-primary rounded" />
                  <span className="text-sm font-medium">Surviving {deceasedGender === 'male' ? 'Wife' : 'Husband'}</span>
                </label>
                {spouseAlive && deceasedGender === 'male' && (
                  <div className="mt-2 ml-6">
                    <label className="text-xs text-gray-500 block mb-1">Number of Wives</label>
                    <input type="number" min="1" max="4" value={numberOfWives} onChange={(e) => setNumberOfWives(Number(e.target.value))} className="w-16 px-2 py-1 border rounded text-sm" />
                  </div>
                )}
              </div>

              {/* Parents */}
              <div className="col-span-2 sm:col-span-1 p-3 border border-gray-200 rounded-lg space-y-2">
                <label className="flex items-center space-x-2">
                  <input type="checkbox" checked={fatherAlive} onChange={(e) => setFatherAlive(e.target.checked)} className="text-primary rounded" />
                  <span className="text-sm font-medium">Surviving Father</span>
                </label>
                <label className="flex items-center space-x-2">
                  <input type="checkbox" checked={motherAlive} onChange={(e) => setMotherAlive(e.target.checked)} className="text-primary rounded" />
                  <span className="text-sm font-medium">Surviving Mother</span>
                </label>
              </div>

              {/* Children */}
              <div className="col-span-2 p-3 border border-gray-200 rounded-lg grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Number of Sons</label>
                  <input type="number" min="0" value={sons} onChange={(e) => setSons(Number(e.target.value))} className="w-full px-3 py-2 border border-gray-300 rounded-lg" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Number of Daughters</label>
                  <input type="number" min="0" value={daughters} onChange={(e) => setDaughters(Number(e.target.value))} className="w-full px-3 py-2 border border-gray-300 rounded-lg" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right Column: Results */}
      <div className="bg-gradient-to-br from-[#0F4C3A] to-[#1a6650] rounded-xl shadow-lg p-6 sm:p-8 text-white h-full relative overflow-hidden">
        {/* Decorative element */}
        <div className="absolute -top-12 -right-12 w-40 h-40 bg-accent/20 rounded-full blur-2xl pointer-events-none"></div>

        <div className="relative z-10 flex flex-col h-full">
          <div>
            <h2 className="text-xl font-bold text-accent mb-6">Faraidh Distribution</h2>
            
            {/* Disclaimer */}
            <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-4 mb-6 flex items-start">
              <AlertTriangle className="h-5 w-5 text-yellow-500 mr-3 flex-shrink-0 mt-0.5" />
              <div className="text-sm text-yellow-100/90 leading-relaxed">
                <span className="font-semibold text-yellow-500">Educational Simulation.</span> Faraidh involves complex blocking rules (Hijab), Awl, and Radd not fully covered here. Always consult a certified Islamic Scholar for official distribution.
              </div>
            </div>

            {/* Estate Summary */}
            <div className="grid grid-cols-2 gap-4 mb-8 p-4 bg-white/5 rounded-lg border border-white/10">
              <div>
                <p className="text-xs text-gray-300">Net Estate (After Debts)</p>
                <p className="font-semibold">Rp {Math.round(remainingAfterDebts).toLocaleString('id-ID')}</p>
              </div>
              <div>
                <p className="text-xs text-gray-300">Distributable Estate</p>
                <p className="font-semibold text-accent">Rp {Math.round(distributableEstate).toLocaleString('id-ID')}</p>
              </div>
            </div>

            {/* Breakdown */}
            {!isWasiatValid ? (
              <div className="text-center py-8">
                <p className="text-red-300">Wasiat validation failed. Adjust inputs to see distribution.</p>
              </div>
            ) : distributableEstate === 0 ? (
              <div className="text-center py-8">
                <p className="text-gray-300 italic">No distributable estate remaining after debts and wasiat.</p>
              </div>
            ) : distribution.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-gray-300 italic">Please select the surviving heirs to see the distribution.</p>
              </div>
            ) : (
              <div className="space-y-4">
                <h3 className="text-sm font-medium text-gray-300 uppercase tracking-wider mb-2 border-b border-white/10 pb-2">Heir Allocation</h3>
                {distribution.map((item, idx) => (
                  <div key={idx} className="bg-white/10 rounded-lg p-4 flex justify-between items-center border border-white/5">
                    <div>
                      <p className="font-bold text-lg">{item.heir}</p>
                      <p className="text-xs text-accent mt-1">{item.fractionStr}</p>
                      {item.notes && <p className="text-xs text-gray-400 mt-1 italic">{item.notes}</p>}
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-xl font-mono">Rp {Math.round(item.amount).toLocaleString('id-ID')}</p>
                      <p className="text-xs text-gray-300 mt-1">{Math.round((item.amount / distributableEstate) * 100)}% of distributable</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
