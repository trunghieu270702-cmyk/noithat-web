import React from 'react';
import ScrollReveal from './ScrollReveal';

const PROCESS_STEPS = [
  {
    num: '01',
    img: '/images/services/service-design.jpg',
    title: 'Conceptual',
    desc: 'Providing proposals to the client for the <br/> preliminary with the full models <br/>and rendering the reality.',
  },
  {
    num: '02',
    img: '/images/services/service-interior.jpg',
    title: 'Schematic',
    desc: 'Enhancement proposals to the client for the <br/> preliminary with the full models <br/>and rendering the approved.',
  },
  {
    num: '03',
    img: '/images/categories/cat-retail.jpg',
    title: 'Development',
    desc: 'Finalized proposals to the client for the <br/> preliminary with the full models <br/>and changes are sufficient.',
  }
];

export default function WorkProcess() {
  return (
    <section className="relative py-32 bg-black overflow-hidden">
      <div className="relative z-10 max-w-[1200px] mx-auto px-6">
        
        {/* Section Header */}
        <ScrollReveal animation="fade-up" delay={100}>
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-[40px] font-bold font-['Montserrat',_sans-serif] text-white mb-6">
              Smart planing of <span className="text-[#D3AE3E]">Work process</span>
            </h2>
            <p className="text-[#999] text-[14px] md:text-[15px] max-w-3xl mx-auto font-['Montserrat',_sans-serif] leading-relaxed">
              This including consulting multi disciplinary consulting work with design and engineering, 
              our world branches giving full support for executing professional work.
            </p>
          </div>
        </ScrollReveal>

        {/* Process Steps */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-8">
          {PROCESS_STEPS.map((step, index) => (
            <ScrollReveal key={step.num} animation="fade-up" delay={200 + index * 200}>
              <div className="flex flex-col items-center text-center group">
                
                {/* Circular Image Box */}
                <div className="relative w-48 h-48 md:w-[220px] md:h-[220px] mb-8 rounded-full overflow-hidden p-3 bg-gradient-to-tr from-[#D3AE3E]/20 via-white/40 to-white/10 shadow-[0_0_30px_rgba(255,255,255,0.05)]">
                  {/* Inner Image Wrapper */}
                  <div className="relative w-full h-full rounded-full overflow-hidden">
                    <div 
                      className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110"
                      style={{ backgroundImage: `url(${step.img})` }}
                    />
                    {/* Dark overlay inside circle */}
                    <div className="absolute inset-0 bg-black/40 group-hover:bg-black/50 transition-colors duration-500" />
                    
                    {/* Hollow Stroke Number */}
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span 
                        className="text-6xl md:text-[80px] font-bold font-['Montserrat',_sans-serif] text-hollow tracking-tighter"
                      >
                        {step.num}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Content Box */}
                <div className="px-4">
                  {/* 
                    Note: The title is in the HTML but visually hidden or merged in the screenshot.
                    I will include it as requested by the DOM structure but style it to fit the dark theme. 
                  */}
                  <h3 className="text-[18px] font-bold font-['Montserrat',_sans-serif] text-white mb-3 hidden">
                    {step.title}
                  </h3>
                  <p 
                    className="text-[#888] font-['Montserrat',_sans-serif] leading-[1.8] text-[13px] md:text-[14px]"
                    dangerouslySetInnerHTML={{ __html: step.desc }}
                  />
                </div>

              </div>
            </ScrollReveal>
          ))}
        </div>

      </div>
    </section>
  );
}
