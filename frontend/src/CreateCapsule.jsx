import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function CreateCapsule() {
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    releaseDate: '',
    collaborators: '',
    isPublic: true
  });
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();

    fetch('http://localhost:8080/api/capsules', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        ...formData,
        isPublic: Boolean(formData.isPublic)
      })
    })
      .then(res => {
        if(res.ok) {
           navigate('/');
        } else {
           console.error("Failed to create capsule");
        }
      })
      .catch(err => console.error(err));
  };

  return (
    <div className="max-w-4xl mx-auto pb-12 mt-12">
        <div className="mb-10 text-center">
            <h1 className="headline-font text-4xl md:text-5xl font-bold text-white tracking-tight mb-4">
                Seal a New <span className="text-secondary">Memory</span>
            </h1>
            <p className="font-body text-on-surface-variant max-w-lg mx-auto">
                Encode your thoughts into the archive. They will remain locked until the precise moment you choose.
            </p>
        </div>

        <div className="gradient-border-mask">
            <div className="glass-card rounded-xl p-8 md:p-12 relative overflow-hidden">
                <div className="absolute top-[-20%] right-[-10%] w-[300px] h-[300px] glow-overlay pointer-events-none"></div>

                <form className="relative z-10 space-y-8" onSubmit={handleSubmit}>
                    
                    <div className="space-y-3 pl-4 border-l-2 border-primary/30 focus-within:border-primary transition-colors">
                        <label className="block headline-font text-xs font-bold uppercase tracking-[0.15em] text-primary">Capsule Identity</label>
                        <input 
                            type="text" 
                            required
                            placeholder="e.g., The Last Rain of 2024" 
                            className="w-full bg-transparent border-0 border-b border-outline-variant/30 text-white font-body text-2xl focus:ring-0 focus:border-secondary transition-colors placeholder:text-on-surface-variant/50 px-0 pb-2"
                            value={formData.title}
                            onChange={(e) => setFormData({...formData, title: e.target.value})}
                        />
                    </div>

                    <div className="space-y-3 pl-4 border-l-2 border-primary/30 focus-within:border-primary transition-colors">
                        <label className="block headline-font text-xs font-bold uppercase tracking-[0.15em] text-primary">Archival Content</label>
                        <textarea 
                            rows="6" 
                            required
                            placeholder="Transcribe your message for the future..." 
                            className="w-full bg-surface-container-low/50 border border-outline-variant/30 rounded-lg text-white font-body p-4 focus:ring-1 focus:ring-secondary focus:border-secondary transition-colors placeholder:text-on-surface-variant/50 resize-none"
                            value={formData.content}
                            onChange={(e) => setFormData({...formData, content: e.target.value})}
                        ></textarea>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="space-y-3 pl-4 border-l-2 border-primary/30 focus-within:border-primary transition-colors">
                            <label className="block headline-font text-xs font-bold uppercase tracking-[0.15em] text-primary">Unlock Date</label>
                            <input 
                                type="date" 
                                required
                                className="w-full bg-transparent border-0 border-b border-outline-variant/30 text-white font-body text-lg focus:ring-0 focus:border-secondary transition-colors px-0 pb-2 custom-date-input"
                                value={formData.releaseDate}
                                onChange={(e) => setFormData({...formData, releaseDate: e.target.value})}
                            />
                        </div>

                        <div className="space-y-3 pl-4 border-l-2 border-primary/30 focus-within:border-primary transition-colors">
                            <label className="block headline-font text-xs font-bold uppercase tracking-[0.15em] text-primary">Author Name</label>
                            <input 
                                type="text" 
                                placeholder="Your Name or Alias" 
                                className="w-full bg-transparent border-0 border-b border-outline-variant/30 text-white font-body text-lg focus:ring-0 focus:border-secondary transition-colors placeholder:text-on-surface-variant/50 px-0 pb-2"
                                value={formData.collaborators}
                                onChange={(e) => setFormData({...formData, collaborators: e.target.value})}
                            />
                        </div>
                    </div>

                    <div className="pt-6 border-t border-outline-variant/20 flex flex-col md:flex-row items-center justify-between gap-6">
                        <label className="flex flex-row items-center gap-2 cursor-pointer">
                            <input 
                                type="checkbox" 
                                className="w-5 h-5 rounded border-outline-variant bg-surface-container-low text-primary focus:ring-primary focus:ring-offset-surface-dim"
                                checked={formData.isPublic}
                                onChange={(e) => setFormData({...formData, isPublic: e.target.checked})}
                            />
                            <span className="font-body text-on-surface-variant text-sm">Add to Global Echoes (Public)</span>
                        </label>
                        <button type="submit" className="w-full md:w-auto bg-gradient-to-r from-primary to-secondary text-on-primary-fixed font-headline font-bold py-4 px-12 rounded-full shadow-[0_0_30px_rgba(188,135,254,0.4)] hover:shadow-[0_0_40px_rgba(74,248,227,0.5)] hover:scale-105 transition-all duration-300 flex items-center justify-center gap-3">
                            <span className="material-symbols-outlined">lock</span>
                            Seal Capsule
                        </button>
                    </div>

                </form>
            </div>
        </div>
    </div>
  );
}

export default CreateCapsule;
