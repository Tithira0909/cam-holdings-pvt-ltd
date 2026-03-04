import React, { useState } from 'react';
import { Search, Plus, Edit2, Trash2, Shield } from 'lucide-react';

export default function SettingsPermissions() {
  const [searchQuery, setSearchQuery] = useState('');

  // Mock data for permissions
  const [permissions, setPermissions] = useState([
    { id: 1, role: 'Super Admin', users: 1, accessLevel: 'Full Access', status: 'Active' },
    { id: 2, role: 'Editor', users: 3, accessLevel: 'Properties, Projects', status: 'Active' },
    { id: 3, role: 'Viewer', users: 5, accessLevel: 'Read Only', status: 'Inactive' },
  ]);

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <header className="mb-8 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-serif font-bold text-luxury-black">Permission Settings</h1>
          <p className="text-luxury-gray mt-2">Manage user roles and access levels.</p>
        </div>
        <button className="bg-luxury-gold text-white px-4 py-2 rounded-lg font-bold flex items-center gap-2 hover:bg-luxury-golddark transition-all">
          <Plus size={18} />
          Add New Role
        </button>
      </header>

      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="p-6 border-b border-luxury-border flex justify-between items-center">
          <div className="relative w-64">
            <input
              type="text"
              placeholder="Search roles..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-luxury-border rounded-lg focus:ring-1 focus:ring-luxury-gold focus:border-luxury-gold outline-none"
            />
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-luxury-offwhite text-left">
              <tr>
                <th className="px-6 py-4 text-xs font-bold text-luxury-gray uppercase tracking-wider">Role Name</th>
                <th className="px-6 py-4 text-xs font-bold text-luxury-gray uppercase tracking-wider">Users</th>
                <th className="px-6 py-4 text-xs font-bold text-luxury-gray uppercase tracking-wider">Access Level</th>
                <th className="px-6 py-4 text-xs font-bold text-luxury-gray uppercase tracking-wider">Status</th>
                <th className="px-6 py-4 text-xs font-bold text-luxury-gray uppercase tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-luxury-border">
              {permissions.filter(p => p.role.toLowerCase().includes(searchQuery.toLowerCase())).map((perm) => (
                <tr key={perm.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <Shield size={18} className="text-luxury-gold" />
                      <span className="font-bold text-luxury-black">{perm.role}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    {perm.users} Users
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    {perm.accessLevel}
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 text-xs font-bold rounded-full ${perm.status === 'Active' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'}`}>
                      {perm.status}
                    </span>
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
