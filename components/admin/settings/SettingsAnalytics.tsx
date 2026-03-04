import React, { useState, useEffect } from 'react';
import { BarChart, Save, Check, AlertCircle } from 'lucide-react';

export default function SettingsAnalytics() {
  const [analyticsTag, setAnalyticsTag] = useState('');
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetch('/api/settings')
      .then(res => res.json())
      .then(data => {
        if (data.analyticsTag) setAnalyticsTag(data.analyticsTag);
      })
      .catch(err => console.error('Error fetching analytics:', err));
  }, []);

  const handleSave = async () => {
    setLoading(true);
    setMessage(null);
    try {
      const res = await fetch('/api/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ analyticsTag })
      });
      if (res.ok) {
        setMessage({ type: 'success', text: 'Analytics settings updated successfully!' });
      } else {
        setMessage({ type: 'error', text: 'Failed to save analytics settings.' });
      }
    } catch (err) {
      setMessage({ type: 'error', text: 'An error occurred.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <header className="mb-8">
        <h1 className="text-3xl font-serif font-bold text-luxury-black">Analytics Settings</h1>
        <p className="text-luxury-gray mt-2">Manage tracking codes and analytics tags for your website.</p>
      </header>

      {message && (
        <div className={`p-4 rounded-lg flex items-center gap-3 ${message.type === 'success' ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-red-50 text-red-700 border border-red-200'}`}>
           {message.type === 'success' ? <Check size={20} /> : <AlertCircle size={20} />}
           <p className="font-medium">{message.text}</p>
        </div>
      )}

      <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-luxury-border">
        <div className="p-6 border-b border-luxury-border">
          <h2 className="text-xl font-serif font-bold text-luxury-black flex items-center gap-2">
            <BarChart className="text-luxury-gold" size={24} /> Tracking Codes
          </h2>
        </div>
        <div className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-bold text-luxury-black mb-2">Google Analytics / Tag Manager Script</label>
            <p className="text-sm text-luxury-gray mb-4">Paste your analytics tracking code snippet here. It will be injected into the head of your website.</p>
            <textarea
              rows={8}
              value={analyticsTag}
              onChange={(e) => setAnalyticsTag(e.target.value)}
              className="w-full px-4 py-3 border border-luxury-border rounded-lg focus:ring-1 focus:ring-luxury-gold focus:border-luxury-gold outline-none transition-all font-mono text-sm bg-gray-50"
              placeholder="<!-- Google Analytics Code -->&#10;<script>&#10;  window.dataLayer = window.dataLayer || [];&#10;  function gtag(){dataLayer.push(arguments);}&#10;  gtag('js', new Date());&#10;  gtag('config', 'G-XXXXXXX');&#10;</script>"
            />
          </div>
        </div>
        <div className="p-6 bg-gray-50 border-t border-luxury-border text-right">
          <button
            onClick={handleSave}
            disabled={loading}
            className="bg-luxury-gold text-white px-6 py-2 rounded-lg font-bold uppercase tracking-wider hover:bg-luxury-golddark transition-all flex items-center gap-2 ml-auto"
          >
            <Save size={18} />
            {loading ? 'Saving...' : 'Save/Update'}
          </button>
        </div>
      </div>
    </div>
  );
}
