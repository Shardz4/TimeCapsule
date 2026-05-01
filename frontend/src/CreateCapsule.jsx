import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

const API = 'http://localhost:8080';

function CreateCapsule() {
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    releaseDate: '',
    collaborators: '',
    isPublic: true
  });
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef(null);
  const navigate = useNavigate();

  const handleImageSelect = (file) => {
    if (!file) return;
    const allowed = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
    if (!allowed.includes(file.type)) {
      alert('Please select a JPG, PNG, GIF, or WebP image.');
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      alert('Image must be under 10MB.');
      return;
    }
    setImageFile(file);
    const reader = new FileReader();
    reader.onload = (e) => setImagePreview(e.target.result);
    reader.readAsDataURL(file);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    handleImageSelect(file);
  };

  const removeImage = () => {
    setImageFile(null);
    setImagePreview(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsUploading(true);

    try {
      let imageUrl = '';

      // Step 1: Upload image if present
      if (imageFile) {
        const uploadData = new FormData();
        uploadData.append('image', imageFile);
        const uploadRes = await fetch(`${API}/api/upload`, {
          method: 'POST',
          body: uploadData,
        });
        if (uploadRes.ok) {
          const uploadJson = await uploadRes.json();
          imageUrl = uploadJson.imageUrl;
        } else {
          console.error('Image upload failed');
        }
      }

      // Step 2: Create capsule
      const res = await fetch(`${API}/api/capsules`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          isPublic: Boolean(formData.isPublic),
          imageUrl: imageUrl,
        }),
      });

      if (res.ok) {
        navigate('/');
      } else {
        console.error('Failed to create capsule');
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsUploading(false);
    }
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

                    {/* Image Upload Zone */}
                    <div className="space-y-3 pl-4 border-l-2 border-primary/30 transition-colors">
                        <label className="block headline-font text-xs font-bold uppercase tracking-[0.15em] text-primary">Attach Memory</label>
                        
                        {imagePreview ? (
                          <div className="relative rounded-xl overflow-hidden group">
                            <img
                              src={imagePreview}
                              alt="Preview"
                              className="w-full max-h-72 object-cover rounded-xl"
                            />
                            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                              <button
                                type="button"
                                onClick={removeImage}
                                className="bg-error/80 hover:bg-error text-white rounded-full p-3 transition-all hover:scale-110 shadow-lg"
                              >
                                <span className="material-symbols-outlined">delete</span>
                              </button>
                            </div>
                            <div className="absolute bottom-3 left-3 bg-black/60 backdrop-blur-sm rounded-lg px-3 py-1.5 flex items-center gap-2">
                              <span className="material-symbols-outlined text-secondary text-sm">check_circle</span>
                              <span className="text-xs text-white font-body">{imageFile?.name}</span>
                            </div>
                          </div>
                        ) : (
                          <div
                            onClick={() => fileInputRef.current?.click()}
                            onDragOver={handleDragOver}
                            onDragLeave={handleDragLeave}
                            onDrop={handleDrop}
                            className={`relative cursor-pointer rounded-xl border-2 border-dashed transition-all duration-300 p-8 text-center ${
                              isDragging
                                ? 'border-secondary bg-secondary/10 scale-[1.02]'
                                : 'border-outline-variant/30 hover:border-primary/50 hover:bg-primary/5'
                            }`}
                          >
                            <div className="flex flex-col items-center gap-3">
                              <div className={`w-16 h-16 rounded-2xl flex items-center justify-center transition-all duration-300 ${
                                isDragging
                                  ? 'bg-secondary/20 text-secondary scale-110'
                                  : 'bg-primary/10 text-primary'
                              }`}>
                                <span className="material-symbols-outlined text-3xl">
                                  {isDragging ? 'download' : 'add_photo_alternate'}
                                </span>
                              </div>
                              <div>
                                <p className="font-body text-white text-sm font-medium">
                                  {isDragging ? 'Drop your image here' : 'Drag & drop an image, or click to browse'}
                                </p>
                                <p className="font-body text-on-surface-variant text-xs mt-1">
                                  JPG, PNG, GIF, WebP • Max 10MB
                                </p>
                              </div>
                            </div>
                          </div>
                        )}
                        <input
                          ref={fileInputRef}
                          type="file"
                          accept="image/jpeg,image/png,image/gif,image/webp"
                          className="hidden"
                          onChange={(e) => handleImageSelect(e.target.files[0])}
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
                        <button
                          type="submit"
                          disabled={isUploading}
                          className={`w-full md:w-auto bg-gradient-to-r from-primary to-secondary text-on-primary-fixed font-headline font-bold py-4 px-12 rounded-full shadow-[0_0_30px_rgba(188,135,254,0.4)] hover:shadow-[0_0_40px_rgba(74,248,227,0.5)] hover:scale-105 transition-all duration-300 flex items-center justify-center gap-3 ${
                            isUploading ? 'opacity-60 cursor-not-allowed' : ''
                          }`}
                        >
                            {isUploading ? (
                              <>
                                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                Sealing...
                              </>
                            ) : (
                              <>
                                <span className="material-symbols-outlined">lock</span>
                                Seal Capsule
                              </>
                            )}
                        </button>
                    </div>

                </form>
            </div>
        </div>
    </div>
  );
}

export default CreateCapsule;
