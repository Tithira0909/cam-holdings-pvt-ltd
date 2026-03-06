import React, { useState, useRef } from 'react';
import { Upload, X, Loader2, Image as ImageIcon, ArrowLeft, Plus } from 'lucide-react';
import { PropertyType } from '../../types';

interface AddPropertyProps {
  onSuccess: () => void;
  onCancel: () => void;
}

const AddProperty: React.FC<AddPropertyProps> = ({ onSuccess, onCancel }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Form State
  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [location, setLocation] = useState('');
  const [price, setPrice] = useState('');
  const [type, setType] = useState<PropertyType>(PropertyType.HOUSE);
  const [status, setStatus] = useState('Active');
  const [description, setDescription] = useState('');

  // File State
  const [mainImage, setMainImage] = useState<File | null>(null);
  const [mainImagePreview, setMainImagePreview] = useState<string | null>(null);
  const [galleryImages, setGalleryImages] = useState<File[]>([]);
  const [galleryPreviews, setGalleryPreviews] = useState<string[]>([]);

  const mainImageInputRef = useRef<HTMLInputElement>(null);
  const galleryInputRef = useRef<HTMLInputElement>(null);

  const handleMainImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setMainImage(file);
      setMainImagePreview(URL.createObjectURL(file));
    }
  };

  const handleGalleryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      setGalleryImages(prev => [...prev, ...files]);

      const newPreviews = files.map(file => URL.createObjectURL(file as unknown as Blob));
      setGalleryPreviews(prev => [...prev, ...newPreviews]);
    }
  };

  const removeGalleryImage = (index: number) => {
    setGalleryImages(prev => prev.filter((_, i) => i !== index));
    setGalleryPreviews(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append('title', title);
      formData.append('slug', slug);
      formData.append('location', location);
      formData.append('price', price);
      formData.append('type', type);
      formData.append('status', status);
      formData.append('description', description);

      if (mainImage) {
        formData.append('image', mainImage);
      }

      galleryImages.forEach(file => {
        formData.append('gallery', file);
      });

      const response = await fetch('/api/properties', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Failed to add property');
      }

      onSuccess();
    } catch (err) {
      console.error('Error adding property:', err);
      setError('Failed to add property. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm overflow-hidden animate-in fade-in duration-300">
      <div className="p-6 border-b border-luxury-border flex justify-between items-center">
        <div className="flex items-center gap-4">
          <button onClick={onCancel} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
            <ArrowLeft size={20} className="text-luxury-gray" />
          </button>
          <h2 className="text-xl font-serif font-bold text-luxury-black">Add New Property</h2>
        </div>
      </div>

      <div className="p-8">
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-600 rounded-lg">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Main Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-bold text-luxury-gray mb-2 uppercase tracking-wider">Property Title</label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => {
                    setTitle(e.target.value);
                    // Auto-generate slug from title if slug is empty
                    if (!slug) {
                      setSlug(e.target.value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, ''));
                    }
                  }}
                  required
                  className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-luxury-gold focus:border-transparent outline-none transition-all"
                  placeholder="e.g. The Grand Manor"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-luxury-gray mb-2 uppercase tracking-wider">Slug</label>
                <input
                  type="text"
                  value={slug}
                  onChange={(e) => setSlug(e.target.value)}
                  required
                  className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-luxury-gold focus:border-transparent outline-none transition-all"
                  placeholder="e.g. the-grand-manor"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-luxury-gray mb-2 uppercase tracking-wider">Location</label>
                <input
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  required
                  className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-luxury-gold focus:border-transparent outline-none transition-all"
                  placeholder="e.g. Colombo 07"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-luxury-gray mb-2 uppercase tracking-wider">Price</label>
                <input
                  type="text"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  required
                  className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-luxury-gold focus:border-transparent outline-none transition-all"
                  placeholder="e.g. LKR 45,000,000"
                />
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-bold text-luxury-gray mb-2 uppercase tracking-wider">Property Type</label>
                <select
                  value={type}
                  onChange={(e) => setType(e.target.value as PropertyType)}
                  className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-luxury-gold focus:border-transparent outline-none transition-all"
                >
                  {Object.values(PropertyType).map(t => (
                    <option key={t} value={t}>{t}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-bold text-luxury-gray mb-2 uppercase tracking-wider">Status</label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                  className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-luxury-gold focus:border-transparent outline-none transition-all"
                >
                  <option value="Active">Active</option>
                  <option value="Sold">Sold</option>
                  <option value="Pending">Pending</option>
                </select>
              </div>
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-bold text-luxury-gray mb-2 uppercase tracking-wider">Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={4}
              className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-luxury-gold focus:border-transparent outline-none transition-all resize-none"
              placeholder="Describe the property..."
            ></textarea>
          </div>

          {/* Images */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Main Image */}
            <div>
              <label className="block text-sm font-bold text-luxury-gray mb-2 uppercase tracking-wider">Main Image</label>
              <div
                onClick={() => mainImageInputRef.current?.click()}
                className={`border-2 border-dashed border-gray-300 rounded-xl aspect-video flex flex-col items-center justify-center cursor-pointer hover:border-luxury-gold transition-colors ${mainImagePreview ? 'bg-gray-50' : ''}`}
              >
                {mainImagePreview ? (
                  <div className="relative w-full h-full group">
                    <img src={mainImagePreview} alt="Main Preview" className="w-full h-full object-cover rounded-xl" />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center rounded-xl">
                      <p className="text-white font-bold">Change Image</p>
                    </div>
                  </div>
                ) : (
                  <>
                    <ImageIcon size={48} className="text-gray-300 mb-2" />
                    <p className="text-gray-500 font-medium">Click to upload main image</p>
                  </>
                )}
                <input
                  type="file"
                  ref={mainImageInputRef}
                  onChange={handleMainImageChange}
                  accept="image/*"
                  className="hidden"
                />
              </div>
            </div>

            {/* Gallery Images */}
            <div>
              <label className="block text-sm font-bold text-luxury-gray mb-2 uppercase tracking-wider">Gallery Images</label>
              <div
                onClick={() => galleryInputRef.current?.click()}
                className="border-2 border-dashed border-gray-300 rounded-xl p-4 min-h-[200px] cursor-pointer hover:border-luxury-gold transition-colors"
              >
                {galleryPreviews.length > 0 ? (
                  <div className="grid grid-cols-3 gap-2">
                    {galleryPreviews.map((preview, idx) => (
                      <div key={idx} className="relative aspect-square group">
                        <img src={preview} alt={`Gallery ${idx}`} className="w-full h-full object-cover rounded-lg" />
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            removeGalleryImage(idx);
                          }}
                          className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <X size={12} />
                        </button>
                      </div>
                    ))}
                    <div className="aspect-square flex items-center justify-center bg-gray-50 rounded-lg border border-gray-200">
                      <Plus size={24} className="text-gray-400" />
                    </div>
                  </div>
                ) : (
                  <div className="h-full flex flex-col items-center justify-center py-8">
                    <Upload size={48} className="text-gray-300 mb-2" />
                    <p className="text-gray-500 font-medium">Click to upload gallery images</p>
                  </div>
                )}
                <input
                  type="file"
                  ref={galleryInputRef}
                  onChange={handleGalleryChange}
                  accept="image/*"
                  multiple
                  className="hidden"
                />
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-4 pt-4 border-t border-gray-100">
            <button
              type="button"
              onClick={onCancel}
              className="px-6 py-3 text-luxury-gray font-bold uppercase tracking-wider hover:text-luxury-black transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-8 py-3 bg-luxury-gold text-white rounded-lg font-bold uppercase tracking-wider hover:bg-luxury-golddark transition-all shadow-gold-glow disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {loading && <Loader2 size={18} className="animate-spin" />}
              {loading ? 'Saving...' : 'Save Property'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddProperty;
