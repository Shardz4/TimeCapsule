import { useState, useEffect } from 'react';

const API = 'http://localhost:8080';

function Echoes() {
  const [capsules, setCapsules] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${API}/api/capsules?filter=public`)
      .then(res => res.json())
      .then(data => {
        if (data && Array.isArray(data)) {
          setCapsules(data);
        }
        setLoading(false);
      })
      .catch(err => {
        console.error("Error fetching echoes:", err);
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
      <div className="mb-12 space-y-2">
        <div className="flex items-center gap-3 mb-4">
          <span className="h-[1px] w-12 bg-secondary"></span>
          <span className="font-headline text-secondary text-sm font-bold uppercase tracking-[0.2em]">Global Echoes</span>
        </div>
        <h1 className="headline-font text-5xl md:text-7xl font-bold tracking-tight text-white max-w-4xl leading-[1.1]">
          Memories shared across <span className="text-transparent bg-clip-text bg-gradient-to-r from-secondary to-primary">time & space</span>.
        </h1>
        <p className="font-body text-on-surface-variant max-w-xl mt-4 text-lg">
          A living archive of moments others have chosen to share with the world.
        </p>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-24">
          <div className="flex flex-col items-center gap-4">
            <div className="w-10 h-10 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
            <span className="text-on-surface-variant font-body text-sm">Loading echoes...</span>
          </div>
        </div>
      ) : capsules.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 text-center">
          <span className="material-symbols-outlined text-6xl text-primary/30 mb-4">rss_feed</span>
          <h3 className="headline-font text-xl font-bold text-white mb-2">The archive is silent</h3>
          <p className="text-on-surface-variant font-body max-w-md">
            No public echoes have been created yet. Be the first to share a memory with the world.
          </p>
        </div>
      ) : (
        <div className="columns-1 sm:columns-2 lg:columns-3 gap-6 mb-24 [column-fill:_balance]">
          {capsules.map((capsule, i) => (
            <div
              key={capsule.id}
              className="break-inside-avoid mb-6 group"
              style={{ animationDelay: `${i * 80}ms` }}
            >
              <div className="gradient-border-mask h-full">
                <div className="glass-card h-full rounded-xl overflow-hidden flex flex-col echo-card-enter">
                  {/* Image */}
                  {capsule.imageUrl && (
                    <div className="relative overflow-hidden">
                      <img
                        src={`${API}${capsule.imageUrl}`}
                        alt={capsule.title}
                        className="w-full object-cover max-h-80 group-hover:scale-105 transition-transform duration-700 ease-out"
                        loading="lazy"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#0c0c1d] via-transparent to-transparent opacity-60"></div>
                    </div>
                  )}

                  {/* Content */}
                  <div className="p-6 flex flex-col flex-1">
                    <h3 className="headline-font text-xl font-bold text-white mb-3 group-hover:text-primary transition-colors duration-300">
                      {capsule.title}
                    </h3>
                    <p className="font-body text-on-surface-variant text-sm leading-relaxed flex-1">
                      {capsule.content.length > 200
                        ? capsule.content.substring(0, 200) + '...'
                        : capsule.content}
                    </p>

                    {/* Footer */}
                    <div className="mt-6 pt-4 border-t border-outline-variant/20">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className="w-7 h-7 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-[11px] font-bold text-white shadow-[0_0_10px_rgba(199,153,255,0.3)]">
                            {capsule.collaborators ? capsule.collaborators[0].toUpperCase() : 'U'}
                          </div>
                          <span className="text-xs text-on-surface-variant font-body">
                            {capsule.collaborators || 'Anonymous'}
                          </span>
                        </div>
                        <div className="flex items-center gap-1.5 text-secondary/80">
                          <span className="material-symbols-outlined text-sm">schedule</span>
                          <span className="text-xs font-body">{formatDate(capsule.releaseDate)}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </>
  );
}

export default Echoes;
