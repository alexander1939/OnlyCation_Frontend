import React from 'react';
import { Header } from '../components';
import Footer from '../components/Footer';

const Home: React.FC = () => {
  return (
    <div className="min-h-screen w-full" style={{backgroundColor: '#FAF9F5', margin: 0, padding: 0}}>
      <Header />
      
      {/* Hero Section - Replicando el diseño Flutter exacto */}
      <section className="w-full h-[600px] pt-[100px]" style={{backgroundColor: '#FAF9F5'}}>
        <div className="max-w-[1200px] mx-auto px-10 h-full">
          <div className="grid grid-cols-2 gap-0 h-full items-center">
            {/* Left side - Content (exacto como Flutter) */}
            <div className="flex flex-col justify-center">
              <h1 className="text-[48px] font-bold text-petroleum-blue leading-[1.2] tracking-[-0.5px] mb-6">
                Nivele su experiencia de aprendizaje
              </h1>
              
              <p className="text-[18px] font-normal text-petroleum-blue/80 leading-[1.6] tracking-[0.2px] mb-10 max-w-none">
                El destino final para todos los educadores. Sumérgete en un mundo de aventuras educacionales, acción, desarrollo y emoción sin límites.
              </p>
              
              <button className="bg-petroleum-blue text-white px-8 py-4 rounded-lg text-[16px] font-semibold tracking-[0.5px] self-start hover:bg-petroleum-blue/90 transition-colors">
                Descubre ahora
              </button>
            </div>
            
            {/* Right side - Ilustración Flutter replicada */}
            <div className="h-[400px] relative">
              {/* Fondo circular suave */}
              <div className="absolute top-[50px] right-[30px] w-[300px] h-[300px] rounded-full bg-gradient-to-br from-mint-green/10 to-sky-blue/5"></div>
              
              {/* Profesor */}
              <div className="absolute bottom-[80px] left-[50px] w-[80px] h-[120px]">
                <div className="w-[40px] h-[40px] bg-petroleum-blue rounded-full mb-2"></div>
                <div className="w-[60px] h-[72px] bg-sky-blue rounded-[30px]"></div>
              </div>
              
              {/* Estudiantes */}
              <div className="absolute bottom-[90px] right-[80px] flex gap-[15px]">
                <div className="w-[30px] h-[50px]">
                  <div className="w-[20px] h-[20px] bg-petroleum-blue rounded-full mb-1"></div>
                  <div className="w-[25px] h-[26px] bg-mint-green rounded-[12px]"></div>
                </div>
                <div className="w-[30px] h-[50px]">
                  <div className="w-[20px] h-[20px] bg-petroleum-blue rounded-full mb-1"></div>
                  <div className="w-[25px] h-[26px] bg-pastel-yellow rounded-[12px]"></div>
                </div>
                <div className="w-[30px] h-[50px]">
                  <div className="w-[20px] h-[20px] bg-petroleum-blue rounded-full mb-1"></div>
                  <div className="w-[25px] h-[26px] bg-coral-orange rounded-[12px]"></div>
                </div>
              </div>
              
              {/* Pizarra */}
              <div className="absolute top-[60px] left-[80px] w-[120px] h-[80px] bg-petroleum-blue rounded-lg border-[3px] border-sky-blue p-[10px]">
                <div className="w-[60px] h-[4px] bg-mint-green rounded-sm mb-[6px]"></div>
                <div className="w-[40px] h-[4px] bg-pastel-yellow rounded-sm mb-[6px]"></div>
                <div className="w-[50px] h-[4px] bg-coral-orange rounded-sm"></div>
              </div>
              
              {/* Elementos flotantes */}
              <div className="absolute top-[30px] right-[150px] w-[25px] h-[30px] bg-mint-green rounded"></div>
              <div className="absolute top-[120px] right-[200px] w-[20px] h-[20px] bg-pastel-yellow rounded-full"></div>
              
              {/* Bombilla */}
              <div className="absolute top-[80px] right-[50px]">
                <div className="w-[20px] h-[25px] bg-coral-orange/80 rounded-[10px] mb-1"></div>
                <div className="w-[15px] h-[10px] bg-petroleum-blue rounded-sm mx-auto"></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Best Teachers Section - Replicando Flutter exacto */}
      <section className="w-full py-20 px-10" style={{backgroundColor: '#FAF9F5'}}>
        <div className="max-w-[1200px] mx-auto">
          <div className="text-center mb-[60px]">
            <h2 className="text-[48px] font-bold text-[#1A202C] mb-4">
              Los Mejores Docentes
            </h2>
            <p className="text-[18px] text-[#718096]">
              Descubre a nuestros tutores más destacados
            </p>
          </div>
          
          <div className="grid grid-cols-3 gap-[30px]">
            {[
              {
                name: 'Dr. María González',
                subject: 'Matemáticas para Secundaria',
                price: '$500 MX/hora',
                rating: 4.8,
                reviews: 124,
                description: 'Doctora en química orgánica con trayectoria en investigación científica, apasionada por la enseñanza y creadora de métodos didácticos innovadores para facilitar el aprendizaje.'
              },
              {
                name: 'Prof. Carlos Ruiz',
                subject: 'Física para Preparatoria',
                price: '$600 MX/hora',
                rating: 4.9,
                reviews: 98,
                description: 'Experto en mecánica cuántica y física aplicada con más de 15 años de experiencia docente.'
              },
              {
                name: 'Dra. Ana López',
                subject: 'Química para Universidad',
                price: '$560 MX/hora',
                rating: 4.7,
                reviews: 156,
                description: 'Doctora en química orgánica especializada en bioquímica y química analítica, con métodos didácticos innovadores.'
              }
            ].map((teacher, index) => (
              <div key={index} className="bg-white rounded-[20px] shadow-lg overflow-hidden">
                {/* Video del docente */}
                <div className="h-[160px] bg-gradient-to-br from-gray-800 to-gray-900 relative">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-20 h-20 bg-white/90 rounded-full flex items-center justify-center shadow-lg">
                      <div className="w-0 h-0 border-l-[16px] border-l-petroleum-blue border-t-[12px] border-t-transparent border-b-[12px] border-b-transparent ml-1"></div>
                    </div>
                  </div>
                  <div className="absolute top-3 right-3 bg-black/70 rounded-xl px-2 py-1 flex items-center gap-1">
                    <div className="w-3 h-3 bg-white rounded-sm"></div>
                    <span className="text-white text-[10px] font-medium">Video</span>
                  </div>
                </div>
                
                {/* Información del docente */}
                <div className="p-3">
                  <h3 className="text-[16px] font-bold text-petroleum-blue mb-1 truncate">
                    {teacher.name}
                  </h3>
                  <p className="text-[13px] text-sky-blue font-medium mb-[6px] truncate">
                    {teacher.subject}
                  </p>
                  
                  {/* Rating */}
                  <div className="flex items-center gap-[6px] mb-[6px]">
                    <div className="flex">
                      {[1,2,3,4,5].map((star) => (
                        <span key={star} className="text-pastel-yellow text-[16px]">
                          {star <= Math.floor(teacher.rating) ? '★' : star <= teacher.rating ? '☆' : '☆'}
                        </span>
                      ))}
                    </div>
                    <span className="text-[12px] font-semibold text-petroleum-blue">
                      {teacher.rating}
                    </span>
                    <span className="text-[10px] text-gray-500">
                      ({teacher.reviews})
                    </span>
                  </div>
                  
                  {/* Descripción */}
                  <p className="text-[11px] text-gray-600 leading-[1.3] mb-2 line-clamp-4">
                    {teacher.description}
                  </p>
                  
                  {/* Precio */}
                  <p className="text-[16px] font-bold text-petroleum-blue">
                    {teacher.price}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Home;
