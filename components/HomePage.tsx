// src/components/HomePage.tsx

import React from 'react';
import { UserType, InsecurityData } from '../types';
import { Utensils, Warehouse } from 'lucide-react';

interface HomePageProps {
  setUserType: (type: UserType) => void;
  insecurityStats: InsecurityData[];
}

// Calculate total available donations
const TOTAL_DONATIONS = 74; 

const HomePage: React.FC<HomePageProps> = ({ setUserType, insecurityStats }) => {
  
  // Find the stat for Canada-wide food insecurity 
  const canadaStat = insecurityStats.find(s => s.region === 'Canada') || { percent: 14.6 };

  return (
    <div className="min-h-screen bg-white text-slate-900 flex flex-col items-center justify-center p-6">
      
      {/* Hero Section */}
      <header className="text-center mb-16 max-w-4xl">
        <h1 className="text-6xl font-extrabold tracking-tight text-slate-800">
          <span className="text-emerald-500">ZERO</span> HUNGER
        </h1>
        <p className="text-xl mt-4 text-slate-600 font-medium">
          Connecting surplus food to communities that need it — in real time, with data-driven routing.
        </p>
      </header>

      {/* Two Big Choice Buttons */}
      <div className="flex flex-col md:flex-row gap-8 mb-20 w-full max-w-3xl">
        
        {/* Restaurant/Vendor Button */}
        <button
          onClick={() => setUserType(UserType.VENDOR)}
          className="flex-1 p-8 rounded-2xl bg-white border-2 border-slate-100 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 group"
        >
          <div className="flex flex-col items-center text-center">
            <Utensils className="w-12 h-12 text-slate-600 mb-3 group-hover:text-emerald-500 transition-colors" />
            <h2 className="text-2xl font-bold text-slate-800">I’m a Restaurant (Vendor)</h2>
            <p className="text-slate-500 mt-2">Post your surplus food and get a live match to a food bank.</p>
          </div>
        </button>

        {/* Food Bank/Charity Button */}
        <button
          onClick={() => setUserType(UserType.CHARITY)}
          className="flex-1 p-8 rounded-2xl bg-white border-2 border-slate-100 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 group"
        >
          <div className="flex flex-col items-center text-center">
            <Warehouse className="w-12 h-12 text-slate-600 mb-3 group-hover:text-amber-500 transition-colors" />
            <h2 className="text-2xl font-bold text-slate-800">I’m a Food Bank (Charity)</h2>
            <p className="text-slate-500 mt-2">Claim available posts and view high-need community data.</p>
          </div>
        </button>
      </div>

{/* Mission + Stats Section */}
<div className="w-full max-w-5xl text-center">
  <h2 className="text-3xl font-bold text-slate-800 mb-8 border-b-2 border-emerald-100 pb-2">Why This Matters</h2>
  <div className="grid md:grid-cols-3 gap-8">

    {/* Stat 1: Food Insecurity in Ontario */}
    <div className="p-6 bg-emerald-50 rounded-xl">
      <p className="text-5xl font-extrabold text-emerald-600">16%</p>
      <p className="text-lg font-semibold text-slate-700 mt-2">
        of Ontario households are food insecure.
      </p>
      <p className="text-sm text-slate-500 mt-1">
        That’s over 2.3 million people — including 1 in 5 children.
      </p>
    </div>

    {/* Stat 2: Food Waste in Canada */}
    <div className="p-6 bg-emerald-50 rounded-xl">
      <p className="text-5xl font-extrabold text-slate-800">46%</p>
      <p className="text-lg font-semibold text-slate-700 mt-2">
        of all food in Canada is wasted each year.
      </p>
      <p className="text-sm text-slate-500 mt-1">
        Over half of this wasted food is edible and could be rescued.
      </p>
    </div>

    {/* Stat 3: Food Bank Demand */}
    <div className="p-6 bg-emerald-50 rounded-xl">
      <p className="text-5xl font-extrabold text-amber-600">2.2M</p>
      <p className="text-lg font-semibold text-slate-700 mt-2">
        food bank visits in March 2025 alone.
      </p>
      <p className="text-sm text-slate-500 mt-1">
        Demand is rising faster than food banks can meet it.
      </p>
    </div>

  </div>
</div>

      {/* Simple Footer */}
      <footer className="w-full max-w-5xl mt-16 pt-8 border-t border-slate-100 text-center text-sm text-slate-400">
        <p>Zero Hunger · Data Sources: Food Banks Canada, Statistics Canada</p>
      </footer>
    </div>
  );
};

export default HomePage;