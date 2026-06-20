'use client';
import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { toast } from 'sonner';

interface QuoteModalProps {
  isOpen: boolean;
  onClose: () => void;
  productName?: string;
  productImage?: string;
}

export default function QuoteModal({ isOpen, onClose, productName, productImage }: QuoteModalProps) {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [notes, setNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setNotes(productName ? `Tôi muốn nhận báo giá cho sản phẩm: ${productName}` : '');
    }
  }, [isOpen, productName]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;
    setIsSubmitting(true);

    try {
      const payload = {
        customerName: name,
        phone,
        email,
        notes,
        source: 'Quote Form',
        status: 'NEW'
      };

      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:3001/api/v1';
      const res = await fetch(`${apiUrl}/leads`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (res.ok) {
        toast.success("Gửi yêu cầu báo giá thành công. Chúng tôi sẽ liên hệ sớm nhất!");
        onClose();
        setName('');
        setPhone('');
        setEmail('');
        setNotes('');
      } else {
        toast.error("Có lỗi xảy ra, vui lòng thử lại sau.");
      }
    } catch (err) {
      console.error(err);
      toast.error("Không thể kết nối máy chủ.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return createPortal(
    <div className="fixed inset-0 z-[9999] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white dark:bg-[#131313] w-full max-w-2xl rounded-[4px] shadow-2xl overflow-hidden animate-fadeInUp flex flex-col md:flex-row border border-[#E5C98A]/30">
        
        {/* Left/Top Side: Product Info */}
        <div className="bg-[#FAF8F2] dark:bg-[#0a0a0a] border-b md:border-b-0 md:border-r border-[#ECE7DE] dark:border-white/5 p-6 md:w-[40%] flex flex-col items-center justify-center text-center relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#C7A25C] to-transparent opacity-50"></div>
          
          <h2 className="font-heading text-xl font-bold text-[#C7A25C] mb-6 tracking-wide uppercase">Yêu cầu báo giá</h2>
          
          {productImage && (
            <div className="w-32 h-32 rounded-full overflow-hidden border-2 border-[#C7A25C]/30 p-1 mb-4 shadow-lg luxury-glow">
              <div className="w-full h-full rounded-full overflow-hidden bg-gray-100 dark:bg-white/5">
                <img src={productImage} alt={productName} className="w-full h-full object-cover" />
              </div>
            </div>
          )}
          
          <div className="space-y-2">
            <p className="text-xs text-gray-500 dark:text-[#888] uppercase tracking-widest font-bold">Sản phẩm quan tâm</p>
            <h3 className="font-heading text-lg font-bold text-gray-900 dark:text-white leading-snug">
              {productName || "Sản phẩm nội thất"}
            </h3>
          </div>
        </div>

        {/* Right/Bottom Side: Form */}
        <div className="p-6 md:p-8 md:w-[60%] relative">
          <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-red-500 transition-colors bg-gray-100 dark:bg-white/5 rounded-full p-2 hover:bg-gray-200 dark:hover:bg-white/10">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
          </button>
          
          <form onSubmit={handleSubmit} className="space-y-5 mt-2">
            <div>
              <label className="block text-[13px] font-medium text-gray-700 dark:text-white/70 mb-1.5">Họ và tên *</label>
              <input type="text" required value={name} onChange={e => setName(e.target.value)} className="w-full bg-transparent border border-gray-300 dark:border-white/20 text-gray-900 dark:text-white p-3 rounded-[2px] focus:border-[#C7A25C] outline-none transition-colors" placeholder="Nhập họ tên của bạn" />
            </div>
            <div>
              <label className="block text-[13px] font-medium text-gray-700 dark:text-white/70 mb-1.5">Số điện thoại *</label>
              <input type="tel" required value={phone} onChange={e => setPhone(e.target.value)} className="w-full bg-transparent border border-gray-300 dark:border-white/20 text-gray-900 dark:text-white p-3 rounded-[2px] focus:border-[#C7A25C] outline-none transition-colors" placeholder="Nhập số điện thoại" />
            </div>
            <div>
              <label className="block text-[13px] font-medium text-gray-700 dark:text-white/70 mb-1.5">Email (Tùy chọn)</label>
              <input type="email" value={email} onChange={e => setEmail(e.target.value)} className="w-full bg-transparent border border-gray-300 dark:border-white/20 text-gray-900 dark:text-white p-3 rounded-[2px] focus:border-[#C7A25C] outline-none transition-colors" placeholder="Nhập email của bạn" />
            </div>
            <div>
              <label className="block text-[13px] font-medium text-gray-700 dark:text-white/70 mb-1.5">Ghi chú thêm</label>
              <textarea rows={2} value={notes} onChange={e => setNotes(e.target.value)} className="w-full bg-transparent border border-gray-300 dark:border-white/20 text-gray-900 dark:text-white p-3 rounded-[2px] focus:border-[#C7A25C] outline-none transition-colors text-sm" placeholder="Bạn có yêu cầu đặc biệt nào không?"></textarea>
            </div>
            <div className="pt-2 mt-4">
              <button type="submit" disabled={isSubmitting} className="w-full bg-[#C7A25C] hover:bg-[#b08e4f] disabled:bg-[#C7A25C]/50 text-white font-bold py-4 px-6 rounded-[2px] transition-colors uppercase tracking-widest text-[13px] flex justify-center items-center gap-2 shadow-lg shadow-[#C7A25C]/20">
                {isSubmitting ? 'Đang gửi...' : 'Gửi yêu cầu'}
                {!isSubmitting && <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path></svg>}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>,
    document.body
  );
}
