import React, { useState } from 'react';
import {
  LayoutDashboard,
  Building,
  FolderOpen,
  Users,
  Settings,
  LogOut,
  MapPin
} from 'lucide-react';
import { PROPERTIES, PROJECTS } from '../../constants';
import PropertiesList from './PropertiesList';
import AddProperty from './AddProperty';
import EditProperty from './EditProperty';

interface DashboardProps {
  onLogout: () => void;
}

type ViewState = 'dashboard' | 'properties' | 'add-property' | 'edit-property';

const Dashboard: React.FC<DashboardProps> = ({ onLogout }) => {
  const [activeView, setActiveView] = useState<ViewState>('dashboard');
  const [editingPropertyId, setEditingPropertyId] = useState<string | null>(null);

  return (
    <div className="min-h-screen bg-[#f4f4f4] flex">
      {/* Sidebar */}
      <aside className="w-64 bg-luxury-black text-white fixed h-full flex flex-col z-50">
        <div className="p-8 border-b border-white/10">
          <div className="font-serif text-2xl font-bold tracking-brand">
            <span className="text-luxury-gold">C</span>AM
          </div>
          <p className="text-[10px] text-white/40 tracking-widest mt-1 uppercase">Admin Panel</p>
        </div>

        <nav className="flex-1 py-8 px-4 space-y-2">
          <button
            onClick={() => setActiveView('dashboard')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg font-bold text-sm uppercase tracking-wider transition-all ${
              activeView === 'dashboard'
                ? 'bg-white/10 text-luxury-gold'
                : 'text-white/60 hover:bg-white/5 hover:text-white'
            }`}
          >
            <LayoutDashboard size={18} />
            Dashboard
          </button>
          <button
            onClick={() => setActiveView('properties')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg font-bold text-sm uppercase tracking-wider transition-all ${
              activeView === 'properties' || activeView === 'add-property' || activeView === 'edit-property'
                ? 'bg-white/10 text-luxury-gold'
                : 'text-white/60 hover:bg-white/5 hover:text-white'
            }`}
          >
            <Building size={18} />
            Properties
          </button>
          <button className="w-full flex items-center gap-3 px-4 py-3 text-white/60 hover:bg-white/5 hover:text-white rounded-lg font-medium text-sm transition-all">
            <FolderOpen size={18} />
            Projects
          </button>
          <button className="w-full flex items-center gap-3 px-4 py-3 text-white/60 hover:bg-white/5 hover:text-white rounded-lg font-medium text-sm transition-all">
            <Users size={18} />
            Inquiries
          </button>
          <button className="w-full flex items-center gap-3 px-4 py-3 text-white/60 hover:bg-white/5 hover:text-white rounded-lg font-medium text-sm transition-all">
            <Settings size={18} />
            Settings
          </button>
        </nav>

        <div className="p-4 border-t border-white/10">
          <button
            onClick={onLogout}
            className="w-full flex items-center gap-3 px-4 py-3 text-red-400 hover:bg-red-500/10 rounded-lg font-medium text-sm transition-all"
          >
            <LogOut size={18} />
            Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 ml-64 p-8">
        <header className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-serif font-bold text-luxury-black">Dashboard Overview</h1>
          <div className="flex items-center gap-4">
             <div className="text-right hidden md:block">
               <p className="font-bold text-luxury-black">Admin User</p>
               <p className="text-xs text-luxury-gray">admin@camholdings.lk</p>
             </div>
             <div className="w-10 h-10 bg-luxury-gold rounded-full flex items-center justify-center text-white font-bold">
               A
             </div>
          </div>
        </header>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white p-6 rounded-xl shadow-sm border-l-4 border-luxury-gold">
            <div className="flex justify-between items-start mb-4">
              <div>
                <p className="text-sm text-luxury-gray font-medium uppercase tracking-wider">Total Properties</p>
                <h3 className="text-3xl font-bold text-luxury-black mt-1">{PROPERTIES.length}</h3>
              </div>
              <div className="p-3 bg-luxury-offwhite rounded-lg text-luxury-gold">
                <Building size={24} />
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border-l-4 border-luxury-black">
            <div className="flex justify-between items-start mb-4">
              <div>
                <p className="text-sm text-luxury-gray font-medium uppercase tracking-wider">Active Projects</p>
                <h3 className="text-3xl font-bold text-luxury-black mt-1">{PROJECTS.length}</h3>
              </div>
              <div className="p-3 bg-luxury-offwhite rounded-lg text-luxury-black">
                <FolderOpen size={24} />
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border-l-4 border-luxury-gold">
            <div className="flex justify-between items-start mb-4">
              <div>
                <p className="text-sm text-luxury-gray font-medium uppercase tracking-wider">New Inquiries</p>
                <h3 className="text-3xl font-bold text-luxury-black mt-1">12</h3>
              </div>
              <div className="p-3 bg-luxury-offwhite rounded-lg text-luxury-gold">
                <Users size={24} />
              </div>
            </div>
            <p className="text-xs text-green-600 font-medium flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-green-600"></span>
              +4 this week
            </p>
          </div>
        </div>

        {/* Content based on active view */}
        {activeView === 'dashboard' && (
          <div className="bg-white rounded-xl shadow-sm overflow-hidden">
            <div className="p-6 border-b border-luxury-border flex justify-between items-center">
              <h2 className="text-xl font-serif font-bold text-luxury-black">Recent Properties</h2>
              <button
                onClick={() => setActiveView('properties')}
                className="text-sm text-luxury-gold font-bold uppercase tracking-wider hover:text-luxury-golddark"
              >
                View All
              </button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-luxury-offwhite text-left">
                  <tr>
                    <th className="px-6 py-4 text-xs font-bold text-luxury-gray uppercase tracking-wider">Property</th>
                    <th className="px-6 py-4 text-xs font-bold text-luxury-gray uppercase tracking-wider">Location</th>
                    <th className="px-6 py-4 text-xs font-bold text-luxury-gray uppercase tracking-wider">Type</th>
                    <th className="px-6 py-4 text-xs font-bold text-luxury-gray uppercase tracking-wider">Price</th>
                    <th className="px-6 py-4 text-xs font-bold text-luxury-gray uppercase tracking-wider">Status</th>
                    <th className="px-6 py-4 text-xs font-bold text-luxury-gray uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-luxury-border">
                  {PROPERTIES.slice(0, 5).map((prop) => (
                    <tr key={prop.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-4">
                          <img src={prop.image} alt={prop.title} className="w-12 h-12 rounded-lg object-cover" />
                          <div>
                            <p className="font-bold text-luxury-black text-sm">{prop.title}</p>
                            <p className="text-xs text-luxury-gray">ID: {prop.id}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        <div className="flex items-center gap-2">
                          <MapPin size={14} className="text-luxury-gold" />
                          {prop.location.split(',')[0]}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="px-3 py-1 bg-luxury-offwhite text-luxury-black text-xs font-bold rounded-full border border-luxury-border">
                          {prop.type}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm font-bold text-luxury-black">
                        {prop.price}
                      </td>
                      <td className="px-6 py-4">
                        <span className="px-2 py-1 bg-green-100 text-green-700 text-xs font-bold rounded-full">
                          Active
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <button className="text-luxury-gray hover:text-luxury-gold transition-colors font-bold text-xs uppercase">Edit</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeView === 'properties' && (
          <PropertiesList
            onAddProperty={() => setActiveView('add-property')}
            onEditProperty={(id) => {
              setEditingPropertyId(id);
              setActiveView('edit-property');
            }}
          />
        )}

        {activeView === 'add-property' && (
          <AddProperty
            onSuccess={() => setActiveView('properties')}
            onCancel={() => setActiveView('properties')}
          />
        )}

        {activeView === 'edit-property' && editingPropertyId && (
          <EditProperty
            propertyId={editingPropertyId}
            onSuccess={() => setActiveView('properties')}
            onCancel={() => setActiveView('properties')}
          />
        )}
      </main>
    </div>
  );
};

export default Dashboard;
