import React from 'react';

const HeroSection: React.FC = () => {
  return (
    <section className="w-full snap-start" style={{backgroundColor: '#FAF9F5'}}>
      <div className="max-w-[1200px] py-[100px] mx-auto px-10 h-full flex items-center">
        <div className="grid grid-cols-2 gap-0 w-full items-center">
          {/* Left side - Content (exacto como Flutter) */}
          <div className="flex flex-col justify-center">
            <h1 className="text-[48px] font-bold leading-[1.2] tracking-[-0.5px] mb-6" style={{color: '#294954', padding: '0 0 0 100px'}}>
              Nivele su experiencia de aprendizaje
            </h1>
            
            <p className="text-[18px] font-normal leading-[1.6] tracking-[0.2px] mb-10 max-w-none" style={{color: '#294954', padding: '20px 0 0 100px'}}>
              El destino final para todos los educadores. Sumérgete en un mundo de aventuras educacionales, acción, desarrollo y emoción sin límites.
            </p>
            
            <button className="text-[18px] font-semibold tracking-[0.5px] self-start transition-colors" style={{marginLeft: '100px', marginTop: '20px', backgroundColor: '#294954', color: '#FAF9F5', padding: '10px', borderRadius: '20px', border: '2px solid #294954'}} onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#1e3a42'} onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#294954'}>
              Descubre ahora
            </button>
          </div>
          
          {/* Right side - Mascota */}
          <div className="h-[400px] relative flex items-center justify-center">
            <img 
              src="/mascota_sentado.png" 
              alt="Mascota OnlyCation" 
              className="max-w-full max-h-full object-contain"
              style={{
                filter: 'drop-shadow(0 10px 25px rgba(0, 0, 0, 0.1))'
              }}
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
