import React, { useState, useEffect } from 'react';
import { Shield, Plus, Edit, Trash2, Search, CheckCircle2, XCircle, Loader2 } from 'lucide-react';

interface Role {
  id: number;
  role_name: string;
  users_count: number;
  access_level: string | string[];
  status: string;
}

const ALL_MODULES = ['Properties', 'Projects', 'Services', 'Inquiries', 'Settings'];

export default function SettingsPermissions() {
  const [roles, setRoles] = useState<Role[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingRole, setEditingRole] = useState<Role | null>(null);
  const [message, setMessage] = useState<{type: 'success' | 'error', text: string} | null>(null);

  const [formData, setFormData] = useState({
    role_name: '',
    access_type: 'Full Access', // Full Access, Read Only, Custom
    custom_modules: [] as string[],
    status: 'Active'
  });

  useEffect(() => {
    fetchRoles();
  }, []);

  const fetchRoles = async () => {
    try {
      const res = await fetch('/api/settings/roles');
      if (res.ok) {
        const data = await res.json();
        setRoles(data);
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

  const filteredRoles = roles.filter(r => r.role_name.toLowerCase().includes(searchTerm.toLowerCase()));

  const handleOpenAdd = () => {
    setEditingRole(null);
    setFormData({
      role_name: '',
      access_type: 'Full Access',
      custom_modules: [],
      status: 'Active'
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (role: Role) => {
    setEditingRole(role);
    let access_type = 'Custom';
    let custom_modules: string[] = [];

    if (role.access_level === 'Full Access' || role.access_level === 'Read Only') {
      access_type = role.access_level;
    } else if (Array.isArray(role.access_level)) {
      custom_modules = role.access_level;
    } else if (typeof role.access_level === 'string') {
      // maybe JSON parsed later
      try {
        custom_modules = JSON.parse(role.access_level);
      } catch(e) {
        custom_modules = [role.access_level];
      }
    }

    setFormData({
      role_name: role.role_name,
      access_type,
      custom_modules,
      status: role.status
    });
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const url = editingRole ? `/api/settings/roles/${editingRole.id}` : '/api/settings/roles';
      const method = editingRole ? 'PUT' : 'POST';

      const payload = {
        role_name: formData.role_name,
        status: formData.status,
        access_level: formData.access_type === 'Custom' ? formData.custom_modules : formData.access_type
      };

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (res.ok) {
        showMessage('success', `Role ${editingRole ? 'updated' : 'added'} successfully`);
        setIsModalOpen(false);
        fetchRoles();
      } else {
        const err = await res.json();
        showMessage('error', err.error || 'Failed to save role');
      }
    } catch (err) {
      showMessage('error', 'An error occurred while saving');
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm('Are you sure you want to delete this role?')) return;
    try {
      const res = await fetch(`/api/settings/roles/${id}`, { method: 'DELETE' });
      if (res.ok) {
        showMessage('success', 'Role deleted successfully');
        fetchRoles();
      } else {
        const err = await res.json();
        showMessage('error', err.error || 'Failed to delete role');
      }
    } catch (err) {
      showMessage('error', 'An error occurred while deleting');
    }
  };

  const toggleModule = (mod: string) => {
    setFormData(prev => ({
      ...prev,
      custom_modules: prev.custom_modules.includes(mod)
        ? prev.custom_modules.filter(m => m !== mod)
        : [...prev.custom_modules, mod]
    }));
  };

  if (loading) {
    return <div className="flex items-center justify-center h-64"><Loader2 className="animate-spin text-red-600" size={32} /></div>;
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
        <div className="p-6 border-b border-luxury-border flex flex-col md:flex-row justify-between items-center gap-4">
          <div>
            <h2 className="text-xl font-serif font-bold text-luxury-black flex items-center gap-2">
              <Shield className="text-red-600" size={24} /> Permission Settings
            </h2>
          </div>
          <div className="flex gap-4 w-full md:w-auto">
            <div className="relative flex-1 md:w-64">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search size={16} className="text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search roles..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-3 py-2 border border-luxury-border rounded-lg focus:ring-1 focus:ring-red-600 outline-none text-sm"
              />
            </div>
            <button onClick={handleOpenAdd} className="bg-red-600 text-white px-4 py-2 rounded-lg font-bold text-sm hover:bg-red-700 transition-all flex items-center gap-2 shadow-sm whitespace-nowrap">
              <Plus size={16} /> Add New Role
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-luxury-offwhite text-luxury-gray text-xs uppercase tracking-wider border-b border-luxury-border">
                <th className="px-6 py-4 font-bold">Role Name</th>
                <th className="px-6 py-4 font-bold">Users</th>
                <th className="px-6 py-4 font-bold">Access Level</th>
                <th className="px-6 py-4 font-bold">Status</th>
                <th className="px-6 py-4 font-bold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-luxury-border">
              {filteredRoles.map((role) => (
                <tr key={role.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 font-bold text-luxury-black">{role.role_name}</td>
                  <td className="px-6 py-4 text-gray-600 font-medium">{role.users_count} Users</td>
                  <td className="px-6 py-4">
                    <div className="flex flex-wrap gap-1">
                      {Array.isArray(role.access_level) ? (
                        role.access_level.map((acc, i) => (
                          <span key={i} className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded border border-gray-200">{acc}</span>
                        ))
                      ) : (
                        <span className="px-2 py-1 bg-red-600/10 text-red-700 text-xs font-bold rounded border border-red-600/20">{role.access_level}</span>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 text-xs font-bold rounded-full ${role.status === 'Active' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'}`}>
                      {role.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 flex justify-end gap-3">
                    <button onClick={() => handleOpenEdit(role)} className="text-luxury-gray hover:text-red-600 p-1 transition-colors" title="Edit">
                      <Edit size={18} />
                    </button>
                    <button onClick={() => handleDelete(role.id)} className="text-luxury-gray hover:text-red-500 p-1 transition-colors" title="Delete">
                      <Trash2 size={18} />
                    </button>
                  </td>
                </tr>
              ))}
              {filteredRoles.length === 0 && (
                 <tr><td colSpan={5} className="text-center py-8 text-gray-500">No roles found.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-lg flex flex-col animate-in fade-in zoom-in-95 duration-200">
            <div className="p-6 border-b border-luxury-border flex justify-between items-center">
              <h2 className="text-xl font-serif font-bold text-luxury-black">
                {editingRole ? 'Edit Role' : 'Add New Role'}
              </h2>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-600 transition-colors">
                <XCircle size={24} />
              </button>
            </div>

            <div className="p-6 overflow-y-auto">
              <form id="roleForm" onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="block text-sm font-bold text-luxury-black mb-1">Role Name</label>
                  <input type="text" required value={formData.role_name} onChange={e => setFormData({...formData, role_name: e.target.value})} className="w-full px-3 py-2 border border-luxury-border rounded-lg focus:ring-1 focus:ring-red-600 outline-none" placeholder="e.g. Content Editor" />
                </div>

                <div>
                  <label className="block text-sm font-bold text-luxury-black mb-1">Access Level</label>
                  <select value={formData.access_type} onChange={e => setFormData({...formData, access_type: e.target.value})} className="w-full px-3 py-2 border border-luxury-border rounded-lg focus:ring-1 focus:ring-red-600 outline-none bg-white mb-3">
                    <option value="Full Access">Full Access</option>
                    <option value="Read Only">Read Only</option>
                    <option value="Custom">Custom Modules</option>
                  </select>

                  {formData.access_type === 'Custom' && (
                    <div className="grid grid-cols-2 gap-2 p-4 bg-gray-50 rounded-lg border border-gray-200">
                      {ALL_MODULES.map(mod => (
                        <label key={mod} className="flex items-center gap-2 cursor-pointer">
                           <input type="checkbox" checked={formData.custom_modules.includes(mod)} onChange={() => toggleModule(mod)} className="rounded border-gray-300 text-red-600 focus:ring-red-600" />
                           <span className="text-sm text-gray-700">{mod}</span>
                        </label>
                      ))}
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-bold text-luxury-black mb-1">Status</label>
                  <div className="flex items-center gap-3">
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" className="sr-only peer" checked={formData.status === 'Active'} onChange={e => setFormData({...formData, status: e.target.checked ? 'Active' : 'Inactive'})} />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-red-600"></div>
                    </label>
                    <span className="text-sm font-medium text-gray-700">{formData.status}</span>
                  </div>
                </div>
              </form>
            </div>

            <div className="p-6 border-t border-luxury-border flex justify-end gap-3 bg-gray-50 rounded-b-xl">
              <button onClick={() => setIsModalOpen(false)} className="px-4 py-2 text-gray-600 font-bold hover:bg-gray-200 rounded-lg transition-colors">
                Cancel
              </button>
              <button form="roleForm" type="submit" className="px-6 py-2 bg-red-600 text-white font-bold rounded-lg hover:bg-red-700 transition-colors shadow-sm">
                Save Role
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
