import React, { useEffect, useMemo, useState } from 'react';
import { createPortal } from 'react-dom';
import { SAMPLE_FOOD_BANKS, INSECURITY_STATS, SAMPLE_POSTS } from './constants';
import { DonationPost, UserType } from './types';
import MapController from './components/MapController';
import Feed from './components/Feed';
import VendorPanel from './components/VendorPanel';
import AiAssistant from './components/AiAssistant';
import { Bot, Map as MapIcon, Radio, Users, X } from 'lucide-react';

const App: React.FC = () => {
  const [userType, setUserType] = useState<UserType>(UserType.CHARITY);
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

  const mainContent = (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-slate-100 text-slate-900">
      <main className="max-w-7xl mx-auto p-6 space-y-6">
        <header className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase text-emerald-600">ZeroHunger Connect</p>
            <h1 className="text-3xl md:text-4xl font-black tracking-tight text-slate-900">
              Real-time surplus redistribution
            </h1>
            <p className="text-sm text-slate-500 mt-1">
              Match surplus food with nearby high-need communities in seconds.
            </p>
            <p className="text-xs text-emerald-600 mt-1">{locationStatus}</p>
          </div>
          <div className="flex items-center gap-2 bg-white/70 border border-emerald-100 rounded-2xl p-2 shadow-sm">
            <button
              className={`px-4 py-2 text-sm font-bold rounded-xl transition-colors ${
                userType === UserType.CHARITY
                  ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-200'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
              onClick={() => setUserType(UserType.CHARITY)}
            >
              Charity
            </button>
            <button
              className={`px-4 py-2 text-sm font-bold rounded-xl transition-colors ${
                userType === UserType.VENDOR
                  ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-200'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
              onClick={() => setUserType(UserType.VENDOR)}
            >
              Vendor
            </button>
          </div>
        </header>

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
            <p className="text-sm text-slate-500">Already redirected today</p>
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
              AI Co-Pilot <Bot className="w-4 h-4" />
            </div>
            <p className="text-3xl font-black text-slate-900 mt-2">Online</p>
            <p className="text-sm text-slate-500">Ask routing or packaging tips</p>
          </div>
        </section>

        <section className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <div className="h-[480px]">
              <MapController
                foodBanks={SAMPLE_FOOD_BANKS}
                insecurityData={INSECURITY_STATS}
                posts={sortedPosts}
                userLocation={userLocation}
              />
            </div>

            <Feed posts={sortedPosts} onClaim={claimPost} userType={userType} />
          </div>

          <div className="space-y-4">
            {userType === UserType.VENDOR ? (
              <VendorPanel foodBanks={SAMPLE_FOOD_BANKS} addPost={addPost} userLocation={userLocation} />
            ) : (
              <div className="glass-panel rounded-2xl p-6 shadow-sm border border-slate-200 space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-xl font-bold text-slate-900">High-need regions</h2>
                    <p className="text-sm text-slate-500">Prioritize drop-offs here</p>
                  </div>
                  <span className="px-3 py-1 text-xs font-bold bg-emerald-100 text-emerald-700 rounded-full">
                    Updated
                  </span>
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
                        <p className="text-xl font-black text-emerald-600">{region.percent}%</p>
                        <p className="text-[11px] text-slate-400">{region.trend} trend</p>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="p-3 rounded-xl bg-gradient-to-r from-emerald-500 to-emerald-600 text-white shadow-lg">
                  <p className="text-sm font-semibold">Tip</p>
                  <p className="text-sm opacity-90">
                    Cross-check live posts, then call ahead to coordinate volunteers before claiming.
                  </p>
                </div>
              </div>
            )}
          </div>
        </section>
      </main>
    </div>
  );

  const portalTarget = typeof document !== 'undefined' ? document.body : null;

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
                      <Bot className="w-5 h-5" />
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
            <Bot className="w-6 h-6" />
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
