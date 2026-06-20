'use client';
import React, { useEffect, useState, use } from 'react';
import { createPortal } from 'react-dom';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function SoSanhPage({ searchParams }: { searchParams: Promise<{ ids?: string }> }) {
  const resolvedParams = use(searchParams);
  const ids = resolvedParams.ids ? resolvedParams.ids.split(',') : [];
  const router = useRouter();
  
  const [allUnits, setAllUnits] = useState<any[]>([]);
  const [selectedUnits, setSelectedUnits] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  // Auto-open modal if exactly 1 unit is selected (e.g., coming directly from the list)
  useEffect(() => {
    if (ids.length === 1) {
      setShowModal(true);
    }
  }, [ids.length]);

  useEffect(() => {
    const fetchUnits = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:3001/api/v1'}/units`);
        const data = await res.json();
        if (Array.isArray(data)) {
          const mapped = data.map((u: any, idx: number) => ({
            id: u.id.toString(),
            name: u.name,
            category: u.segment || 'Cơ bản',
            strengths: u.projectType || 'Đa dạng',
            style: u.style || 'Hiện đại',
            location: u.location || 'Toàn quốc',
            experienceNum: u.experience ? parseInt(u.experience) : 5,
            experience: u.experience ? u.experience + ' năm' : '5 năm',
            description: u.shortDescription || u.description || 'Đơn vị thiết kế thi công chuyên nghiệp.',
            avatar: u.avatar || `/images/common/bg-hero-${(idx % 2) + 1}.jpg`,
            services: u.services || ['Thiết kế nội thất', 'Thi công nội thất'],
            fanpage: u.fanpage || null,
            profile: u.profile || null
          }));
          setAllUnits(mapped);
          
          if (ids.length > 0) {
            setSelectedUnits(mapped.filter((u: any) => ids.includes(u.id)));
          }
        }
      } catch (error) {
        console.error('Failed to fetch units:', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchUnits();
  }, [resolvedParams.ids]);

  const addUnitToCompare = (id: string) => {
    const newIds = [...ids, id].slice(0, 2); // Max 2 units for premium UI
    router.push(`/don-vi-thiet-ke/so-sanh?ids=${newIds.join(',')}`);
    setShowModal(false);
  };

  const removeUnit = (idToRemove: string) => {
    const newIds = ids.filter(id => id !== idToRemove);
    if (newIds.length === 0) {
      router.push('/don-vi-thiet-ke');
    } else {
      router.push(`/don-vi-thiet-ke/so-sanh?ids=${newIds.join(',')}`);
    }
  };

  // Lọc danh sách trong Modal
  const availableUnits = allUnits.filter(u => !ids.includes(u.id) && u.name.toLowerCase().includes(searchTerm.toLowerCase()));

  if (isLoading) {
    return <div className="pt-[120px] pb-20 modern-section min-h-screen text-[#1F1F1F] dark:text-white flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <svg className="animate-spin h-10 w-10 text-[#C7A25C]" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
        <p className="font-heading text-lg">Đang phân tích dữ liệu...</p>
      </div>
    </div>;
  }

  const unitA = selectedUnits[0];
  const unitB = selectedUnits[1];

  return (
    <div className="pt-[120px] pb-20 modern-section min-h-screen text-[#1F1F1F] dark:text-white">
      <div className="container mx-auto px-4 lg:px-8 max-w-[1400px]">
        {/* Header */}
        <div className="flex flex-wrap items-center justify-between mb-10 gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-[2px] bg-gradient-to-r from-[#C7A25C]/20 to-transparent border-l-2 border-[#C7A25C] text-[#A67C00] dark:text-[#FFD700] text-[11px] font-bold uppercase tracking-widest mb-4 luxury-glow">
              So sánh năng lực
            </div>
            <h1 className="font-heading text-3xl md:text-5xl font-bold uppercase tracking-tight mb-2">Đối đầu 1-1</h1>
          </div>
          <button onClick={() => router.push('/don-vi-thiet-ke')} className="border border-[#ECE7DE] dark:border-white/20 px-6 py-3 rounded-[2px] font-bold uppercase tracking-wider text-xs hover:bg-gray-50 dark:hover:bg-white/5 transition-colors flex items-center gap-2">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path></svg>
            Trở về danh sách
          </button>
        </div>

        {/* Split Screen Container */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-12 relative">
          
          {/* V.S Badge Center */}
          {unitA && unitB && (
            <div className="hidden lg:flex absolute top-[15%] left-1/2 -translate-x-1/2 -translate-y-1/2 w-16 h-16 bg-[#1F1F1F] dark:bg-white text-[#C7A25C] dark:text-[#1F1F1F] rounded-full items-center justify-center font-heading text-2xl font-bold z-10 border-4 border-[#ECE7DE] dark:border-[#131313] shadow-[0_0_30px_rgba(199,162,92,0.3)]">
              VS
            </div>
          )}

          {/* Cột 1: Unit A */}
          {unitA ? (
            <div className="card dark:bg-[#1c1c1c] rounded-[4px] border border-[#ECE7DE] dark:border-white/10 shadow-sm p-6 relative overflow-hidden">
              <button onClick={() => removeUnit(unitA.id)} className="absolute top-4 right-4 w-8 h-8 bg-black/50 text-white rounded-full flex items-center justify-center hover:bg-red-500 transition-colors z-20">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
              </button>
              
              <div className="h-64 w-full mb-6 relative rounded-[2px] overflow-hidden group">
                <div className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105" style={{ backgroundImage: `url(${unitA.avatar})` }}></div>
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent"></div>
                <div className="absolute bottom-4 left-4 right-4">
                  <div className="text-[#C7A25C] text-xs font-bold uppercase tracking-widest mb-1">{unitA.category}</div>
                  <h2 className="font-heading text-3xl font-bold text-white">{unitA.name}</h2>
                </div>
              </div>

              <div className="space-y-8">
                {/* Kinh nghiệm Progress */}
                <div>
                  <div className="flex justify-between text-sm mb-2 font-bold uppercase tracking-wider text-gray-500 dark:text-white/60">
                    <span>Kinh nghiệm</span>
                    <span className="text-[#1F1F1F] dark:text-white">{unitA.experience}</span>
                  </div>
                  <div className="h-2 w-full bg-gray-200 dark:bg-white/10 rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-[#C7A25C] to-[#E5C98A] rounded-full" style={{ width: `${Math.min((unitA.experienceNum / 20) * 100, 100)}%` }}></div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 bg-gray-50 dark:bg-white/5 rounded-[2px] border border-[#ECE7DE] dark:border-white/5">
                    <p className="text-xs text-gray-400 uppercase tracking-wider mb-1">Phong cách</p>
                    <p className="font-bold">{unitA.style}</p>
                  </div>
                  <div className="p-4 bg-gray-50 dark:bg-white/5 rounded-[2px] border border-[#ECE7DE] dark:border-white/5">
                    <p className="text-xs text-gray-400 uppercase tracking-wider mb-1">Thế mạnh</p>
                    <p className="font-bold">{unitA.strengths}</p>
                  </div>
                  <div className="col-span-2 p-4 bg-gray-50 dark:bg-white/5 rounded-[2px] border border-[#ECE7DE] dark:border-white/5">
                    <p className="text-xs text-gray-400 uppercase tracking-wider mb-1">Khu vực hoạt động</p>
                    <div className="flex items-center gap-2 font-bold">
                      <svg className="w-4 h-4 text-[#C7A25C]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
                      {unitA.location}
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="font-bold text-lg mb-4 border-b border-[#ECE7DE] dark:border-white/10 pb-2">Dịch vụ cung cấp</h3>
                  <ul className="space-y-3">
                    {unitA.services.map((s: string, i: number) => (
                      <li key={i} className="flex items-center gap-3">
                        <div className="w-5 h-5 rounded-full bg-[#C7A25C]/20 text-[#C7A25C] flex items-center justify-center shrink-0">
                          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"></path></svg>
                        </div>
                        <span className="text-sm">{s}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="pt-6 mt-6 border-t border-[#ECE7DE] dark:border-white/10 flex gap-4">
                  <Link href={`/don-vi-thiet-ke/${unitA.id}`} className="flex-1 text-center border border-[#1F1F1F] dark:border-white text-[#1F1F1F] dark:text-white font-bold py-4 px-4 rounded-[2px] transition-colors uppercase tracking-wider text-sm hover:bg-gray-50 dark:hover:bg-white/5">
                    Hồ sơ
                  </Link>
                  <Link href={`/tu-van?unit=${unitA.id}`} className="flex-[2] text-center bg-[#C7A25C] text-white font-bold py-4 px-4 rounded-[2px] transition-colors uppercase tracking-wider text-sm hover:bg-[#b08e4f] shadow-[0_0_20px_rgba(199,162,92,0.3)]">
                    Nhận tư vấn
                  </Link>
                </div>
              </div>
            </div>
          ) : null}

          {/* Cột 2: Unit B hoặc Empty Slot */}
          {unitB ? (
            <div className="card dark:bg-[#1c1c1c] rounded-[4px] border border-[#ECE7DE] dark:border-white/10 shadow-sm p-6 relative overflow-hidden">
              <button onClick={() => removeUnit(unitB.id)} className="absolute top-4 right-4 w-8 h-8 bg-black/50 text-white rounded-full flex items-center justify-center hover:bg-red-500 transition-colors z-20">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
              </button>
              
              <div className="h-64 w-full mb-6 relative rounded-[2px] overflow-hidden group">
                <div className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105" style={{ backgroundImage: `url(${unitB.avatar})` }}></div>
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent"></div>
                <div className="absolute bottom-4 left-4 right-4">
                  <div className="text-[#C7A25C] text-xs font-bold uppercase tracking-widest mb-1">{unitB.category}</div>
                  <h2 className="font-heading text-3xl font-bold text-white">{unitB.name}</h2>
                </div>
              </div>

              <div className="space-y-8">
                {/* Kinh nghiệm Progress */}
                <div>
                  <div className="flex justify-between text-sm mb-2 font-bold uppercase tracking-wider text-gray-500 dark:text-white/60">
                    <span>Kinh nghiệm</span>
                    <span className="text-[#1F1F1F] dark:text-white">{unitB.experience}</span>
                  </div>
                  <div className="h-2 w-full bg-gray-200 dark:bg-white/10 rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-[#C7A25C] to-[#E5C98A] rounded-full" style={{ width: `${Math.min((unitB.experienceNum / 20) * 100, 100)}%` }}></div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 bg-gray-50 dark:bg-white/5 rounded-[2px] border border-[#ECE7DE] dark:border-white/5">
                    <p className="text-xs text-gray-400 uppercase tracking-wider mb-1">Phong cách</p>
                    <p className="font-bold">{unitB.style}</p>
                  </div>
                  <div className="p-4 bg-gray-50 dark:bg-white/5 rounded-[2px] border border-[#ECE7DE] dark:border-white/5">
                    <p className="text-xs text-gray-400 uppercase tracking-wider mb-1">Thế mạnh</p>
                    <p className="font-bold">{unitB.strengths}</p>
                  </div>
                  <div className="col-span-2 p-4 bg-gray-50 dark:bg-white/5 rounded-[2px] border border-[#ECE7DE] dark:border-white/5">
                    <p className="text-xs text-gray-400 uppercase tracking-wider mb-1">Khu vực hoạt động</p>
                    <div className="flex items-center gap-2 font-bold">
                      <svg className="w-4 h-4 text-[#C7A25C]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
                      {unitB.location}
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="font-bold text-lg mb-4 border-b border-[#ECE7DE] dark:border-white/10 pb-2">Dịch vụ cung cấp</h3>
                  <ul className="space-y-3">
                    {unitB.services.map((s: string, i: number) => (
                      <li key={i} className="flex items-center gap-3">
                        <div className="w-5 h-5 rounded-full bg-[#C7A25C]/20 text-[#C7A25C] flex items-center justify-center shrink-0">
                          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"></path></svg>
                        </div>
                        <span className="text-sm">{s}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="pt-6 mt-6 border-t border-[#ECE7DE] dark:border-white/10 flex gap-4">
                  <Link href={`/don-vi-thiet-ke/${unitB.id}`} className="flex-1 text-center border border-[#1F1F1F] dark:border-white text-[#1F1F1F] dark:text-white font-bold py-4 px-4 rounded-[2px] transition-colors uppercase tracking-wider text-sm hover:bg-gray-50 dark:hover:bg-white/5">
                    Hồ sơ
                  </Link>
                  <Link href={`/tu-van?unit=${unitB.id}`} className="flex-[2] text-center bg-[#C7A25C] text-white font-bold py-4 px-4 rounded-[2px] transition-colors uppercase tracking-wider text-sm hover:bg-[#b08e4f] shadow-[0_0_20px_rgba(199,162,92,0.3)]">
                    Nhận tư vấn
                  </Link>
                </div>
              </div>
            </div>
          ) : (
            <div 
              onClick={() => setShowModal(true)}
              className="card dark:bg-[#1c1c1c] rounded-[4px] border-2 border-dashed border-[#ECE7DE] dark:border-white/20 p-12 flex flex-col items-center justify-center text-center cursor-pointer hover:border-[#C7A25C] hover:bg-[#C7A25C]/5 transition-all group min-h-[600px]"
            >
              <div className="w-24 h-24 rounded-full bg-[#ECE7DE] dark:bg-white/10 flex items-center justify-center text-[#1F1F1F]/40 dark:text-white/40 group-hover:bg-[#C7A25C] group-hover:text-white group-hover:shadow-[0_0_30px_rgba(199,162,92,0.4)] transition-all mb-6">
                <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"></path></svg>
              </div>
              <h3 className="font-heading text-2xl font-bold mb-3">Thêm đối tác so sánh</h3>
              <p className="text-gray-500 dark:text-white/60">Chọn thêm một đơn vị thiết kế khác để đặt lên bàn cân so sánh chi tiết năng lực và dịch vụ.</p>
            </div>
          )}
          
        </div>
      </div>

      {/* Modal Chọn Đơn vị */}
      {showModal && typeof document !== 'undefined' ? createPortal(
        <div className="fixed inset-0 z-[9999] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-[#131313] w-full max-w-4xl rounded-[4px] shadow-2xl overflow-hidden animate-fadeInUp flex flex-col max-h-[90vh]">
            <div className="p-6 border-b border-[#ECE7DE] dark:border-white/10 flex justify-between items-center bg-gray-50 dark:bg-white/5">
              <h2 className="font-heading text-2xl font-bold">Chọn đối tác so sánh</h2>
              <button onClick={() => setShowModal(false)} className="text-gray-500 hover:text-red-500 transition-colors">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
              </button>
            </div>
            
            <div className="p-6 border-b border-[#ECE7DE] dark:border-white/10">
              <div className="relative">
                <svg className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
                <input 
                  type="text" 
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Tìm kiếm tên đơn vị thiết kế..." 
                  className="w-full bg-gray-100 dark:bg-white/5 border border-transparent dark:border-white/10 py-4 pl-12 pr-4 rounded-[2px] outline-none focus:border-[#C7A25C] transition-colors"
                />
              </div>
            </div>

            <div className="p-6 overflow-y-auto flex-1 custom-scrollbar">
              {availableUnits.length === 0 ? (
                <div className="text-center text-gray-500 py-10">Không tìm thấy đơn vị nào phù hợp.</div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {availableUnits.map(unit => (
                    <div 
                      key={unit.id} 
                      onClick={() => addUnitToCompare(unit.id)}
                      className="flex items-center gap-4 p-4 border border-[#ECE7DE] dark:border-white/10 rounded-[2px] hover:border-[#C7A25C] cursor-pointer group transition-colors"
                    >
                      <div className="w-16 h-16 rounded-[2px] bg-cover bg-center shrink-0" style={{ backgroundImage: `url(${unit.avatar})` }}></div>
                      <div>
                        <div className="text-[10px] text-[#C7A25C] font-bold uppercase tracking-wider mb-1">{unit.category}</div>
                        <h4 className="font-bold group-hover:text-[#C7A25C] transition-colors">{unit.name}</h4>
                        <p className="text-xs text-gray-500 line-clamp-1">{unit.style} • {unit.experience}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>,
        document.body
      ) : null}

    </div>
  );
}
