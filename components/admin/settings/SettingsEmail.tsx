import React, { useState, useEffect } from 'react';
import { Mail, Plus, Edit, Trash2, CheckCircle2, XCircle, Loader2, Send } from 'lucide-react';

interface EmailConfig {
  id: number;
  mailer: string;
  host: string;
  port: number;
  username: string;
  encryption: string;
  from_address: string;
  from_name: string;
  status: string;
}

export default function SettingsEmail() {
  const [configs, setConfigs] = useState<EmailConfig[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingConfig, setEditingConfig] = useState<EmailConfig | null>(null);
  const [isTestModalOpen, setIsTestModalOpen] = useState(false);
  const [testEmail, setTestEmail] = useState('');
  const [testing, setTesting] = useState(false);

  const [formData, setFormData] = useState({
    mailer: 'smtp',
    host: '',
    port: 587,
    username: '',
    password: '',
    encryption: 'tls',
    from_address: '',
    from_name: '',
    status: 'Inactive'
  });

  const [message, setMessage] = useState<{type: 'success' | 'error', text: string} | null>(null);

  useEffect(() => {
    fetchConfigs();
  }, []);

  const fetchConfigs = async () => {
    try {
      const res = await fetch('/api/settings/email/all');
      if (res.ok) {
        const data = await res.json();
        setConfigs(data);
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

  const handleOpenAdd = () => {
    setEditingConfig(null);
    setFormData({
      mailer: 'smtp',
      host: '',
      port: 587,
      username: '',
      password: '',
      encryption: 'tls',
      from_address: '',
      from_name: '',
      status: 'Inactive'
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (config: EmailConfig) => {
    setEditingConfig(config);
    setFormData({
      mailer: config.mailer || 'smtp',
      host: config.host || '',
      port: config.port || 587,
      username: config.username || '',
      password: '', // Don't populate password
      encryption: config.encryption || 'tls',
      from_address: config.from_address || '',
      from_name: config.from_name || '',
      status: config.status || 'Inactive'
    });
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const url = editingConfig ? `/api/settings/email/${editingConfig.id}` : '/api/settings/email';
      const method = editingConfig ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      if (res.ok) {
        showMessage('success', `Configuration ${editingConfig ? 'updated' : 'added'} successfully`);
        setIsModalOpen(false);
        fetchConfigs();
      } else {
        const err = await res.json();
        showMessage('error', err.error || 'Failed to save configuration');
      }
    } catch (err) {
      showMessage('error', 'An error occurred while saving');
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm('Are you sure you want to delete this configuration?')) return;
    try {
      const res = await fetch(`/api/settings/email/${id}`, { method: 'DELETE' });
      if (res.ok) {
        showMessage('success', 'Configuration deleted successfully');
        fetchConfigs();
      } else {
        showMessage('error', 'Failed to delete configuration');
      }
    } catch (err) {
      showMessage('error', 'An error occurred while deleting');
    }
  };

  const handleActivate = async (id: number) => {
    try {
      const res = await fetch(`/api/settings/email/${id}/activate`, { method: 'PATCH' });
      if (res.ok) {
        showMessage('success', 'Configuration activated');
        fetchConfigs();
      } else {
        showMessage('error', 'Failed to activate configuration');
      }
    } catch (err) {
      showMessage('error', 'An error occurred while activating');
    }
  };

  const handleTestEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!testEmail) return;

    setTesting(true);
    try {
      const res = await fetch('/api/settings/email/test', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ test_email: testEmail })
      });
      if (res.ok) {
        showMessage('success', 'Test email sent successfully');
        setIsTestModalOpen(false);
        setTestEmail('');
      } else {
        const err = await res.json();
        showMessage('error', err.error || 'Failed to send test email');
      }
    } catch (err) {
      showMessage('error', 'An error occurred while sending test email');
    } finally {
      setTesting(false);
    }
  };

  if (loading) {
    return <div className="flex items-center justify-center h-64"><Loader2 className="animate-spin text-luxury-gold" size={32} /></div>;
  }

  return (
    <div className="space-y-6">
      {message && (
        <div className={`p-4 rounded-lg flex items-center gap-3 ${message.type === 'success' ? 'bg-green-50 text-green-800 border border-green-200' : 'bg-red-50 text-red-800 border border-red-200'}`}>
          {message.type === 'success' ? <CheckCircle2 size={20} /> : <XCircle size={20} />}
          <span className="font-medium">{message.text}</span>
        </div>
      )}

      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="p-6 border-b border-luxury-border flex justify-between items-center">
          <div>
            <h2 className="text-xl font-serif font-bold text-luxury-black flex items-center gap-2">
              <Mail className="text-luxury-gold" size={24} /> Email Configurations (SMTP)
            </h2>
            <p className="text-sm text-luxury-gray mt-1">Manage SMTP settings used for sending inquiry replies.</p>
          </div>
          <div className="flex gap-4">
            <button onClick={() => setIsTestModalOpen(true)} className="bg-white text-luxury-black border border-luxury-border px-4 py-2 rounded-lg font-bold text-sm hover:bg-gray-50 transition-all flex items-center gap-2 shadow-sm">
              <Send size={16} className="text-luxury-gold" /> Test Email
            </button>
            <button onClick={handleOpenAdd} className="bg-luxury-gold text-white px-4 py-2 rounded-lg font-bold text-sm hover:bg-luxury-golddark transition-all flex items-center gap-2 shadow-sm">
              <Plus size={16} /> Add Configuration
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-luxury-offwhite text-luxury-gray text-sm uppercase tracking-wider border-b border-luxury-border">
                <th className="px-6 py-4 font-bold">Host</th>
                <th className="px-6 py-4 font-bold">Username</th>
                <th className="px-6 py-4 font-bold">From Address</th>
                <th className="px-6 py-4 font-bold">Status</th>
                <th className="px-6 py-4 font-bold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-luxury-border">
              {configs.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-luxury-gray">
                    No email configurations found. Add one to enable email replies.
                  </td>
                </tr>
              ) : (
                configs.map((config) => (
                  <tr key={config.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 font-medium text-luxury-black">{config.host}:{config.port}</td>
                    <td className="px-6 py-4 text-gray-600">{config.username}</td>
                    <td className="px-6 py-4 text-gray-600">{config.from_address}</td>
                    <td className="px-6 py-4">
                      {config.status === 'Active' ? (
                        <span className="px-3 py-1 bg-green-100 text-green-700 text-xs font-bold rounded-full">Active</span>
                      ) : (
                        <button onClick={() => handleActivate(config.id)} className="px-3 py-1 bg-gray-100 text-gray-600 text-xs font-bold rounded-full hover:bg-gray-200 transition-colors">
                          Set Active
                        </button>
                      )}
                    </td>
                    <td className="px-6 py-4 flex justify-end gap-3">
                      <button onClick={() => handleOpenEdit(config)} className="text-luxury-gold hover:text-luxury-golddark p-1 rounded hover:bg-luxury-gold/10 transition-colors" title="Edit">
                        <Edit size={18} />
                      </button>
                      <button onClick={() => handleDelete(config.id)} className="text-red-500 hover:text-red-700 p-1 rounded hover:bg-red-50 transition-colors" title="Delete">
                        <Trash2 size={18} />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl max-h-[90vh] flex flex-col animate-in fade-in zoom-in-95 duration-200">
            <div className="p-6 border-b border-luxury-border flex justify-between items-center">
              <h2 className="text-xl font-serif font-bold text-luxury-black">
                {editingConfig ? 'Edit Email Configuration' : 'Add Email Configuration'}
              </h2>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-600 transition-colors">
                <XCircle size={24} />
              </button>
            </div>

            <div className="p-6 overflow-y-auto">
              <form id="emailForm" onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-bold text-luxury-black mb-1">Host (SMTP Server)*</label>
                    <input type="text" required value={formData.host} onChange={e => setFormData({...formData, host: e.target.value})} className="w-full px-3 py-2 border border-luxury-border rounded-lg focus:ring-1 focus:ring-luxury-gold outline-none" placeholder="smtp.gmail.com" />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-luxury-black mb-1">Port*</label>
                    <input type="number" required value={formData.port} onChange={e => setFormData({...formData, port: parseInt(e.target.value)})} className="w-full px-3 py-2 border border-luxury-border rounded-lg focus:ring-1 focus:ring-luxury-gold outline-none" placeholder="587" />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-luxury-black mb-1">Username*</label>
                    <input type="text" required value={formData.username} onChange={e => setFormData({...formData, username: e.target.value})} className="w-full px-3 py-2 border border-luxury-border rounded-lg focus:ring-1 focus:ring-luxury-gold outline-none" placeholder="user@example.com" />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-luxury-black mb-1">Password {editingConfig && '(Leave blank to keep)'}</label>
                    <input type="password" required={!editingConfig} value={formData.password} onChange={e => setFormData({...formData, password: e.target.value})} className="w-full px-3 py-2 border border-luxury-border rounded-lg focus:ring-1 focus:ring-luxury-gold outline-none" placeholder="••••••••" />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-luxury-black mb-1">Encryption</label>
                    <select value={formData.encryption} onChange={e => setFormData({...formData, encryption: e.target.value})} className="w-full px-3 py-2 border border-luxury-border rounded-lg focus:ring-1 focus:ring-luxury-gold outline-none bg-white">
                      <option value="tls">TLS (STARTTLS)</option>
                      <option value="ssl">SSL</option>
                      <option value="none">None</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-luxury-black mb-1">Status</label>
                    <select value={formData.status} onChange={e => setFormData({...formData, status: e.target.value})} className="w-full px-3 py-2 border border-luxury-border rounded-lg focus:ring-1 focus:ring-luxury-gold outline-none bg-white">
                      <option value="Active">Active</option>
                      <option value="Inactive">Inactive</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-luxury-black mb-1">From Address*</label>
                    <input type="email" required value={formData.from_address} onChange={e => setFormData({...formData, from_address: e.target.value})} className="w-full px-3 py-2 border border-luxury-border rounded-lg focus:ring-1 focus:ring-luxury-gold outline-none" placeholder="noreply@example.com" />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-luxury-black mb-1">From Name</label>
                    <input type="text" value={formData.from_name} onChange={e => setFormData({...formData, from_name: e.target.value})} className="w-full px-3 py-2 border border-luxury-border rounded-lg focus:ring-1 focus:ring-luxury-gold outline-none" placeholder="CAM Holdings" />
                  </div>
                </div>
              </form>
            </div>

            <div className="p-6 border-t border-luxury-border flex justify-end gap-3 bg-gray-50 rounded-b-xl">
              <button onClick={() => setIsModalOpen(false)} className="px-4 py-2 text-gray-600 font-bold hover:bg-gray-200 rounded-lg transition-colors">
                Cancel
              </button>
              <button form="emailForm" type="submit" className="px-6 py-2 bg-luxury-gold text-white font-bold rounded-lg hover:bg-luxury-golddark transition-colors shadow-sm">
                Save Configuration
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Test Email Modal */}
      {isTestModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md flex flex-col animate-in fade-in zoom-in-95 duration-200">
            <div className="p-6 border-b border-luxury-border flex justify-between items-center">
              <h2 className="text-xl font-serif font-bold text-luxury-black">Send Test Email</h2>
              <button onClick={() => setIsTestModalOpen(false)} className="text-gray-400 hover:text-gray-600 transition-colors">
                <XCircle size={24} />
              </button>
            </div>

            <div className="p-6">
              <form id="testEmailForm" onSubmit={handleTestEmail} className="space-y-4">
                <div>
                  <label className="block text-sm font-bold text-luxury-black mb-1">Recipient Email Address</label>
                  <input
                    type="email"
                    required
                    value={testEmail}
                    onChange={e => setTestEmail(e.target.value)}
                    className="w-full px-3 py-2 border border-luxury-border rounded-lg focus:ring-1 focus:ring-luxury-gold outline-none"
                    placeholder="you@example.com"
                  />
                  <p className="text-xs text-gray-500 mt-2">This will send a test email using the currently <strong>Active</strong> configuration.</p>
                </div>
              </form>
            </div>

            <div className="p-6 border-t border-luxury-border flex justify-end gap-3 bg-gray-50 rounded-b-xl">
              <button onClick={() => setIsTestModalOpen(false)} className="px-4 py-2 text-gray-600 font-bold hover:bg-gray-200 rounded-lg transition-colors">
                Cancel
              </button>
              <button form="testEmailForm" type="submit" disabled={testing} className="px-6 py-2 bg-luxury-gold text-white font-bold rounded-lg hover:bg-luxury-golddark transition-colors shadow-sm flex items-center gap-2 disabled:opacity-50">
                {testing ? <Loader2 className="animate-spin" size={16} /> : <Send size={16} />}
                {testing ? 'Sending...' : 'Send Test'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
