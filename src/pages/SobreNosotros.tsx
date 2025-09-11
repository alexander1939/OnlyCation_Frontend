import React from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';

const SobreNosotros: React.FC = () => {
  return (
    <div className="min-h-screen bg-soft-white">
      <Header />
      
      <main className="py-[80px] px-[50px]">
        <div className="max-w-[1200px] mx-auto">
          <div className="text-center mb-[60px]">
            <h1 className="text-[48px] font-bold mb-6" style={{color: '#294954'}}>
              Sobre Nosotros
            </h1>
            <p className="text-[20px]" style={{color: '#6B7280'}}>
              Conoce más sobre OnlyCation y nuestra misión educativa
            </p>
          </div>
          
          {/* Contenido sobre nosotros */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-[60px] items-center">
            <div>
              <h2 className="text-[32px] font-bold mb-6" style={{color: '#294954'}}>
                Nuestra Misión
              </h2>
              <p className="text-[18px] leading-relaxed mb-6" style={{color: '#6B7280'}}>
                En OnlyCation, creemos que la educación de calidad debe ser accesible para todos. 
                Conectamos estudiantes con los mejores tutores especializados para crear experiencias 
                de aprendizaje personalizadas y efectivas.
              </p>
              <p className="text-[18px] leading-relaxed" style={{color: '#6B7280'}}>
                Nuestra plataforma facilita el encuentro entre estudiantes que buscan conocimiento 
                y profesores apasionados por enseñar, creando una comunidad educativa sólida y confiable.
              </p>
            </div>
            
            <div className="text-center">
              <div className="rounded-[20px] p-[40px] border-2 border-mint-green" style={{backgroundColor: '#8ED4BE'}}>
                <h3 className="text-[24px] font-bold mb-4" style={{color: '#294954'}}>
                  ¿Por qué OnlyCation?
                </h3>
                <ul className="space-y-3 text-left">
                  <li className="text-[16px] font-bold" style={{color: '#294954'}}>
                    • Tutores verificados y especializados
                  </li>
                  <li className="text-[16px] font-bold" style={{color: '#294954'}}>
                    • Clases personalizadas y flexibles
                  </li>
                  <li className="text-[16px] font-bold" style={{color: '#294954'}}>
                    • Plataforma segura y confiable
                  </li>
                  <li className="text-[16px] font-bold" style={{color: '#294954'}}>
                    • Precios accesibles y transparentes
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default SobreNosotros;
