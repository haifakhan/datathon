import React from 'react';
import { DonationPost } from '../types';
import { Clock, MapPin, CheckCircle, SearchX } from 'lucide-react';

interface FeedProps {
  posts: DonationPost[];
  onClaim: (id: string) => void;
  userType: string;
}

const Feed: React.FC<FeedProps> = ({ posts, onClaim, userType }) => {
  return (
    <div className="glass-panel rounded-2xl p-6 shadow-sm border border-slate-200 h-full overflow-y-auto">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-slate-900">Live Feed</h2>
        <span className="animate-pulse flex h-3 w-3 rounded-full bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]"></span>
      </div>

      <div className="space-y-4">
        {posts.length === 0 ? (
          <div className="text-slate-400 text-center py-20 flex flex-col items-center">
            <SearchX className="w-12 h-12 mb-2 opacity-50" />
            <p>No active donations in range.</p>
          </div>
        ) : (
          posts.map((post) => (
            <div key={post.id} className={`p-4 rounded-xl border transition-all ${post.status === 'available' ? 'bg-white border-slate-200 hover:border-emerald-400 shadow-sm' : 'bg-slate-50 border-slate-100 opacity-60'}`}>
              <div className="flex justify-between items-start">
                <div>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wide ${post.status === 'available' ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-200 text-slate-600'}`}>
                    {post.status}
                  </span>
                  <h3 className="font-bold text-slate-900 mt-2">{post.foodType}</h3>
                  <p className="text-sm text-slate-600 font-medium">{post.vendorName} • {post.quantity}</p>
                </div>
                <div className="text-right">
                  <div className="flex items-center text-xs text-red-500 font-bold mb-1 justify-end">
                    <Clock className="w-3 h-3 mr-1" /> {post.expiry} left
                  </div>
                  {post.targetCommunity && (
                    <div className="flex items-center text-[10px] text-slate-500 justify-end font-medium">
                      <MapPin className="w-3 h-3 mr-1" /> {post.targetCommunity}
                    </div>
                  )}
                </div>
              </div>

              {post.status === 'available' && userType === 'CHARITY' && (
                <button 
                  onClick={() => onClaim(post.id)}
                  className="mt-4 w-full py-2 bg-slate-900 text-white text-sm font-bold rounded-lg hover:bg-slate-800 transition-colors flex items-center justify-center shadow-lg shadow-slate-200/50"
                >
                  <CheckCircle className="w-4 h-4 mr-2" /> Claim Donation
                </button>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Feed;