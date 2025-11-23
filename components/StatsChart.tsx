import React from 'react';
import { InsecurityData } from '../types';
import { TrendingUp, TrendingDown, Minus, AlertTriangle } from 'lucide-react';

interface StatsChartProps {
  data: InsecurityData[];
}

const StatsChart: React.FC<StatsChartProps> = ({ data }) => {
  const sortedData = [...data].sort((a, b) => b.percent - a.percent);

  const getRiskLevel = (percent: number) => {
    if (percent > 30) return { label: 'CRITICAL', color: 'text-red-600 bg-red-100', bar: 'bg-red-500' };
    if (percent > 25) return { label: 'HIGH', color: 'text-orange-600 bg-orange-100', bar: 'bg-orange-500' };
    if (percent > 20) return { label: 'MODERATE', color: 'text-yellow-600 bg-yellow-100', bar: 'bg-yellow-500' };
    return { label: 'STABLE', color: 'text-emerald-600 bg-emerald-100', bar: 'bg-emerald-500' };
  };

  return (
    <div className="glass-panel rounded-2xl p-8 shadow-sm border border-slate-200 h-full overflow-y-auto">
      <div className="flex justify-between items-end mb-8">
        <div>
          <h2 className="text-3xl font-bold text-slate-900 mb-2">Risk Monitor</h2>
          <p className="text-slate-500">Real-time analysis of household food insecurity by region.</p>
        </div>
        <button className="text-xs font-bold text-slate-500 bg-slate-100 px-3 py-1 rounded-lg hover:bg-slate-200 transition">
          Download CSV
        </button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {sortedData.map((region, idx) => {
          const risk = getRiskLevel(region.percent);
          return (
            <div key={idx} className="bg-white p-5 rounded-xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden">
              {/* Risk Bar Top */}
              <div className={`absolute top-0 left-0 right-0 h-1.5 ${risk.bar}`}></div>
              
              <div className="flex justify-between items-start mb-4">
                <span className={`text-[10px] font-black tracking-widest px-2 py-1 rounded ${risk.color}`}>
                  {risk.label} RISK
                </span>
                {region.trend === 'Higher' && <TrendingUp className="w-4 h-4 text-red-500" />}
                {region.trend === 'Lower' && <TrendingDown className="w-4 h-4 text-emerald-500" />}
                {region.trend === 'Stable' && <Minus className="w-4 h-4 text-slate-400" />}
              </div>

              <h3 className="text-lg font-bold text-slate-900 mb-1 leading-snug min-h-[3.5rem]">
                {region.region.replace(' Public Health', '').replace(' Health Unit', '')}
              </h3>

              <div className="flex items-end justify-between mt-4">
                <div>
                  <p className="text-3xl font-black text-slate-900">{region.percent}%</p>
                  <p className="text-xs text-slate-400 font-medium mt-1">Insecurity Rate</p>
                </div>
                <div className="w-12 h-12 rounded-full border-4 border-slate-100 flex items-center justify-center">
                   <AlertTriangle className={`w-5 h-5 ${region.percent > 25 ? 'text-red-400' : 'text-slate-300'}`} />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default StatsChart;