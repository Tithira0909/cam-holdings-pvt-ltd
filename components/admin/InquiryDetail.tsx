import React, { useState, useEffect } from 'react';
import { ArrowLeft, Loader2, Send, CheckCircle, Clock } from 'lucide-react';

interface InquiryDetailProps {
  inquiryId: string;
  onBack: () => void;
}

interface Reply {
  id: string;
  admin_user: string;
  reply_subject: string;
  reply_message: string;
  sent_at: string;
}

interface Inquiry {
  id: string;
  full_name: string;
  email: string;
  phone: string;
  subject: string;
  service: string;
  message: string;
  status: 'new' | 'replied' | 'closed';
  createdAt: string;
  replies: Reply[];
}

const InquiryDetail: React.FC<InquiryDetailProps> = ({ inquiryId, onBack }) => {
  const [inquiry, setInquiry] = useState<Inquiry | null>(null);
  const [loading, setLoading] = useState(true);
  const [replySubject, setReplySubject] = useState('');
  const [replyMessage, setReplyMessage] = useState('');
  const [sending, setSending] = useState(false);

  useEffect(() => {
    fetchDetail();
  }, [inquiryId]);

  const fetchDetail = async () => {
    try {
      const res = await fetch(`/api/admin/inquiries/${inquiryId}`);
      if (res.ok) {
        const data = await res.json();
        setInquiry(data);
        setReplySubject(`Re: ${data.subject}`);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSendReply = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!replyMessage.trim()) return;

    setSending(true);
    try {
      const res = await fetch(`/api/inquiries/${inquiryId}/reply`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          subject: replySubject,
          message: replyMessage
        })
      });

      if (res.ok) {
        alert('Reply sent successfully!');
        setReplyMessage('');
        fetchDetail(); // Refresh to show new reply in history
      } else {
        const data = await res.json();
        alert(`Failed to send reply: ${data.error || 'Unknown error'}`);
      }
    } catch (err) {
      console.error(err);
      alert('Error sending reply.');
    } finally {
      setSending(false);
    }
  };

  if (loading) return <div className="flex justify-center p-12 text-red-600"><Loader2 className="animate-spin" size={32} /></div>;
  if (!inquiry) return <div className="p-12 text-center text-red-500">Inquiry not found.</div>;

  return (
    <div className="bg-white rounded-xl shadow-sm overflow-hidden animate-in fade-in duration-300">
      <div className="p-6 border-b border-luxury-border flex items-center gap-4">
        <button onClick={onBack} className="p-2 hover:bg-gray-100 rounded-full text-luxury-gray hover:text-luxury-black transition-colors">
          <ArrowLeft size={20} />
        </button>
        <h2 className="text-xl font-serif font-bold text-luxury-black">Inquiry Details</h2>
        <span className={`ml-auto px-3 py-1 text-xs font-bold rounded-full uppercase tracking-wider ${
           inquiry.status === 'new' ? 'bg-blue-100 text-blue-700' :
           inquiry.status === 'replied' ? 'bg-green-100 text-green-700' :
           'bg-gray-100 text-gray-700'
        }`}>
          {inquiry.status}
        </span>
      </div>

      <div className="p-8 grid grid-cols-1 lg:grid-cols-3 gap-12">
        {/* Left: Original Message & History */}
        <div className="lg:col-span-2 space-y-8">
          <div className="bg-luxury-offwhite p-6 rounded-lg border border-luxury-border">
            <h3 className="text-lg font-bold text-luxury-black mb-4">{inquiry.subject}</h3>
            <div className="flex gap-8 text-sm text-gray-500 mb-6 pb-6 border-b border-gray-200">
               <div>
                 <span className="block font-bold uppercase text-[10px] tracking-wider text-luxury-gray">From</span>
                 <span className="text-luxury-black font-medium">{inquiry.full_name}</span> &lt;{inquiry.email}&gt;
               </div>
               <div>
                 <span className="block font-bold uppercase text-[10px] tracking-wider text-luxury-gray">Date</span>
                 <span className="text-luxury-black font-medium">{new Date(inquiry.createdAt).toLocaleString()}</span>
               </div>
               {inquiry.phone && (
                 <div>
                    <span className="block font-bold uppercase text-[10px] tracking-wider text-luxury-gray">Phone</span>
                    <span className="text-luxury-black font-medium">{inquiry.phone}</span>
                 </div>
               )}
            </div>
            <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">{inquiry.message}</p>
          </div>

          {/* Reply History */}
          {inquiry.status === 'Replied' && inquiry.reply_message && (
            <div className="space-y-6">
              <h4 className="text-sm font-bold text-luxury-gray uppercase tracking-wider flex items-center gap-2">
                <Clock size={16} /> Reply History
              </h4>
              <div className="space-y-4">
                <div className="pl-6 border-l-2 border-red-600 py-2">
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-bold text-luxury-black text-sm">Admin <span className="font-normal text-gray-500">replied:</span></span>
                    <span className="text-xs text-gray-400">{new Date(inquiry.replied_at || '').toLocaleString()}</span>
                  </div>
                  <h5 className="text-sm font-bold text-luxury-black mb-1">{inquiry.reply_subject}</h5>
                  <p className="text-sm text-gray-600 bg-gray-50 p-3 rounded-lg whitespace-pre-wrap">{inquiry.reply_message}</p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Right: Reply Panel */}
        {inquiry.status !== 'Replied' && (
          <div className="space-y-6">
             <div className="bg-white border border-gray-200 shadow-lg rounded-xl p-6 sticky top-8">
               <h3 className="text-lg font-bold text-luxury-black mb-4 flex items-center gap-2">
                 <Send size={18} className="text-red-600" /> Send Reply
               </h3>
               <form onSubmit={handleSendReply} className="space-y-4">
               <div>
                 <label className="block text-xs font-bold text-luxury-gray uppercase tracking-wider mb-1">Subject</label>
                 <input
                   type="text"
                   value={replySubject}
                   onChange={(e) => setReplySubject(e.target.value)}
                   className="w-full p-2 border border-gray-300 rounded text-sm focus:ring-1 focus:ring-red-600 outline-none"
                   required
                 />
               </div>
               <div>
                 <label className="block text-xs font-bold text-luxury-gray uppercase tracking-wider mb-1">Message</label>
                 <textarea
                   rows={6}
                   value={replyMessage}
                   onChange={(e) => setReplyMessage(e.target.value)}
                   className="w-full p-2 border border-gray-300 rounded text-sm focus:ring-1 focus:ring-red-600 outline-none resize-none"
                   placeholder="Type your reply here..."
                   required
                 />
               </div>
                 <button
                   type="submit"
                   disabled={sending}
                   className="w-full py-3 bg-red-600 text-white font-bold uppercase text-xs tracking-wider rounded shadow-gold-glow hover:bg-red-700 transition-all disabled:opacity-50 flex justify-center items-center gap-2"
                 >
                   {sending ? <Loader2 className="animate-spin" size={16} /> : <Send size={16} />}
                   {sending ? 'Sending...' : 'Send Email'}
                 </button>
               </form>
             </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default InquiryDetail;
