import React, { useState, useEffect } from 'react';
import { Building, Image as ImageIcon, Monitor, Check, AlertCircle } from 'lucide-react';

export default function SettingsSite() {
  const [companyName, setCompanyName] = useState('CAM Holdings');
  const [supportEmail, setSupportEmail] = useState('support@camholdings.lk');
  const [primaryColor, setPrimaryColor] = useState('#D4AF37');
  const [darkMode, setDarkMode] = useState(false);
  const [logoPreview, setLogoPreview] = useState<string | null>(null);

  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

  useEffect(() => {
    fetch('/api/settings')
      .then(res => res.json())
      .then(data => {
        setCompanyName(data.companyName || 'CAM Holdings');
        setSupportEmail(data.supportEmail || 'support@camholdings.lk');
        setPrimaryColor(data.primaryColor || '#D4AF37');
        setDarkMode(data.darkMode || false);
        setLogoPreview(data.siteLogo || null);
      })
      .catch(err => console.error('Error fetching settings:', err));
  }, []);

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setLogoPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSiteSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);

    if (!companyName || !supportEmail) {
       setMessage({ type: 'error', text: 'Company name and support email are required.' });
       return;
    }

    try {
        const res = await fetch('/api/settings', {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ companyName, supportEmail, primaryColor, darkMode, siteLogo: logoPreview })
        });

        if (res.ok) {
             setMessage({ type: 'success', text: 'Site settings updated successfully!' });
        } else {
             setMessage({ type: 'error', text: 'Failed to update site settings.' });
        }
    } catch(err) {
         setMessage({ type: 'error', text: 'An error occurred.' });
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <header className="mb-8">
        <h1 className="text-3xl font-serif font-bold text-luxury-black">Site Settings</h1>
        <p className="text-luxury-gray mt-2">Manage your website's basic parameters, logo, and theme.</p>
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
            <Building className="text-luxury-gold" size={24} /> General Information
          </h2>
        </div>
        <div className="p-6">
          <form onSubmit={handleSiteSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-bold text-luxury-black mb-1">Site/Company Name</label>
                <input
                  type="text"
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  className="w-full px-3 py-2 border border-luxury-border rounded-lg focus:ring-1 focus:ring-luxury-gold focus:border-luxury-gold outline-none transition-all"
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-luxury-black mb-1">Support Email</label>
                <input
                  type="email"
                  value={supportEmail}
                  onChange={(e) => setSupportEmail(e.target.value)}
                  className="w-full px-3 py-2 border border-luxury-border rounded-lg focus:ring-1 focus:ring-luxury-gold focus:border-luxury-gold outline-none transition-all"
                />
              </div>
            </div>

            <div className="space-y-4 py-6 border-t border-luxury-border">
              <h3 className="font-bold text-luxury-black flex items-center gap-2">
                <ImageIcon className="text-luxury-gold" size={18} /> Logo Upload
              </h3>
              <div className="flex items-center gap-6">
                <div className="w-32 h-32 border-2 border-dashed border-luxury-border rounded-xl flex items-center justify-center bg-gray-50 overflow-hidden">
                  {logoPreview ? (
                    <img src={logoPreview} alt="Logo Preview" className="w-full h-full object-contain p-2" />
                  ) : (
                    <ImageIcon className="text-gray-300" size={48} />
                  )}
                </div>
                <div>
                  <input
                    type="file"
                    id="logo-upload"
                    accept="image/*"
                    onChange={handleLogoUpload}
                    className="hidden"
                  />
                  <label
                    htmlFor="logo-upload"
                    className="cursor-pointer bg-white text-luxury-black border border-luxury-border px-4 py-2 rounded-lg font-bold hover:bg-gray-50 transition-all text-sm inline-block mb-2"
                  >
                    Choose Image
                  </label>
                  <p className="text-xs text-luxury-gray">Recommended size: 250x100px. Max size: 2MB.</p>
                </div>
              </div>
            </div>

            <div className="space-y-6 py-6 border-t border-luxury-border">
               <h3 className="font-bold text-luxury-black flex items-center gap-2">
                <Monitor className="text-luxury-gold" size={18} /> Appearance & Theme
               </h3>
              <div>
                <label className="block text-sm font-bold text-luxury-black mb-1">Primary Color (Brand Accent)</label>
                <div className="flex items-center gap-3">
                  <input
                    type="color"
                    value={primaryColor}
                    onChange={(e) => setPrimaryColor(e.target.value)}
                    className="w-10 h-10 p-1 border border-luxury-border rounded cursor-pointer"
                  />
                  <input
                    type="text"
                    value={primaryColor}
                    onChange={(e) => setPrimaryColor(e.target.value)}
                    className="flex-1 max-w-[200px] px-3 py-2 border border-luxury-border rounded-lg focus:ring-1 focus:ring-luxury-gold focus:border-luxury-gold outline-none transition-all uppercase font-mono text-sm"
                  />
                </div>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-bold text-luxury-black">Dark Mode Preview</h3>
                  <p className="text-sm text-luxury-gray">Enable dark mode theme across the admin dashboard</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" className="sr-only peer" checked={darkMode} onChange={() => setDarkMode(!darkMode)} />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-luxury-gold"></div>
                </label>
              </div>
            </div>

            <div className="pt-6 border-t border-luxury-border text-right">
              <button type="submit" className="bg-luxury-gold text-white px-8 py-3 rounded-lg font-bold uppercase tracking-wider hover:bg-luxury-golddark transition-all">
                Save Changes
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
