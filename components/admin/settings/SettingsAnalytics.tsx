import React, { useState, useEffect } from 'react';
import { BarChart, CheckCircle2, XCircle, Loader2, Code } from 'lucide-react';

export default function SettingsAnalytics() {
  const [googleTag, setGoogleTag] = useState('');
  const [fbTag, setFbTag] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{type: 'success' | 'error', text: string} | null>(null);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const res = await fetch('/api/settings/analytics');
        if (res.ok) {
          const data = await res.json();
          setGoogleTag(data.google_analytics_tag || '');
          setFbTag(data.facebook_pixel_tag || '');
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchAnalytics();
  }, []);

  const showMessage = (type: 'success' | 'error', text: string) => {
    setMessage({ type, text });
    setTimeout(() => setMessage(null), 3000);
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await fetch('/api/settings/analytics', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          google_analytics_tag: googleTag,
          facebook_pixel_tag: fbTag
        })
      });
      if (res.ok) {
        showMessage('success', 'Analytics settings updated successfully');
      } else {
        showMessage('error', 'Failed to update analytics settings');
      }
    } catch (err) {
      showMessage('error', 'An error occurred while saving');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="flex items-center justify-center h-64"><Loader2 className="animate-spin text-luxury-gold" size={32} /></div>;
  }

  return (
    <div className="max-w-4xl space-y-6">
      <header className="mb-8">
        <h1 className="text-3xl font-serif font-bold text-luxury-black">Analytics Settings</h1>
        <p className="text-luxury-gray mt-2">Manage tracking codes and analytics tags for your website.</p>
      </header>

      {message && (
        <div className={`p-4 rounded-lg flex items-center gap-3 ${message.type === 'success' ? 'bg-green-50 text-green-800 border border-green-200' : 'bg-red-50 text-red-800 border border-red-200'}`}>
          {message.type === 'success' ? <CheckCircle2 size={20} /> : <XCircle size={20} />}
          <span className="font-medium">{message.text}</span>
        </div>
      )}

      <div className="bg-white rounded-xl shadow-sm border border-luxury-border overflow-hidden">
        <div className="p-6 border-b border-luxury-border flex items-center gap-3">
          <BarChart className="text-luxury-gold" size={24} />
          <h2 className="text-xl font-bold text-luxury-black">Tracking Codes</h2>
        </div>

        <div className="p-6 space-y-8">
          <div>
            <label className="flex items-center gap-2 text-sm font-bold text-luxury-black mb-2">
              Google Analytics / Tag Manager Script
            </label>
            <p className="text-sm text-gray-500 mb-3">Paste your analytics tracking code snippet here. It will be injected into the head of your website.</p>
            <div className="relative">
              <textarea
                value={googleTag}
                onChange={(e) => setGoogleTag(e.target.value)}
                rows={8}
                className="w-full p-4 bg-gray-50 border border-luxury-border rounded-lg focus:ring-1 focus:ring-luxury-gold outline-none font-mono text-sm text-gray-700 placeholder-gray-400"
                placeholder="<!-- Google Analytics Code -->&#10;<script>&#10;  window.dataLayer = window.dataLayer || [];&#10;  function gtag(){dataLayer.push(arguments);}&#10;  gtag('js', new Date());&#10;  gtag('config', 'G-XXXXXXX');&#10;</script>"
              />
              <Code className="absolute top-4 right-4 text-gray-300 pointer-events-none" size={20} />
            </div>
          </div>

          <div className="pt-6 border-t border-gray-100">
            <label className="flex items-center gap-2 text-sm font-bold text-luxury-black mb-2">
              Facebook Pixel Tag <span className="text-xs font-normal text-gray-400">(Optional)</span>
            </label>
            <p className="text-sm text-gray-500 mb-3">Paste your Facebook Pixel snippet here.</p>
            <div className="relative">
              <textarea
                value={fbTag}
                onChange={(e) => setFbTag(e.target.value)}
                rows={6}
                className="w-full p-4 bg-gray-50 border border-luxury-border rounded-lg focus:ring-1 focus:ring-luxury-gold outline-none font-mono text-sm text-gray-700 placeholder-gray-400"
                placeholder="<!-- Facebook Pixel Code -->&#10;<script>&#10;...&#10;</script>"
              />
              <Code className="absolute top-4 right-4 text-gray-300 pointer-events-none" size={20} />
            </div>
          </div>
        </div>

        <div className="p-6 border-t border-luxury-border bg-gray-50 flex justify-end">
          <button
            onClick={handleSave}
            disabled={saving}
            className="bg-luxury-gold text-white px-8 py-3 rounded-lg font-bold hover:bg-luxury-golddark transition-all shadow-sm flex items-center gap-2 disabled:opacity-50"
          >
            {saving ? <Loader2 className="animate-spin" size={18} /> : null}
            {saving ? 'Saving...' : 'Update Analytics Changes'}
          </button>
        </div>
      </div>
    </div>
  );
}
