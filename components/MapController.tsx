import React, { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, CircleMarker, useMap } from 'react-leaflet';
import { FoodBank, InsecurityData, DonationPost } from '../types';
import L from 'leaflet';

// Icons
const DefaultIcon = L.icon({
    iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
    shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
});

L.Marker.prototype.options.icon = DefaultIcon;

const vendorIcon = new L.Icon({
    iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-orange.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
});

const charityIcon = new L.Icon({
    iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-blue.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
});

const userLocationIcon = new L.Icon({
    iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
});

interface MapControllerProps {
  foodBanks: FoodBank[];
  insecurityData: InsecurityData[];
  posts: DonationPost[];
  userLocation: { lat: number, lng: number } | null;
}

const RecenterMap = ({ lat, lng }: { lat: number; lng: number }) => {
  const map = useMap();
  useEffect(() => {
    map.setView([lat, lng], 12); // Zoom in closer to user
  }, [lat, lng, map]);
  return null;
};

const MapController: React.FC<MapControllerProps> = ({ foodBanks, insecurityData, posts, userLocation }) => {
  
  const getHeatmapStyle = (percent: number) => {
    // Smoother gradients, no stroke for "heat" effect
    const color = percent > 30 ? '#ef4444' : // Red
                  percent > 25 ? '#f97316' : // Orange
                  percent > 20 ? '#eab308' : // Yellow
                  '#22c55e';                 // Green
    
    return {
      color: color,
      fillColor: color,
      fillOpacity: 0.3, // Lower opacity for blending
      weight: 0, // No border
      radius: percent * 1.8 // Slightly larger
    };
  };

  return (
    <div className="h-full w-full rounded-2xl overflow-hidden border border-slate-200 shadow-inner relative z-0 bg-slate-100">
      <MapContainer 
        center={[43.7, -79.4] as L.LatLngExpression} 
        zoom={10} 
        style={{ height: '100%', width: '100%' }}
        scrollWheelZoom={true}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
        />

        {userLocation && <RecenterMap lat={userLocation.lat} lng={userLocation.lng} />}

        {/* User Location */}
        {userLocation && (
          <Marker position={[userLocation.lat, userLocation.lng]} icon={userLocationIcon}>
            <Popup>
              <div className="p-1 text-center">
                <h3 className="font-bold text-emerald-700">Your Location</h3>
                <p className="text-xs text-slate-500">You are here</p>
              </div>
            </Popup>
          </Marker>
        )}

        {/* Food Banks Markers */}
        {foodBanks.map((bank) => (
          <Marker 
            key={bank.id} 
            position={[bank.latitude, bank.longitude]}
            icon={charityIcon}
          >
            <Popup>
              <div className="p-1 min-w-[150px]">
                <h3 className="font-bold text-slate-900 mb-1">{bank.name}</h3>
                <p className="text-xs text-slate-600 mb-2">{bank.address}</p>
                <div className="flex flex-wrap gap-1">
                  {bank.needs.slice(0, 2).map((need, i) => (
                    <span key={i} className="text-[10px] bg-blue-50 text-blue-700 border border-blue-100 px-1.5 py-0.5 rounded">
                      {need}
                    </span>
                  ))}
                </div>
                <p className="text-[10px] text-slate-400 mt-2 italic">{bank.hours}</p>
              </div>
            </Popup>
          </Marker>
        ))}

        {/* Active Donation Posts Markers */}
        {posts.filter(p => p.status === 'available').map((post) => (
          <Marker 
            key={post.id} 
            position={[post.latitude, post.longitude]}
            icon={vendorIcon}
          >
            <Popup>
              <div className="p-1 min-w-[150px]">
                <span className="text-[10px] font-bold bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-full mb-2 inline-block">
                  AVAILABLE
                </span>
                <h3 className="font-bold text-slate-900">{post.vendorName}</h3>
                <p className="text-sm text-slate-700">{post.foodType}</p>
                <p className="text-xs text-slate-500 mb-2">Qty: {post.quantity}</p>
                <div className="border-t border-slate-100 pt-2 mt-1">
                  <p className="text-[10px] text-red-500 font-bold">Expires: {post.expiry}</p>
                </div>
              </div>
            </Popup>
          </Marker>
        ))}

        {/* Heatmap Layers */}
        {insecurityData.map((data, idx) => (
          <CircleMarker
            key={idx}
            center={[data.latitude, data.longitude]}
            {...getHeatmapStyle(data.percent)}
          >
            <Popup>
              <div className="text-center p-2">
                <h4 className="font-bold text-slate-900 mb-1">{data.region}</h4>
                <div className="flex items-baseline justify-center space-x-1">
                  <p className="text-2xl font-black" style={{ color: getHeatmapStyle(data.percent).color }}>
                    {data.percent}%
                  </p>
                </div>
                <p className="text-[10px] text-slate-500 uppercase font-bold tracking-wide">Food Insecurity Rate</p>
                <div className="mt-2 pt-2 border-t border-slate-100">
                  <span className={`text-xs font-bold px-2 py-1 rounded ${data.trend === 'Higher' ? 'bg-red-50 text-red-600' : 'bg-slate-50 text-slate-600'}`}>
                    Trend: {data.trend}
                  </span>
                </div>
              </div>
            </Popup>
          </CircleMarker>
        ))}

      </MapContainer>
      
      {/* Modern Map Legend */}
      <div className="absolute bottom-6 right-6 bg-white/95 backdrop-blur-md p-4 rounded-2xl border border-slate-200 shadow-xl z-[1000] text-xs min-w-[160px]">
        <h4 className="font-bold mb-3 text-slate-800">Legend</h4>
        <div className="space-y-2.5">
          <div className="flex items-center">
            <img src="https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png" className="w-3 h-5 mr-2" alt=""/>
            <span className="text-slate-600">You</span>
          </div>
          <div className="flex items-center">
            <img src="https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-blue.png" className="w-3 h-5 mr-2" alt=""/>
            <span className="text-slate-600">Food Bank</span>
          </div>
          <div className="flex items-center">
            <img src="https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-orange.png" className="w-3 h-5 mr-2" alt=""/>
            <span className="text-slate-600">Donation</span>
          </div>
          <div className="h-px bg-slate-100 my-2"></div>
          <p className="text-[10px] text-slate-400 uppercase font-bold mb-1">Insecurity Heatmap</p>
          <div className="grid grid-cols-3 gap-1 h-2 rounded overflow-hidden">
            <div className="bg-yellow-400/60"></div>
            <div className="bg-orange-500/60"></div>
            <div className="bg-red-500/60"></div>
          </div>
          <div className="flex justify-between text-[10px] text-slate-400">
            <span>Low</span>
            <span>High</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MapController;