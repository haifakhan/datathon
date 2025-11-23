// src/components/CharityPanel.tsx

import React from 'react';
import { InsecurityData } from '../types';
import { Plus, BarChart3, TrendingUp } from 'lucide-react';

interface CharityPanelProps {
  topInsecurity: InsecurityData[];
}

const CharityPanel: React.FC<CharityPanelProps> = ({ topInsecurity }) => {
  
  // Function to handle the form submission (keep it simple for the hackathon)
  const handleSubmitRequest = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // In a real app, this would send data to the backend
    alert('Food Request Submitted! Waiting for a match...');
  };

  return (
    <div className="space-y-6">
      
      {/* 1. Request Food Items - Submission Form (Soft Peach background) */}
      <div className="glass-panel rounded-2xl p-6 shadow-lg border border-amber-100 bg-amber-50">
        <h2 className="text-xl font-bold text-amber-700 flex items-center gap-2 mb-4">
          <Plus className="w-5 h-5" /> Submit Food Request
        </h2>
        <form onSubmit={handleSubmitRequest} className="space-y-3">
          <input
            type="text"
            placeholder="Item Needed (e.g., Canned Tuna, Diapers)"
            className="w-full p-3 rounded-lg border border-amber-200 focus:ring-amber-500 focus:border-amber-500"
            required
          />
          <div className="flex gap-3">
            <input
              type="number"
              placeholder="Quantity (units)"
                min="1"
              className="w-1/2 p-3 rounded-lg border border-amber-200 focus:ring-amber-500 focus:border-amber-500"
              required
            />
            <select
              className="w-1/2 p-3 rounded-lg border border-amber-200 bg-white focus:ring-amber-500 focus:border-amber-500"
              required
            >
              <option value="">Urgency Level</option>
              <option value="High">High (Critical)</option>
              <option value="Medium">Medium</option>
              <option value="Low">Low</option>
            </select>
          </div>
          <button
            type="submit"
            className="w-full p-3 rounded-lg bg-amber-500 text-white font-bold hover:bg-amber-600 transition-colors shadow-md"
          >
            Submit Request
          </button>
        </form>
      </div>
      
      {/* 2. Analytics (High-need regions) - Existing logic moved here */}
      <div className="glass-panel rounded-2xl p-6 shadow-sm border border-slate-200 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-emerald-500" /> High-Need Regions
            </h2>
            <p className="text-sm text-slate-500">Prioritize drop-offs based on food insecurity data.</p>
          </div>
        </div>
        <div className="space-y-3">
          {topInsecurity.map((region) => (
            <div
              key={region.region}
              className="p-3 rounded-xl border border-slate-100 bg-white flex items-center justify-between shadow-sm"
            >
              <div>
                <p className="text-sm font-bold text-slate-900">{region.region}</p>
                <p className="text-xs text-slate-500">Food insecure households</p>
              </div>
              <div className="text-right">
                <p className="text-xl font-black text-red-600">{region.percent}%</p>
                <p className="text-[11px] text-slate-400 flex items-center gap-1 justify-end">
                  {region.trend === 'Higher' && <TrendingUp className="w-3 h-3 text-red-500" />}
                  {region.trend} trend
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
      
      {/* Tip Card */}
      <div className="p-4 rounded-xl bg-gradient-to-r from-emerald-500 to-emerald-600 text-white shadow-lg">
        <p className="text-sm font-semibold">Coordination Tip</p>
        <p className="text-sm opacity-90">
          Cross-check live posts, then call ahead to coordinate volunteers before claiming a donation.
        </p>
      </div>
    </div>
  );
};

export default CharityPanel;