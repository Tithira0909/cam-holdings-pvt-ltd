import React, { useState, useEffect } from 'react';
import { Save, X, Image as ImageIcon, Loader2 } from 'lucide-react';

interface ProjectFormProps {
  projectId?: string;
  onSuccess: () => void;
  onCancel: () => void;
}

const ProjectForm: React.FC<ProjectFormProps> = ({ projectId, onSuccess, onCancel }) => {
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(!!projectId);

  const [title, setTitle] = useState('');
  const [location, setLocation] = useState('');
  const [category, setCategory] = useState('Real Estate');
  const [budget, setBudget] = useState('');
  const [status, setStatus] = useState('Active');
  const [description, setDescription] = useState('');
  const [image, setImage] = useState<File | null>(null);
  const [currentImage, setCurrentImage] = useState('');

  useEffect(() => {
    if (projectId) {
      fetchProject();
    }
  }, [projectId]);

  const fetchProject = async () => {
    try {
      const response = await fetch(`/api/projects/${projectId}`);
      if (response.ok) {
        const data = await response.json();
        setTitle(data.title || '');
        setLocation(data.location || '');
        setCategory(data.category || 'Real Estate');
        setBudget(data.budget || '');
        setStatus(data.status || 'Active');
        setDescription(data.description || '');
        setCurrentImage(data.image || '');
      }
    } catch (error) {
      console.error('Failed to fetch project:', error);
      alert('Failed to load project details.');
    } finally {
      setInitialLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !location || !category) {
      alert('Title, Location, and Category are required.');
      return;
    }

    setLoading(true);
    const formData = new FormData();
    formData.append('title', title);
    formData.append('location', location);
    formData.append('category', category);
    formData.append('budget', budget);
    formData.append('status', status);
    formData.append('description', description);
    if (image) {
      formData.append('image', image);
    }

    try {
      const url = projectId ? `/api/projects/${projectId}` : '/api/projects';
      const method = projectId ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Failed to save project');
      }

      onSuccess();
    } catch (error) {
      console.error('Error saving project:', error);
      alert('Failed to save project. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (initialLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-64 text-luxury-gold">
        <Loader2 size={48} className="animate-spin mb-4" />
        <p className="font-serif text-lg">Loading project details...</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-sm overflow-hidden animate-in fade-in duration-300">
      <div className="p-6 border-b border-luxury-border flex justify-between items-center bg-luxury-offwhite">
        <h2 className="text-xl font-serif font-bold text-luxury-black">
          {projectId ? 'Edit Project' : 'Add New Project'}
        </h2>
        <button
          onClick={onCancel}
          className="text-luxury-gray hover:text-luxury-black transition-colors"
        >
          <X size={24} />
        </button>
      </div>

      <form onSubmit={handleSubmit} className="p-6 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-bold text-luxury-black mb-1">Title *</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-4 py-2 border border-luxury-border rounded-lg focus:ring-1 focus:ring-luxury-gold outline-none"
                placeholder="E.g., Skyview Tower"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-luxury-black mb-1">Location *</label>
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="w-full px-4 py-2 border border-luxury-border rounded-lg focus:ring-1 focus:ring-luxury-gold outline-none"
                placeholder="E.g., Colombo 03"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-bold text-luxury-black mb-1">Category *</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full px-4 py-2 border border-luxury-border rounded-lg focus:ring-1 focus:ring-luxury-gold outline-none bg-white"
                  required
                >
                  <option value="Real Estate">Real Estate</option>
                  <option value="Construction">Construction</option>
                  <option value="Interiors">Interiors</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-bold text-luxury-black mb-1">Status</label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                  className="w-full px-4 py-2 border border-luxury-border rounded-lg focus:ring-1 focus:ring-luxury-gold outline-none bg-white"
                >
                  <option value="Active">Active</option>
                  <option value="Pending">Pending</option>
                  <option value="Completed">Completed</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-bold text-luxury-black mb-1">Budget</label>
              <input
                type="text"
                value={budget}
                onChange={(e) => setBudget(e.target.value)}
                className="w-full px-4 py-2 border border-luxury-border rounded-lg focus:ring-1 focus:ring-luxury-gold outline-none"
                placeholder="E.g., 50M LKR"
              />
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-bold text-luxury-black mb-1">Cover Image</label>
              <div className="border-2 border-dashed border-luxury-border rounded-lg p-6 flex flex-col items-center justify-center text-center relative hover:bg-luxury-offwhite transition-colors">
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    if (e.target.files && e.target.files[0]) {
                      setImage(e.target.files[0]);
                      setCurrentImage(URL.createObjectURL(e.target.files[0]));
                    }
                  }}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                />
                {currentImage ? (
                  <img src={currentImage} alt="Preview" className="h-32 object-contain mb-2 rounded" />
                ) : (
                  <ImageIcon size={48} className="text-luxury-gray mb-2" />
                )}
                <p className="text-sm font-bold text-luxury-black">Click to upload or drag and drop</p>
                <p className="text-xs text-luxury-gray mt-1">PNG, JPG, WEBP up to 5MB</p>
              </div>
            </div>

            <div>
              <label className="block text-sm font-bold text-luxury-black mb-1">Short Description</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={4}
                className="w-full px-4 py-2 border border-luxury-border rounded-lg focus:ring-1 focus:ring-luxury-gold outline-none resize-none"
                placeholder="Brief description of the project..."
              />
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-4 pt-6 border-t border-luxury-border">
          <button
            type="button"
            onClick={onCancel}
            className="px-6 py-2 border border-luxury-border text-luxury-black rounded-lg font-bold uppercase tracking-wider hover:bg-luxury-offwhite transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="flex items-center gap-2 px-6 py-2 bg-luxury-gold text-white rounded-lg font-bold uppercase tracking-wider hover:bg-luxury-golddark transition-colors shadow-gold-glow disabled:opacity-70"
          >
            {loading ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
            {projectId ? 'Save Changes' : 'Create Project'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ProjectForm;