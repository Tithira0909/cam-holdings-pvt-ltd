import React, { useState, useEffect } from 'react';
import { User, Mail, Lock, Building, Monitor, Shield, LogOut, Check, AlertCircle } from 'lucide-react';

export default function Settings() {
  const [adminName, setAdminName] = useState('Admin');
  const [adminEmail, setAdminEmail] = useState('admin@camholdings.lk');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [companyName, setCompanyName] = useState('CAM Holdings');
  const [supportEmail, setSupportEmail] = useState('support@camholdings.lk');
  const [primaryColor, setPrimaryColor] = useState('#D4AF37'); // CAM Gold
  const [darkMode, setDarkMode] = useState(false);

  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const res = await fetch('/api/settings');
      if (res.ok) {
        const data = await res.json();
        setCompanyName(data.companyName || 'CAM Holdings');
        setSupportEmail(data.supportEmail || 'support@camholdings.lk');
        setPrimaryColor(data.primaryColor || '#D4AF37');
        setDarkMode(data.darkMode || false);
        setAdminName(data.adminName || 'Admin');
        setAdminEmail(data.adminEmail || 'admin@camholdings.lk');
      }
    } catch (err) {
      console.error('Failed to fetch settings:', err);
    }
  };

  const handleAccountSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);

    // Basic validation
    if (!adminName) {
      setMessage({ type: 'error', text: 'Admin name is required.' });
      return;
    }

    if (newPassword || confirmPassword || currentPassword) {
        if (!currentPassword || !newPassword || !confirmPassword) {
             setMessage({ type: 'error', text: 'All password fields are required to change password.' });
             return;
        }
        if (newPassword !== confirmPassword) {
            setMessage({ type: 'error', text: 'New passwords do not match.' });
            return;
        }

        try {
            const res = await fetch('/api/admin/change-password', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ currentPassword, newPassword })
            });

            if (!res.ok) {
                setMessage({ type: 'error', text: 'Failed to change password. Incorrect current password?' });
                return;
            }

            setCurrentPassword('');
            setNewPassword('');
            setConfirmPassword('');
        } catch (error) {
            setMessage({ type: 'error', text: 'An error occurred while changing password.' });
            return;
        }
    }

    try {
        const res = await fetch('/api/settings', {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ adminName, adminEmail, companyName, supportEmail, primaryColor, darkMode })
        });

        if (res.ok) {
             setMessage({ type: 'success', text: 'Account settings updated successfully!' });
        } else {
             setMessage({ type: 'error', text: 'Failed to update account settings.' });
        }
    } catch(err) {
         setMessage({ type: 'error', text: 'An error occurred.' });
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
            body: JSON.stringify({ adminName, adminEmail, companyName, supportEmail, primaryColor, darkMode })
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
    <div className="max-w-6xl mx-auto space-y-6">
      <header className="mb-8">
        <h1 className="text-3xl font-serif font-bold text-luxury-black">Settings</h1>
        <p className="text-luxury-gray mt-2">Manage admin preferences and website configuration.</p>
      </header>

      {message && (
        <div className={`p-4 rounded-lg flex items-center gap-3 ${message.type === 'success' ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-red-50 text-red-700 border border-red-200'}`}>
           {message.type === 'success' ? <Check size={20} /> : <AlertCircle size={20} />}
           <p className="font-medium">{message.text}</p>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left Column: Account Settings */}
        <div className="space-y-8">
          <div className="bg-white rounded-xl shadow-sm overflow-hidden">
            <div className="p-6 border-b border-luxury-border">
              <h2 className="text-xl font-serif font-bold text-luxury-black flex items-center gap-2">
                <User className="text-luxury-gold" size={24} /> Account Settings
              </h2>
            </div>
            <div className="p-6">
              <form onSubmit={handleAccountSubmit} className="space-y-6">
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-bold text-luxury-black mb-1">Admin Name</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <User size={16} className="text-gray-400" />
                      </div>
                      <input
                        type="text"
                        value={adminName}
                        onChange={(e) => setAdminName(e.target.value)}
                        className="w-full pl-10 pr-3 py-2 border border-luxury-border rounded-lg focus:ring-1 focus:ring-luxury-gold focus:border-luxury-gold outline-none transition-all"
                        placeholder="Admin Name"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-luxury-black mb-1">Admin Email (Read Only)</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Mail size={16} className="text-gray-400" />
                      </div>
                      <input
                        type="email"
                        value={adminEmail}
                        onChange={(e) => setAdminEmail(e.target.value)}
                        readOnly
                        className="w-full pl-10 pr-3 py-2 border border-luxury-border rounded-lg bg-gray-50 text-gray-500 outline-none"
                      />
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t border-luxury-border space-y-4">
                  <h3 className="font-bold text-luxury-black flex items-center gap-2">
                     <Lock className="text-luxury-gold" size={18} /> Change Password
                  </h3>
                  <div>
                    <label className="block text-sm font-bold text-luxury-black mb-1">Current Password</label>
                    <input
                      type="password"
                      value={currentPassword}
                      onChange={(e) => setCurrentPassword(e.target.value)}
                      className="w-full px-3 py-2 border border-luxury-border rounded-lg focus:ring-1 focus:ring-luxury-gold focus:border-luxury-gold outline-none transition-all"
                      placeholder="••••••••"
                    />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-bold text-luxury-black mb-1">New Password</label>
                      <input
                        type="password"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        className="w-full px-3 py-2 border border-luxury-border rounded-lg focus:ring-1 focus:ring-luxury-gold focus:border-luxury-gold outline-none transition-all"
                        placeholder="••••••••"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-luxury-black mb-1">Confirm Password</label>
                      <input
                        type="password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        className="w-full px-3 py-2 border border-luxury-border rounded-lg focus:ring-1 focus:ring-luxury-gold focus:border-luxury-gold outline-none transition-all"
                        placeholder="••••••••"
                      />
                    </div>
                  </div>
                </div>

                <div className="pt-2">
                  <button type="submit" className="w-full bg-luxury-gold text-white px-6 py-3 rounded-lg font-bold uppercase tracking-wider hover:bg-luxury-golddark transition-all shadow-sm">
                    Save Changes
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>

        {/* Right Column: Site Settings & Security */}
        <div className="space-y-8">
          <div className="bg-white rounded-xl shadow-sm overflow-hidden">
            <div className="p-6 border-b border-luxury-border">
              <h2 className="text-xl font-serif font-bold text-luxury-black flex items-center gap-2">
                <Building className="text-luxury-gold" size={24} /> Site Settings
              </h2>
            </div>
            <div className="p-6">
              <form onSubmit={handleSiteSubmit} className="space-y-6">
                <div>
                  <label className="block text-sm font-bold text-luxury-black mb-1">Company Name</label>
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
                <div>
                  <label className="block text-sm font-bold text-luxury-black mb-1">Primary Color (CAM Gold)</label>
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
                      className="flex-1 px-3 py-2 border border-luxury-border rounded-lg focus:ring-1 focus:ring-luxury-gold focus:border-luxury-gold outline-none transition-all uppercase"
                    />
                  </div>
                </div>
                <div className="flex items-center justify-between py-2 border-t border-luxury-border">
                  <div>
                    <h3 className="font-bold text-luxury-black flex items-center gap-2">
                      <Monitor className="text-luxury-gold" size={18} /> Dark Mode
                    </h3>
                    <p className="text-sm text-luxury-gray">Enable dark mode for the dashboard</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" className="sr-only peer" checked={darkMode} onChange={() => setDarkMode(!darkMode)} />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-luxury-gold"></div>
                  </label>
                </div>
                <div className="pt-2">
                  <button type="submit" className="w-full bg-white text-luxury-black border-2 border-luxury-gold px-6 py-3 rounded-lg font-bold uppercase tracking-wider hover:bg-luxury-gold/5 transition-all">
                    Save Site Settings
                  </button>
                </div>
              </form>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm overflow-hidden">
             <div className="p-6 border-b border-luxury-border">
                <h2 className="text-xl font-serif font-bold text-luxury-black flex items-center gap-2">
                  <Shield className="text-luxury-gold" size={24} /> Security & Session
                </h2>
             </div>
             <div className="p-6 space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-bold text-luxury-black">Two-Factor Authentication</h3>
                    <p className="text-sm text-luxury-gray">Add an extra layer of security</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" className="sr-only peer" />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-luxury-gold"></div>
                  </label>
                </div>
                <div className="pt-4 border-t border-luxury-border">
                   <button className="w-full flex items-center justify-center gap-2 bg-red-50 text-red-600 border border-red-200 px-6 py-3 rounded-lg font-bold hover:bg-red-100 transition-all">
                     <LogOut size={18} /> Logout all sessions
                   </button>
                </div>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
}
