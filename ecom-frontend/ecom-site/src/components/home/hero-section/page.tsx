import React from 'react';
import ButtonOne from '@/components/common/button/button-one/page';

const HeroSection: React.FC = () => {
  return (
    <div 
      className="relative w-full h-[590px] flex items-end pb-12 md:pb-0 md:items-center justify-left overflow-hidden bg-cover bg-center"
      style={{ backgroundImage: `url('/images/user/hero-image.png')` }} 
    >
      {/* Subtle dark overlay to help white text pop against a rugged image */}
      <div className="absolute inset-0 bg-black/30" />

      <div className="relative text-white text-left px-6 md:px-20 max-w-4xl space-y-6">
        <h1 className="text-3xl md:text-5xl font-extrabold uppercase tracking-tighter leading-[0.9]">
          Built for Life. <br /> 
          <span className="text-gray-300">Styled for You.</span>
        </h1>
        
        <p className="text-lg md:text-xl font-medium max-w-2xl leading-snug">
          Netsa combines rugged durability with effortless style. We craft 
          high-quality gear designed to endure every move you make.
        </p>

        <div className="flex flex-col space-y-4 md:flex-row md:space-x-5 md:space-y-0 pt-4">
          <ButtonOne text="New & Featured" />
          <ButtonOne text="Create Your Own" />
        </div>
      </div>
    </div>
  );
}

export default HeroSection;
