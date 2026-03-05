import React, { useState, useEffect } from 'react';
import {
  LayoutDashboard,
  Building,
  FolderOpen,
  Users,
  Settings,
  LogOut,
  MapPin,
  Shield,
  BarChart,
  Globe,
  Mail,
  ChevronDown
} from 'lucide-react';
import { PROPERTIES, PROJECTS } from '../../constants';
import PropertiesList from './PropertiesList';
import AddProperty from './AddProperty';
import EditProperty from './EditProperty';
import InquiriesList from './InquiriesList';
import InquiryDetail from './InquiryDetail';
import ServicesList from './ServicesList';
import ServiceForm from './ServiceForm';
import ProjectsList from './ProjectsList';
import ProjectForm from './ProjectForm';
import SettingsPermissions from './settings/SettingsPermissions';
import SettingsAnalytics from './settings/SettingsAnalytics';
import SettingsSite from './settings/SettingsSite';
import SettingsEmail from './settings/SettingsEmail';

interface DashboardProps {
  onLogout: () => void;
}

type ViewState = 'dashboard' | 'properties' | 'add-property' | 'edit-property' | 'inquiries' | 'inquiry-detail' | 'services' | 'add-service' | 'edit-service' | 'projects' | 'add-project' | 'edit-project' | 'settings-permissions' | 'settings-analytics' | 'settings-site' | 'settings-email';

const Dashboard: React.FC<DashboardProps> = ({ onLogout }) => {
  const [activeView, setActiveView] = useState<ViewState>('dashboard');
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [editingPropertyId, setEditingPropertyId] = useState<string | null>(null);
  const [editingProjectId, setEditingProjectId] = useState<string | null>(null);
  const [viewingInquiryId, setViewingInquiryId] = useState<string | null>(null);
  const [editingServiceId, setEditingServiceId] = useState<string | null>(null);
  const [activeProjectsCount, setActiveProjectsCount] = useState<number | null>(null);

  useEffect(() => {
    fetch('/api/projects')
      .then(res => res.json())
      .then(data => {
        const activeCount = data.filter((p: any) => p.status === 'Active' || p.status === 'active' || !p.status).length;
        setActiveProjectsCount(activeCount);
      })
      .catch(err => console.error('Error fetching projects count:', err));
  }, [activeView]); // Re-fetch when view changes so we get updated count after editing

  const handleSettingsClick = () => {
    setIsSettingsOpen(!isSettingsOpen);
    if (!isSettingsOpen && !activeView.startsWith('settings-')) {
      setActiveView('settings-site');
    }
  };

  return (
    <div className="min-h-screen bg-[#f4f4f4] flex">
      {/* Sidebar */}
      <aside className="w-64 bg-luxury-black text-white fixed h-full flex flex-col z-50">
        <div
          className="p-8 border-b border-white/10 cursor-pointer flex flex-col items-start"
          onClick={() => setActiveView('dashboard')}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => { if (e.key === 'Enter') setActiveView('dashboard'); }}
        >
          <img
            src="/assets/cam_logo.png"
            alt="CAM Admin Panel"
            className="w-40 object-contain h-auto"
          />
          <p className="text-[10px] text-white/40 tracking-widest mt-3 uppercase">Admin Panel</p>
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
          <button
            onClick={() => setActiveView('projects')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg font-bold text-sm uppercase tracking-wider transition-all ${
              activeView === 'projects' || activeView === 'add-project' || activeView === 'edit-project'
                ? 'bg-white/10 text-luxury-gold'
                : 'text-white/60 hover:bg-white/5 hover:text-white'
            }`}
          >
            <FolderOpen size={18} />
            Projects
          </button>
          <button
            onClick={() => setActiveView('services')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg font-bold text-sm uppercase tracking-wider transition-all ${
              activeView === 'services' || activeView === 'add-service' || activeView === 'edit-service'
                ? 'bg-white/10 text-luxury-gold'
                : 'text-white/60 hover:bg-white/5 hover:text-white'
            }`}
          >
            <Settings size={18} />
            Services
          </button>
          <button
            onClick={() => setActiveView('inquiries')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg font-bold text-sm uppercase tracking-wider transition-all ${
              activeView === 'inquiries' || activeView === 'inquiry-detail'
                ? 'bg-white/10 text-luxury-gold'
                : 'text-white/60 hover:bg-white/5 hover:text-white'
            }`}
          >
            <Users size={18} />
            Inquiries
          </button>
          <div>
            <button
              onClick={handleSettingsClick}
              className={`w-full flex items-center justify-between px-4 py-3 rounded-lg font-bold text-sm uppercase tracking-wider transition-all ${
                activeView.startsWith('settings-')
                  ? 'bg-white/10 text-luxury-gold'
                  : 'text-white/60 hover:bg-white/5 hover:text-white'
              }`}
            >
              <div className="flex items-center gap-3">
                <Settings size={18} />
                Settings
              </div>
              <ChevronDown size={16} className={`transform transition-transform ${isSettingsOpen || activeView.startsWith('settings-') ? 'rotate-180' : ''}`} />
            </button>
            {(isSettingsOpen || activeView.startsWith('settings-')) && (
              <div className="pl-4 mt-2 space-y-1">
                <button onClick={() => setActiveView('settings-permissions')} className={`w-full flex items-center gap-3 px-4 py-2 rounded-lg font-medium text-xs tracking-wider transition-all ${activeView === 'settings-permissions' ? 'text-luxury-gold bg-white/5' : 'text-white/60 hover:text-white hover:bg-white/5'}`}>
                  <Shield size={14} />
                  Permission Settings
                </button>
                <button onClick={() => setActiveView('settings-analytics')} className={`w-full flex items-center gap-3 px-4 py-2 rounded-lg font-medium text-xs tracking-wider transition-all ${activeView === 'settings-analytics' ? 'text-luxury-gold bg-white/5' : 'text-white/60 hover:text-white hover:bg-white/5'}`}>
                  <BarChart size={14} />
                  Analytics Settings
                </button>
                <button onClick={() => setActiveView('settings-site')} className={`w-full flex items-center gap-3 px-4 py-2 rounded-lg font-medium text-xs tracking-wider transition-all ${activeView === 'settings-site' ? 'text-luxury-gold bg-white/5' : 'text-white/60 hover:text-white hover:bg-white/5'}`}>
                  <Globe size={14} />
                  Site Settings
                </button>
                <button onClick={() => setActiveView('settings-email')} className={`w-full flex items-center gap-3 px-4 py-2 rounded-lg font-medium text-xs tracking-wider transition-all ${activeView === 'settings-email' ? 'text-luxury-gold bg-white/5' : 'text-white/60 hover:text-white hover:bg-white/5'}`}>
                  <Mail size={14} />
                  Email Settings
                </button>
              </div>
            )}
          </div>
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
                <h3 className="text-3xl font-bold text-luxury-black mt-1">
                  {activeProjectsCount !== null ? activeProjectsCount : PROJECTS.length}
                </h3>
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

        {activeView === 'inquiries' && (
          <InquiriesList
            onViewInquiry={(id) => {
              setViewingInquiryId(id);
              setActiveView('inquiry-detail');
            }}
          />
        )}

        {activeView === 'inquiry-detail' && viewingInquiryId && (
          <InquiryDetail
            inquiryId={viewingInquiryId}
            onBack={() => setActiveView('inquiries')}
          />
        )}

        {activeView === 'services' && (
          <ServicesList
            onAddService={() => setActiveView('add-service')}
            onEditService={(id) => {
              setEditingServiceId(id);
              setActiveView('edit-service');
            }}
          />
        )}

        {activeView === 'add-service' && (
          <ServiceForm
            onSuccess={() => setActiveView('services')}
            onCancel={() => setActiveView('services')}
          />
        )}

        {activeView === 'edit-service' && editingServiceId && (
          <ServiceForm
            serviceId={editingServiceId}
            onSuccess={() => setActiveView('services')}
            onCancel={() => setActiveView('services')}
          />
        )}

        {activeView === 'projects' && (
          <ProjectsList
            onAddProject={() => setActiveView('add-project')}
            onEditProject={(id) => {
              setEditingProjectId(id);
              setActiveView('edit-project');
            }}
          />
        )}

        {activeView === 'add-project' && (
          <ProjectForm
            onSuccess={() => setActiveView('projects')}
            onCancel={() => setActiveView('projects')}
          />
        )}

        {activeView === 'edit-project' && editingProjectId && (
          <ProjectForm
            projectId={editingProjectId}
            onSuccess={() => setActiveView('projects')}
            onCancel={() => setActiveView('projects')}
          />
        )}

        {activeView === 'settings-permissions' && (
          <SettingsPermissions />
        )}

        {activeView === 'settings-analytics' && (
          <SettingsAnalytics />
        )}

        {activeView === 'settings-site' && (
          <SettingsSite />
        )}

        {activeView === 'settings-email' && (
          <SettingsEmail />
        )}
      </main>
    </div>
  );
};

export default Dashboard;