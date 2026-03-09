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
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
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
    if (isSettingsOpen) setMobileMenuOpen(false);
    if (!isSettingsOpen && !activeView.startsWith('settings-')) {
      setActiveView('settings-site');
    }
  };

  return (
    <div className="min-h-screen bg-[#f4f4f4] flex">
      {/* Sidebar */}
      {/* Mobile Header */}
      <div className="lg:hidden fixed top-0 left-0 right-0 h-16 bg-luxury-black text-white z-40 flex items-center justify-between px-4">
        <img src="/assets/cam_logo.png" alt="CAM Admin" className="h-8 object-contain" />
        <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="p-2 text-white">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={mobileMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} /></svg>
        </button>
      </div>

      {/* Mobile Menu Overlay */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 bg-black/50 z-40 lg:hidden" onClick={() => setMobileMenuOpen(false)} />
      )}

      {/* Sidebar */}
      <aside className={`w-64 bg-luxury-black text-white fixed h-full flex flex-col z-50 transition-transform duration-300 ${mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0`}>
        <div
          className="p-8 border-b border-white/10 cursor-pointer flex flex-col items-start"
          onClick={() => { setActiveView('dashboard'); setMobileMenuOpen(false); }}
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
            onClick={() => { setActiveView('dashboard'); setMobileMenuOpen(false); }}
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
            onClick={() => { setActiveView('properties'); setMobileMenuOpen(false); }}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg font-bold text-sm uppercase tracking-wider transition-all ${
              activeView === 'properties' || activeView === 'add-property' || activeView === 'edit-property'
                ? 'bg-white/10 text-luxury-gold'
                : 'text-white/60 hover:bg-white/5 hover:text-white'
            }`}
          >
            <MapPin size={18} />
            Lands
          </button>

          <button
            onClick={() => { setActiveView('houses'); setMobileMenuOpen(false); }}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg font-bold text-sm uppercase tracking-wider transition-all ${
              activeView === 'houses' || activeView === 'add-house' || activeView === 'edit-house'
                ? 'bg-white/10 text-luxury-gold'
                : 'text-white/60 hover:bg-white/5 hover:text-white'
            }`}
          >
            <Building size={18} />
            Houses
          </button>
          <button
            onClick={() => { setActiveView('projects'); setMobileMenuOpen(false); }}
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
            onClick={() => { setActiveView('services'); setMobileMenuOpen(false); }}
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
            onClick={() => { setActiveView('inquiries'); setMobileMenuOpen(false); }}
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
                <button onClick={() => { setActiveView('settings-permissions'); setMobileMenuOpen(false); }} className={`w-full flex items-center gap-3 px-4 py-2 rounded-lg font-medium text-xs tracking-wider transition-all ${activeView === 'settings-permissions' ? 'text-luxury-gold bg-white/5' : 'text-white/60 hover:text-white hover:bg-white/5'}`}>
                  <Shield size={14} />
                  Permission Settings
                </button>
                <button onClick={() => { setActiveView('settings-analytics'); setMobileMenuOpen(false); }} className={`w-full flex items-center gap-3 px-4 py-2 rounded-lg font-medium text-xs tracking-wider transition-all ${activeView === 'settings-analytics' ? 'text-luxury-gold bg-white/5' : 'text-white/60 hover:text-white hover:bg-white/5'}`}>
                  <BarChart size={14} />
                  Analytics Settings
                </button>
                <button onClick={() => { setActiveView('settings-site'); setMobileMenuOpen(false); }} className={`w-full flex items-center gap-3 px-4 py-2 rounded-lg font-medium text-xs tracking-wider transition-all ${activeView === 'settings-site' ? 'text-luxury-gold bg-white/5' : 'text-white/60 hover:text-white hover:bg-white/5'}`}>
                  <Globe size={14} />
                  Site Settings
                </button>
                <button onClick={() => { setActiveView('settings-email'); setMobileMenuOpen(false); }} className={`w-full flex items-center gap-3 px-4 py-2 rounded-lg font-medium text-xs tracking-wider transition-all ${activeView === 'settings-email' ? 'text-luxury-gold bg-white/5' : 'text-white/60 hover:text-white hover:bg-white/5'}`}>
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
      <main className="flex-1 lg:ml-64 pt-20 lg:pt-8 p-4 lg:p-8 w-full max-w-[100vw] overflow-x-hidden container-overflow-fix">
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
          <div className="bg-white p-6 rounded-xl shadow-sm border-l-4 border-luxury-gold relative overflow-hidden group">
            <div className="absolute inset-0 bg-gradient-to-br from-luxury-gold/5 to-transparent pointer-events-none" />
            <div className="flex justify-between items-start mb-4 relative z-10">
              <div>
                <p className="text-sm text-luxury-gray font-bold uppercase tracking-wider">Total Properties</p>
                <h3 className="text-4xl font-serif font-bold text-luxury-black mt-2">{PROPERTIES.length}</h3>
              </div>
              <div className="p-3 bg-luxury-gold/10 rounded-xl text-luxury-gold group-hover:scale-110 transition-transform">
                <Building size={24} />
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border-l-4 border-luxury-black relative overflow-hidden group">
            <div className="absolute inset-0 bg-gradient-to-br from-black/5 to-transparent pointer-events-none" />
            <div className="flex justify-between items-start mb-4 relative z-10">
              <div>
                <p className="text-sm text-luxury-gray font-bold uppercase tracking-wider">Active Projects</p>
                <h3 className="text-4xl font-serif font-bold text-luxury-black mt-2">
                  {activeProjectsCount !== null ? activeProjectsCount : PROJECTS.length}
                </h3>
              </div>
              <div className="p-3 bg-gray-100 rounded-xl text-luxury-black group-hover:scale-110 transition-transform">
                <FolderOpen size={24} />
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border-l-4 border-green-500 relative overflow-hidden group">
            <div className="absolute inset-0 bg-gradient-to-br from-green-500/5 to-transparent pointer-events-none" />
            <div className="flex justify-between items-start mb-4 relative z-10">
              <div>
                <p className="text-sm text-luxury-gray font-bold uppercase tracking-wider">New Inquiries</p>
                <h3 className="text-4xl font-serif font-bold text-luxury-black mt-2">12</h3>
              </div>
              <div className="p-3 bg-green-50 rounded-xl text-green-600 group-hover:scale-110 transition-transform">
                <Users size={24} />
              </div>
            </div>
            <p className="text-xs text-green-600 font-bold flex items-center gap-1 relative z-10">
              <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
              +4 this week
            </p>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border-l-4 border-blue-500 relative overflow-hidden group">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-transparent pointer-events-none" />
            <div className="flex justify-between items-start mb-4 relative z-10">
              <div>
                <p className="text-sm text-luxury-gray font-bold uppercase tracking-wider">Total Lands</p>
                <h3 className="text-4xl font-serif font-bold text-luxury-black mt-2">{PROPERTIES.length /* Placeholder */}</h3>
              </div>
              <div className="p-3 bg-blue-50 rounded-xl text-blue-600 group-hover:scale-110 transition-transform">
                <MapPin size={24} />
              </div>
            </div>
          </div>
        </div>

        {/* Content based on active view */}
        {activeView === 'dashboard' && (
          <div className="bg-white rounded-xl shadow-sm overflow-hidden">
            <div className="p-6 border-b border-luxury-border flex justify-between items-center">
              <h2 className="text-xl font-serif font-bold text-luxury-black">Recent Properties</h2>
              <button
                onClick={() => { setActiveView('properties'); setMobileMenuOpen(false); }}
                className="text-sm text-luxury-gold font-bold uppercase tracking-wider hover:text-luxury-golddark"
              >
                View All
              </button>
            </div>
            <div className="overflow-x-auto">
              <div className="admin-table-container">
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
          </div>
        )}

        {activeView === 'properties' && (
          <PropertiesList
            forcedType="Lands"
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
            propertyId={editingPropertyId.replace(/^(land|house)-/, '')}
            onSuccess={() => setActiveView('properties')}
            onCancel={() => setActiveView('properties')}
          />
        )}

        {activeView === 'houses' && (
          <PropertiesList
            forcedType="Houses"
            onAddProperty={() => setActiveView('add-house')}
            onEditProperty={(id) => {
              setEditingPropertyId(id);
              setActiveView('edit-house');
            }}
          />
        )}

        {activeView === 'add-house' && (
          <AddProperty
            forcedType="House"
            onSuccess={() => setActiveView('houses')}
            onCancel={() => setActiveView('houses')}
          />
        )}

        {activeView === 'edit-house' && editingPropertyId && (
          <EditProperty
            propertyId={editingPropertyId.replace(/^(land|house)-/, '')}
            onSuccess={() => setActiveView('houses')}
            onCancel={() => setActiveView('houses')}
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