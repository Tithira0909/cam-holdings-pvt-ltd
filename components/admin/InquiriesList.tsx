import React, { useState, useEffect } from 'react';
import { Loader2, Eye, Mail } from 'lucide-react';

interface InquiriesListProps {
  onViewInquiry: (id: string) => void;
}

interface Inquiry {
  id: string;
  full_name: string;
  email: string;
  phone: string;
  subject: string;
  status: 'new' | 'replied' | 'closed';
  createdAt: string;
}

const InquiriesList: React.FC<InquiriesListProps> = ({ onViewInquiry }) => {
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchInquiries();
  }, []);

  const fetchInquiries = async () => {
    try {
      const res = await fetch('/api/admin/inquiries');
      if (res.ok) {
        const data = await res.json();
        setInquiries(data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="flex justify-center p-12 text-luxury-gold"><Loader2 className="animate-spin" size={32} /></div>;

  return (
    <div className="bg-white rounded-xl shadow-sm overflow-hidden animate-in fade-in duration-300">
      <div className="p-6 border-b border-luxury-border">
        <h2 className="text-xl font-serif font-bold text-luxury-black">Inquiries</h2>
      </div>
      <div className="overflow-x-auto">
        <div className="admin-table-container">
          <table className="w-full">
          <thead className="bg-luxury-offwhite text-left">
            <tr>
              <th className="px-6 py-4 text-xs font-bold text-luxury-gray uppercase tracking-wider">Name</th>
              <th className="px-6 py-4 text-xs font-bold text-luxury-gray uppercase tracking-wider">Email</th>
              <th className="px-6 py-4 text-xs font-bold text-luxury-gray uppercase tracking-wider">Subject</th>
              <th className="px-6 py-4 text-xs font-bold text-luxury-gray uppercase tracking-wider">Date</th>
              <th className="px-6 py-4 text-xs font-bold text-luxury-gray uppercase tracking-wider">Status</th>
              <th className="px-6 py-4 text-xs font-bold text-luxury-gray uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-luxury-border">
            {inquiries.map((inq) => (
              <tr key={inq.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4 font-bold text-luxury-black text-sm">{inq.full_name}</td>
                <td className="px-6 py-4 text-sm text-gray-600">{inq.email}</td>
                <td className="px-6 py-4 text-sm text-gray-800 font-medium">{inq.subject}</td>
                <td className="px-6 py-4 text-xs text-gray-500">{new Date(inq.createdAt).toLocaleDateString()}</td>
                <td className="px-6 py-4">
                  <span className={`px-2 py-1 text-xs font-bold rounded-full uppercase tracking-wider ${
                    inq.status === 'new' ? 'bg-blue-100 text-blue-700' :
                    inq.status === 'replied' ? 'bg-green-100 text-green-700' :
                    'bg-gray-100 text-gray-700'
                  }`}>
                    {inq.status}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <button
                    onClick={() => onViewInquiry(String(inq.id))}
                    className="flex items-center gap-2 text-luxury-gold font-bold text-xs uppercase hover:underline"
                  >
                    <Eye size={14} /> View
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
          </div>
        {inquiries.length === 0 && (
          <div className="p-12 text-center text-gray-400">No inquiries found.</div>
        )}
      </div>
    </div>
  );
};

export default InquiriesList;
