import React from 'react';

interface AboutUsHeroProps {
  isVisible: boolean;
}

const AboutUsHero: React.FC<AboutUsHeroProps> = ({ isVisible }) => {
  return (
    <section className="py-20 px-6" style={{backgroundColor: '#FAF9F5'}}>
      <div className="max-w-6xl mx-auto text-center">
        <div 
          className={`transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
        >
          <h1 
            className="text-5xl md:text-6xl font-bold mb-6" 
            style={{color: '#294954', fontSize: '3rem'}}
          >
            Sobre Nosotros
          </h1>
          <p 
            className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto" 
            style={{color: '#6B7280', fontSize: '1.25rem'}}
          >
            Conoce nuestra misión, visión y al equipo detrás de OnlyCation
          </p>
          
          {/* Decorative line */}
          <div className="flex justify-center mb-12">
            <div className="w-24 h-1 rounded-full" style={{backgroundColor: '#68B2C9'}}></div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutUsHero;
