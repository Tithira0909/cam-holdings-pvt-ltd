import React, { useState, useEffect, useRef } from 'react';
import { Upload, X, Loader2, Image as ImageIcon, ArrowLeft, Plus } from 'lucide-react';
import { PropertyType, Property } from '../../types';

interface EditPropertyProps {
  propertyId: string;
  onSuccess: () => void;
  onCancel: () => void;
}

const EditProperty: React.FC<EditPropertyProps> = ({ propertyId, onSuccess, onCancel }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [initialLoading, setInitialLoading] = useState(true);

  // Form State
  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [location, setLocation] = useState('');
  const [price, setPrice] = useState('');
  const [type, setType] = useState<PropertyType>(PropertyType.LAND);
  const [status, setStatus] = useState('Active');
  const [description, setDescription] = useState('');
  const [fullDescription, setFullDescription] = useState('');

  // New Fields
  const [category, setCategory] = useState('');
  const [district, setDistrict] = useState('');
  const [city, setCity] = useState('');
  const [locationLabel, setLocationLabel] = useState('');
  const [priceLabel, setPriceLabel] = useState('');
  const [projectStatusLabel, setProjectStatusLabel] = useState('');
  const [bedrooms, setBedrooms] = useState<number | ''>('');
  const [bathrooms, setBathrooms] = useState<number | ''>('');
  const [isFeatured, setIsFeatured] = useState(false);
  const [sortOrder, setSortOrder] = useState<number>(0);
  const [isSoldOut, setIsSoldOut] = useState(false);
  const [hotlineNumber, setHotlineNumber] = useState('');
  const [whatsappNumber, setWhatsappNumber] = useState('');
  const [inquiryEmail, setInquiryEmail] = useState('');
  const [metaTitle, setMetaTitle] = useState('');
  const [metaDescription, setMetaDescription] = useState('');

  // Facilities Repeater
  const [amenities, setAmenities] = useState<{ id: string, label: string }[]>([]);
  const [newFacility, setNewFacility] = useState('');

  // File State
  const [mainImage, setMainImage] = useState<File | null>(null);
  const [mainImagePreview, setMainImagePreview] = useState<string | null>(null);

  const [logoImage, setLogoImage] = useState<File | null>(null);
  const [logoImagePreview, setLogoImagePreview] = useState<string | null>(null);

  const [blockPlanImage, setBlockPlanImage] = useState<File | null>(null);
  const [blockPlanImagePreview, setBlockPlanImagePreview] = useState<string | null>(null);

  const [roadMapImage, setRoadMapImage] = useState<File | null>(null);
  const [roadMapImagePreview, setRoadMapImagePreview] = useState<string | null>(null);

  const [locationMapImage, setLocationMapImage] = useState<File | null>(null);
  const [locationMapImagePreview, setLocationMapImagePreview] = useState<string | null>(null);

  // Gallery
  const [galleryImages, setGalleryImages] = useState<File[]>([]);
  const [galleryPreviews, setGalleryPreviews] = useState<string[]>([]);
  const [existingGallery, setExistingGallery] = useState<any[]>([]);
  const [uploadingGallery, setUploadingGallery] = useState(false);

  const mainImageInputRef = useRef<HTMLInputElement>(null);
  const logoImageInputRef = useRef<HTMLInputElement>(null);
  const blockPlanImageInputRef = useRef<HTMLInputElement>(null);
  const roadMapImageInputRef = useRef<HTMLInputElement>(null);
  const locationMapImageInputRef = useRef<HTMLInputElement>(null);
  const galleryInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetchPropertyDetails();
  }, [propertyId]);

  const fetchPropertyDetails = async () => {
    try {
      let res = await fetch(`/api/lands/${propertyId}`);
      if (!res.ok) {
        res = await fetch(`/api/houses/${propertyId}`);
      }
      const response = res;
      if (!response.ok) {
        throw new Error('Failed to fetch property details');
      }
      const data: Property = await response.json();

      setTitle(data.title || '');
      setSlug(data.slug || '');
      setLocation(data.location || '');
      setPrice(data.price || '');
      setType((data.type as PropertyType) || PropertyType.LAND);
      setStatus(data.status || 'Active');
      setDescription(data.description || '');
      setFullDescription(data.fullDescription || '');

      setCategory(data.category || '');
      setDistrict(data.district || '');
      setCity(data.city || '');
      setLocationLabel(data.locationLabel || '');
      setPriceLabel(data.priceLabel || '');
      setProjectStatusLabel(data.projectStatusLabel || '');
      setBedrooms(data.bedrooms ?? data.beds ?? '');
      setBathrooms(data.bathrooms ?? data.baths ?? '');
      setIsFeatured(!!data.isFeatured);
      setSortOrder(data.sortOrder ?? 0);
      setIsSoldOut(!!data.isSoldOut);
      setHotlineNumber(data.hotlineNumber || '');
      setWhatsappNumber(data.whatsappNumber || '');
      setInquiryEmail(data.inquiryEmail || '');
      setMetaTitle(data.metaTitle || '');
      setMetaDescription(data.metaDescription || '');

      setAmenities(data.amenities || []);

      if (data.image) setMainImagePreview(data.image);
      if (data.logoImage) setLogoImagePreview(data.logoImage);
      if (data.blockPlanImage) setBlockPlanImagePreview(data.blockPlanImage);
      if (data.roadMapImage) setRoadMapImagePreview(data.roadMapImage);
      if (data.locationMapImage) setLocationMapImagePreview(data.locationMapImage);

      if (data.images && data.images.length > 0) {
        setExistingGallery(data.images);
      }

    } catch (err) {
      console.error(err);
      setError('Failed to load property details.');
    } finally {
      setInitialLoading(false);
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>, setFile: any, setPreview: any) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setFile(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const addFacility = () => {
     if (newFacility.trim()) {
        setAmenities([...amenities, { id: Date.now().toString(), label: newFacility.trim(), icon: '' }]);
        setNewFacility('');
     }
  };

  const removeFacility = (id: string) => {
     setAmenities(amenities.filter(a => a.id !== id));
  };

  const handleGalleryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      setGalleryImages(prev => [...prev, ...files]);
      const newPreviews = files.map((file: File) => URL.createObjectURL(file));
      setGalleryPreviews(prev => [...prev, ...newPreviews]);
    }
  };

  const removeGalleryImage = (index: number) => {
    setGalleryImages(prev => prev.filter((_, i) => i !== index));
    setGalleryPreviews(prev => prev.filter((_, i) => i !== index));
  };

  const handleDeleteExistingImage = async (imageId: number) => {
    if (!window.confirm('Are you sure you want to delete this gallery image?')) return;
    try {
      let url = `/api/admin/lands/images/${imageId}`;
      if (type === 'House' || type === 'Apartment') {
        url = `/api/admin/houses/images/${imageId}`;
      }
      const res = await fetch(url, {
        method: 'DELETE',
      });
      if (res.ok) {
        setExistingGallery(prev => prev.filter(img => img.id !== imageId));
      } else {
        throw new Error('Failed to delete');
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
    Array.from(e.target.files).forEach((file: File) => {
      formData.append('images', file);
    });

    try {
      let url = `/api/admin/lands/${propertyId}/images`;
      if (type === 'House' || type === 'Apartment') {
        url = `/api/admin/houses/${propertyId}/images`;
      }
      const res = await fetch(url, {
        method: 'POST',
        body: formData,
      });

      if (!res.ok) throw new Error('Failed to upload');

      const uploadedImages = await res.json();
      setExistingGallery(prev => [...prev, ...uploadedImages]);
    } catch (err) {
      console.error(err);
      alert('Error uploading images');
    } finally {
      setUploadingGallery(false);
      if (galleryInputRef.current) galleryInputRef.current.value = '';
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append('title', title);
      formData.append('slug', slug);
      formData.append('location', location || `${city}, ${district}`);
      formData.append('price', price);
      formData.append('type', type);
      formData.append('status', status);
      formData.append('description', description);
      formData.append('fullDescription', fullDescription || description);

      // New text fields
      formData.append('category', category);
      formData.append('district', district);
      formData.append('city', city);
      formData.append('locationLabel', locationLabel);
      formData.append('priceLabel', priceLabel);
      formData.append('projectStatusLabel', projectStatusLabel);
      formData.append('bedrooms', String(bedrooms || ''));
      formData.append('bathrooms', String(bathrooms || ''));
      formData.append('isFeatured', String(isFeatured));
      formData.append('sortOrder', String(sortOrder));
      formData.append('isSoldOut', String(isSoldOut));
      formData.append('hotlineNumber', hotlineNumber);
      formData.append('whatsappNumber', whatsappNumber);
      formData.append('inquiryEmail', inquiryEmail);
      formData.append('metaTitle', metaTitle);
      formData.append('metaDescription', metaDescription);

      // Arrays as JSON strings
      formData.append('amenities', JSON.stringify(amenities));

      // Files
      if (mainImage) formData.append('image', mainImage);
      if (logoImage) formData.append('logoImage', logoImage);
      if (blockPlanImage) formData.append('blockPlanImage', blockPlanImage);
      if (roadMapImage) formData.append('roadMapImage', roadMapImage);
      if (locationMapImage) formData.append('locationMapImage', locationMapImage);

      let url = `/api/lands/${propertyId}`;
      if (type === 'House' || type === 'Apartment') {
        url = `/api/houses/${propertyId}`;
      }
      const response = await fetch(url, {
        method: 'PUT',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Failed to update property');
      }

      onSuccess();
    } catch (err: any) {
      setError(err.message || 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  if (initialLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-64 text-red-600">
        <Loader2 size={48} className="animate-spin mb-4" />
        <p className="font-serif text-lg">Loading property details...</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-sm overflow-hidden animate-in fade-in duration-300">
      <div className="p-6 border-b border-luxury-border flex justify-between items-center bg-gray-50">
        <div className="flex items-center gap-4">
          <button onClick={onCancel} className="p-2 hover:bg-gray-200 rounded-full transition-colors bg-white shadow-sm">
            <ArrowLeft size={20} className="text-luxury-gray" />
          </button>
          <h2 className="text-xl font-serif font-bold text-luxury-black">Edit Property / Land</h2>
        </div>
      </div>

      <div className="p-8">
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-600 rounded-lg">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-12">
          {/* --- SECTION 1: Basic Information --- */}
          <section>
            <h3 className="text-lg font-serif font-bold text-luxury-black mb-6 border-b border-luxury-border pb-2">1. Basic Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-luxury-gray mb-2 uppercase tracking-wider">Property Title *</label>
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => {
                      setTitle(e.target.value);
                      if (!slug) setSlug(e.target.value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, ''));
                    }}
                    required
                    className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-1 focus:ring-red-600 outline-none transition-all text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-luxury-gray mb-2 uppercase tracking-wider">Slug URL *</label>
                  <input
                    type="text"
                    value={slug}
                    onChange={(e) => setSlug(e.target.value)}
                    required
                    className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-1 focus:ring-red-600 outline-none transition-all text-sm"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-luxury-gray mb-2 uppercase tracking-wider">Property Type *</label>
                    <select
                      value={type}
                      onChange={(e) => setType(e.target.value as PropertyType)}
                      className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-1 focus:ring-red-600 outline-none transition-all text-sm"
                    >
                      {Object.values(PropertyType).map(t => (
                        <option key={t} value={t}>{t}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-luxury-gray mb-2 uppercase tracking-wider">Category</label>
                    <input
                      type="text"
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                      className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-1 focus:ring-red-600 outline-none transition-all text-sm"
                    />
                  </div>
                </div>
                {type === PropertyType.HOUSE || type === PropertyType.APARTMENT ? (
                  <div className="grid grid-cols-2 gap-4 mt-4">
                    <div>
                      <label className="block text-xs font-bold text-luxury-gray mb-2 uppercase tracking-wider">Bedrooms</label>
                      <input
                        type="number"
                        min="0"
                        value={bedrooms}
                        onChange={(e) => setBedrooms(e.target.value ? Number(e.target.value) : '')}
                        className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-1 focus:ring-red-600 outline-none transition-all text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-luxury-gray mb-2 uppercase tracking-wider">Bathrooms</label>
                      <input
                        type="number"
                        min="0"
                        value={bathrooms}
                        onChange={(e) => setBathrooms(e.target.value ? Number(e.target.value) : '')}
                        className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-1 focus:ring-red-600 outline-none transition-all text-sm"
                      />
                    </div>
                  </div>
                ) : null}
              </div>
              <div className="space-y-4">
                 <div>
                    <label className="block text-xs font-bold text-luxury-gray mb-2 uppercase tracking-wider">Project Status Label</label>
                    <input
                      type="text"
                      value={projectStatusLabel}
                      onChange={(e) => setProjectStatusLabel(e.target.value)}
                      className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-1 focus:ring-red-600 outline-none transition-all text-sm"
                    />
                 </div>
                 <div>
                    <label className="block text-xs font-bold text-luxury-gray mb-2 uppercase tracking-wider">Sort Order</label>
                    <input
                      type="number"
                      value={sortOrder}
                      onChange={(e) => setSortOrder(Number(e.target.value))}
                      className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-1 focus:ring-red-600 outline-none transition-all text-sm"
                    />
                 </div>
                 <div className="grid grid-cols-3 gap-4 pt-4">
                    <label className="flex items-center gap-2 cursor-pointer bg-gray-50 p-3 rounded-lg border border-gray-200 text-sm font-bold text-luxury-gray">
                       <input type="checkbox" checked={isFeatured} onChange={e => setIsFeatured(e.target.checked)} className="accent-luxury-gold w-4 h-4" />
                       Featured
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer bg-gray-50 p-3 rounded-lg border border-gray-200 text-sm font-bold text-luxury-gray">
                       <input type="checkbox" checked={status === 'Active'} onChange={e => setStatus(e.target.checked ? 'Active' : 'Inactive')} className="accent-green-500 w-4 h-4" />
                       Active
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer bg-red-50 p-3 rounded-lg border border-red-200 text-sm font-bold text-red-600">
                       <input type="checkbox" checked={isSoldOut} onChange={e => setIsSoldOut(e.target.checked)} className="accent-red-600 w-4 h-4" />
                       Sold Out
                    </label>
                 </div>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
              <div>
                <label className="block text-xs font-bold text-luxury-gray mb-2 uppercase tracking-wider">Short Description</label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={4}
                  className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-1 focus:ring-red-600 outline-none transition-all text-sm resize-none"
                ></textarea>
              </div>
              <div>
                <label className="block text-xs font-bold text-luxury-gray mb-2 uppercase tracking-wider">Full Detailed Description</label>
                <textarea
                  value={fullDescription}
                  onChange={(e) => setFullDescription(e.target.value)}
                  rows={4}
                  className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-1 focus:ring-red-600 outline-none transition-all text-sm resize-none"
                ></textarea>
              </div>
            </div>
          </section>

          {/* --- SECTION 2: Pricing & Location --- */}
          <section>
            <h3 className="text-lg font-serif font-bold text-luxury-black mb-6 border-b border-luxury-border pb-2">2. Pricing & Location</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                 <div>
                    <label className="block text-xs font-bold text-luxury-gray mb-2 uppercase tracking-wider">Starting Price *</label>
                    <input
                      type="text"
                      value={price}
                      onChange={(e) => setPrice(e.target.value)}
                      required
                      className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-1 focus:ring-red-600 outline-none transition-all text-sm font-bold text-luxury-black"
                    />
                 </div>
                 <div>
                    <label className="block text-xs font-bold text-luxury-gray mb-2 uppercase tracking-wider">Price Label</label>
                    <input
                      type="text"
                      value={priceLabel}
                      onChange={(e) => setPriceLabel(e.target.value)}
                      className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-1 focus:ring-red-600 outline-none transition-all text-sm"
                    />
                 </div>
              </div>
              <div className="space-y-4">
                 <div className="grid grid-cols-2 gap-4">
                    <div>
                       <label className="block text-xs font-bold text-luxury-gray mb-2 uppercase tracking-wider">District</label>
                       <input
                         type="text"
                         value={district}
                         onChange={(e) => setDistrict(e.target.value)}
                         className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-1 focus:ring-red-600 outline-none transition-all text-sm"
                       />
                    </div>
                    <div>
                       <label className="block text-xs font-bold text-luxury-gray mb-2 uppercase tracking-wider">City</label>
                       <input
                         type="text"
                         value={city}
                         onChange={(e) => setCity(e.target.value)}
                         className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-1 focus:ring-red-600 outline-none transition-all text-sm"
                       />
                    </div>
                 </div>
                 <div>
                    <label className="block text-xs font-bold text-luxury-gray mb-2 uppercase tracking-wider">Exact Location Label</label>
                    <input
                      type="text"
                      value={locationLabel}
                      onChange={(e) => setLocationLabel(e.target.value)}
                      className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-1 focus:ring-red-600 outline-none transition-all text-sm"
                    />
                 </div>
              </div>
            </div>
          </section>

          {/* --- SECTION 3: Media & Plans --- */}
          <section>
            <h3 className="text-lg font-serif font-bold text-luxury-black mb-6 border-b border-luxury-border pb-2">3. Media & Plans</h3>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
               {/* Main Cover */}
               <div className="col-span-2">
                  <label className="block text-xs font-bold text-luxury-gray mb-2 uppercase tracking-wider">Main Cover Image *</label>
                  <div
                    onClick={() => mainImageInputRef.current?.click()}
                    className={`border-2 border-dashed border-gray-300 rounded-xl aspect-[16/9] flex flex-col items-center justify-center cursor-pointer hover:border-red-600 transition-colors ${mainImagePreview ? 'bg-gray-50' : ''}`}
                  >
                    {mainImagePreview ? (
                      <div className="relative w-full h-full group">
                        <img src={mainImagePreview} alt="Main Preview" className="w-full h-full object-cover rounded-xl" />
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center rounded-xl">
                          <p className="text-white font-bold text-sm">Change Cover</p>
                        </div>
                      </div>
                    ) : (
                      <>
                        <ImageIcon size={32} className="text-gray-300 mb-2" />
                        <p className="text-gray-500 font-medium text-xs">Upload Cover</p>
                      </>
                    )}
                    <input type="file" ref={mainImageInputRef} onChange={(e) => handleImageChange(e, setMainImage, setMainImagePreview)} accept="image/*" className="hidden" />
                  </div>
               </div>

               {/* Project Logo */}
               <div className="col-span-2 md:col-span-1">
                  <label className="block text-xs font-bold text-luxury-gray mb-2 uppercase tracking-wider">Project Logo</label>
                  <div
                    onClick={() => logoImageInputRef.current?.click()}
                    className={`border-2 border-dashed border-gray-300 rounded-xl aspect-square flex flex-col items-center justify-center cursor-pointer hover:border-red-600 transition-colors bg-gray-50`}
                  >
                    {logoImagePreview ? (
                       <div className="relative w-full h-full group p-4">
                         <img src={logoImagePreview} alt="Logo Preview" className="w-full h-full object-contain" />
                         <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center rounded-xl">
                            <p className="text-white font-bold text-xs">Change</p>
                         </div>
                       </div>
                    ) : (
                      <>
                        <ImageIcon size={24} className="text-gray-300 mb-2" />
                        <p className="text-gray-500 font-medium text-xs">Upload Logo</p>
                      </>
                    )}
                    <input type="file" ref={logoImageInputRef} onChange={(e) => handleImageChange(e, setLogoImage, setLogoImagePreview)} accept="image/*" className="hidden" />
                  </div>
               </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4 border-t border-gray-100">
               {/* Block Plan */}
               <div>
                  <label className="block text-xs font-bold text-luxury-gray mb-2 uppercase tracking-wider">Block Plan</label>
                  <div onClick={() => blockPlanImageInputRef.current?.click()} className="border-2 border-dashed border-gray-300 rounded-xl aspect-video flex items-center justify-center cursor-pointer hover:border-red-600 bg-gray-50">
                    {blockPlanImagePreview ? <img src={blockPlanImagePreview} className="w-full h-full object-contain p-2" /> : <p className="text-xs text-gray-500">Upload Block Plan</p>}
                    <input type="file" ref={blockPlanImageInputRef} onChange={(e) => handleImageChange(e, setBlockPlanImage, setBlockPlanImagePreview)} accept="image/*" className="hidden" />
                  </div>
               </div>

               {/* Road Map */}
               <div>
                  <label className="block text-xs font-bold text-luxury-gray mb-2 uppercase tracking-wider">Road Map</label>
                  <div onClick={() => roadMapImageInputRef.current?.click()} className="border-2 border-dashed border-gray-300 rounded-xl aspect-video flex items-center justify-center cursor-pointer hover:border-red-600 bg-gray-50">
                    {roadMapImagePreview ? <img src={roadMapImagePreview} className="w-full h-full object-contain p-2" /> : <p className="text-xs text-gray-500">Upload Road Map</p>}
                    <input type="file" ref={roadMapImageInputRef} onChange={(e) => handleImageChange(e, setRoadMapImage, setRoadMapImagePreview)} accept="image/*" className="hidden" />
                  </div>
               </div>

               {/* Location Map */}
               <div>
                  <label className="block text-xs font-bold text-luxury-gray mb-2 uppercase tracking-wider">Location Map</label>
                  <div onClick={() => locationMapImageInputRef.current?.click()} className="border-2 border-dashed border-gray-300 rounded-xl aspect-video flex items-center justify-center cursor-pointer hover:border-red-600 bg-gray-50">
                    {locationMapImagePreview ? <img src={locationMapImagePreview} className="w-full h-full object-contain p-2" /> : <p className="text-xs text-gray-500">Upload Location Map</p>}
                    <input type="file" ref={locationMapImageInputRef} onChange={(e) => handleImageChange(e, setLocationMapImage, setLocationMapImagePreview)} accept="image/*" className="hidden" />
                  </div>
               </div>
            </div>

          </section>

          {/* --- SECTION 3.5: Gallery Section --- */}
          <section className="pt-8 border-t border-gray-100">
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
                      <Loader2 size={32} className="text-red-600 animate-spin" />
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
          </section>

          {/* --- SECTION 4: Facilities & Amenities --- */}
          <section>
            <h3 className="text-lg font-serif font-bold text-luxury-black mb-6 border-b border-luxury-border pb-2">4. Facilities & Features</h3>

            <div className="bg-gray-50 p-6 rounded-xl border border-gray-200">
               <div className="flex gap-2 mb-4">
                  <input
                     type="text"
                     value={newFacility}
                     onChange={(e) => setNewFacility(e.target.value)}
                     onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); addFacility(); } }}
                     placeholder="e.g. 3 Phase Electricity, Tar Road, Tap Water..."
                     className="flex-1 p-3 bg-white border border-gray-300 rounded-lg text-sm focus:ring-1 focus:ring-red-600 outline-none"
                  />
                  <button type="button" onClick={addFacility} className="bg-luxury-black text-white px-6 rounded-lg font-bold uppercase tracking-wider text-xs hover:bg-red-600 transition-colors">
                     Add
                  </button>
               </div>

               <div className="flex flex-wrap gap-2">
                  {amenities.map(fac => (
                     <div key={fac.id} className="bg-white border border-gray-200 px-3 py-1.5 rounded-full flex items-center gap-2 text-sm shadow-sm">
                        <span className="text-luxury-black font-medium">{fac.label}</span>
                        <button type="button" onClick={() => removeFacility(fac.id)} className="text-red-500 hover:bg-red-50 rounded-full p-0.5"><X size={14} /></button>
                     </div>
                  ))}
                  {amenities.length === 0 && <span className="text-sm text-gray-400 italic">No facilities added yet.</span>}
               </div>
            </div>
          </section>

          {/* --- SECTION 5: Contact & SEO --- */}
          <section>
            <h3 className="text-lg font-serif font-bold text-luxury-black mb-6 border-b border-luxury-border pb-2">5. Contact & SEO</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
               <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-luxury-gray mb-2 uppercase tracking-wider">Hotline Number</label>
                    <input type="text" value={hotlineNumber} onChange={e => setHotlineNumber(e.target.value)} className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:ring-1 focus:ring-red-600 outline-none" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-luxury-gray mb-2 uppercase tracking-wider">WhatsApp Number</label>
                    <input type="text" value={whatsappNumber} onChange={e => setWhatsappNumber(e.target.value)} className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:ring-1 focus:ring-red-600 outline-none" />
                  </div>
               </div>
               <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-luxury-gray mb-2 uppercase tracking-wider">SEO Title</label>
                    <input type="text" value={metaTitle} onChange={e => setMetaTitle(e.target.value)} className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:ring-1 focus:ring-red-600 outline-none" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-luxury-gray mb-2 uppercase tracking-wider">SEO Description</label>
                    <textarea value={metaDescription} onChange={e => setMetaDescription(e.target.value)} rows={2} className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:ring-1 focus:ring-red-600 outline-none resize-none"></textarea>
                  </div>
               </div>
            </div>
          </section>

          {/* Actions */}
          <div className="flex justify-between items-center pt-8 border-t border-gray-200 mt-12 bg-gray-50 p-6 rounded-xl">
            <button
              type="button"
              onClick={onCancel}
              className="px-6 py-3 text-luxury-gray font-bold uppercase tracking-wider hover:text-luxury-black transition-colors bg-white border border-gray-200 rounded-lg shadow-sm"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-8 py-3 bg-red-600 text-white rounded-lg font-bold uppercase tracking-wider hover:bg-red-600dark transition-all shadow-gold-glow disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {loading && <Loader2 size={18} className="animate-spin" />}
              {loading ? 'Updating Property...' : 'Update Property'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditProperty;