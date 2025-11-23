// App.tsx (Modified)

import React, { useEffect, useMemo, useState } from 'react';
import { createPortal } from 'react-dom';
import { SAMPLE_FOOD_BANKS, INSECURITY_STATS, SAMPLE_POSTS } from './constants';
import { DonationPost, UserType } from './types';
import MapController from './components/MapController';
import Feed from './components/Feed';
import VendorPanel from './components/VendorPanel';
import AiAssistant from './components/AiAssistant';
import HomePage from './components/HomePage'; // <--- NEW IMPORT
import CharityPanel from './components/CharityPanel'; // <--- NEW IMPORT
import { RectangleEllipsis, Map as MapIcon, Radio, Users, X, ArrowLeft } from 'lucide-react'; // Added ArrowLeft

const App: React.FC = () => {
  // Use null to indicate the initial selection page
  const [userType, setUserType] = useState<UserType | null>(null);
  const [posts, setPosts] = useState<DonationPost[]>(SAMPLE_POSTS);
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [locationStatus, setLocationStatus] = useState('Detecting location...');
  const [chatOpen, setChatOpen] = useState(false);

  useEffect(() => {
    if (!('geolocation' in navigator)) {
      setLocationStatus('Geolocation not supported. Showing GTA data.');
      setUserLocation({ lat: 43.6532, lng: -79.3832 });
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setUserLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude });
        setLocationStatus('Location locked');
      },
      () => {
        setLocationStatus('Location blocked. Showing GTA data.');
        setUserLocation({ lat: 43.6532, lng: -79.3832 });
      }
    );
  }, []);

  const sortedPosts = useMemo(
    () => [...posts].sort((a, b) => b.timestamp - a.timestamp),
    [posts]
  );

  const topInsecurity = useMemo(
    () => [...INSECURITY_STATS].sort((a, b) => b.percent - a.percent).slice(0, 3),
    []
  );

  const claimPost = (id: string) => {
    setPosts((prev) => prev.map((post) => (post.id === id ? { ...post, status: 'claimed' } : post)));
  };

  const addPost = (post: DonationPost) => {
    setPosts((prev) => [post, ...prev]);
  };

  const availableCount = posts.filter((p) => p.status === 'available').length;
  const claimedCount = posts.filter((p) => p.status === 'claimed').length;

  // --- RENDER LOGIC ---

  // 1. Render Home Page if no userType is selected
  if (userType === null) {
    return (
      <HomePage setUserType={setUserType} insecurityStats={INSECURITY_STATS} />
    );
  }

  // 2. Render Dashboard if userType is selected
  const mainContent = (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-slate-100 text-slate-900">
      <main className="max-w-7xl mx-auto p-6 space-y-6">
        
        {/* HEADER BAR */}
        <header className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setUserType(null)} // Go back to home page
              className="p-2 rounded-full text-slate-600 bg-white shadow-md hover:bg-slate-100 transition-colors"
              aria-label="Back to Role Selection"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>

            <div>
              <p className={`text-xs font-semibold uppercase ${userType === UserType.VENDOR ? 'text-amber-600' : 'text-emerald-600'}`}>
                {userType === UserType.VENDOR ? 'Vendor Dashboard' : 'Charity Dashboard'}
              </p>
              <h1 className="text-3xl md:text-4xl font-black tracking-tight text-slate-900">
                Top Areas for Food Support
              </h1>
            </div>
          </div>
          <p className="text-xs text-emerald-600 mt-1">{locationStatus}</p>
        </header>

        {/* STATS CARDS - Simplified and kept */}
        <section className="grid md:grid-cols-4 gap-3">
          <div className="glass-panel rounded-2xl border border-emerald-100 p-4 shadow-sm">
            <div className="flex items-center justify-between text-xs font-semibold text-emerald-600 uppercase">
              Live Posts <Radio className="w-4 h-4" />
            </div>
            <p className="text-3xl font-black text-slate-900 mt-2">{availableCount}</p>
            <p className="text-sm text-slate-500">Available donations nearby</p>
          </div>
          <div className="glass-panel rounded-2xl border border-slate-200 p-4 shadow-sm">
            <div className="flex items-center justify-between text-xs font-semibold text-slate-500 uppercase">
              Claimed <Users className="w-4 h-4" />
            </div>
            <p className="text-3xl font-black text-slate-900 mt-2">{claimedCount}</p>
            <p className="text-sm text-slate-500">Redirected today</p>
          </div>
          <div className="glass-panel rounded-2xl border border-slate-200 p-4 shadow-sm">
            <div className="flex items-center justify-between text-xs font-semibold text-slate-500 uppercase">
              Hotspots <MapIcon className="w-4 h-4" />
            </div>
            <p className="text-3xl font-black text-slate-900 mt-2">{topInsecurity[0].percent}%</p>
            <p className="text-sm text-slate-500">Highest household insecurity</p>
          </div>
          <div className="glass-panel rounded-2xl border border-slate-200 p-4 shadow-sm">
            <div className="flex items-center justify-between text-xs font-semibold text-slate-500 uppercase">
              AI Co-Pilot <RectangleEllipsis className="w-4 h-4" />
            </div>
            <p className="text-3xl font-black text-slate-900 mt-2">Online</p>
            <p className="text-sm text-slate-500">Ask routing or packaging tips</p>
          </div>
        </section>

        {/* MAIN LAYOUT: Map/Feed + Side Panel */}
        <section className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            {/* MAP CONTROLLER */}
            <div className="h-[480px]">
              <MapController
                foodBanks={SAMPLE_FOOD_BANKS}
                insecurityData={INSECURITY_STATS}
                posts={sortedPosts}
                userLocation={userLocation}
              />
            </div>

            {/* FEED/LISTINGS */}
            <Feed posts={sortedPosts} onClaim={claimPost} userType={userType} />
          </div>

          {/* SIDE PANEL: VendorPost Form OR Charity Request/Analytics */}
          <div className="space-y-4">
            {userType === UserType.VENDOR ? (
              <VendorPanel foodBanks={SAMPLE_FOOD_BANKS} addPost={addPost} userLocation={userLocation} />
            ) : (
              <CharityPanel topInsecurity={topInsecurity} /> // <--- USING NEW COMPONENT
            )}
          </div>
        </section>
      </main>
    </div>
  );

  const portalTarget = typeof document !== 'undefined' ? document.body : null;

  // ... (rest of the chatWidget code remains the same)
  const chatWidget =
    portalTarget &&
    createPortal(
      <div
        style={{
          position: 'fixed',
          bottom: '16px',
          right: '16px',
          zIndex: 9999,
          width: 'min(420px, calc(100vw - 32px))',
          pointerEvents: 'none',
        }}
      >
        <div style={{ position: 'relative', width: '100%', pointerEvents: 'auto' }}>
          {chatOpen && (
            <div
              style={{
                position: 'absolute',
                bottom: '72px',
                right: 0,
                width: '100%',
                height: '520px',
              }}
            >
              <div className="glass-panel rounded-2xl border border-slate-200 shadow-2xl h-full flex flex-col">
                <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100">
                  <div className="flex items-center space-x-2">
                    <span className="p-2 rounded-lg bg-emerald-100 text-emerald-700">
                      <RectangleEllipsis className="w-5 h-5" />
                    </span>
                    <div>
                      <p className="text-sm font-bold text-slate-900">AI Assistant</p>
                      <p className="text-[11px] text-slate-500">Ask about routing or packaging</p>
                    </div>
                  </div>
                  <button
                    onClick={() => setChatOpen(false)}
                    className="p-2 rounded-lg text-slate-500 hover:bg-slate-100 transition-colors"
                    aria-label="Close chat"
                    type="button"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
                <div className="flex-1 p-4">
                  <AiAssistant embedded />
                </div>
              </div>
            </div>
          )}

          <button
            type="button"
            onClick={() => setChatOpen((prev) => !prev)}
            className="absolute bottom-0 right-0 w-14 h-14 rounded-full bg-emerald-500 text-white shadow-xl shadow-emerald-200 flex items-center justify-center hover:bg-emerald-600 transition-colors border border-emerald-100"
            aria-label={chatOpen ? 'Hide AI assistant' : 'Open AI assistant'}
          >
            <RectangleEllipsis className="w-6 h-6" />
          </button>
        </div>
      </div>,
      portalTarget
    );

  return (
    <>
      {mainContent}
      {chatWidget}
    </>
  );
};

export default App;