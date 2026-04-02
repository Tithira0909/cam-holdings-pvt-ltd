import React, { useState, useEffect } from 'react';
import { Upload, Save, Loader2, Image as ImageIcon } from 'lucide-react';

const Settings: React.FC = () => {
  const [currentHeroImage, setCurrentHeroImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const res = await fetch('/api/settings/hero');
      if (res.ok) {
        const data = await res.json();
        setCurrentHeroImage(data.hero_image);
      }
    } catch (error) {
      console.error('Failed to fetch settings:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      setFile(selectedFile);
      setPreview(URL.createObjectURL(selectedFile));
    }
  };

  const handleSave = async () => {
    if (!file) return;

    setSaving(true);
    const formData = new FormData();
    formData.append('hero_image', file);

    try {
      const res = await fetch('/api/admin/settings/hero', {
        method: 'POST',
        body: formData,
      });

      if (res.ok) {
        const data = await res.json();
        setCurrentHeroImage(data.hero_image);
        setFile(null);
        setPreview(null);
        alert('Hero image updated successfully!');
      } else {
        alert('Failed to update hero image.');
      }
    } catch (error) {
      console.error('Error saving settings:', error);
      alert('An error occurred.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64 text-luxury-gold">
        <Loader2 className="animate-spin" size={32} />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-serif font-bold text-luxury-black">Site Settings</h2>
      </div>

      <div className="bg-white p-8 rounded-xl shadow-sm border border-luxury-border">
        <h3 className="text-lg font-bold text-luxury-black mb-6 flex items-center gap-2">
          <ImageIcon size={20} className="text-luxury-gold" />
          Homepage Hero Image
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <label className="block text-sm font-bold text-luxury-gray mb-2">Current Image</label>
            <div className="aspect-video w-full rounded-lg overflow-hidden bg-gray-100 border border-luxury-border">
              {currentHeroImage ? (
                <img
                  src={currentHeroImage}
                  alt="Current Hero"
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="flex items-center justify-center h-full text-gray-400">
                  No image set
                </div>
              )}
            </div>
            <p className="text-xs text-gray-500 mt-2">This is the image currently displayed on the homepage.</p>
          </div>

          <div>
            <label className="block text-sm font-bold text-luxury-gray mb-2">Upload New Image</label>

            <div className="border-2 border-dashed border-luxury-border rounded-lg p-6 text-center hover:border-luxury-gold transition-colors">
              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
                id="hero-upload"
              />
              <label htmlFor="hero-upload" className="cursor-pointer block">
                {preview ? (
                   <div className="aspect-video w-full rounded-lg overflow-hidden mb-4 relative">
                     <img src={preview} alt="Preview" className="w-full h-full object-cover" />
                     <div className="absolute inset-0 bg-black/20 flex items-center justify-center text-white font-bold opacity-0 hover:opacity-100 transition-opacity">
                       Click to Change
                     </div>
                   </div>
                ) : (
                  <div className="py-8">
                    <Upload className="mx-auto text-luxury-gray mb-3" size={32} />
                    <span className="text-sm text-luxury-gray font-medium">Click to upload or drag and drop</span>
                    <p className="text-xs text-gray-400 mt-1">JPG, PNG, WEBP up to 5MB</p>
                  </div>
                )}
              </label>
            </div>

            <div className="mt-6 flex justify-end">
              <button
                onClick={handleSave}
                disabled={!file || saving}
                className={`flex items-center gap-2 px-6 py-3 rounded-lg font-bold text-white transition-all ${
                  !file || saving
                    ? 'bg-gray-300 cursor-not-allowed'
                    : 'bg-luxury-gold hover:bg-luxury-golddark shadow-gold-glow'
                }`}
              >
                {saving ? <Loader2 className="animate-spin" size={18} /> : <Save size={18} />}
                {saving ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
