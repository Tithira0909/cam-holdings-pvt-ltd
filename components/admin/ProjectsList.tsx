import React, { useState, useEffect } from 'react';
import { MapPin, Plus, Loader2, AlertCircle, Trash2, Edit } from 'lucide-react';
import { Project } from '../../types';

interface ProjectsListProps {
  onAddProject: () => void;
  onEditProject: (id: string) => void;
}

// Extend Project type to include status and budget since they are newly added
interface AdminProject extends Project {
  status?: string;
  budget?: string;
}

const ProjectsList: React.FC<ProjectsListProps> = ({ onAddProject, onEditProject }) => {
  const [projects, setProjects] = useState<AdminProject[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/projects');
      if (!response.ok) {
        throw new Error('Failed to fetch projects');
      }
      const data = await response.json();
      setProjects(data.map((p: any) => ({ ...p, id: String(p.id) })));
      setError(null);
    } catch (err) {
      console.error('Error fetching projects:', err);
      setError('Failed to load projects. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this project?')) return;

    try {
      const response = await fetch(`/api/projects/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete project');
      }

      // Refresh list
      fetchProjects();
    } catch (err) {
      console.error('Error deleting project:', err);
      alert('Failed to delete project');
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-64 text-luxury-gold">
        <Loader2 size={48} className="animate-spin mb-4" />
        <p className="font-serif text-lg">Loading projects...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-64 text-red-500">
        <AlertCircle size={48} className="mb-4" />
        <p className="font-serif text-lg">{error}</p>
        <button
          onClick={fetchProjects}
          className="mt-4 px-4 py-2 bg-luxury-gold text-white rounded-lg hover:bg-luxury-golddark transition-colors"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-sm overflow-hidden animate-in fade-in duration-300">
      <div className="p-6 border-b border-luxury-border flex justify-between items-center">
        <h2 className="text-xl font-serif font-bold text-luxury-black">All Projects</h2>
        <button
          onClick={onAddProject}
          className="flex items-center gap-2 px-4 py-2 bg-luxury-gold text-white rounded-lg font-bold text-sm uppercase tracking-wider hover:bg-luxury-golddark transition-all shadow-gold-glow"
        >
          <Plus size={16} />
          Add New Project
        </button>
      </div>

      {projects.length === 0 ? (
        <div className="p-12 text-center text-gray-500">
          <p className="text-lg mb-4">No projects found.</p>
          <button
            onClick={onAddProject}
            className="text-luxury-gold hover:underline font-bold"
          >
            Add your first project
          </button>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <div className="admin-table-container">
          <table className="w-full">
            <thead className="bg-luxury-offwhite text-left">
              <tr>
                <th className="px-6 py-4 text-xs font-bold text-luxury-gray uppercase tracking-wider">Project</th>
                <th className="px-6 py-4 text-xs font-bold text-luxury-gray uppercase tracking-wider">Location</th>
                <th className="px-6 py-4 text-xs font-bold text-luxury-gray uppercase tracking-wider">Category</th>
                <th className="px-6 py-4 text-xs font-bold text-luxury-gray uppercase tracking-wider">Budget</th>
                <th className="px-6 py-4 text-xs font-bold text-luxury-gray uppercase tracking-wider">Status</th>
                <th className="px-6 py-4 text-xs font-bold text-luxury-gray uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-luxury-border">
              {projects.map((proj) => (
                <tr key={proj.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-lg overflow-hidden bg-gray-200 shrink-0">
                         {proj.image ? (
                           <img src={proj.image} alt={proj.title} className="w-full h-full object-cover" />
                         ) : (
                           <div className="w-full h-full flex items-center justify-center text-gray-400">
                             <MapPin size={16} />
                           </div>
                         )}
                      </div>
                      <div>
                        <p className="font-bold text-luxury-black text-sm line-clamp-1">{proj.title}</p>
                        <p className="text-xs text-luxury-gray">ID: {proj.id}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    <div className="flex items-center gap-2">
                      <MapPin size={14} className="text-luxury-gold shrink-0" />
                      <span className="line-clamp-1">{proj.location?.split(',')[0] || 'N/A'}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="px-3 py-1 bg-luxury-offwhite text-luxury-black text-xs font-bold rounded-full border border-luxury-border">
                      {proj.category}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm font-bold text-luxury-black">
                    {proj.budget || 'N/A'}
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 text-xs font-bold rounded-full ${
                      proj.status === 'Completed' ? 'bg-blue-100 text-blue-700' :
                      proj.status === 'Pending' ? 'bg-yellow-100 text-yellow-700' :
                      'bg-green-100 text-green-700'
                    }`}>
                      {proj.status || 'Active'}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => onEditProject(proj.id)}
                        className="p-2 text-luxury-gray hover:text-luxury-gold transition-colors rounded-full hover:bg-luxury-offwhite"
                      >
                        <Edit size={16} />
                      </button>
                      <button
                        onClick={() => handleDelete(proj.id)}
                        className="p-2 text-luxury-gray hover:text-red-500 transition-colors rounded-full hover:bg-red-50"
                      >
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
      )}
    </div>
  );
};

export default ProjectsList;
