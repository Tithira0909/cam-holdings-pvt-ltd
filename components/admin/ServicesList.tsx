import React, { useState, useEffect } from 'react';
import { Loader2, Plus, Edit, Trash2 } from 'lucide-react';

interface ServicesListProps {
  onAddService: () => void;
  onEditService: (id: string) => void;
}

interface Service {
  id: string;
  title: string;
  slug: string;
  short_desc: string;
  status: 'active' | 'inactive';
  sort_order: number;
  updated_at: string;
}

const ServicesList: React.FC<ServicesListProps> = ({ onAddService, onEditService }) => {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchServices();
  }, []);

  const fetchServices = async () => {
    try {
      const res = await fetch('/api/admin/services');
      if (res.ok) {
        const data = await res.json();
        setServices(data.map((s: any) => ({ ...s, id: String(s.id) })));
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure?')) return;
    try {
      await fetch(`/api/admin/services/${id}`, { method: 'DELETE' });
      fetchServices();
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) return <div className="flex justify-center p-12 text-red-600"><Loader2 className="animate-spin" size={32} /></div>;

  return (
    <div className="bg-white rounded-xl shadow-sm overflow-hidden animate-in fade-in duration-300">
      <div className="p-6 border-b border-luxury-border flex justify-between items-center">
        <h2 className="text-xl font-serif font-bold text-luxury-black">Services</h2>
        <button
          onClick={onAddService}
          className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg font-bold text-sm uppercase tracking-wider hover:bg-red-600dark transition-all shadow-gold-glow"
        >
          <Plus size={16} />
          Add New Service
        </button>
      </div>
      <div className="overflow-x-auto">
        <div className="admin-table-container">
          <table className="w-full">
          <thead className="bg-luxury-offwhite text-left">
            <tr>
              <th className="px-6 py-4 text-xs font-bold text-luxury-gray uppercase tracking-wider">Service</th>
              <th className="px-6 py-4 text-xs font-bold text-luxury-gray uppercase tracking-wider">Slug</th>
              <th className="px-6 py-4 text-xs font-bold text-luxury-gray uppercase tracking-wider">Order</th>
              <th className="px-6 py-4 text-xs font-bold text-luxury-gray uppercase tracking-wider">Status</th>
              <th className="px-6 py-4 text-xs font-bold text-luxury-gray uppercase tracking-wider">Updated</th>
              <th className="px-6 py-4 text-xs font-bold text-luxury-gray uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-luxury-border">
            {services.map((svc) => (
              <tr key={svc.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4 font-bold text-luxury-black text-sm">{svc.title}</td>
                <td className="px-6 py-4 text-sm text-gray-600">{svc.slug}</td>
                <td className="px-6 py-4 text-sm text-gray-600">{svc.sort_order}</td>
                <td className="px-6 py-4">
                  <span className={`px-2 py-1 text-xs font-bold rounded-full uppercase tracking-wider ${
                    svc.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'
                  }`}>
                    {svc.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-xs text-gray-500">{new Date(svc.updated_at).toLocaleDateString()}</td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2">
                    <button onClick={() => onEditService(svc.id)} className="p-2 text-luxury-gray hover:text-red-600 transition-colors rounded-full hover:bg-luxury-offwhite">
                      <Edit size={16} />
                    </button>
                    <button onClick={() => handleDelete(svc.id)} className="p-2 text-luxury-gray hover:text-red-500 transition-colors rounded-full hover:bg-red-50">
                      <Trash2 size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
          </div>
      </div>
    </div>
  );
};

export default ServicesList;
