'use client';
import React, { useState, useRef, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import SectionStarryMotif from '../_components/SectionStarryMotif';

function CustomSelect({ label, options, value, onChange }: { label: string, options: { value: string, label: string }[], value: string, onChange: (val: string) => void }) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        setSearchTerm('');
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const selectedLabel = options.find(o => o.value === value)?.label || options[0].label;

  const filteredOptions = options.filter(opt => 
    opt.label.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className={`flex-1 min-w-[200px] relative ${isOpen ? 'z-50' : 'z-10'}`} ref={dropdownRef}>
      <label className="block text-sm text-gray-400 dark:text-white/50 mb-2 font-medium">{label}</label>
      <div className="relative">
        <div
          className={`bg-white dark:bg-[#1c1c1c] border ${isOpen ? 'border-[#C7A25C]' : 'border-[#ECE7DE] dark:border-white/20'} text-[#1F1F1F] dark:text-white p-3 rounded-[2px] cursor-pointer flex justify-between items-center transition-colors hover:border-[#C7A25C]/50`}
          onClick={() => { setIsOpen(!isOpen); setSearchTerm(''); }}
        >
          <span className="text-sm truncate">{selectedLabel}</span>
          <svg className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180 text-[#C7A25C]' : 'text-[#1F1F1F]/50 dark:text-white/50'} flex-shrink-0`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
        </div>

        {isOpen && (
          <div className="absolute z-50 w-full mt-2 bg-white dark:bg-[#1c1c1c] shadow-lg dark:shadow-none border border-gray-200 dark:border-white/10 rounded-[2px] py-2 max-h-[300px] overflow-y-auto animate-fadeInDown">
            <div className="px-3 pb-2 sticky top-0 bg-white dark:bg-[#1c1c1c] z-10 border-b border-gray-100 dark:border-white/5">
              <input 
                type="text" 
                className="w-full bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-[2px] px-3 py-2 text-sm text-[#1F1F1F] dark:text-white focus:outline-none focus:border-[#C7A25C]"
                placeholder="Tìm kiếm..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onClick={(e) => e.stopPropagation()}
                autoFocus
              />
            </div>
            {filteredOptions.length > 0 ? filteredOptions.map((opt) => (
              <div
                key={opt.value}
                className={`px-4 py-2 text-sm cursor-pointer transition-colors ${value === opt.value ? 'bg-[#C7A25C]/10 text-[#C7A25C] font-medium' : 'text-[#1F1F1F] dark:text-white/80 hover:bg-gray-50 dark:hover:bg-white/5 hover:text-[#C7A25C] dark:hover:text-[#C7A25C]'}`}
                onClick={() => {
                  onChange(opt.value);
                  setIsOpen(false);
                  setSearchTerm('');
                }}
              >
                {opt.label}
              </div>
            )) : (
              <div className="px-4 py-3 text-sm text-gray-400 text-center">Không tìm thấy kết quả</div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default function DonViThietKePage() {
  const [segment, setSegment] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [style, setStyle] = useState('');
  const [projectType, setProjectType] = useState('');
  
  const [allUnits, setAllUnits] = useState<any[]>([]);
  const [filteredUnits, setFilteredUnits] = useState<any[]>([]);

  const getCategoryDisplayName = (segment: string) => {
    if (!segment) return 'Cơ bản';
    if (segment.includes('cao-cap') || segment.includes('Cao cấp')) return 'Cao cấp';
    if (segment.includes('trung-cap') || segment.includes('Trung cấp')) return 'Trung cấp';
    if (segment.includes('co-ban') || segment.includes('Cơ bản')) return 'Cơ bản';
    return segment;
  };

  const getCategoryStyles = (category: string) => {
    const lower = category?.toLowerCase() || '';
    if (lower.includes('cao cấp') || lower.includes('cao-cap')) {
      return 'bg-gradient-to-r from-[#D3AE3E] to-[#E5C98A] text-[#131313] shadow-[0_0_15px_rgba(211,174,62,0.4)] luxury-glow';
    }
    if (lower.includes('trung cấp') || lower.includes('trung-cap')) {
      return 'bg-gradient-to-r from-[#e2e2e2] to-[#b4b5b5] text-[#131313] shadow-[0_0_15px_rgba(226,226,226,0.4)]';
    }
    return 'bg-gradient-to-r from-[#cd7f32] to-[#b87333] text-white shadow-[0_0_15px_rgba(205,127,50,0.4)]';
  };

  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchUnits = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:3001/api/v1'}/units`);
        const data = await res.json();
        
        const getAvatarUrl = (avatar: any) => {
          if (Array.isArray(avatar) && avatar.length > 0) {
            return typeof avatar[0] === 'string' ? avatar[0] : avatar[0].url;
          }
          if (typeof avatar === 'string') {
            try {
              const parsed = JSON.parse(avatar);
              if (Array.isArray(parsed) && parsed.length > 0) {
                return typeof parsed[0] === 'string' ? parsed[0] : parsed[0].url;
              }
            } catch(e) { return avatar; }
          }
          return avatar?.url || avatar || null;
        };

          if (Array.isArray(data)) {
            // Map API data to the fields required by the UI
            const mappedUnits = data
              .filter((u: any) => u.projectType && u.projectType.toLowerCase().includes('thi công'))
              .map((u: any, idx: number) => ({
              id: u.id,
              name: u.name,
              category: getCategoryDisplayName(u.segment),
              strengths: u.style || 'Đa dạng',
              style: u.style || 'Hiện đại',
              location: u.location || 'Toàn quốc',
              description: u.shortDescription || u.description || 'Đơn vị thiết kế thi công nội thất chuyên nghiệp.',
              avatarUrl: getAvatarUrl(u.avatar),
              fanpage: u.fanpage || null,
              services: u.services || [],
              categories: u.categories || []
            }));
            setAllUnits(mappedUnits);
            setFilteredUnits(mappedUnits);
          }
        } catch (error) {
          console.error('Failed to fetch units:', error);
        } finally {
          setIsLoading(false);
        }
      };
      fetchUnits();
    }, []);
  
    const segmentOptions = useMemo(() => {
      const allowedSegments = ['Cao cấp', 'Trung cấp', 'Cơ bản'];
      const segments = Array.from(new Set(allUnits.map(u => u.category))).filter(s => allowedSegments.includes(s));
      return [{ value: '', label: 'Tất cả phân khúc' }, ...segments.map(s => ({ value: s, label: s }))];
    }, [allUnits]);
  
    const projectTypeOptions = useMemo(() => {
      const types = Array.from(new Set(allUnits.map(u => u.strengths))).filter(Boolean);
      return [{ value: '', label: 'Tất cả hạng mục' }, ...types.map(t => ({ value: t, label: t }))];
    }, [allUnits]);

    const [styleOptions, setStyleOptions] = useState<{value: string, label: string}[]>([{ value: '', label: 'Tất cả lĩnh vực' }]);

    useEffect(() => {
      const fetchCategories = async () => {
        try {
          const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:3001/api/v1'}/categories`);
          const data = await res.json();
          if (Array.isArray(data)) {
            const linhVuc = data.filter((c: any) => c.type === 'Lĩnh vực công trình');
            setStyleOptions([{ value: '', label: 'Tất cả lĩnh vực' }, ...linhVuc.map((c: any) => ({ value: c.name, label: c.name }))]);
          }
        } catch(e) {}
      };
      fetchCategories();
    }, []);
  
    useEffect(() => {
      let result = [...allUnits];
      if (segment) result = result.filter(u => u.category === segment);
      if (projectType) result = result.filter(u => u.strengths === projectType);
      if (style) result = result.filter(u => u.categories && u.categories.some((c: any) => c.name === style));
      if (searchQuery) {
        const lowerQ = searchQuery.toLowerCase();
        result = result.filter(u => 
          u.name.toLowerCase().includes(lowerQ) || 
          (u.description && u.description.toLowerCase().includes(lowerQ))
        );
      }
      setFilteredUnits(result);
    }, [segment, projectType, style, searchQuery, allUnits]);

  return (
    <div className="modern-section min-h-screen pt-[120px] pb-20 relative">
      <div className="container mx-auto px-6 max-w-[1400px]">
        {/* Header */}
        <SectionStarryMotif position="random-corner" />
        <div className="text-center mb-16 relative overflow-hidden p-10 rounded-[4px] bg-[#f9f9f9] dark:bg-[#1a1a1a] border border-[#ECE7DE] dark:border-white/10 shadow-sm">
          <div className="relative z-10">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-[2px] bg-gradient-to-r from-[#C7A25C]/20 to-transparent border-l-2 border-[#C7A25C] text-[#A67C00] dark:text-[#FFD700] text-[11px] font-bold uppercase tracking-widest mb-4 luxury-glow">
              Đơn vị thi công
            </div>
            <h1 className="font-heading text-4xl md:text-5xl font-bold text-[#1F1F1F] dark:text-white mb-6 uppercase">Hệ sinh thái đơn vị thi công</h1>
            <p className="text-gray-600 dark:text-white/70 max-w-3xl mx-auto text-lg">Các đơn vị được phân loại theo phân khúc, loại công trình, khu vực hoạt động, phong cách thiết kế và năng lực thi công. Khách hàng có thể tham khảo hồ sơ từng đơn vị hoặc gửi nhu cầu để được tư vấn đơn vị phù hợp nhất.</p>
          </div>
        </div>

        {/* Filters Scaffold */}
        <div id="phan-khuc" className="card dark:bg-[#1c1c1c] shadow-sm dark:shadow-none p-6 rounded-[4px] mb-12 border border-[#ECE7DE] dark:border-white/10 flex flex-wrap gap-4 items-end relative z-[60]">
          <div className="flex-1 min-w-[200px]">
            <label className="block text-sm text-gray-400 dark:text-white/50 mb-2 font-medium">Tìm kiếm</label>
            <div className="relative">
              <input 
                type="text" 
                placeholder="Tên đơn vị, mô tả..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-white dark:bg-[#1c1c1c] border border-[#ECE7DE] dark:border-white/20 text-[#1F1F1F] dark:text-white p-3 rounded-[2px] focus:outline-none focus:border-[#C7A25C] transition-colors text-sm h-[46px]"
              />
              <svg className="absolute right-3 top-3.5 w-4 h-4 text-gray-400 dark:text-white/50" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
            </div>
          </div>
          <CustomSelect
            label="Phân khúc"
            value={segment}
            onChange={setSegment}
            options={segmentOptions}
          />
          <CustomSelect
            label="Hạng mục"
            value={projectType}
            onChange={setProjectType}
            options={projectTypeOptions}
          />
          <CustomSelect
            label="Lĩnh vực hoạt động"
            value={style}
            onChange={setStyle}
            options={styleOptions}
          />
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {isLoading ? (
            <div className="col-span-3 text-center text-gray-400 dark:text-white/50 py-10">Đang tải danh sách đơn vị...</div>
          ) : filteredUnits.length === 0 ? (
            <div className="col-span-1 md:col-span-2 lg:col-span-3 card dark:bg-[#1c1c1c] shadow-sm dark:shadow-none border border-[#ECE7DE] dark:border-white/5 rounded-[4px] p-16 text-center flex flex-col items-center justify-center min-h-[400px]">
              <div className="w-24 h-24 bg-[#C7A25C]/10 text-[#C7A25C] rounded-full flex items-center justify-center text-4xl mb-6 shadow-[0_0_30px_rgba(206,158,81,0.15)]">
                <i className="fa fa-building"></i>
              </div>
              <h3 className="font-heading text-2xl font-bold text-[#1F1F1F] dark:text-white mb-4">Chưa có đối tác nào</h3>
              <p className="text-gray-500 dark:text-white/60 max-w-md mx-auto text-lg">Không tìm thấy đơn vị nào phù hợp với bộ lọc hiện tại của bạn.</p>
            </div>
          ) : filteredUnits.map((unit) => (
            <div key={unit.id} className="card dark:bg-[#1c1c1c] shadow-sm dark:shadow-none rounded-[4px] overflow-hidden group border border-[#ECE7DE] dark:border-white/5 hover:border-[#C7A25C]/50 hover:-translate-y-1 transition-all luxury-glow relative">
              <Link href={`/don-vi-thiet-ke/${unit.id}`} className="absolute inset-0 z-40" aria-label={`Xem chi tiết hồ sơ ${unit.name}`}></Link>
              <div className="h-[240px] relative overflow-hidden flex items-center justify-center bg-gray-50 dark:bg-[#151515]">
                {/* Subtle Grid Background */}
                <div className="absolute inset-0 bg-[url('/images/common/noise.png')] opacity-[0.03] mix-blend-overlay pointer-events-none z-0"></div>
                <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] z-0"></div>
                
                {/* Luxury Corner Accents */}
                <div className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 border-[#D3AE3E] opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-30"></div>
                <div className="absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 border-[#D3AE3E] opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-30"></div>
                
                {/* Avatar Display */}
                {unit.avatarUrl ? (
                  <div className="w-[180px] h-[120px] md:w-[220px] md:h-[140px] bg-white/60 dark:bg-[#1c1c1c]/60 backdrop-blur-sm rounded-[4px] shadow-[0_10px_30px_rgba(0,0,0,0.05)] dark:shadow-[0_10px_30px_rgba(0,0,0,0.5)] flex items-center justify-center p-4 relative z-20 group-hover:scale-105 transition-transform duration-500 border border-[#ECE7DE] dark:border-white/5">
                    <img src={unit.avatarUrl} alt={unit.name} className="max-w-full max-h-full object-contain drop-shadow-[0_2px_8px_rgba(0,0,0,0.15)] dark:drop-shadow-[0_0_15px_rgba(255,255,255,0.4)] transition-transform duration-500" />
                  </div>
                ) : (
                  <div className="w-[180px] h-[120px] md:w-[220px] md:h-[140px] bg-gradient-to-br from-[#1F1F1F] to-[#333] dark:from-[#2a2a2a] dark:to-[#1a1a1a] rounded-[4px] shadow-lg flex items-center justify-center p-6 relative z-20 group-hover:scale-105 transition-transform duration-500 border border-[#ECE7DE]/20 dark:border-white/10">
                    <span className="text-5xl font-heading font-bold text-[#D3AE3E] tracking-widest">{unit.name.substring(0, 2).toUpperCase()}</span>
                  </div>
                )}
                
                <div className={`absolute top-4 left-4 text-[10px] font-bold px-3 py-1.5 rounded-[2px] uppercase tracking-widest z-40 shadow-md ${getCategoryStyles(unit.category)}`}>
                  {unit.category}
                </div>
              </div>
              <div className="p-6">
                <div className="mb-2">
                  <h3 className="font-heading text-2xl font-bold text-[#1F1F1F] dark:text-white mb-2">{unit.name}</h3>
                </div>
                <div className="text-sm text-gray-500 dark:text-white/60 mb-4 line-clamp-2" dangerouslySetInnerHTML={{ __html: unit.description }} />

                <div className="space-y-2 mb-6 text-sm text-gray-700 dark:text-white/80">
                  <div className="flex items-start">
                    <i className="fa fa-building mt-1 w-5 text-[#C7A25C]"></i>
                    <span><strong>Hạng mục:</strong> {unit.strengths}</span>
                  </div>
                  <div className="flex items-start">
                    <i className="fa fa-paint-brush mt-1 w-5 text-[#C7A25C]"></i>
                    <span><strong>Lĩnh vực:</strong> {unit.style}</span>
                  </div>
                  <div className="flex items-start">
                    <i className="fa fa-map-marker-alt mt-1 w-5 text-[#C7A25C]"></i>
                    <span><strong>Khu vực:</strong> {unit.location}</span>
                  </div>
                </div>

                <div className="flex flex-col gap-3 relative z-50">
                  <div className="flex gap-2">
                    <button 
                      onClick={(e) => {
                        e.preventDefault();
                        router.push(`/don-vi-thiet-ke/so-sanh?ids=${unit.id}`);
                      }}
                      className="flex-1 flex items-center justify-center gap-2 bg-transparent border border-[#E5C98A] dark:border-white/30 hover:bg-[#C7A25C] hover:border-[#C7A25C] text-[#C7A25C] hover:text-white font-bold py-3 px-4 rounded-[2px] transition-all duration-300 uppercase tracking-wider text-xs group/cb shadow-[0_4px_15px_rgba(199,162,92,0.05)] hover:shadow-[0_4px_15px_rgba(199,162,92,0.3)]"
                    >
                      <svg className="w-4 h-4 text-[#C7A25C] group-hover/cb:text-white transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" /></svg>
                      So sánh
                    </button>
                    {unit.fanpage && (
                      <a href={unit.fanpage} target="_blank" rel="noreferrer" className="flex items-center justify-center bg-[#3b5998] hover:bg-[#2d4373] text-white px-4 rounded-[2px] transition-colors" title="Facebook Fanpage">
                        <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.469h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.469h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
                      </a>
                    )}
                  </div>
                  <Link href={`/tu-van?unit=${unit.id}`} className="text-center block w-full bg-[#1F1F1F] text-white dark:bg-white/10 dark:hover:bg-[#C7A25C] dark:text-white font-bold py-3 px-4 rounded-[2px] transition-colors uppercase tracking-wider text-xs hover:bg-[#C7A25C]">
                    Nhận tư vấn
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>


    </div>
  );
}
