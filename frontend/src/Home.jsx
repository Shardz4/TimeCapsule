import { useState, useEffect } from 'react';

const API = 'http://localhost:8080';

function Home() {
  const [capsules, setCapsules] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${API}/api/capsules`)
      .then(res => res.json())
      .then(data => {
        if (data && Array.isArray(data)) {
          setCapsules(data);
        }
        setLoading(false);
      })
      .catch(err => {
        console.error("Error fetching capsules:", err);
        setLoading(false);
      });
  }, []);

  const formatDate = (dateStr) => {
    if (!dateStr) return '';
    const d = new Date(dateStr);
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  return (
    <>
      <div className="mb-16 space-y-2">
        <div className="flex items-center gap-3 mb-4">
          <span className="h-[1px] w-12 bg-secondary"></span>
          <span className="font-headline text-secondary text-sm font-bold uppercase tracking-[0.2em]">Your Vault</span>
        </div>
        <h1 className="headline-font text-5xl md:text-7xl font-bold tracking-tight text-white max-w-3xl leading-[1.1]">
            Preserve your <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">digital legacy</span> for the future.
        </h1>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-24">
          <div className="flex flex-col items-center gap-4">
            <div className="w-10 h-10 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
            <span className="text-on-surface-variant font-body text-sm">Loading your vault...</span>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 mb-24">
          {capsules.length === 0 ? (
            <div className="md:col-span-12 flex flex-col items-center justify-center py-16 text-center">
              <span className="material-symbols-outlined text-6xl text-primary/30 mb-4">inventory_2</span>
              <h3 className="headline-font text-xl font-bold text-white mb-2">Your vault is empty</h3>
              <p className="text-on-surface-variant font-body max-w-md">
                No capsules found. Create your first time capsule to start preserving memories!
              </p>
            </div>
          ) : (
            capsules.map((capsule, i) => (
              <div key={capsule.id} className="md:col-span-4 group">
                <div className="gradient-border-mask h-full">
                  <div className="glass-card h-full rounded-xl overflow-hidden flex flex-col">
                    {/* Image */}
                    {capsule.imageUrl && (
                      <div className="relative overflow-hidden">
                        <img
                          src={`${API}${capsule.imageUrl}`}
                          alt={capsule.title}
                          className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                          loading="lazy"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-[#0c0c1d] via-transparent to-transparent opacity-50"></div>
                      </div>
                    )}

                    <div className="p-6 flex flex-col flex-1">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          {capsule.isPublic && (
                            <span className="inline-flex items-center gap-1 bg-secondary/10 text-secondary text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full">
                              <span className="material-symbols-outlined text-[10px]">public</span>
                              Echo
                            </span>
                          )}
                          {!capsule.isPublic && (
                            <span className="inline-flex items-center gap-1 bg-primary/10 text-primary text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full">
                              <span className="material-symbols-outlined text-[10px]">lock</span>
                              Private
                            </span>
                          )}
                        </div>
                        <h3 className="headline-font text-xl font-bold text-white mb-2 group-hover:text-primary transition-colors duration-300">{capsule.title}</h3>
                        <p className="font-body text-on-surface-variant text-sm line-clamp-3">
                          {capsule.content}
                        </p>
                      </div>
                      <div className="mt-8 relative z-10">
                        <div className="flex items-center gap-2 mb-4">
                          <div className="w-6 h-6 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-[10px] font-bold text-white">
                            {capsule.collaborators ? capsule.collaborators[0].toUpperCase() : 'U'}
                          </div>
                          <span className="text-xs text-on-surface-variant">by {capsule.collaborators || 'Unknown'}</span>
                        </div>
                        <div className="bg-surface-container-highest/40 rounded-lg p-3 inline-flex items-center gap-1.5">
                          <span className="material-symbols-outlined text-secondary text-sm">schedule</span>
                          <span className="text-sm font-bold text-secondary headline-font">Unlocks: {formatDate(capsule.releaseDate)}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </>
  );
}

export default Home;
