import React, { useState } from 'react';
import { Mail, Plus, Edit2, Trash2 } from 'lucide-react';

export default function SettingsEmail() {
  const [emails, setEmails] = useState([
    { id: 1, provider: 'SendGrid SMTP', host: 'smtp.sendgrid.net', port: 587, user: 'apikey', active: true },
    { id: 2, provider: 'Gmail SMTP', host: 'smtp.gmail.com', port: 465, user: 'support@camholdings.lk', active: false },
  ]);

  const toggleActive = (id: number) => {
    setEmails(emails.map(email => ({
      ...email,
      active: email.id === id ? !email.active : email.active
    })));
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <header className="mb-8 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-serif font-bold text-luxury-black">Email Settings</h1>
          <p className="text-luxury-gray mt-2">Manage SMTP configurations for system emails.</p>
        </div>
        <button className="bg-luxury-gold text-white px-4 py-2 rounded-lg font-bold flex items-center gap-2 hover:bg-luxury-golddark transition-all">
          <Plus size={18} />
          Add New SMTP
        </button>
      </header>

      <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-luxury-border">
        <div className="p-6 border-b border-luxury-border">
          <h2 className="text-xl font-serif font-bold text-luxury-black flex items-center gap-2">
             <Mail className="text-luxury-gold" size={24} /> Configured Providers
          </h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-luxury-offwhite text-left">
              <tr>
                <th className="px-6 py-4 text-xs font-bold text-luxury-gray uppercase tracking-wider">Provider / Host</th>
                <th className="px-6 py-4 text-xs font-bold text-luxury-gray uppercase tracking-wider">Port</th>
                <th className="px-6 py-4 text-xs font-bold text-luxury-gray uppercase tracking-wider">Username</th>
                <th className="px-6 py-4 text-xs font-bold text-luxury-gray uppercase tracking-wider text-center">Active Status</th>
                <th className="px-6 py-4 text-xs font-bold text-luxury-gray uppercase tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-luxury-border">
              {emails.map((email) => (
                <tr key={email.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4">
                    <p className="font-bold text-luxury-black">{email.provider}</p>
                    <p className="text-xs text-luxury-gray">{email.host}</p>
                  </td>
                  <td className="px-6 py-4 text-sm font-mono text-gray-600">
                    {email.port}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    {email.user}
                  </td>
                  <td className="px-6 py-4 text-center">
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        className="sr-only peer"
                        checked={email.active}
                        onChange={() => toggleActive(email.id)}
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-luxury-gold"></div>
                    </label>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button className="text-luxury-gray hover:text-luxury-gold transition-colors mx-2"><Edit2 size={16} /></button>
                    <button className="text-luxury-gray hover:text-red-500 transition-colors mx-2"><Trash2 size={16} /></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
