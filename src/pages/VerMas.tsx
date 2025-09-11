import React from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';

const VerMas: React.FC = () => {
  return (
    <div className="min-h-screen bg-soft-white">
      <Header />
      
      <main className="py-[80px] px-[50px]">
        <div className="max-w-[1200px] mx-auto">
          <div className="text-center mb-[60px]">
            <h1 className="text-[48px] font-bold mb-6" style={{color: '#294954'}}>
              Más Docentes
            </h1>
            <p className="text-[20px]" style={{color: '#6B7280'}}>
              Descubre todos nuestros tutores especializados
            </p>
          </div>
          
          {/* Grid de docentes */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-[40px]">
            {/* Aquí irían más cards de docentes */}
            <div className="text-center p-8 rounded-[20px] border-2 border-mint-green" style={{backgroundColor: '#8ED4BE'}}>
              <h3 className="text-[24px] font-bold mb-4" style={{color: '#294954'}}>
                Próximamente
              </h3>
              <p className="text-[16px]" style={{color: '#294954'}}>
                Más docentes estarán disponibles pronto
              </p>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default VerMas;
