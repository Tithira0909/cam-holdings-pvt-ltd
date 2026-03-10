import React, { useState, useEffect, useRef } from 'react';
import { Globe, Upload, Image as ImageIcon, CheckCircle2, XCircle, Loader2 } from 'lucide-react';

export default function SettingsSite() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{type: 'success' | 'error', text: string} | null>(null);

  const [formData, setFormData] = useState({
    site_name: '',
    contact_email: '',
    contact_phone: '',
    address: ''
  });

  const [heroPreview, setHeroPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetchSiteSettings();
  }, []);

  const fetchSiteSettings = async () => {
    try {
      const res = await fetch('/api/settings/site');
      if (res.ok) {
        const data = await res.json();
        setFormData({
          site_name: data.site_name || '',
          contact_email: data.contact_email || '',
          contact_phone: data.contact_phone || '',
          address: data.address || ''
        });
        if (data.hero_image_url) {
          setHeroPreview(data.hero_image_url);
        }
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const showMessage = (type: 'success' | 'error', text: string) => {
    setMessage({ type, text });
    setTimeout(() => setMessage(null), 3000);
  };

  const handleHeroChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;

    const file = e.target.files[0];
    const formData = new FormData();
    formData.append('hero_image', file);

    try {
      const res = await fetch('/api/settings/site/hero', {
        method: 'POST',
        body: formData
      });

      if (res.ok) {
        const data = await res.json();
        setHeroPreview(data.hero_image || data.hero_image_url);
        showMessage('success', 'Hero image updated');
      } else {
        const errorData = await res.json().catch(() => ({}));
        showMessage('error', errorData.error || 'Failed to upload hero image');
      }
    } catch (err) {
      showMessage('error', 'An error occurred while uploading hero image');
    }
  };

  const handleRemoveHero = async () => {
    try {
      const res = await fetch('/api/settings/site/hero', {
        method: 'DELETE'
      });
      if (res.ok) {
        setHeroPreview(null);
        showMessage('success', 'Hero image removed');
      } else {
        showMessage('error', 'Failed to remove hero image');
      }
    } catch (err) {
      showMessage('error', 'An error occurred while removing hero image');
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await fetch('/api/settings/site', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...formData, hero_image_url: heroPreview })
      });

      if (res.ok) {
        showMessage('success', 'Site settings saved successfully');
      } else {
        showMessage('error', 'Failed to save site settings');
      }
    } catch (err) {
      showMessage('error', 'An error occurred while saving site settings');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="flex items-center justify-center h-64"><Loader2 className="animate-spin text-red-600" size={32} /></div>;
  }

  return (
    <div className="max-w-4xl space-y-6">
      <header className="mb-8">
        <h1 className="text-3xl font-serif font-bold text-luxury-black">Site Settings</h1>
        <p className="text-luxury-gray mt-2">Manage general parameters and branding for your website.</p>
      </header>

      {message && (
        <div className={`p-4 rounded-lg flex items-center gap-3 ${message.type === 'success' ? 'bg-green-50 text-green-800 border border-green-200' : 'bg-red-50 text-red-800 border border-red-200'}`}>
          {message.type === 'success' ? <CheckCircle2 size={20} /> : <XCircle size={20} />}
          <span className="font-medium">{message.text}</span>
        </div>
      )}

      <div className="bg-white rounded-xl shadow-sm border border-luxury-border overflow-hidden">
        <div className="p-6 border-b border-luxury-border flex items-center gap-3">
          <Globe className="text-red-600" size={24} />
          <h2 className="text-xl font-bold text-luxury-black">General Information</h2>
        </div>

        <div className="p-6 md:p-8">
          <form id="siteForm" onSubmit={handleSave} className="space-y-8">

            {/* Hero Image Upload Section */}
            <div className="flex flex-col md:flex-row gap-8 items-start pb-8 border-b border-gray-100">
              <div className="flex-1 space-y-2">
                <label className="block font-bold text-luxury-black">Hero Section Image</label>
                <p className="text-sm text-gray-500">Upload the main hero/banner image for the homepage. Recommended size: 1920×900 (JPG/PNG).</p>
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleHeroChange}
                  accept="image/*"
                  className="hidden"
                />
                <div className="flex gap-4">
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="mt-4 px-4 py-2 border border-luxury-border rounded-lg text-sm font-bold flex items-center gap-2 hover:bg-gray-50 transition-colors"
                  >
                    <Upload size={16} /> Upload Hero Image
                  </button>
                  {heroPreview && (
                    <button
                      type="button"
                      onClick={handleRemoveHero}
                      className="mt-4 px-4 py-2 text-red-600 rounded-lg text-sm font-bold flex items-center gap-2 hover:bg-red-50 transition-colors"
                    >
                      Remove
                    </button>
                  )}
                </div>
              </div>

              <div className="w-full md:w-96 aspect-[21/9] bg-gray-50 border-2 border-dashed border-gray-300 rounded-xl flex items-center justify-center overflow-hidden relative">
                {heroPreview ? (
                  <img src={heroPreview} alt="Hero Preview" className="w-full h-full object-cover" />
                ) : (
                  <div className="text-center text-gray-400">
                    <ImageIcon size={32} className="mx-auto mb-2 opacity-50" />
                    <span className="text-xs font-medium">No hero image uploaded</span>
                  </div>
                )}
              </div>
            </div>

            {/* Basic Parameters */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="md:col-span-2">
                <label className="block text-sm font-bold text-luxury-black mb-2">Site Name</label>
                <input
                  type="text"
                  required
                  value={formData.site_name}
                  onChange={e => setFormData({...formData, site_name: e.target.value})}
                  className="w-full px-4 py-3 border border-luxury-border rounded-lg focus:ring-1 focus:ring-red-600 outline-none"
                  placeholder="e.g. CAM Holdings"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-luxury-black mb-2">Contact Email</label>
                <input
                  type="email"
                  value={formData.contact_email}
                  onChange={e => setFormData({...formData, contact_email: e.target.value})}
                  className="w-full px-4 py-3 border border-luxury-border rounded-lg focus:ring-1 focus:ring-red-600 outline-none"
                  placeholder="e.g. support@example.com"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-luxury-black mb-2">Contact Phone</label>
                <input
                  type="text"
                  value={formData.contact_phone}
                  onChange={e => setFormData({...formData, contact_phone: e.target.value})}
                  className="w-full px-4 py-3 border border-luxury-border rounded-lg focus:ring-1 focus:ring-red-600 outline-none"
                  placeholder="e.g. +94 11 234 5678"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-bold text-luxury-black mb-2">Primary Address</label>
                <textarea
                  rows={3}
                  value={formData.address}
                  onChange={e => setFormData({...formData, address: e.target.value})}
                  className="w-full px-4 py-3 border border-luxury-border rounded-lg focus:ring-1 focus:ring-red-600 outline-none resize-none"
                  placeholder="Enter physical address..."
                />
              </div>
            </div>

          </form>
        </div>

        <div className="p-6 border-t border-luxury-border bg-gray-50 flex justify-end">
          <button
            type="submit"
            form="siteForm"
            disabled={saving}
            className="bg-red-600 text-white px-8 py-3 rounded-lg font-bold hover:bg-red-600dark transition-all shadow-sm flex items-center gap-2 disabled:opacity-50"
          >
            {saving ? <Loader2 className="animate-spin" size={18} /> : null}
            {saving ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </div>
    </div>
  );
}
