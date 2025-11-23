// VendorPanel.tsx - Updated with proper autocomplete

import React, { useState, useEffect, useMemo, useRef } from 'react';
import { FoodBank, DonationPost } from '../types';
import { MapPin, Clock, ArrowRight, Tag, Scale, CheckCircle2, Search, Loader } from 'lucide-react';
import { getDonationSuggestion } from '../services/geminiService';
import { calculateDistance } from '../services/geoUtils';

interface VendorPanelProps {
  foodBanks: FoodBank[];
  addPost: (post: DonationPost) => void;
  userLocation: { lat: number; lng: number } | null;
  onRestaurantLocationChange: (location: { lat: number; lng: number; name: string; address: string } | null) => void; // NEW PROP
}

// Enhanced geocoding function
const geocodeAddress = async (address: string): Promise<{ lat: number; lng: number; display_name: string } | null> => {
  try {
    const response = await fetch(
      `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(address + ', Ontario, Canada')}&limit=5&addressdetails=1`
    );
    const data = await response.json();
    
    if (data && data.length > 0) {
      return {
        lat: parseFloat(data[0].lat),
        lng: parseFloat(data[0].lon),
        display_name: data[0].display_name
      };
    }
    return null;
  } catch (error) {
    console.error('Geocoding error:', error);
    return null;
  }
};

// Address autocomplete function
const getAddressSuggestions = async (query: string): Promise<Array<{ display_name: string; lat: number; lng: number }>> => {
  if (query.length < 3) return [];
  
  try {
    const response = await fetch(
      `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query + ', Ontario, Canada')}&limit=5&addressdetails=1`
    );
    const data = await response.json();
    
    return data.map((item: any) => ({
      display_name: item.display_name,
      lat: parseFloat(item.lat),
      lng: parseFloat(item.lon)
    }));
  } catch (error) {
    console.error('Autocomplete error:', error);
    return [];
  }
};

const VendorPanel: React.FC<VendorPanelProps> = ({ foodBanks, addPost, userLocation, onRestaurantLocationChange }) => {
  const [restaurantName, setRestaurantName] = useState('');
  const [restaurantAddress, setRestaurantAddress] = useState('');
  const [addressSuggestions, setAddressSuggestions] = useState<Array<{ display_name: string; lat: number; lng: number }>>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [category, setCategory] = useState('Raw Ingredients');
  const [foodDetails, setFoodDetails] = useState('');
  const [quantity, setQuantity] = useState<number>(1);
  const [unit, setUnit] = useState('kg');
  const [expiryHours, setExpiryHours] = useState(24);
  const [suggestion, setSuggestion] = useState<string | null>(null);
  const [loadingAI, setLoadingAI] = useState(false);
  const [restaurantCoords, setRestaurantCoords] = useState<{ lat: number; lng: number } | null>(null);
  const [geocoding, setGeocoding] = useState(false);
  const [searching, setSearching] = useState(false);
  const addressInputRef = useRef<HTMLInputElement>(null);

  // Debounced address search
  useEffect(() => {
    const searchAddresses = async () => {
      if (restaurantAddress.length < 3) {
        setAddressSuggestions([]);
        setShowSuggestions(false);
        return;
      }

      setSearching(true);
      const suggestions = await getAddressSuggestions(restaurantAddress);
      setAddressSuggestions(suggestions);
      setShowSuggestions(true);
      setSearching(false);
    };

    const timeoutId = setTimeout(searchAddresses, 300);
    return () => clearTimeout(timeoutId);
  }, [restaurantAddress]);

  // Geocode address when a suggestion is selected or manually entered
  useEffect(() => {
    const geocodeRestaurantAddress = async () => {
      if (restaurantAddress.length > 5 && !addressSuggestions.some(sugg => sugg.display_name === restaurantAddress)) {
        setGeocoding(true);
        const coords = await geocodeAddress(restaurantAddress);
        if (coords) {
          setRestaurantCoords({ lat: coords.lat, lng: coords.lng });
          // Notify parent component about the restaurant location
          onRestaurantLocationChange({
            lat: coords.lat,
            lng: coords.lng,
            name: restaurantName || 'Restaurant',
            address: restaurantAddress
          });
        }
        setGeocoding(false);
      }
    };

    const timeoutId = setTimeout(geocodeRestaurantAddress, 1000);
    return () => clearTimeout(timeoutId);
  }, [restaurantAddress, restaurantName, onRestaurantLocationChange]);

  // Calculate nearby banks dynamically based on restaurant location
  const nearbyBanks = useMemo(() => {
    const coords = restaurantCoords || userLocation;
    if (!coords) return [];
    
    return foodBanks
      .map(bank => ({ 
        ...bank, 
        distance: calculateDistance(coords.lat, coords.lng, bank.latitude, bank.longitude) 
      }))
      .sort((a, b) => (a.distance || 0) - (b.distance || 0))
      .slice(0, 5);
  }, [foodBanks, restaurantCoords, userLocation]);

  const handleAddressChange = (value: string) => {
    setRestaurantAddress(value);
    setShowSuggestions(value.length > 2);
  };

  const selectAddress = (suggestion: { display_name: string; lat: number; lng: number }) => {
    setRestaurantAddress(suggestion.display_name);
    setRestaurantCoords({ lat: suggestion.lat, lng: suggestion.lng });
    setShowSuggestions(false);
    
    // Extract restaurant name from address if possible
    const nameMatch = suggestion.display_name.match(/^([^,]+)/);
    if (nameMatch && !restaurantName) {
      setRestaurantName(nameMatch[0].trim());
    }

    // Notify parent component about the restaurant location
    onRestaurantLocationChange({
      lat: suggestion.lat,
      lng: suggestion.lng,
      name: restaurantName || nameMatch?.[0]?.trim() || 'Restaurant',
      address: suggestion.display_name
    });
  };

  const handleGetSuggestion = async () => {
    if (!foodDetails || quantity <= 0) return;
    setLoadingAI(true);
    const fullDesc = `${quantity}${unit} of ${category} - ${foodDetails}`;
    const result = await getDonationSuggestion(fullDesc, `${quantity}${unit}`, nearbyBanks);
    setSuggestion(result);
    setLoadingAI(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const coords = restaurantCoords || userLocation;
    if (!coords) {
      alert("Please enter a valid address or enable location services");
      return;
    }

    const newPost: DonationPost = {
      id: Math.random().toString(36).substr(2, 9),
      vendorName: restaurantName || "Restaurant",
      vendorAddress: restaurantAddress,
      foodType: `${category}: ${foodDetails}`,
      quantity: `${quantity} ${unit}`,
      expiry: `${expiryHours} hours`,
      latitude: coords.lat,
      longitude: coords.lng,
      timestamp: Date.now(),
      status: 'available',
      targetCommunity: nearbyBanks[0]?.name || "General Pool"
    };
    
    addPost(newPost);
    
    // Reset form
    setFoodDetails('');
    setQuantity(1);
    setSuggestion(null);
    alert("Donation broadcasted successfully! Food banks have been notified.");
  };

  const currentLocation = restaurantCoords || userLocation;

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
        {/* Restaurant Name */}
        <div>
          <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Restaurant Name *</label>
          <input 
            type="text" 
            className="w-full p-3 bg-white border border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 focus:ring-2 focus:ring-emerald-500 focus:outline-none transition-all"
            placeholder="e.g., The Italian Kitchen"
            value={restaurantName}
            onChange={(e) => setRestaurantName(e.target.value)}
            required
          />
        </div>

        {/* Address Input with Proper Autocomplete */}
        <div className="relative">
          <label className="block text-xs font-bold text-slate-500 uppercase mb-2 flex items-center">
            <MapPin className="w-3.5 h-3.5 mr-1" /> Pickup Address *
          </label>
          <div className="relative">
            <input 
              ref={addressInputRef}
              type="text" 
              className="w-full p-3 bg-white border border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 focus:ring-2 focus:ring-emerald-500 focus:outline-none transition-all pr-10"
              placeholder="Start typing your restaurant address..."
              value={restaurantAddress}
              onChange={(e) => handleAddressChange(e.target.value)}
              onFocus={() => restaurantAddress.length > 2 && setShowSuggestions(true)}
              required
            />
            {searching ? (
              <Loader className="absolute right-3 top-3.5 w-4 h-4 text-slate-400 animate-spin" />
            ) : (
              <Search className="absolute right-3 top-3.5 w-4 h-4 text-slate-400" />
            )}
          </div>
          
          {/* Enhanced Address Suggestions Dropdown */}
          {showSuggestions && addressSuggestions.length > 0 && (
            <div className="absolute z-20 w-full mt-1 bg-white border border-slate-200 rounded-xl shadow-lg max-h-60 overflow-y-auto">
              {addressSuggestions.map((suggestion, index) => (
                <button
                  key={index}
                  type="button"
                  className="w-full text-left p-3 hover:bg-slate-50 border-b border-slate-100 last:border-b-0 transition-colors"
                  onClick={() => selectAddress(suggestion)}
                >
                  <div className="flex items-start space-x-2">
                    <MapPin className="w-4 h-4 text-emerald-500 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="text-sm text-slate-800 font-medium">{suggestion.display_name.split(',')[0]}</p>
                      <p className="text-xs text-slate-500 mt-1">
                        {suggestion.display_name.split(',').slice(1).join(',').trim()}
                      </p>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          )}

          {/* Status Messages */}
          {searching && (
            <p className="text-xs text-blue-600 mt-1 flex items-center">
              <Loader className="w-3 h-3 mr-1 animate-spin" /> Searching addresses...
            </p>
          )}
          {geocoding && !searching && (
            <p className="text-xs text-amber-600 mt-1 flex items-center">
              <Loader className="w-3 h-3 mr-1 animate-spin" /> Verifying location...
            </p>
          )}
          {restaurantCoords && !geocoding && (
            <p className="text-xs text-emerald-600 mt-1 flex items-center">
              <CheckCircle2 className="w-3 h-3 mr-1" /> Location verified - pin added to map
            </p>
          )}
        </div>

        {/* Rest of the form remains the same */}
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
            <option>Produce</option>
            <option>Frozen Foods</option>
          </select>
        </div>

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
              onChange={(e) => setQuantity(parseInt(e.target.value) || 1)}
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
              <option>liters</option>
              <option>portions</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Item Description *</label>
          <input 
            type="text" 
            className="w-full p-3 bg-white border border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 focus:ring-2 focus:ring-emerald-500 focus:outline-none transition-all"
            placeholder="e.g., Russet Potatoes, Tomato Sauce, Chicken Breast"
            value={foodDetails}
            onChange={(e) => setFoodDetails(e.target.value)}
            required
          />
        </div>

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

        {/* Dynamic Nearest Food Banks */}
        <div className="pt-2">
          <div className="flex justify-between items-end mb-3">
            <h3 className="text-sm font-bold text-slate-800">Nearest Food Banks</h3>
            {currentLocation ? (
              <span className="text-[10px] text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded">
                {restaurantCoords ? 'Based on restaurant address' : 'Based on your GPS'}
              </span>
            ) : (
              <span className="text-[10px] text-orange-500 animate-pulse">Enter address to see matches</span>
            )}
          </div>
          
          <div className="space-y-2">
            {nearbyBanks.length === 0 ? (
              <p className="text-xs text-slate-400 italic">
                {currentLocation ? 'No food banks found within range' : 'Enter your address to find nearby food banks'}
              </p>
            ) : (
              nearbyBanks.map((bank, idx) => (
                <div key={bank.id} className="flex items-center justify-between p-3 bg-white rounded-lg border border-slate-200 shadow-sm hover:border-emerald-300 transition-colors cursor-default group">
                  <div className="flex items-center space-x-3 overflow-hidden">
                    <div className={`w-6 h-6 shrink-0 rounded-full flex items-center justify-center font-bold text-[10px] ${
                      idx === 0 ? 'bg-emerald-100 text-emerald-700' : 
                      idx === 1 ? 'bg-blue-100 text-blue-700' : 
                      idx === 2 ? 'bg-purple-100 text-purple-700' : 
                      'bg-slate-100 text-slate-600'
                    }`}>
                      {idx + 1}
                    </div>
                    <div className="truncate">
                      <p className="text-xs font-bold text-slate-800 truncate">{bank.name}</p>
                      <p className="text-[10px] text-slate-500 flex items-center">
                        <MapPin className="w-3 h-3 mr-1" /> {bank.distance?.toFixed(1)} km away
                      </p>
                    </div>
                  </div>
                  {idx === 0 && (
                    <span className="text-[10px] bg-emerald-100 text-emerald-700 px-2 py-1 rounded-full font-bold">
                      CLOSEST
                    </span>
                  )}
                </div>
              ))
            )}
          </div>
        </div>

        <div className="pt-2">
          <button 
            type="button"
            onClick={handleGetSuggestion}
            disabled={!foodDetails || loadingAI || nearbyBanks.length === 0}
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
          disabled={!currentLocation || !restaurantAddress}
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