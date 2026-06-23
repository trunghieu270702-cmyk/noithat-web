'use client';
import SectionStarryMotif from './SectionStarryMotif';
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import ScrollReveal from './ScrollReveal';

export default function Portfolio() {
  const [activeFilter, setActiveFilter] = useState('*');
  const [projects, setProjects] = useState<any[]>([]);
  const [filters, setFilters] = useState<any[]>([{ id: '*', label: 'Tất cả' }]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:3001/api/v1'}/projects`);
        if (!res.ok) throw new Error('API error');
        const text = await res.text();
        if (!text || text.startsWith('<')) throw new Error('Invalid JSON response');
        const data = JSON.parse(text);

        if (Array.isArray(data)) {
          const fetchedProjects = data.map((p: any, idx: number) => ({
            id: p.id,
            title: p.name,
            img: `/images/main/${['bed1', 'cafe', 'dinning', 'kitchen2', 'office', 'pen1'][idx % 6]}.jpg`, // using interior images
            categories: [p.projectType],
            categoryText: `${p.projectType} / ${p.unitName}`,
            link: '#'
          }));

          // Generate dynamic filters based on projectType
          const uniqueTypes = Array.from(new Set(data.map((p: any) => p.projectType))) as string[];
          const dynamicFilters = [
            { id: '*', label: 'Tất cả' },
            ...uniqueTypes.map(type => ({ id: type, label: type }))
          ];

          setFilters(dynamicFilters);
          setProjects(fetchedProjects);
        }
      } catch (error) {
        console.error("Failed to fetch projects", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchProjects();
  }, []);

  const filteredItems = projects.filter(item =>
    activeFilter === '*' || item.categories.includes(activeFilter)
  );

  return (
    <section id="Portfolio" className="relative py-32 bg-transparent dark:bg-transparent modern-section overflow-hidden">
      <SectionStarryMotif />
      {/* Grid Pattern Background */}
      <div
        className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage: "radial-gradient(#ffffff 1px, transparent 1px)",
          backgroundSize: "30px 30px"
        }}
      />

      <div className="relative z-10 max-w-[1400px] mx-auto px-6">

        {/* Section Header */}
        <ScrollReveal animation="fade-up" delay={100}>
          <div className="text-center mb-16">
            <h6 className="font-label text-[#D3AE3E] text-[13px] font-semibold tracking-[4px] uppercase mb-4">
              Recent Work
            </h6>
            <h3 className="uppercase font-heading text-4xl md:text-[40px] font-bold text-gray-900 dark:text-white mb-6 tracking-tight flex justify-center gap-[2px]">
              {'Awesome Portfolio'.split('').map((char, index) => (
                <span key={index} className={char === ' ' ? 'w-3' : ''}>{char}</span>
              ))}
            </h3>
            <p className="text-[#999] max-w-3xl mx-auto leading-relaxed text-[14px] md:text-[15px]">
              This including consulting multi disciplinary consulting work with design and engineering,
              our world branches giving full support for executing professional work.
            </p>
          </div>
        </ScrollReveal>

        {/* Filter Navigation */}
        <ScrollReveal animation="fade-up" delay={200}>
          <div className="flex flex-wrap justify-center gap-4 md:gap-8 mb-12">
            {filters.map(filter => (
              <button
                key={filter.id}
                onClick={() => setActiveFilter(filter.id)}
                className={`text-[13px] font-bold  uppercase tracking-wider transition-colors ${activeFilter === filter.id
                  ? 'text-[#D3AE3E]'
                  : 'text-gray-900 dark:text-white hover:text-[#D3AE3E]'
                  }`}
              >
                {filter.label}
              </button>
            ))}
          </div>
        </ScrollReveal>

        {/* Portfolio Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 transition-all duration-500">
          {filteredItems.map((item, index) => (
            <ScrollReveal key={item.id} animation="fade-up" delay={100 + index * 100}>
              <div
                className="group relative overflow-hidden bg-white dark:bg-[#1a1a1a] shadow-sm dark:shadow-none border border-gray-100 dark:border-white/10 aspect-[4/3] animate-in fade-in zoom-in duration-500"
              >
                {/* Image Background */}
                <div
                  className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110"
                  style={{ backgroundImage: `url(${item.img})` }}
                />

                {/* Dark Overlay on Hover */}
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/60 transition-colors duration-500" />

                {/* Content (Slides up on hover) */}
                <div className="absolute inset-0 p-8 flex flex-col justify-end translate-y-8 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500">
                  <h3 className="font-heading text-[22px] font-bold text-gray-900 dark:text-white mb-2">
                    <Link href={item.link} className="hover:text-[#D3AE3E] transition-colors">
                      {item.title}
                    </Link>
                  </h3>
                  <p className="text-[#D3AE3E] text-[13px] uppercase tracking-wider mb-6">
                    {item.categoryText}
                  </p>

                  {/* SVG Icon matching the original */}
                  <Link href={item.link} className="absolute bottom-8 right-8 w-10 h-10 bg-white dark:bg-[#131313] flex items-center justify-center hover:bg-[#D3AE3E] transition-colors group/icon">
                    <svg className="w-5 h-5 text-[#333] group-hover/icon:text-gray-900 dark:text-white" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="square" strokeMiterlimit="10" viewBox="0 0 24 24">
                      <path d="M22,22l-3-3"></path>
                      <path d="M10,7v6"></path>
                      <path d="M13,10H7"></path>
                      <path strokeLinecap="round" d="M16.419,16.309 C14.786,17.97,12.514,19,10,19c-4.971,0-9-4.029-9-9s4.029-9,9-9s9,4.029,9,9c0,2.39-0.931,4.562-2.451,6.174"></path>
                    </svg>
                  </Link>
                </div>
              </div>
            </ScrollReveal>
          ))}
        </div>

      </div>
    </section>
  );
}
