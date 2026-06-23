'use client';
import SectionStarryMotif from '../_components/SectionStarryMotif';
import React, { useState } from 'react';
import Link from 'next/link';
import { toast } from 'sonner';

export default function PartnerRegistrationPage() {
  const [formData, setFormData] = useState({
    companyName: '',
    contactName: '',
    phone: '',
    email: '',
    location: '',
    experience: '',
    portfolioUrl: '',
    notes: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;
    setIsSubmitting(true);

    try {
      // Use existing lead API but mark source as Partner Registration
      const payload = {
        customerName: formData.contactName + ' (' + formData.companyName + ')',
        phone: formData.phone,
        email: formData.email,
        location: formData.location,
        notes: `ĐĂNG KÝ ĐỐI TÁC:\nKinh nghiệm: ${formData.experience}\nPortfolio: ${formData.portfolioUrl}\nGhi chú: ${formData.notes}`,
        status: 'NEW',
        source: 'Đăng ký đối tác'
      };

      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:3001/api/v1'}/leads`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (res.ok) {
        toast.success("Cảm ơn bạn! Thông tin đăng ký đối tác đã được gửi thành công. Chúng tôi sẽ liên hệ sớm nhất.");
        setFormData({
          companyName: '', contactName: '', phone: '', email: '', location: '', experience: '', portfolioUrl: '', notes: ''
        });
      } else {
        toast.error("Có lỗi xảy ra khi gửi yêu cầu. Vui lòng thử lại.");
      }
    } catch (err) {
      console.error(err);
      toast.error("Không thể kết nối đến máy chủ.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="overflow-hidden relative pt-[120px] pb-20 modern-section min-h-screen text-[#1F1F1F] dark:text-white">
      <SectionStarryMotif position="random-corner" />
      <div className="container mx-auto px-6 max-w-[1400px]">
        
        {/* Header Section */}
        <div className="text-center mb-16 max-w-4xl mx-auto">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-[2px] bg-gradient-to-r from-[#C7A25C]/20 to-transparent border-l-2 border-[#C7A25C] text-[#A67C00] dark:text-[#FFD700] text-[11px] font-bold uppercase tracking-widest mb-4 luxury-glow">
            Hợp tác cùng phát triển
          </div>
          <h1 className="font-heading text-4xl md:text-5xl lg:text-6xl font-bold mb-6 uppercase tracking-tight">
            Trở thành đối tác<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#C7A25C] via-[#f1be6d] to-[#C7A25C]">Hệ sinh thái nội thất</span>
          </h1>
          <p className="text-[#1F1F1F]/70 dark:text-white/70 text-lg leading-relaxed">
            Kết nối với hàng ngàn khách hàng tiềm năng, nâng cao uy tín thương hiệu và gia tăng doanh thu thông qua hệ sinh thái minh bạch và chuyên nghiệp của chúng tôi.
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-12 items-start">
          
          {/* Left Column - Benefits */}
          <div className="w-full lg:w-5/12">
            <h2 className="font-heading text-3xl font-bold mb-8 flex items-center gap-3">
              Quyền lợi đối tác
            </h2>
            
            <div className="space-y-6">
              <div className="card p-6 rounded-[4px] border border-[#ECE7DE] dark:border-white/5 dark:bg-[#1c1c1c] shadow-sm flex gap-4 transition-all hover:border-[#C7A25C]/50 hover:-translate-y-1">
                <div className="w-12 h-12 bg-[#C7A25C]/10 rounded-full flex items-center justify-center shrink-0">
                  <svg className="w-6 h-6 text-[#C7A25C]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path></svg>
                </div>
                <div>
                  <h3 className="font-bold text-lg mb-2">Tiếp cận khách hàng chất lượng</h3>
                  <p className="text-sm text-[#1F1F1F]/70 dark:text-white/60">Nguồn khách hàng được sàng lọc kỹ lưỡng, có nhu cầu thực tế và ngân sách rõ ràng.</p>
                </div>
              </div>

              <div className="card p-6 rounded-[4px] border border-[#ECE7DE] dark:border-white/5 dark:bg-[#1c1c1c] shadow-sm flex gap-4 transition-all hover:border-[#C7A25C]/50 hover:-translate-y-1">
                <div className="w-12 h-12 bg-[#C7A25C]/10 rounded-full flex items-center justify-center shrink-0">
                  <svg className="w-6 h-6 text-[#C7A25C]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path></svg>
                </div>
                <div>
                  <h3 className="font-bold text-lg mb-2">Khẳng định uy tín thương hiệu</h3>
                  <p className="text-sm text-[#1F1F1F]/70 dark:text-white/60">Gia tăng niềm tin với khách hàng thông qua bộ tiêu chuẩn đánh giá đối tác độc lập của hệ sinh thái.</p>
                </div>
              </div>

              <div className="card p-6 rounded-[4px] border border-[#ECE7DE] dark:border-white/5 dark:bg-[#1c1c1c] shadow-sm flex gap-4 transition-all hover:border-[#C7A25C]/50 hover:-translate-y-1">
                <div className="w-12 h-12 bg-[#C7A25C]/10 rounded-full flex items-center justify-center shrink-0">
                  <svg className="w-6 h-6 text-[#C7A25C]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg>
                </div>
                <div>
                  <h3 className="font-bold text-lg mb-2">Quy trình làm việc chuẩn hóa</h3>
                  <p className="text-sm text-[#1F1F1F]/70 dark:text-white/60">Được hỗ trợ quy trình tư vấn, hợp đồng và nghiệm thu chuyên nghiệp, giảm thiểu rủi ro tranh chấp.</p>
                </div>
              </div>
            </div>
            
            <div className="mt-8 p-6 bg-gradient-to-br from-[#C7A25C]/10 to-transparent border border-[#C7A25C]/30 rounded-[4px]">
              <h3 className="font-bold text-[#C7A25C] mb-2 uppercase tracking-wider text-sm">Tiêu chí tham gia:</h3>
              <ul className="list-disc pl-5 space-y-2 text-sm text-[#1F1F1F]/80 dark:text-white/70">
                <li>Pháp nhân công ty rõ ràng, minh bạch</li>
                <li>Có kinh nghiệm thực tiễn tối thiểu 3 năm</li>
                <li>Có năng lực thiết kế / thi công chứng minh qua dự án thực tế</li>
                <li>Cam kết chất lượng và tiến độ với khách hàng</li>
              </ul>
            </div>
          </div>

          {/* Right Column - Form */}
          <div className="w-full lg:w-7/12">
            <div className="modern-section shadow-sm dark:shadow-none p-8 lg:p-10 rounded-[4px] border border-[#ECE7DE] dark:border-white/10 dark:bg-[#1c1c1c]">
              <h2 className="font-heading text-2xl font-bold mb-6">Đăng ký biểu mẫu đối tác</h2>
              
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm text-[#1F1F1F]/80 dark:text-white/70 mb-2 font-medium">Tên Đơn vị / Công ty *</label>
                    <input type="text" value={formData.companyName} onChange={e => setFormData({...formData, companyName: e.target.value})} className="w-full modern-section border border-[#ECE7DE] dark:border-white/20 text-gray-900 dark:text-white p-3 rounded-[4px] focus:border-[#C7A25C] outline-none transition-colors dark:bg-black/20" placeholder="VD: Công ty TNHH Kiến trúc..." required />
                  </div>
                  <div>
                    <label className="block text-sm text-[#1F1F1F]/80 dark:text-white/70 mb-2 font-medium">Người liên hệ *</label>
                    <input type="text" value={formData.contactName} onChange={e => setFormData({...formData, contactName: e.target.value})} className="w-full modern-section border border-[#ECE7DE] dark:border-white/20 text-gray-900 dark:text-white p-3 rounded-[4px] focus:border-[#C7A25C] outline-none transition-colors dark:bg-black/20" placeholder="Họ và tên" required />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm text-[#1F1F1F]/80 dark:text-white/70 mb-2 font-medium">Số điện thoại *</label>
                    <input type="tel" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} className="w-full modern-section border border-[#ECE7DE] dark:border-white/20 text-gray-900 dark:text-white p-3 rounded-[4px] focus:border-[#C7A25C] outline-none transition-colors dark:bg-black/20" placeholder="Số điện thoại liên hệ" required />
                  </div>
                  <div>
                    <label className="block text-sm text-[#1F1F1F]/80 dark:text-white/70 mb-2 font-medium">Email *</label>
                    <input type="email" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} className="w-full modern-section border border-[#ECE7DE] dark:border-white/20 text-gray-900 dark:text-white p-3 rounded-[4px] focus:border-[#C7A25C] outline-none transition-colors dark:bg-black/20" placeholder="Email liên hệ" required />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm text-[#1F1F1F]/80 dark:text-white/70 mb-2 font-medium">Khu vực hoạt động *</label>
                    <input type="text" value={formData.location} onChange={e => setFormData({...formData, location: e.target.value})} className="w-full modern-section border border-[#ECE7DE] dark:border-white/20 text-gray-900 dark:text-white p-3 rounded-[4px] focus:border-[#C7A25C] outline-none transition-colors dark:bg-black/20" placeholder="VD: Hà Nội, TP.HCM..." required />
                  </div>
                  <div>
                    <label className="block text-sm text-[#1F1F1F]/80 dark:text-white/70 mb-2 font-medium">Số năm kinh nghiệm *</label>
                    <input type="text" value={formData.experience} onChange={e => setFormData({...formData, experience: e.target.value})} className="w-full modern-section border border-[#ECE7DE] dark:border-white/20 text-gray-900 dark:text-white p-3 rounded-[4px] focus:border-[#C7A25C] outline-none transition-colors dark:bg-black/20" placeholder="VD: 5 năm" required />
                  </div>
                </div>

                <div>
                  <label className="block text-sm text-[#1F1F1F]/80 dark:text-white/70 mb-2 font-medium">Link Hồ sơ năng lực (Portfolio / Fanpage / Website) *</label>
                  <input type="url" value={formData.portfolioUrl} onChange={e => setFormData({...formData, portfolioUrl: e.target.value})} className="w-full modern-section border border-[#ECE7DE] dark:border-white/20 text-gray-900 dark:text-white p-3 rounded-[4px] focus:border-[#C7A25C] outline-none transition-colors dark:bg-black/20" placeholder="https://..." required />
                </div>

                <div>
                  <label className="block text-sm text-[#1F1F1F]/80 dark:text-white/70 mb-2 font-medium">Lời nhắn bổ sung</label>
                  <textarea rows={4} value={formData.notes} onChange={e => setFormData({...formData, notes: e.target.value})} className="w-full modern-section border border-[#ECE7DE] dark:border-white/20 text-gray-900 dark:text-white p-3 rounded-[4px] focus:border-[#C7A25C] outline-none transition-colors dark:bg-black/20 resize-none" placeholder="Chia sẻ thêm về thế mạnh của đơn vị..."></textarea>
                </div>

                <div className="pt-4">
                  <button type="submit" disabled={isSubmitting} className="w-full bg-[#1F1F1F] hover:modern-section dark:hover:bg-white dark:hover:text-[#1F1F1F] text-white dark:bg-[#C7A25C] dark:hover:bg-[#b08e4f] font-bold py-4 px-8 rounded-[2px] transition-colors uppercase tracking-wider text-sm flex items-center justify-center gap-2">
                    {isSubmitting ? (
                      <><svg className="animate-spin h-5 w-5 text-current" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg> Đang gửi...</>
                    ) : 'Gửi yêu cầu hợp tác'}
                  </button>
                  <p className="text-[#1F1F1F]/50 dark:text-white/50 text-xs text-center mt-4">Bằng việc gửi thông tin, bạn đồng ý với các chính sách và quy định của hệ sinh thái.</p>
                </div>
              </form>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
