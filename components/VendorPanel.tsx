import React, { useState, useEffect, useMemo } from 'react';
import { FoodBank, DonationPost } from '../types';
import { MapPin, Clock, ArrowRight, Tag, Scale, DollarSign, CheckCircle2 } from 'lucide-react';
import { getDonationSuggestion } from '../services/geminiService';
import { calculateDistance } from '../services/geoUtils';

interface VendorPanelProps {
  foodBanks: FoodBank[];
  addPost: (post: DonationPost) => void;
  userLocation: { lat: number; lng: number } | null;
}

const VendorPanel: React.FC<VendorPanelProps> = ({ foodBanks, addPost, userLocation }) => {
  const [restaurantName, setRestaurantName] = useState('Maple Leaf Kitchen');
  const [restaurantAddress, setRestaurantAddress] = useState('123 Main St, Toronto');
  const [category, setCategory] = useState('Raw Ingredients');
  const [foodDetails, setFoodDetails] = useState('');
  const [quantity, setQuantity] = useState<number>(1);
  const [unit, setUnit] = useState('kg');
  const [expiryHours, setExpiryHours] = useState(24);
  const [suggestion, setSuggestion] = useState<string | null>(null);
  const [loadingAI, setLoadingAI] = useState(false);

  // Calculate nearby banks dynamically based on user location
  const nearbyBanks = useMemo(() => {
    if (!userLocation) return [];
    
    return foodBanks
      .map(b => ({ 
        ...b, 
        distance: calculateDistance(userLocation.lat, userLocation.lng, b.latitude, b.longitude) 
      }))
      .sort((a, b) => (a.distance || 0) - (b.distance || 0))
      .slice(0, 3);
  }, [foodBanks, userLocation]);

  const handleGetSuggestion = async () => {
    if (!foodDetails || quantity <= 0) return;
    setLoadingAI(true);
    const fullDesc = `${quantity}${unit} of ${category} - ${foodDetails}`;
    const result = await getDonationSuggestion(fullDesc, `${quantity}${unit}`, nearbyBanks);
    setSuggestion(result);
    setLoadingAI(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!userLocation) {
      alert("Waiting for location...");
      return;
    }

    const newPost: DonationPost = {
      id: Math.random().toString(36).substr(2, 9),
      vendorName: "Current User Vendor",
      vendorName: restaurantName,
      vendorAddress: restaurantAddress,
      foodType: `${category}: ${foodDetails}`,
      quantity: `${quantity} ${unit}`,
      expiry: `${expiryHours} hours`,
      latitude: userLocation.lat,
      longitude: userLocation.lng,
      timestamp: Date.now(),
      status: 'available',
      targetCommunity: nearbyBanks[0]?.name || "General Pool"
    };
    addPost(newPost);
    
    // Reset
    setFoodDetails('');
    setQuantity(1);
    setSuggestion(null);
    alert("Donation broadcasted successfully!");
  };

  return (
    <div className="glass-panel rounded-2xl p-6 shadow-sm border border-slate-200 h-full overflow-y-auto flex flex-col">
      <div className="mb-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold text-slate-900">Broadcast Surplus</h2>
          <span className="bg-blue-100 text-blue-700 text-[10px] font-bold px-2 py-1 rounded-full flex items-center">
            <CheckCircle2 className="w-3 h-3 mr-1" /> VERIFIED VENDOR
          </span>
        </div>
        <p className="text-slate-500 text-sm mt-1">Connect instantly with the nearest shelters.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5 flex-1">
        <div>
          <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Restaurant Name</label>
          <input 
            type="text" 
            className="w-full p-3 bg-white border border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 focus:ring-2 focus:ring-emerald-500 focus:outline-none transition-all"
            placeholder="e.g., The Italian Kitchen"
            value={restaurantName}
            onChange={(e) => setRestaurantName(e.target.value)}
            required
          />
        </div>

        {/* --- NEW: Address Input --- */}
        <div>
          <label className="block text-xs font-bold text-slate-500 uppercase mb-2 flex items-center">
            <MapPin className="w-3.5 h-3.5 mr-1" /> Pickup Address
          </label>
          <input 
            type="text" 
            className="w-full p-3 bg-white border border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 focus:ring-2 focus:ring-emerald-500 focus:outline-none transition-all"
            placeholder="e.g., 123 Front St West, Toronto"
            value={restaurantAddress}
            onChange={(e) => setRestaurantAddress(e.target.value)}
            required
          />
        </div>

        {/* Category Selection */}
        <div>
          <label className="block text-xs font-bold text-slate-500 uppercase mb-2 flex items-center">
            <Tag className="w-3.5 h-3.5 mr-1" /> Food Category
          </label>
          <select 
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full p-3 bg-white border border-slate-200 rounded-xl text-slate-900 font-medium focus:ring-2 focus:ring-emerald-500 focus:outline-none"
          >
            <option>Raw Ingredients</option>
            <option>Prepared Meals</option>
            <option>Bakery & Bread</option>
            <option>Dairy Products</option>
            <option>Canned Goods</option>
          </select>
        </div>

        {/* Quantity & Unit */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase mb-2 flex items-center">
              <Scale className="w-3.5 h-3.5 mr-1" /> Quantity
            </label>
            <input 
              type="number" 
              min="1"
              max="500"
              className="w-full p-3 bg-white border border-slate-200 rounded-xl text-slate-900 font-bold focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              value={quantity}
              onChange={(e) => setQuantity(parseInt(e.target.value))}
              required
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Unit</label>
            <select 
              value={unit}
              onChange={(e) => setUnit(e.target.value)}
              className="w-full p-3 bg-white border border-slate-200 rounded-xl text-slate-900 font-medium focus:ring-2 focus:ring-emerald-500 focus:outline-none"
            >
              <option>kg</option>
              <option>lbs</option>
              <option>crates</option>
              <option>items</option>
            </select>
          </div>
        </div>

        {/* Description */}
        <div>
          <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Item Description</label>
          <input 
            type="text" 
            className="w-full p-3 bg-white border border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 focus:ring-2 focus:ring-emerald-500 focus:outline-none transition-all"
            placeholder="e.g., Russet Potatoes, Tomato Sauce"
            value={foodDetails}
            onChange={(e) => setFoodDetails(e.target.value)}
            required
          />
        </div>

        {/* Expiry Slider */}
        <div>
          <label className="block text-xs font-bold text-slate-500 uppercase mb-2 flex items-center justify-between">
            <span className="flex items-center"><Clock className="w-3.5 h-3.5 mr-1" /> Pickup Within</span>
            <span className="text-emerald-600">{expiryHours} hours</span>
          </label>
          <input 
            type="range" 
            min="1" 
            max="72" 
            value={expiryHours}
            onChange={(e) => setExpiryHours(parseInt(e.target.value))}
            className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-emerald-500"
          />
          <div className="flex justify-between text-[10px] text-slate-400 mt-1">
            <span>1h</span>
            <span>72h</span>
          </div>
        </div>

        {/* Matches */}
        <div className="pt-2">
          <div className="flex justify-between items-end mb-3">
            <h3 className="text-sm font-bold text-slate-800">Nearest High-Need Centers</h3>
            {userLocation ? (
              <span className="text-[10px] text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded">
                Based on your GPS
              </span>
            ) : (
              <span className="text-[10px] text-orange-500 animate-pulse">Locating you...</span>
            )}
          </div>
          
          <div className="space-y-2">
            {nearbyBanks.length === 0 ? (
              <p className="text-xs text-slate-400 italic">No food banks found nearby.</p>
            ) : (
              nearbyBanks.map((bank, idx) => (
                <div key={bank.id} className="flex items-center justify-between p-3 bg-white rounded-lg border border-slate-200 shadow-sm hover:border-emerald-300 transition-colors cursor-default group">
                  <div className="flex items-center space-x-3 overflow-hidden">
                    <div className={`w-6 h-6 shrink-0 rounded-full flex items-center justify-center font-bold text-[10px] ${idx === 0 ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-600'}`}>
                      {idx + 1}
                    </div>
                    <div className="truncate">
                      <p className="text-xs font-bold text-slate-800 truncate">{bank.name}</p>
                      <p className="text-[10px] text-slate-500 flex items-center">
                        <MapPin className="w-3 h-3 mr-1" /> {bank.distance?.toFixed(2)} km away
                      </p>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* AI Button */}
        <div className="pt-2">
          <button 
            type="button"
            onClick={handleGetSuggestion}
            disabled={!foodDetails || loadingAI}
            className="text-xs text-emerald-600 font-bold hover:text-emerald-700 disabled:opacity-50 w-full text-left"
          >
            {loadingAI ? 'Analyzing Logistics...' : '✨ Optimize Distribution (AI)'}
          </button>
          {suggestion && (
            <div className="mt-2 p-3 bg-emerald-50 border border-emerald-100 rounded-lg text-xs text-emerald-800 leading-relaxed">
              {suggestion}
            </div>
          )}
        </div>

        <button 
          type="submit"
          disabled={!userLocation}
          className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold py-4 rounded-xl flex items-center justify-center space-x-2 shadow-xl shadow-slate-200 transition-all transform active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <span>Broadcast to Network</span>
          <ArrowRight className="w-5 h-5" />
        </button>
      </form>
    </div>
  );
};

export default VendorPanel;