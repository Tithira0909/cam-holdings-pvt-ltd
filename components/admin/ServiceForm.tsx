import React, { useState, useEffect, useRef } from 'react';
import { ArrowLeft, Loader2, Save, Image as ImageIcon, Upload } from 'lucide-react';

interface ServiceFormProps {
  serviceId?: string;
  onSuccess: () => void;
  onCancel: () => void;
}

const ServiceForm: React.FC<ServiceFormProps> = ({ serviceId, onSuccess, onCancel }) => {
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(!!serviceId);

  // Fields
  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [shortDesc, setShortDesc] = useState('');
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState('active');
  const [sortOrder, setSortOrder] = useState('0');
  const [icon, setIcon] = useState('Building');

  const [coverImage, setCoverImage] = useState<File | null>(null);
  const [coverPreview, setCoverPreview] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (serviceId) {
      fetchService();
    }
  }, [serviceId]);

  const fetchService = async () => {
    try {
      const res = await fetch(`/api/admin/services/${serviceId}`);
      if (res.ok) {
        const data = await res.json();
        setTitle(data.title);
        setSlug(data.slug);
        setShortDesc(data.short_desc || '');
        setDescription(data.description || '');
        setStatus(data.status);
        setSortOrder(String(data.sort_order));
        setIcon(data.icon || 'Building');
        setCoverPreview(data.cover_image);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setFetching(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData();
    formData.append('title', title);
    formData.append('slug', slug);
    formData.append('short_desc', shortDesc);
    formData.append('description', description);
    formData.append('status', status);
    formData.append('sort_order', sortOrder);
    formData.append('icon', icon);
    if (coverImage) {
      formData.append('cover_image', coverImage);
    }

    try {
      const url = serviceId ? `/api/admin/services/${serviceId}` : '/api/admin/services';
      const method = serviceId ? 'PUT' : 'POST';

      const res = await fetch(url, { method, body: formData });
      if (res.ok) {
        onSuccess();
      } else {
        alert('Failed to save service');
      }
    } catch (err) {
      console.error(err);
      alert('Error saving service');
    } finally {
      setLoading(false);
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setCoverImage(file);
      setCoverPreview(URL.createObjectURL(file));
    }
  };

  if (fetching) return <div className="flex justify-center p-12 text-red-600"><Loader2 className="animate-spin" size={32} /></div>;

  return (
    <div className="bg-white rounded-xl shadow-sm overflow-hidden animate-in fade-in duration-300">
      <div className="p-6 border-b border-luxury-border flex items-center gap-4">
        <button onClick={onCancel} className="p-2 hover:bg-gray-100 rounded-full text-luxury-gray hover:text-luxury-black transition-colors">
          <ArrowLeft size={20} />
        </button>
        <h2 className="text-xl font-serif font-bold text-luxury-black">{serviceId ? 'Edit Service' : 'Add New Service'}</h2>
      </div>

      <form onSubmit={handleSubmit} className="p-8 space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-4">
            <div>
              <label htmlFor="title" className="block text-xs font-bold text-luxury-gray uppercase tracking-wider mb-2">Title</label>
              <input
                id="title"
                type="text"
                value={title}
                onChange={(e) => {
                  setTitle(e.target.value);
                  if (!serviceId && !slug) {
                    setSlug(e.target.value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, ''));
                  }
                }}
                className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-red-600 outline-none"
                required
              />
            </div>
            <div>
              <label htmlFor="slug" className="block text-xs font-bold text-luxury-gray uppercase tracking-wider mb-2">Slug</label>
              <input
                id="slug"
                type="text"
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
                className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-red-600 outline-none"
                required
              />
            </div>
            <div>
              <label htmlFor="icon" className="block text-xs font-bold text-luxury-gray uppercase tracking-wider mb-2">Icon (Lucide Name)</label>
              <input
                id="icon"
                type="text"
                value={icon}
                onChange={(e) => setIcon(e.target.value)}
                className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-red-600 outline-none"
                placeholder="e.g. Building, Users, Settings"
              />
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label htmlFor="status" className="block text-xs font-bold text-luxury-gray uppercase tracking-wider mb-2">Status</label>
              <select
                id="status"
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-red-600 outline-none"
              >
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>
            <div>
              <label htmlFor="sortOrder" className="block text-xs font-bold text-luxury-gray uppercase tracking-wider mb-2">Sort Order</label>
              <input
                id="sortOrder"
                type="number"
                value={sortOrder}
                onChange={(e) => setSortOrder(e.target.value)}
                className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-red-600 outline-none"
              />
            </div>
          </div>
        </div>

        <div>
          <label htmlFor="shortDesc" className="block text-xs font-bold text-luxury-gray uppercase tracking-wider mb-2">Short Description</label>
          <input
            id="shortDesc"
            type="text"
            value={shortDesc}
            onChange={(e) => setShortDesc(e.target.value)}
            className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-red-600 outline-none"
          />
        </div>

        <div>
          <label htmlFor="description" className="block text-xs font-bold text-luxury-gray uppercase tracking-wider mb-2">Full Description</label>
          <textarea
            id="description"
            rows={6}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-red-600 outline-none resize-none"
          />
        </div>

        <div>
          <label className="block text-xs font-bold text-luxury-gray uppercase tracking-wider mb-2">Cover Image</label>
          <div
            onClick={() => fileInputRef.current?.click()}
            className="border-2 border-dashed border-gray-300 rounded-xl p-4 cursor-pointer hover:border-red-600 transition-colors flex flex-col items-center justify-center min-h-[200px]"
          >
            {coverPreview ? (
              <img src={coverPreview} alt="Cover" className="h-48 object-cover rounded-lg" />
            ) : (
              <div className="text-center text-gray-400">
                <Upload size={32} className="mx-auto mb-2" />
                <p>Click to upload cover image</p>
              </div>
            )}
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleImageChange}
              className="hidden"
              accept="image/*"
            />
          </div>
        </div>

        <div className="flex justify-end pt-4 border-t border-gray-100">
          <button
            type="submit"
            disabled={loading}
            className="px-8 py-3 bg-red-600 text-white rounded-lg font-bold uppercase tracking-wider hover:bg-red-600dark transition-all shadow-gold-glow disabled:opacity-50 flex items-center gap-2"
          >
            {loading ? <Loader2 className="animate-spin" size={18} /> : <Save size={18} />}
            Save Service
          </button>
        </div>
      </form>
    </div>
  );
};

export default ServiceForm;
