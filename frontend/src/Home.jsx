import { useState, useEffect } from 'react';

function Home() {
  const [capsules, setCapsules] = useState([]);

  useEffect(() => {
    fetch('http://localhost:8080/api/capsules')
      .then(res => res.json())
      .then(data => {
        if (data && Array.isArray(data)) {
          setCapsules(data);
        }
      })
      .catch(err => console.error("Error fetching capsules:", err));
  }, []);

  return (
    <>
      <div className="mb-16 space-y-2">
        <div className="flex items-center gap-3 mb-4">
          <span className="h-[1px] w-12 bg-secondary"></span>
          <span className="font-headline text-secondary text-sm font-bold uppercase tracking-[0.2em]">Public Archive</span>
        </div>
        <h1 className="headline-font text-5xl md:text-7xl font-bold tracking-tight text-white max-w-3xl leading-[1.1]">
            Preserve your <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">digital legacy</span> for the future.
        </h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 mb-24">
        {capsules.length === 0 ? (
          <div className="md:col-span-12 text-center text-on-surface-variant my-12">
            No public capsules found. Be the first to create one!
          </div>
        ) : (
          capsules.map((capsule, i) => (
            <div key={capsule.id} className="md:col-span-4 group">
              <div className="gradient-border-mask h-full">
                <div className="glass-card h-full rounded-xl p-6 flex flex-col justify-between">
                  <div>
                    <h3 className="headline-font text-xl font-bold text-white mb-2">{capsule.title}</h3>
                    <p className="font-body text-on-surface-variant text-sm line-clamp-3">
                      {capsule.content}
                    </p>
                  </div>
                  <div className="mt-8 relative z-10">
                    <div className="flex items-center gap-2 mb-4">
                      <div className="w-6 h-6 rounded-full bg-secondary-container flex items-center justify-center text-[10px] text-white">
                        {capsule.collaborators ? capsule.collaborators[0].toUpperCase() : 'U'}
                      </div>
                      <span className="text-xs text-on-surface-variant">by {capsule.collaborators || 'Unknown'}</span>
                    </div>
                    <div className="bg-surface-container-highest/40 rounded-lg p-3 inline-block">
                      <span className="text-sm font-bold text-secondary headline-font">Unlocks: {capsule.releaseDate}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </>
  );
}

export default Home;
