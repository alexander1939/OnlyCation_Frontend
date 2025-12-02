import React from 'react';
import { useNavigate } from 'react-router-dom';

const HeroSection: React.FC = () => {
  const navigate = useNavigate();
  return (
    <section className="w-full snap-start" style={{backgroundColor: '#FAF9F5'}}>
      <div className="max-w-[1600px] py-[100px] mx-auto px-4 h-full flex items-center">
        <div className="grid grid-cols-2 gap-0 w-full items-center">
          {/* Left side - Content (exacto como Flutter) */}
          <div className="flex flex-col justify-center">
            <h1 className="text-[80px] font-bold leading-[1.1] tracking-[-0.5px] mb-8" style={{color: '#294954', padding: '0 0 0 40px', fontFamily: 'Roboto, sans-serif', fontSize: 'clamp(34px, 6vw, 80px)'}}>
              Nivele su experiencia<br />
              de aprendizaje
            </h1>
            
            <p className="text-[30px] font-normal leading-[1.5] tracking-[0.2px] mb-12 max-w-none" style={{color: '#294954', padding: '20px 0 0 40px', fontFamily: 'Roboto, sans-serif', fontSize: 'clamp(16px, 2.2vw, 30px)'}}>
              El destino final para todos los educadores. Sumérgete en un mundo de aventuras educacionales, acción, desarrollo y emoción sin límites.
            </p>
            
            <button className="text-[18px] font-semibold tracking-[0.5px] self-start transition-colors" style={{marginLeft: '40px', marginTop: '20px', backgroundColor: '#294954', color: '#FAF9F5', padding: '10px', borderRadius: '20px', border: '2px solid #294954', fontFamily: 'Roboto, sans-serif'}} onClick={() => navigate('/catalog/teachers')} onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#1e3a42'} onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#294954'}>
              Descubre ahora
            </button>
          </div>
          
          {/* Right side - Mascota */}
          <div className="h-auto md:h-[600px] relative flex items-center justify-center">
            <img 
              src="/mascota_sentado.png" 
              alt="Mascota OnlyCation" 
              className="object-contain"
              style={{
                filter: 'drop-shadow(0 10px 25px rgba(0, 0, 0, 0.1))',
                width: 'clamp(180px, 28vw, 550px)',
                height: 'auto'
              }}
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
