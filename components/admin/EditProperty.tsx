import React, { useState, useRef, useEffect } from 'react';
import { Upload, X, Loader2, Image as ImageIcon, ArrowLeft, Plus } from 'lucide-react';
import { PropertyType } from '../../types';

interface EditPropertyProps {
  propertyId: string;
  onSuccess: () => void;
  onCancel: () => void;
}

const EditProperty: React.FC<EditPropertyProps> = ({ propertyId, onSuccess, onCancel }) => {
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
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
  const [existingGallery, setExistingGallery] = useState<any[]>([]);
  const [uploadingGallery, setUploadingGallery] = useState(false);

  const mainImageInputRef = useRef<HTMLInputElement>(null);
  const galleryInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetchPropertyDetails();
  }, [propertyId]);


  const handleDeleteExistingImage = async (imageId: number) => {
    if (!confirm('Are you sure you want to delete this gallery image?')) return;
    try {
      const res = await fetch(`/api/admin/properties/images/${imageId}`, {
        method: 'DELETE'
      });
      if (res.ok) {
        setExistingGallery(prev => prev.filter(img => img.id !== imageId));
      } else {
        alert('Failed to delete image');
      }
    } catch (err) {
      console.error(err);
      alert('Error deleting image');
    }
  };

  const handleUploadNewImages = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;

    setUploadingGallery(true);
    const formData = new FormData();
    Array.from(e.target.files).forEach(file => {
      formData.append('images', file);
    });

    try {
      const res = await fetch(`/api/admin/properties/${propertyId}/images`, {
        method: 'POST',
        body: formData,
      });

      if (res.ok) {
        const newImages = await res.json();
        setExistingGallery(prev => [...prev, ...newImages]);
      } else {
        alert('Failed to upload images');
      }
    } catch (err) {
      console.error(err);
      alert('Error uploading images');
    } finally {
      setUploadingGallery(false);
      if (galleryInputRef.current) galleryInputRef.current.value = '';
    }
  };

  const fetchPropertyDetails = async () => {
    try {
      const response = await fetch(`/api/properties/${propertyId}`);
      if (!response.ok) throw new Error('Failed to fetch property');

      const data = await response.json();
      setTitle(data.title);
      setSlug(data.slug);
      setLocation(data.location);
      setPrice(data.price);
      setType(data.type);
      setStatus(data.status || 'Active');
      setDescription(data.description);
      setMainImagePreview(data.image);

      // Fetch gallery images from new endpoint
      const imgRes = await fetch(`/api/admin/properties/${propertyId}/images`);
      if (imgRes.ok) {
         const imgData = await imgRes.json();
         setExistingGallery(imgData);
      }

    } catch (err) {
      console.error(err);
      setError('Could not load property details.');
    } finally {
      setFetching(false);
    }
  };

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

      const newPreviews = files.map(file => URL.createObjectURL(file));
      setGalleryPreviews(prev => [...prev, ...newPreviews]);
    }
  };

  const removeGalleryImage = (index: number) => {
    setGalleryImages(prev => prev.filter((_, i) => i !== index));
    setGalleryPreviews(prev => prev.filter((_, i) => i !== index));
  };

  // Note: Removing existing gallery images is not implemented in backend yet for this scope.
  // We can only display them.

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

      const response = await fetch(`/api/properties/${propertyId}`, {
        method: 'PUT',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Failed to update property');
      }

      onSuccess();
    } catch (err) {
      console.error('Error updating property:', err);
      setError('Failed to update property. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (fetching) {
      return (
        <div className="flex flex-col items-center justify-center h-64 text-luxury-gold">
            <Loader2 size={48} className="animate-spin mb-4" />
            <p>Loading details...</p>
        </div>
      );
  }

  return (
    <div className="bg-white rounded-xl shadow-sm overflow-hidden animate-in fade-in duration-300">
      <div className="p-6 border-b border-luxury-border flex justify-between items-center">
        <div className="flex items-center gap-4">
          <button onClick={onCancel} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
            <ArrowLeft size={20} className="text-luxury-gray" />
          </button>
          <h2 className="text-xl font-serif font-bold text-luxury-black">Edit Property</h2>
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
                  onChange={(e) => { setTitle(e.target.value); if(!slug) setSlug(e.target.value.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')); }}
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
                />
              </div>
            </div>

            <div className="space-y-4">
               <div>
                <label className="block text-sm font-bold text-luxury-gray mb-2 uppercase tracking-wider">Price</label>
                <input
                  type="text"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  required
                  className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-luxury-gold focus:border-transparent outline-none transition-all"
                />
              </div>

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


          </div>
          {/* Gallery Section */}
          <div className="pt-8 border-t border-gray-100">
            <h3 className="text-xl font-serif font-bold text-luxury-black mb-6">Gallery Images</h3>

            <div className="bg-gray-50 p-6 rounded-lg border border-gray-100">

              {/* Existing Images */}
              {existingGallery.length > 0 ? (
                <div className="mb-6 grid grid-cols-2 md:grid-cols-4 gap-4">
                  {existingGallery.map((img) => (
                    <div key={img.id} className="relative aspect-[4/3] rounded-lg overflow-hidden group shadow-sm">
                      <img src={img.image_url} alt="Gallery" className="w-full h-full object-cover" />
                      <button
                        type="button"
                        onClick={() => handleDeleteExistingImage(img.id)}
                        className="absolute top-2 right-2 bg-red-500/80 text-white p-1.5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600 shadow-md backdrop-blur-sm"
                        title="Remove image"
                      >
                        <X size={16} />
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 mb-6 bg-white rounded-lg border border-dashed border-gray-200">
                   <p className="text-luxury-gray italic">No gallery images yet.</p>
                </div>
              )}

              {/* Upload New Images */}
              <div>
                <label className="block text-sm font-bold text-luxury-black mb-2">Add More Images</label>
                <div
                  className={`border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:bg-gray-50 transition-colors cursor-pointer ${uploadingGallery ? 'opacity-50 pointer-events-none' : ''}`}
                  onClick={() => galleryInputRef.current?.click()}
                >
                  <div className="flex flex-col items-center justify-center gap-3">
                    {uploadingGallery ? (
                      <Loader2 size={32} className="text-luxury-gold animate-spin" />
                    ) : (
                      <Upload size={32} className="text-luxury-gray" />
                    )}
                    <div>
                      <p className="font-medium text-luxury-black">{uploadingGallery ? 'Uploading...' : 'Click to select additional images'}</p>
                      <p className="text-xs text-luxury-gray mt-1">PNG, JPG up to 5MB each. You can select multiple.</p>
                    </div>
                  </div>
                </div>
                <input
                  type="file"
                  ref={galleryInputRef}
                  onChange={handleUploadNewImages}
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
              {loading ? 'Updating...' : 'Update Property'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditProperty;
