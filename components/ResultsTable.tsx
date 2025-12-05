
import React from 'react';
import { CalculationResult, UserSettings } from '../types';
import { Droplet, Scale, AlertTriangle, Percent } from 'lucide-react';

interface ResultsTableProps {
  result: CalculationResult;
  settings: UserSettings;
}

export const ResultsTable: React.FC<ResultsTableProps> = ({ result, settings }) => {
  if (!result.possible) {
    return (
      <div className="p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-3 text-red-700">
        <AlertTriangle className="shrink-0" />
        <div>
           <p className="font-bold">Erreur de dosage</p>
           <p className="text-sm">{result.error}</p>
        </div>
      </div>
    );
  }

  const { bases, targetRatio, boosterRatio, aromaRatio } = settings;
  const finalPg = Math.round(result.finalPg);
  const finalVg = Math.round(result.finalVg);
  const isRatioOff = Math.abs(finalPg - targetRatio.pg) > 1;

  // Build rows dynamically based on available bases
  const rows = [];
  
  if (result.base1Volume > 0.01) {
    rows.push({ 
      label: bases[0].name, 
      ratio: `${bases[0].ratio.pg}/${bases[0].ratio.vg}`,
      vol: result.base1Volume, 
      weight: result.base1Weight, 
      color: 'bg-slate-400' 
    });
  }
  
  if (bases.length > 1 && result.base2Volume > 0.01) {
    rows.push({ 
      label: bases[1].name, 
      ratio: `${bases[1].ratio.pg}/${bases[1].ratio.vg}`,
      vol: result.base2Volume, 
      weight: result.base2Weight, 
      color: 'bg-slate-500' 
    });
  }

  rows.push({ 
    label: 'Booster Nicotine', 
    ratio: `${boosterRatio.pg}/${boosterRatio.vg}`,
    vol: result.boosterVolume, 
    weight: result.boosterWeight, 
    color: 'bg-rose-500' 
  });
  
  rows.push({ 
    label: 'Arôme', 
    ratio: `${aromaRatio.pg}/${aromaRatio.vg}`,
    vol: result.aromaVolume, 
    weight: result.aromaWeight, 
    color: 'bg-indigo-500' 
  });

  const totalVol = rows.reduce((acc, curr) => acc + curr.vol, 0);
  const totalWeight = rows.reduce((acc, curr) => acc + curr.weight, 0);

  return (
    <div>
      {(result.warning || isRatioOff) && (
        <div className="mb-4 p-4 bg-amber-50 border border-amber-200 rounded-lg flex flex-col gap-2 text-amber-800">
          <div className="flex items-center gap-3">
            <AlertTriangle className="shrink-0 text-amber-600" />
            <p className="font-bold text-amber-900">Attention : Ratio approximatif</p>
          </div>
          <div className="ml-9 text-sm">
             {result.warning && <p className="mb-2">{result.warning}</p>}
             {isRatioOff && (
               <div className="bg-white/50 p-2 rounded border border-amber-100 inline-block">
                 <div className="grid grid-cols-2 gap-x-4 gap-y-1">
                    <span className="text-slate-600">Ratio Cible :</span>
                    <span className="font-mono font-bold">{targetRatio.pg}PG / {targetRatio.vg}VG</span>
                    <span className="text-amber-700">Ratio Obtenu :</span>
                    <span className="font-mono font-bold text-amber-700">{finalPg}PG / {finalVg}VG</span>
                 </div>
               </div>
             )}
          </div>
        </div>
      )}

      <div className="overflow-hidden rounded-xl border border-slate-200">
        <table className="w-full text-sm text-left text-slate-600">
          <thead className="text-xs text-slate-700 uppercase bg-slate-50 border-b border-slate-200">
            <tr>
              <th className="px-6 py-3 font-semibold">Ingrédient</th>
              <th className="px-6 py-3 font-semibold text-center hidden sm:table-cell">
                <div className="flex items-center justify-center gap-1">
                  <Percent size={14} /> Ratio
                </div>
              </th>
              <th className="px-6 py-3 font-semibold text-right flex items-center justify-end gap-1">
                <Droplet size={14} /> Volume (ml)
              </th>
              <th className="px-6 py-3 font-semibold text-right">
               <div className="flex items-center justify-end gap-1">
                <Scale size={14} /> Poids (g)
               </div>
              </th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.label} className="bg-white border-b border-slate-100 last:border-0 hover:bg-slate-50 transition-colors">
                <td className="px-6 py-4 font-medium text-slate-900 flex items-center gap-2">
                  <span className={`w-3 h-3 rounded-full ${row.color}`}></span>
                  {row.label}
                  <span className="sm:hidden text-xs text-slate-400 font-normal ml-1">({row.ratio})</span>
                </td>
                <td className="px-6 py-4 text-center font-mono text-slate-500 hidden sm:table-cell">
                  {row.ratio}
                </td>
                <td className="px-6 py-4 text-right font-mono text-indigo-600 font-bold">
                  {row.vol.toFixed(1)}
                </td>
                <td className="px-6 py-4 text-right font-mono text-slate-500">
                  {row.weight.toFixed(1)}
                </td>
              </tr>
            ))}
            <tr className="bg-slate-50 font-bold">
               <td className="px-6 py-4 text-slate-900 sm:col-span-2 col-span-1">TOTAL</td>
               <td className="hidden sm:table-cell"></td>
               <td className="px-6 py-4 text-right text-indigo-700">{totalVol.toFixed(1)} ml</td>
               <td className="px-6 py-4 text-right text-slate-700">{totalWeight.toFixed(1)} g</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};
