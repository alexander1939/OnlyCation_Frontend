import React, { useState } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';

const Home: React.FC = () => {
  const [playingVideo, setPlayingVideo] = useState<number | null>(null);

  return (
    <div className="min-h-screen w-full" style={{backgroundColor: '#FAF9F5', margin: 0, padding: 0}}>
      <Header />
      
      {/* Hero Section - Replicando el diseño Flutter exacto */}
      <section className="w-full h-[600px] pt-[100px]" style={{backgroundColor: '#FAF9F5'}}>
        <div className="max-w-[1200px] mx-auto px-10 h-full">
          <div className="grid grid-cols-2 gap-0 h-full items-center">
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

      {/* Sección Cómo funciona OnlyCation */}
      <section className="py-[80px] px-[50px]" style={{backgroundColor: '#FAF9F5'}}>
        <div className="max-w-[1200px] mx-auto">
          <div className="text-center mb-[60px]">
            <h2 className="text-[42px] font-bold mb-4" style={{color: '#294954'}}>
              Cómo funciona OnlyCation
            </h2>
          </div>
          
          <div className="grid grid-cols-4 gap-[30px]">
            {/* Card 1 - Encuentra a tu profesor */}
            <div className="bg-white rounded-[20px] p-[30px] text-center shadow-lg border border-gray-100">
              <div className="w-[60px] h-[60px] rounded-full flex items-center justify-center mx-auto mb-6"
                style={{backgroundColor: '#A8E6CF'}}
              >
                <span className="text-[24px] font-bold text-white">1</span>
              </div>
              <h3 className="text-[20px] font-bold mb-4" style={{color: '#294954'}}>
                Encuentra a tu profesor
              </h3>
              <p className="text-[14px] leading-relaxed mb-6" style={{color: '#6B7280'}}>
                El alumno elige en la plataforma el nivel educativo y la materia que necesita, para que se le muestren los tutores disponibles.
              </p>
              <div className="bg-gray-50 rounded-[15px] p-4 h-[120px] flex items-center justify-center">
                <img 
                  src="/buscando_zorro.png" 
                  alt="Buscando profesor" 
                  className="w-[150px] h-[150px] object-contain"
                />
              </div>
            </div>

            {/* Card 2 - Selecciona disponibilidad */}
            <div className="bg-white rounded-[20px] p-[30px] text-center shadow-lg border border-gray-100">
              <div className="w-[60px] h-[60px] rounded-full flex items-center justify-center mx-auto mb-6"
                style={{backgroundColor: '#FFD97D'}}
              >
                <span className="text-[24px] font-bold text-white">2</span>
              </div>
              <h3 className="text-[20px] font-bold mb-4" style={{color: '#294954'}}>
                Selecciona disponibilidad
              </h3>
              <p className="text-[14px] leading-relaxed mb-6" style={{color: '#6B7280'}}>
                Revisa el calendario de cada docente y selecciona el día y la hora que mejor se adapten a tus necesidades.
              </p>
              <div className="bg-gray-50 rounded-[15px] p-4 h-[120px] flex items-center justify-center">
                <img 
                  src="/Penzando_zorro.png" 
                  alt="Pensando disponibilidad" 
                  className="w-[150px] h-[150px] object-contain"
                />
              </div>
            </div>

            {/* Card 3 - Asiste a tu tutoría */}
            <div className="bg-white rounded-[20px] p-[30px] text-center shadow-lg border border-gray-100">
              <div className="w-[60px] h-[60px] rounded-full flex items-center justify-center mx-auto mb-6"
                style={{backgroundColor: '#87CEEB'}}
              >
                <span className="text-[24px] font-bold text-white">3</span>
              </div>
              <h3 className="text-[20px] font-bold mb-4" style={{color: '#294954'}}>
                Asiste a tu tutoría
              </h3>
              <p className="text-[14px] leading-relaxed mb-6" style={{color: '#6B7280'}}>
                Conéctate a la sesión en línea a través de la herramienta de videoconferencia que ofrece la plataforma.
              </p>
              <div className="bg-gray-50 rounded-[15px] p-4 h-[120px] flex items-center justify-center">
                <img 
                  src="/zorro_Turoria.png" 
                  alt="Asistiendo a tutoría" 
                  className="w-[150px] h-[150px] object-contain"
                  style={{
                    padding: '20px'
                  }}
                />
              </div>
            </div>

            {/* Card 4 - Confirma tu asistencia */}
            <div className="bg-white rounded-[20px] p-[30px] text-center shadow-lg border border-gray-100">
              <div className="w-[60px] h-[60px] rounded-full flex items-center justify-center mx-auto mb-6"
                style={{backgroundColor: '#DDA0DD'}}
              >
                <span className="text-[24px] font-bold text-white">4</span>
              </div>
              <h3 className="text-[20px] font-bold mb-4" style={{color: '#294954'}}>
                Confirma tu asistencia
              </h3>
              <p className="text-[14px] leading-relaxed mb-6" style={{color: '#6B7280'}}>
                Al finalizar la sesión, confirma tu participación directamente en la plataforma para llevar un registro de tus tutorías.
              </p>
              <div className="bg-gray-50 rounded-[15px] p-4 h-[120px] flex items-center justify-center">
                <img 
                  src="/zorro_confiormando.png" 
                  alt="Confirmando asistencia" 
                  className="w-[150px] h-[150px] object-contain"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

     
      {/* Sección de mejores docentes */}
      <section className="px-[20px] mb-[100px]" style={{backgroundColor: '#FAF9F5'}}>
        <div className="max-w-[1200px] mx-auto">
          <div className="text-center mb-[60px]">
            <h2 className="text-[42px] font-bold mb-4" style={{color: '#294954'}}>
              Los Mejores Docentes
            </h2>
            <p className="text-[18px] text-[#718096]">
              Descubre a nuestros tutores más destacados
            </p>
          </div>
          
          <div className="grid grid-cols-3 gap-[50px]">
            {[
              {
                name: 'Prof. Carlos Mendoza',
                subject: 'Matemáticas Avanzadas',
                price: '$450 MX/hora',
                rating: 4.9,
                reviews: 234,
                description: 'Profesor con 15 años de experiencia en matemáticas universitarias, especializado en cálculo diferencial e integral.',
                videoUrl: 'https://www.youtube.com/embed/3icoSeGqQtY'
              },
              {
                name: 'Lic. María González',
                subject: 'Inglés Conversacional',
                price: '$320 MX/hora',
                rating: 4.8,
                reviews: 189,
                description: 'Licenciada en lenguas extranjeras con certificación TESOL, enfoque en conversación y pronunciación nativa.',
                videoUrl: 'https://www.youtube.com/embed/VqmKSAF4bHI'
              },
              {
                name: 'Dra. Ana López',
                subject: 'Química para Universidad',
                price: '$560 MX/hora',
                rating: 4.7,
                reviews: 156,
                description: 'Doctora en química orgánica especializada en bioquímica y química analítica, con métodos didácticos innovadores.',
                videoUrl: 'https://www.youtube.com/embed/yQhQnyhzC6s'
              }
            ].map((teacher, index) => (
              <div key={index} className="group relative overflow-hidden transition-all duration-500 hover:transform hover:scale-[1.02] cursor-pointer h-[520px] flex flex-col" 
                style={{
                  backgroundColor: '#FFFFFF',
                  borderRadius: '28px',
                  boxShadow: '0 12px 40px rgba(41, 73, 84, 0.08), 0 4px 16px rgba(41, 73, 84, 0.04)',
                  border: '2px solid rgba(104, 178, 201, 0.08)',
                  backdropFilter: 'blur(10px)'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.boxShadow = '0 24px 64px rgba(41, 73, 84, 0.15), 0 8px 32px rgba(104, 178, 201, 0.1)';
                  e.currentTarget.style.borderColor = 'rgba(104, 178, 201, 0.25)';
                  e.currentTarget.style.transform = 'translateY(-8px) scale(1.02)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.boxShadow = '0 12px 40px rgba(41, 73, 84, 0.08), 0 4px 16px rgba(41, 73, 84, 0.04)';
                  e.currentTarget.style.borderColor = 'rgba(104, 178, 201, 0.08)';
                  e.currentTarget.style.transform = 'translateY(0) scale(1)';
                }}
              >
                {/* Video del docente premium */}
                <div className="h-[250px] relative overflow-hidden cursor-pointer" 
                  style={{
                    borderRadius: '28px 28px 0 0'
                  }}
                  onClick={() => setPlayingVideo(playingVideo === index ? null : index)}
                >
                  {playingVideo === index ? (
                    /* Video embebido */
                    <iframe
                      src={`${teacher.videoUrl}?autoplay=1&rel=0&modestbranding=1`}
                      className="w-full h-full"
                      style={{borderRadius: '28px 28px 0 0'}}
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                      title={`Video de ${teacher.name}`}
                    />
                  ) : (
                    <>
                      {/* Thumbnail del video de YouTube */}
                      <img 
                        src={`https://img.youtube.com/vi/${teacher.videoUrl.split('/embed/')[1]}/maxresdefault.jpg`}
                        alt={`Video de ${teacher.name}`}
                        className="w-full h-full object-cover transition-all duration-500 group-hover:scale-110"
                        style={{filter: 'brightness(0.8)'}}
                      />
                      
                      {/* Overlay con gradiente */}
                      <div className="absolute inset-0" 
                        style={{
                          background: 'linear-gradient(135deg, rgba(41, 73, 84, 0.3) 0%, rgba(104, 178, 201, 0.2) 50%, rgba(142, 212, 190, 0.1) 100%)'
                        }}
                      ></div>
                      
                      {/* Botón de play mejorado */}
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-20 h-20 rounded-full flex items-center justify-center transition-all duration-500 group-hover:scale-125 group-hover:rotate-12" 
                          style={{
                            backgroundColor: 'rgba(255, 255, 255, 0.95)',
                            boxShadow: '0 12px 32px rgba(0, 0, 0, 0.3), 0 4px 16px rgba(0, 0, 0, 0.1)',
                            border: '3px solid rgba(104, 178, 201, 0.3)'
                          }}
                        >
                          <div className="w-0 h-0 border-l-[18px] border-t-[12px] border-b-[12px] ml-1 transition-all duration-300"
                            style={{
                              borderLeftColor: '#294954',
                              borderTopColor: 'transparent',
                              borderBottomColor: 'transparent'
                            }}
                          ></div>
                        </div>
                      </div>
                      
                      {/* Badge de video premium */}
                      <div className="absolute bottom-4 right-4 px-4 py-2 rounded-full flex items-center gap-2 transition-all duration-300"
                        style={{
                          backgroundColor: 'rgba(0, 0, 0, 0.8)',
                          backdropFilter: 'blur(12px)',
                          border: '1px solid rgba(255, 255, 255, 0.2)'
                        }}
                      >
                        <div className="w-2 h-2 rounded-full animate-pulse" style={{backgroundColor: '#EF4444'}}></div>
                        <span className="text-white text-xs font-semibold">Ver Video</span>
                      </div>
                    </>
                  )}
                </div>
                
                {/* Información del docente premium */}
<div className="p-10 flex-1 flex flex-col">
                  {/* Header con nombre y materia */}
                  <div className="mb-4">
                    <h3 className="text-lg font-bold mb-3 transition-colors duration-300 group-hover:text-opacity-80" 
                      style={{color: '#294954', fontFamily: 'Inter, sans-serif', padding: '20px 10px 10px 10px'}}
                    >
                      {teacher.name}
                    </h3>
                    <div className="flex items-center gap-2" style={{padding: '0 10px 10px 10px'}}>
                      <div className="w-1 h-4 rounded-full" style={{backgroundColor: '#68B2C9'}}></div>
                      <p className="text-sm font-semibold" style={{color: '#68B2C9'}}>
                        {teacher.subject}
                      </p>
                    </div>
                  </div>
                  
                  {/* Rating premium con animación */}
                  <div className="flex items-center gap-3 mb-8 p-3 rounded-lg transition-all duration-300"
                    style={{backgroundColor: 'rgba(250, 249, 245, 0.8)', padding: '0 10px 10px 10px'}}
                  >
                    <div className="flex items-center gap-1">
                      {[1,2,3,4,5].map((star) => (
                        <span key={star} className="text-sm transition-all duration-300 hover:scale-125 cursor-pointer" 
                          style={{
                            color: star <= Math.floor(teacher.rating) ? '#FFDE97' : '#E5E7EB',
                            textShadow: star <= Math.floor(teacher.rating) ? '0 2px 4px rgba(255, 222, 151, 0.3)' : 'none',
                            filter: star <= Math.floor(teacher.rating) ? 'drop-shadow(0 0 2px rgba(255, 222, 151, 0.5))' : 'none'
                          }}
                        >
                          ★
                        </span>
                      ))}
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-bold" style={{color: '#294954'}}>
                        {teacher.rating}
                      </span>
                      <div className="w-1 h-1 rounded-full" style={{backgroundColor: '#68B2C9'}}></div>
                      <span className="text-xs font-medium" style={{color: '#6B7280'}}>
                        {teacher.reviews} reseñas
                      </span>
                    </div>
                  </div>
                  
                  {/* Descripción con mejor tipografía */}
                  <div className="flex-1 mb-8" style={{padding: '0 10px 10px 10px'}}>
                    <p className="text-sm leading-relaxed text-justify" 
                      style={{
                        color: '#4B5563', 
                        lineHeight: '1.6',
                        fontFamily: 'Inter, sans-serif',
                        display: '-webkit-box',
                        WebkitLineClamp: 3,
                        WebkitBoxOrient: 'vertical',
                        overflow: 'hidden'
                      }}
                    >
                      {teacher.description}
                    </p>
                  </div>
                  
                  {/* PRECIO */}
                  <div className="flex justify-center pt-4 mt-auto"
                    style={{padding: '0 0 30px 0'}}
                  >
                    <div className="px-6 py-3 rounded-lg transition-all duration-300" 
                      style={{
                        backgroundColor: 'rgba(104, 178, 201, 0.08)',
                        border: '1px solid rgba(104, 178, 201, 0.15)'
                      }}
                    >
                      <p className="text-base font-bold text-center" style={{color: '#294954'}}>
                        {teacher.price}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          {/* Botón Ver más centrado */}
          <div className="text-center mt-[60px]">
            <button className="text-[18px] font-semibold tracking-[0.5px] transition-colors" 
              style={{
                backgroundColor: '#294954', 
                color: '#FAF9F5', 
                padding: '12px 24px', 
                borderRadius: '20px', 
                border: '2px solid #294954'
              }} 
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#1e3a42'} 
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#294954'}>
              Ver más
            </button>
          </div>
        </div>
      </section>

     
       {/* Asignaturas Section */}
       <section className="py-[10px] px-[50px] bg-soft-white">
        <div className="max-w-[1200px] mx-auto">
          <div className="text-center mb-[60px]">
            <h2 className="text-[42px] font-bold mb-4 text-white drop-shadow-lg">
              Asignaturas
            </h2>
          </div>
          
          {/* Preparatoria */}
          <div className="mb-[80px]">
            <h3 className="text-[32px] font-bold mb-8 text-center text-white drop-shadow-lg">
              Preparatoria
            </h3>
            <div className="relative group">
              {/* Flecha Izquierda */}
              <button 
                onClick={() => {
                  const container = document.querySelector('.preparatoria-scroll') as HTMLElement;
                  if (container) {
                    container.classList.add('scrolling');
                    const currentTransform = container.style.transform || 'translateX(0px)';
                    const currentX = parseInt(currentTransform.match(/-?\d+/)?.[0] || '0') || 0;
                    const newX = Math.min(currentX + 330, 0);
                    container.style.transform = `translateX(${newX}px)`;
                    setTimeout(() => container.classList.remove('scrolling'), 800);
                  }
                }}
                className="absolute left-2 top-1/2 -translate-y-1/2 z-20 w-16 h-16 rounded-full bg-white shadow-2xl hover:shadow-3xl hover:scale-110 transition-all duration-300 flex items-center justify-center border-2 border-sky-blue/20 hover:border-sky-blue/40">
                <svg className="w-8 h-8" style={{color: '#68B2C9'}} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              
              {/* Flecha Derecha */}
              <button 
                onClick={() => {
                  const container = document.querySelector('.preparatoria-scroll') as HTMLElement;
                  if (container) {
                    container.classList.add('scrolling');
                    const currentTransform = container.style.transform || 'translateX(0px)';
                    const currentX = parseInt(currentTransform.match(/-?\d+/)?.[0] || '0') || 0;
                    const newX = Math.max(currentX - 330, -990);
                    container.style.transform = `translateX(${newX}px)`;
                    setTimeout(() => container.classList.remove('scrolling'), 800);
                  }
                }}
                className="absolute right-2 top-1/2 -translate-y-1/2 z-20 w-16 h-16 rounded-full bg-white shadow-2xl hover:shadow-3xl hover:scale-110 transition-all duration-300 flex items-center justify-center border-2 border-sky-blue/20 hover:border-sky-blue/40">
                <svg className="w-8 h-8" style={{color: '#68B2C9'}} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M9 5l7 7-7 7" />
                </svg>
              </button>
              
              <div className="overflow-hidden transition-all duration-300" style={{padding: '20px 0'}}>
                <div className="preparatoria-scroll scroll-container flex gap-[30px] py-8 px-16 transition-transform duration-500 ease-in-out" style={{minHeight: '320px'}}>
                <div className="rounded-[20px] p-[30px] shadow-xl hover:shadow-2xl transition-all duration-500 hover:scale-110 hover:-translate-y-2 w-[280px] h-[280px] flex-shrink-0 flex flex-col text-center cursor-pointer border-2 border-pastel-yellow" style={{backgroundColor: '#FAF9F5'}}>
                  <div className="w-[50px] h-[50px] rounded-full flex items-center justify-center mx-auto mb-8" style={{backgroundColor: '#A8E6CF'}}>
                    <span className="text-[24px]">📊</span>
                  </div>
                  <h4 className="text-[20px] font-bold mb-8" style={{color: '#294954'}}>Matemáticas</h4>
                  <p className="text-[14px] leading-relaxed flex-1" style={{color: '#6B7280'}}>
                    Sentar las bases con aritmética, geometría y álgebra básica para resolver problemas cotidianos.
                  </p>
                </div>
                <div className="rounded-[20px] p-[30px] shadow-xl hover:shadow-2xl transition-all duration-500 hover:scale-110 hover:-translate-y-2 w-[280px] h-[280px] flex-shrink-0 flex flex-col text-center cursor-pointer border-2 border-pastel-yellow" style={{backgroundColor: '#FAF9F5'}}>
                  <div className="w-[50px] h-[50px] rounded-full flex items-center justify-center mx-auto mb-8" style={{backgroundColor: '#8ED4BE'}}>
                    <span className="text-[24px]">🧬</span>
                  </div>
                  <h4 className="text-[20px] font-bold mb-8" style={{color: '#294954'}}>Biología</h4>
                  <p className="text-[14px] leading-relaxed flex-1" style={{color: '#6B7280'}}>
                    Conocer la estructura y funciones de los seres vivos, desde las células hasta los ecosistemas.
                  </p>
                </div>
                <div className="rounded-[20px] p-[30px] shadow-xl hover:shadow-2xl transition-all duration-500 hover:scale-110 hover:-translate-y-2 w-[280px] h-[280px] flex-shrink-0 flex flex-col text-center cursor-pointer border-2 border-pastel-yellow" style={{backgroundColor: '#FAF9F5'}}>
                  <div className="w-[50px] h-[50px] rounded-full flex items-center justify-center mx-auto mb-8" style={{backgroundColor: '#FFDE97'}}>
                    <span className="text-[24px]">🏛️</span>
                  </div>
                  <h4 className="text-[20px] font-bold mb-8" style={{color: '#294954'}}>Historia</h4>
                  <p className="text-[14px] leading-relaxed flex-1" style={{color: '#6B7280'}}>
                    Comprender los procesos históricos más relevantes que han marcado el desarrollo de la sociedad.
                  </p>
                </div>
                <div className="rounded-[20px] p-[30px] shadow-xl hover:shadow-2xl transition-all duration-500 hover:scale-110 hover:-translate-y-2 w-[280px] h-[280px] flex-shrink-0 flex flex-col text-center cursor-pointer border-2 border-pastel-yellow" style={{backgroundColor: '#FAF9F5'}}>
                  <div className="w-[50px] h-[50px] rounded-full flex items-center justify-center mx-auto mb-8" style={{backgroundColor: '#FF9978'}}>
                    <span className="text-[24px]">📚</span>
                  </div>
                  <h4 className="text-[20px] font-bold mb-8" style={{color: '#294954'}}>Lengua y Literatura</h4>
                  <p className="text-[14px] leading-relaxed flex-1" style={{color: '#6B7280'}}>
                    Desarrollar habilidades de comunicación, lectura crítica y redacción mediante textos literarios.
                  </p>
                </div>
                <div className="rounded-[20px] p-[30px] shadow-xl hover:shadow-2xl transition-all duration-500 hover:scale-110 hover:-translate-y-2 w-[280px] h-[280px] flex-shrink-0 flex flex-col text-center cursor-pointer border-2 border-pastel-yellow" style={{backgroundColor: '#FAF9F5'}}>
                  <div className="w-[50px] h-[50px] rounded-full flex items-center justify-center mx-auto mb-8" style={{backgroundColor: '#68B2C9'}}>
                    <span className="text-[24px]">⚗️</span>
                  </div>
                  <h4 className="text-[20px] font-bold mb-8" style={{color: '#294954'}}>Química</h4>
                  <p className="text-[14px] leading-relaxed flex-1" style={{color: '#6B7280'}}>
                    Introducirse en los principios de la materia, los elementos y las reacciones químicas básicas.
                  </p>
                </div>
                <div className="rounded-[20px] p-[30px] shadow-xl hover:shadow-2xl transition-all duration-500 hover:scale-110 hover:-translate-y-2 w-[280px] h-[280px] flex-shrink-0 flex flex-col text-center cursor-pointer border-2 border-pastel-yellow" style={{backgroundColor: '#FAF9F5'}}>
                  <div className="w-[50px] h-[50px] rounded-full flex items-center justify-center mx-auto mb-8" style={{backgroundColor: '#294954'}}>
                    <span className="text-[24px] text-white">🌍</span>
                  </div>
                  <h4 className="text-[20px] font-bold mb-8" style={{color: '#294954'}}>Geografía</h4>
                  <p className="text-[14px] leading-relaxed flex-1" style={{color: '#6B7280'}}>
                    Analizar el espacio geográfico, los recursos naturales y la relación entre sociedad y entorno.
                  </p>
                </div>
                </div>
              </div>
              {/* Progress Bar */}
              <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-32 h-1 bg-white/30 rounded-full overflow-hidden">
                <div className="h-full bg-white rounded-full transition-all duration-500" style={{width: '33%'}}></div>
              </div>
              
              {/* Arrow Navigation */}
              <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 flex gap-4 items-center">
                <img 
                  onClick={() => {
                    const container = document.querySelector('.preparatoria-scroll') as HTMLElement;
                    if (container) {
                      container.classList.add('scrolling');
                      container.style.transform = `translateX(0px)`;
                      setTimeout(() => container.classList.remove('scrolling'), 800);
                    }
                  }}
                  src="/flecha_iz.png" 
                  alt="Página 1" 
                  className="cursor-pointer hover:scale-125 transition-transform duration-300" 
                  style={{width: '20px', height: '20px'}} />
                <img 
                  onClick={() => {
                    const container = document.querySelector('.preparatoria-scroll') as HTMLElement;
                    if (container) {
                      container.classList.add('scrolling');
                      container.style.transform = `translateX(-330px)`;
                      setTimeout(() => container.classList.remove('scrolling'), 800);
                    }
                  }}
                  src="/flecha_cntro.png" 
                  alt="Página 2" 
                  className="cursor-pointer hover:scale-125 transition-transform duration-300" 
                  style={{width: '20px', height: '20px'}} />
                <img 
                  onClick={() => {
                    const container = document.querySelector('.preparatoria-scroll') as HTMLElement;
                    if (container) {
                      container.classList.add('scrolling');
                      container.style.transform = `translateX(-660px)`;
                      setTimeout(() => container.classList.remove('scrolling'), 800);
                    }
                  }}
                  src="/fcha a la drechas.png" 
                  alt="Página 3" 
                  className="cursor-pointer hover:scale-125 transition-transform duration-300" 
                  style={{width: '20px', height: '20px'}} />
              </div>
            </div>
          </div>

          {/* Universidad */}
          <div className="mb-[80px]">
            <h3 className="text-[32px] font-bold mb-8 text-center text-white drop-shadow-lg">
              Universidad
            </h3>
            <div className="relative group">
              {/* Flecha Izquierda */}
              <button 
                onClick={() => {
                  const container = document.querySelector('.universidad-scroll') as HTMLElement;
                  if (container) {
                    container.classList.add('scrolling');
                    const currentTransform = container.style.transform || 'translateX(0px)';
                    const currentX = parseInt(currentTransform.match(/-?\d+/)?.[0] || '0') || 0;
                    const newX = Math.min(currentX + 330, 0);
                    container.style.transform = `translateX(${newX}px)`;
                    setTimeout(() => container.classList.remove('scrolling'), 800);
                  }
                }}
                className="absolute left-2 top-1/2 -translate-y-1/2 z-20 w-16 h-16 rounded-full bg-white shadow-2xl hover:shadow-3xl hover:scale-110 transition-all duration-300 flex items-center justify-center border-2 border-sky-blue/20 hover:border-sky-blue/40">
                <svg className="w-8 h-8" style={{color: '#68B2C9'}} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              
              {/* Flecha Derecha */}
              <button 
                onClick={() => {
                  const container = document.querySelector('.universidad-scroll') as HTMLElement;
                  if (container) {
                    container.classList.add('scrolling');
                    const currentTransform = container.style.transform || 'translateX(0px)';
                    const currentX = parseInt(currentTransform.match(/-?\d+/)?.[0] || '0') || 0;
                    const newX = Math.max(currentX - 330, -990);
                    container.style.transform = `translateX(${newX}px)`;
                    setTimeout(() => container.classList.remove('scrolling'), 800);
                  }
                }}
                className="absolute right-2 top-1/2 -translate-y-1/2 z-20 w-16 h-16 rounded-full bg-white shadow-2xl hover:shadow-3xl hover:scale-110 transition-all duration-300 flex items-center justify-center border-2 border-sky-blue/20 hover:border-sky-blue/40">
                <svg className="w-8 h-8" style={{color: '#68B2C9'}} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M9 5l7 7-7 7" />
                </svg>
              </button>
              
              <div className="overflow-hidden transition-all duration-300" style={{padding: '20px 0'}}>
                <div className="universidad-scroll scroll-container flex gap-[30px] py-8 px-16 transition-transform duration-500 ease-in-out" style={{minHeight: '320px'}}>
                <div className="rounded-[20px] p-[30px] shadow-xl hover:shadow-2xl transition-all duration-500 hover:scale-110 hover:-translate-y-2 w-[280px] h-[280px] flex-shrink-0 flex flex-col text-center cursor-pointer border-2 border-pastel-yellow" style={{backgroundColor: '#FAF9F5'}}>
                  <div className="w-[50px] h-[50px] rounded-full flex items-center justify-center mx-auto mb-8" style={{backgroundColor: '#A8E6CF'}}>
                    <span className="text-[24px]">📊</span>
                  </div>
                  <h4 className="text-[20px] font-bold mb-8" style={{color: '#294954'}}>Cálculo y Estadística</h4>
                  <p className="text-[14px] leading-relaxed flex-1" style={{color: '#6B7280'}}>
                    Aplicación de herramientas matemáticas avanzadas para resolver problemas académicos y profesionales.
                  </p>
                </div>
                <div className="rounded-[20px] p-[30px] shadow-xl hover:shadow-2xl transition-all duration-500 hover:scale-110 hover:-translate-y-2 w-[280px] h-[280px] flex-shrink-0 flex flex-col text-center cursor-pointer border-2 border-pastel-yellow" style={{backgroundColor: '#FAF9F5'}}>
                  <div className="w-[50px] h-[50px] rounded-full flex items-center justify-center mx-auto mb-8" style={{backgroundColor: '#FFDE97'}}>
                    <span className="text-[24px]">💰</span>
                  </div>
                  <h4 className="text-[20px] font-bold mb-8" style={{color: '#294954'}}>Economía</h4>
                  <p className="text-[14px] leading-relaxed flex-1" style={{color: '#6B7280'}}>
                    Estudio del comportamiento de los mercados, oferta, demanda y políticas económicas.
                  </p>
                </div>
                <div className="rounded-[20px] p-[30px] shadow-xl hover:shadow-2xl transition-all duration-500 hover:scale-110 hover:-translate-y-2 w-[280px] h-[280px] flex-shrink-0 flex flex-col text-center cursor-pointer border-2 border-pastel-yellow" style={{backgroundColor: '#FAF9F5'}}>
                  <div className="w-[50px] h-[50px] rounded-full flex items-center justify-center mx-auto mb-8" style={{backgroundColor: '#294954'}}>
                    <span className="text-[24px] text-white">⚖️</span>
                  </div>
                  <h4 className="text-[20px] font-bold mb-8" style={{color: '#294954'}}>Derecho</h4>
                  <p className="text-[14px] leading-relaxed flex-1" style={{color: '#6B7280'}}>
                    Conocer las bases legales que rigen la sociedad y su aplicación en distintos contextos.
                  </p>
                </div>
                <div className="rounded-[20px] p-[30px] shadow-xl hover:shadow-2xl transition-all duration-500 hover:scale-110 hover:-translate-y-2 w-[280px] h-[280px] flex-shrink-0 flex flex-col text-center cursor-pointer border-2 border-pastel-yellow" style={{backgroundColor: '#FAF9F5'}}>
                  <div className="w-[50px] h-[50px] rounded-full flex items-center justify-center mx-auto mb-8" style={{backgroundColor: '#68B2C9'}}>
                    <span className="text-[24px]">💻</span>
                  </div>
                  <h4 className="text-[20px] font-bold mb-8" style={{color: '#294954'}}>Ingeniería de Software</h4>
                  <p className="text-[14px] leading-relaxed flex-1" style={{color: '#6B7280'}}>
                    Introducción al diseño, desarrollo y mantenimiento de sistemas y aplicaciones tecnológicas.
                  </p>
                </div>
                <div className="rounded-[20px] p-[30px] shadow-xl hover:shadow-2xl transition-all duration-500 hover:scale-110 hover:-translate-y-2 w-[280px] h-[280px] flex-shrink-0 flex flex-col text-center cursor-pointer border-2 border-pastel-yellow" style={{backgroundColor: '#FAF9F5'}}>
                  <div className="w-[50px] h-[50px] rounded-full flex items-center justify-center mx-auto mb-8" style={{backgroundColor: '#FF9978'}}>
                    <span className="text-[24px]">🧠</span>
                  </div>
                  <h4 className="text-[20px] font-bold mb-8" style={{color: '#294954'}}>Psicología General</h4>
                  <p className="text-[14px] leading-relaxed flex-1" style={{color: '#6B7280'}}>
                    Estudio de la mente y la conducta humana desde diferentes enfoques teóricos.
                  </p>
                </div>
                <div className="rounded-[20px] p-[30px] shadow-xl hover:shadow-2xl transition-all duration-500 hover:scale-110 hover:-translate-y-2 w-[280px] h-[280px] flex-shrink-0 flex flex-col text-center cursor-pointer border-2 border-pastel-yellow" style={{backgroundColor: '#FAF9F5'}}>
                  <div className="w-[50px] h-[50px] rounded-full flex items-center justify-center mx-auto mb-8" style={{backgroundColor: '#8ED4BE'}}>
                    <span className="text-[24px]">📢</span>
                  </div>
                  <h4 className="text-[20px] font-bold mb-8" style={{color: '#294954'}}>Comunicación</h4>
                  <p className="text-[14px] leading-relaxed flex-1" style={{color: '#6B7280'}}>
                    Fortalecer las habilidades orales y escritas para la interacción profesional y académica.
                  </p>
                </div>
                </div>
              </div>
              {/* Arrow Navigation */}
              <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 flex gap-4 items-center">
                <img 
                  onClick={() => {
                    const container = document.querySelector('.universidad-scroll') as HTMLElement;
                    if (container) {
                      container.classList.add('scrolling');
                      container.style.transform = `translateX(0px)`;
                      setTimeout(() => container.classList.remove('scrolling'), 800);
                    }
                  }}
                  src="/flecha_iz.png" 
                  alt="Página 1" 
                  className="cursor-pointer hover:scale-125 transition-transform duration-300" 
                  style={{width: '20px', height: '20px'}} />
                <img 
                  onClick={() => {
                    const container = document.querySelector('.universidad-scroll') as HTMLElement;
                    if (container) {
                      container.classList.add('scrolling');
                      container.style.transform = `translateX(-330px)`;
                      setTimeout(() => container.classList.remove('scrolling'), 800);
                    }
                  }}
                  src="/flecha_cntro.png" 
                  alt="Página 2" 
                  className="cursor-pointer hover:scale-125 transition-transform duration-300" 
                  style={{width: '20px', height: '20px'}} />
                <img 
                  onClick={() => {
                    const container = document.querySelector('.universidad-scroll') as HTMLElement;
                    if (container) {
                      container.classList.add('scrolling');
                      container.style.transform = `translateX(-660px)`;
                      setTimeout(() => container.classList.remove('scrolling'), 800);
                    }
                  }}
                  src="/fcha a la drechas.png" 
                  alt="Página 3" 
                  className="cursor-pointer hover:scale-125 transition-transform duration-300" 
                  style={{width: '20px', height: '20px'}} />
              </div>
            </div>
          </div>

          {/* Posgrado */}
          <div className="mb-[40px]">
            <h3 className="text-[32px] font-bold mb-8 text-center text-white drop-shadow-lg">
              Posgrado
            </h3>
            <div className="relative group">
              {/* Flecha Izquierda */}
              <button 
                onClick={() => {
                  const container = document.querySelector('.posgrado-scroll') as HTMLElement;
                  if (container) {
                    container.classList.add('scrolling');
                    const currentTransform = container.style.transform || 'translateX(0px)';
                    const currentX = parseInt(currentTransform.match(/-?\d+/)?.[0] || '0') || 0;
                    const newX = Math.min(currentX + 330, 0);
                    container.style.transform = `translateX(${newX}px)`;
                    setTimeout(() => container.classList.remove('scrolling'), 800);
                  }
                }}
                className="absolute left-2 top-1/2 -translate-y-1/2 z-20 w-16 h-16 rounded-full bg-white shadow-2xl hover:shadow-3xl hover:scale-110 transition-all duration-300 flex items-center justify-center border-2 border-sky-blue/20 hover:border-sky-blue/40">
                <svg className="w-8 h-8" style={{color: '#68B2C9'}} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              
              {/* Flecha Derecha */}
              <button 
                onClick={() => {
                  const container = document.querySelector('.posgrado-scroll') as HTMLElement;
                  if (container) {
                    container.classList.add('scrolling');
                    const currentTransform = container.style.transform || 'translateX(0px)';
                    const currentX = parseInt(currentTransform.match(/-?\d+/)?.[0] || '0') || 0;
                    const newX = Math.max(currentX - 330, -990);
                    container.style.transform = `translateX(${newX}px)`;
                    setTimeout(() => container.classList.remove('scrolling'), 800);
                  }
                }}
                className="absolute right-2 top-1/2 -translate-y-1/2 z-20 w-16 h-16 rounded-full bg-white shadow-2xl hover:shadow-3xl hover:scale-110 transition-all duration-300 flex items-center justify-center border-2 border-sky-blue/20 hover:border-sky-blue/40">
                <svg className="w-8 h-8" style={{color: '#68B2C9'}} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M9 5l7 7-7 7" />
                </svg>
              </button>
              
              <div className="overflow-hidden transition-all duration-300" style={{padding: '20px 0'}}>
                <div className="posgrado-scroll scroll-container flex gap-[30px] py-8 px-16 transition-transform duration-500 ease-in-out" style={{minHeight: '320px'}}>
                <div className="rounded-[20px] p-[30px] shadow-xl hover:shadow-2xl transition-all duration-500 hover:scale-110 hover:-translate-y-2 w-[280px] h-[280px] flex-shrink-0 flex flex-col text-center cursor-pointer border-2 border-pastel-yellow" style={{backgroundColor: '#FAF9F5'}}>
                  <div className="w-[50px] h-[50px] rounded-full flex items-center justify-center mx-auto mb-8" style={{backgroundColor: '#A8E6CF'}}>
                    <span className="text-[24px]">🔍</span>
                  </div>
                  <h4 className="text-[20px] font-bold mb-8" style={{color: '#294954'}}>Metodología de la Investigación</h4>
                  <p className="text-[14px] leading-relaxed flex-1" style={{color: '#6B7280'}}>
                    Desarrollo de proyectos académicos y científicos con rigor metodológico.
                  </p>
                </div>
                <div className="rounded-[20px] p-[30px] shadow-xl hover:shadow-2xl transition-all duration-500 hover:scale-110 hover:-translate-y-2 w-[280px] h-[280px] flex-shrink-0 flex flex-col text-center cursor-pointer border-2 border-pastel-yellow" style={{backgroundColor: '#FAF9F5'}}>
                  <div className="w-[50px] h-[50px] rounded-full flex items-center justify-center mx-auto mb-8" style={{backgroundColor: '#2ECC71'}}>
                    <span className="text-[24px]">🏥</span>
                  </div>
                  <h4 className="text-[20px] font-bold mb-8" style={{color: '#294954'}}>Medicina Especializada</h4>
                  <p className="text-[14px] leading-relaxed flex-1" style={{color: '#6B7280'}}>
                    Especialización médica en diversas áreas clínicas y de investigación biomédica.
                  </p>
                </div>
                <div className="rounded-[20px] p-[30px] shadow-xl hover:shadow-2xl transition-all duration-500 hover:scale-110 hover:-translate-y-2 w-[280px] h-[280px] flex-shrink-0 flex flex-col text-center cursor-pointer border-2 border-pastel-yellow" style={{backgroundColor: '#FAF9F5'}}>
                  <div className="w-[50px] h-[50px] rounded-full flex items-center justify-center mx-auto mb-8" style={{backgroundColor: '#FF6B6B'}}>
                    <span className="text-[24px]">🔬</span>
                  </div>
                  <h4 className="text-[20px] font-bold mb-8" style={{color: '#294954'}}>Investigación Avanzada</h4>
                  <p className="text-[14px] leading-relaxed flex-1" style={{color: '#6B7280'}}>
                    Metodologías de investigación científica y desarrollo de proyectos de alto impacto.
                  </p>
                </div>
                <div className="rounded-[20px] p-[30px] shadow-xl hover:shadow-2xl transition-all duration-500 hover:scale-110 hover:-translate-y-2 w-[280px] h-[280px] flex-shrink-0 flex flex-col text-center cursor-pointer border-2 border-pastel-yellow" style={{backgroundColor: '#FAF9F5'}}>
                  <div className="w-[50px] h-[50px] rounded-full flex items-center justify-center mx-auto mb-8" style={{backgroundColor: '#68B2C9'}}>
                    <span className="text-[24px]">📊</span>
                  </div>
                  <h4 className="text-[20px] font-bold mb-8" style={{color: '#294954'}}>Análisis de Datos Avanzado</h4>
                  <p className="text-[14px] leading-relaxed flex-1" style={{color: '#6B7280'}}>
                    Uso de estadística, programación y modelos predictivos para la innovación e investigación.
                  </p>
                </div>
                <div className="rounded-[20px] p-[30px] shadow-xl hover:shadow-2xl transition-all duration-500 hover:scale-110 hover:-translate-y-2 w-[280px] h-[280px] flex-shrink-0 flex flex-col text-center cursor-pointer border-2 border-pastel-yellow" style={{backgroundColor: '#FAF9F5'}}>
                  <div className="w-[50px] h-[50px] rounded-full flex items-center justify-center mx-auto mb-8" style={{backgroundColor: '#FF9978'}}>
                    <span className="text-[24px]">🏦</span>
                  </div>
                  <h4 className="text-[20px] font-bold mb-8" style={{color: '#294954'}}>Políticas Públicas</h4>
                  <p className="text-[14px] leading-relaxed flex-1" style={{color: '#6B7280'}}>
                    Estudio y diseño de estrategias para la toma de decisiones a nivel social y gubernamental.
                  </p>
                </div>
                <div className="rounded-[20px] p-[30px] shadow-xl hover:shadow-2xl transition-all duration-500 hover:scale-110 hover:-translate-y-2 w-[280px] h-[280px] flex-shrink-0 flex flex-col text-center cursor-pointer border-2 border-pastel-yellow" style={{backgroundColor: '#FAF9F5'}}>
                  <div className="w-[50px] h-[50px] rounded-full flex items-center justify-center mx-auto mb-8" style={{backgroundColor: '#294954'}}>
                    <span className="text-[24px] text-white">💹</span>
                  </div>
                  <h4 className="text-[20px] font-bold mb-8" style={{color: '#294954'}}>Finanzas Corporativas</h4>
                  <p className="text-[14px] leading-relaxed flex-1" style={{color: '#6B7280'}}>
                    Enfoque en la gestión estratégica de recursos financieros en organizaciones y empresas.
                  </p>
                </div>
                <div className="rounded-[20px] p-[30px] shadow-xl hover:shadow-2xl transition-all duration-500 hover:scale-110 hover:-translate-y-2 w-[280px] h-[280px] flex-shrink-0 flex flex-col text-center cursor-pointer border-2 border-pastel-yellow" style={{backgroundColor: '#FAF9F5'}}>
                  <div className="w-[50px] h-[50px] rounded-full flex items-center justify-center mx-auto mb-8" style={{backgroundColor: '#9B59B6'}}>
                    <span className="text-[24px] text-white">📚</span>
                  </div>
                  <h4 className="text-[20px] font-bold mb-8" style={{color: '#294954'}}>Doctorado en Educación</h4>
                  <p className="text-[14px] leading-relaxed flex-1" style={{color: '#6B7280'}}>
                    Formación especializada en pedagogía avanzada y liderazgo educativo.
                  </p>
                </div>
                </div>
              </div>
              
              {/* Arrow Navigation */}
              <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 flex gap-4 items-center">
                <img 
                  onClick={() => {
                    const container = document.querySelector('.posgrado-scroll') as HTMLElement;
                    if (container) {
                      container.classList.add('scrolling');
                      container.style.transform = `translateX(0px)`;
                      setTimeout(() => container.classList.remove('scrolling'), 800);
                    }
                  }}
                  src="/flecha_iz.png" 
                  alt="Página 1" 
                  className="cursor-pointer hover:scale-125 transition-transform duration-300" 
                  style={{width: '20px', height: '20px'}} />
                <img 
                  onClick={() => {
                    const container = document.querySelector('.posgrado-scroll') as HTMLElement;
                    if (container) {
                      container.classList.add('scrolling');
                      container.style.transform = `translateX(-330px)`;
                      setTimeout(() => container.classList.remove('scrolling'), 800);
                    }
                  }}
                  src="/flecha_cntro.png" 
                  alt="Página 2" 
                  className="cursor-pointer hover:scale-125 transition-transform duration-300" 
                  style={{width: '20px', height: '20px'}} />
                <img 
                  onClick={() => {
                    const container = document.querySelector('.posgrado-scroll') as HTMLElement;
                    if (container) {
                      container.classList.add('scrolling');
                      container.style.transform = `translateX(-660px)`;
                      setTimeout(() => container.classList.remove('scrolling'), 800);
                    }
                  }}
                  src="/fcha a la drechas.png" 
                  alt="Página 3" 
                  className="cursor-pointer hover:scale-125 transition-transform duration-300" 
                  style={{width: '20px', height: '20px'}} />
              </div>
            </div>
          </div>
        </div>
      </section>

 {/* Sección Quiero ser docente */}
 <section className="py-[30px] px-[50px] bg-soft-white">
        <div className="max-w-[1200px] mx-auto">
          <div className="flex items-center gap-[20px]">
            {/* Imagen del zorro docente a la izquierda */}
            <div className="flex-shrink-0 -ml-[100px] overflow-hidden rounded-[20px]">
              <img 
                src="/zorro_docnte_.png" 
                alt="Zorro docente" 
                className="w-[600px] h-[600px] object-cover scale-150"
                style={{objectPosition: 'center'}}
              />
            </div>
            
            {/* Contenido de texto a la derecha en card */}
            <div className="flex-1">
              <div className="rounded-[20px] p-[40px] shadow-2xl hover:shadow-3xl transition-all duration-500 w-[500px] h-[600px]" style={{backgroundColor: '#8ED4BE', border: '2px solid #8ED4BE', boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)'}}>
                <h2 className="text-[72px] font-bold" style={{color: '#294954', padding: '0 0 20px 0'}}>
                  Conviértete en profesor
                </h2>
                <p className="text-[18px] leading-relaxed" style={{color: '#294954', padding: '0 0 20px 0'}}>
                  Gana dinero compartiendo tus conocimientos con los estudiantes.
                  Regístrate para empezar a dar clases particulares en línea con Preply.
                </p>
                
                {/* Lista de beneficios */}
                <ul className="space-y-3" style={{padding: '0 0 40px 0'}}>
  <li className="text-[16px]" style={{color: '#294954'}}>
    <strong>Encuentra estudiantes nuevos</strong>
  </li>
  <li className="text-[16px]" style={{color: '#294954'}}>
    <strong>Haz crecer tu negocio</strong>
  </li>
  <li className="text-[16px]" style={{color: '#294954'}}>
    <strong>Recibe tus pagos sin riesgos</strong>
  </li>
</ul>

                
                {/* Botón Ver más centrado */}
                <div className="text-center">
                  <button 
                    onClick={() => window.location.href = '/ver-mas'}
                    className="text-[18px] font-semibold tracking-[0.5px] transition-colors" 
                    style={{
                      backgroundColor: '#294954', 
                      color: '#FAF9F5', 
                      padding: '12px 24px', 
                      borderRadius: '20px', 
                      border: '2px solid #294954'
                    }} 
                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#1e3a42'} 
                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#294954'}>
                    Ver más
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>


      <Footer />
    </div>
  );
};

export default Home;
