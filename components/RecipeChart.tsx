
import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { CalculationResult, BaseDefinition } from '../types';

interface RecipeChartProps {
  result: CalculationResult;
  bases: BaseDefinition[];
}

export const RecipeChart: React.FC<RecipeChartProps> = ({ result, bases }) => {
  const data = [
    { name: bases[0].name, value: result.base1Volume, color: '#94a3b8' }, // Slate 400
    { name: bases.length > 1 ? bases[1].name : 'Base 2', value: result.base2Volume, color: '#64748b' }, // Slate 500
    { name: 'Booster', value: result.boosterVolume, color: '#f43f5e' }, // Rose 500
    { name: 'Arôme', value: result.aromaVolume, color: '#6366f1' }, // Indigo 500
  ].filter(d => d.value > 0.1); // Filter out negligible amounts

  const pgVgData = [
    { name: 'PG', value: result.finalPg, color: '#3b82f6' }, // Blue 500
    { name: 'VG', value: result.finalVg, color: '#ec4899' }, // Pink 500
  ];

  if (!result.possible && !result.error) return null;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-4 flex flex-col items-center h-80">
        <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Composition du mélange</h4>
        <div className="w-full h-full">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart margin={{ top: 0, right: 0, bottom: 20, left: 0 }}>
              <Pie
                data={data}
                cx="50%"
                cy="45%"
                innerRadius={50}
                outerRadius={70}
                paddingAngle={4}
                dataKey="value"
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip 
                formatter={(value: number) => `${value.toFixed(1)} ml`}
                contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} 
              />
              <Legend verticalAlign="bottom" wrapperStyle={{ paddingTop: '20px', fontSize: '12px' }}/>
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-4 flex flex-col items-center h-80">
        <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Ratio Final PG/VG</h4>
        <div className="w-full h-full relative">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart margin={{ top: 0, right: 0, bottom: 20, left: 0 }}>
              <Pie
                data={pgVgData}
                cx="50%"
                cy="45%"
                startAngle={180}
                endAngle={0}
                innerRadius={50}
                outerRadius={70}
                paddingAngle={2}
                dataKey="value"
              >
                {pgVgData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip 
                formatter={(value: number) => `${value.toFixed(1)}%`}
                contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
              />
              <Legend verticalAlign="bottom" wrapperStyle={{ paddingTop: '20px', fontSize: '12px' }} />
            </PieChart>
          </ResponsiveContainer>
          <div className="absolute top-[40%] left-0 right-0 text-center pointer-events-none">
             <span className="text-xl font-bold text-slate-700">{result.finalPg.toFixed(0)}/{result.finalVg.toFixed(0)}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
