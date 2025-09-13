import React, { useState, useRef } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';

const Home: React.FC = () => {
  const [playingVideo, setPlayingVideo] = useState<number | null>(null);
  const sectionRef = useRef<HTMLElement | null>(null);
  const [showMorePreparatoria, setShowMorePreparatoria] = useState(false);
  const [showMoreUniversidad, setShowMoreUniversidad] = useState(false);
  const [showMorePosgrado, setShowMorePosgrado] = useState(false);

  const steps = [
    {
      id: 1,
      title: "Encuentra a tu profesor",
      description: "El alumno elige en la plataforma el nivel educativo y la materia que necesita, para que se le muestren los tutores disponibles.",
      image: "/buscando_zorro.png",
      color: "#A8E6CF"
    },
    {
      id: 2,
      title: "Selecciona disponibilidad",
      description: "Revisa el calendario de cada docente y selecciona el día y la hora que mejor se adapten a tus necesidades.",
      image: "/Penzando_zorro.png",
      color: "#FFD97D"
    },
    {
      id: 3,
      title: "Asiste a tu tutoría",
      description: "Conéctate a la sesión en línea a través de la herramienta de videoconferencia que ofrece la plataforma.",
      image: "/zorro_Turoria.png",
      color: "#87CEEB"
    },
    {
      id: 4,
      title: "Confirma tu asistencia",
      description: "Al finalizar la sesión, confirma tu participación directamente en la plataforma para llevar un registro de tus tutorías.",
      image: "/zorro_confiormando.png",
      color: "#DDA0DD"
    }
  ];



  return (
    <div className="min-h-screen w-full snap-y snap-mandatory overflow-y-scroll" style={{backgroundColor: '#FAF9F5', margin: 0, padding: 0}}>
      <Header />
      
      {/* Hero Section - Replicando el diseño Flutter exacto */}
      <section className="w-full  snap-start" style={{backgroundColor: '#FAF9F5'}}>
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
      {/* Sección Cómo funciona OnlyCation - Scroll Snap que ocupa toda la pantalla */}
      <section 
        ref={sectionRef} 
        className="h-[100vh] snap-start flex items-center justify-center px-[50px]" 
        style={{backgroundColor: '#FAF9F5'}}
      >
        <div className="max-w-[1400px] mx-auto w-full">
          {/* Container principal con scroll snap interno */}
          <div 
            className="h-[80vh] overflow-y-auto [&::-webkit-scrollbar]:hidden"
            style={{scrollbarWidth: 'none', msOverflowStyle: 'none'}}
          >
            {/* Snap Point 1 - Introducción */}
            <div className="h-[80vh] flex items-center justify-center">
              <div className="grid grid-cols-2 gap-[40px] items-center w-full">
                <div className="flex flex-col justify-center items-center text-center">
                  <h2 className="text-[42px] font-bold mb-6 leading-tight" style={{color: '#294954'}}>
                    La química perfecta<br />
                    para tu aprendizaje 
                  </h2>
                  <p className="text-[18px] py-[10px] px-[50px] leading-relaxed max-w-lg" style={{color: '#6B7280'}}>
                    Sigue estos pasos para reservar tu tutoría <br />
                    y aprovechar al máximo la plataforma:
                  </p>
                </div>
                <div className="flex items-center justify-center">
                  <div className="w-full h-[400px] bg-gray-100 rounded-lg flex items-center justify-center">
                    <img 
                      src="/buscando_zorro.png"
                      alt="Buscando zorro"
                      className="w-[700px] h-[700px] object-contain"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Snap Points 2-5 - Cada paso */}
            {steps.map((step) => (
              <div key={step.id} className="h-[80vh] flex items-center justify-center">
                <div className="grid grid-cols-2 gap-[40px] items-center w-full">
                  <div className="flex flex-col justify-center items-center text-center">
                    <h2 className="text-[42px] font-bold mb-6 leading-tight" style={{color: '#294954'}}>
                      Paso {step.id}<br />
                      {step.title}
                    </h2>
                    <p className="text-[18px] py-[10px] px-[50px] leading-relaxed max-w-lg" style={{color: '#6B7280'}}>
                      {step.description}
                    </p>
                  </div>
                  <div className="flex items-center justify-center">
                    <div 
                      className="rounded-[20px] p-[30px] text-center shadow-xl border border-gray-100 w-[350px] h-[450px]"
                      style={{backgroundColor: step.color}}
                    >
                      <div 
                        className="w-[60px] h-[60px] rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg"
                        style={{backgroundColor: '#294954'}}
                      >
                        <span className="text-[24px] font-bold text-white">{step.id}</span>
                      </div>
                      <h3 className="text-[20px] font-bold mb-4" style={{color: '#294954'}}>
                        {step.title}
                      </h3>
                      <p className="text-[14px] leading-relaxed mb-6" style={{color: '#294954'}}>
                        {step.description}
                      </p>
                      <div 
                        className="rounded-[15px] p-4 h-[120px] flex items-center justify-center"
                        style={{backgroundColor: 'rgba(255, 255, 255, 0.3)'}}
                      >
                        <img 
                          src={step.image}
                          alt={step.title}
                          className="w-[100px] h-[100px] object-contain"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
      {/* Sección de mejores docentes */}
      <section className="px-[20px] mb-[100px]" style={{backgroundColor: '#FAF9F5'}}>
        <div className="max-w-[1000px] mx-auto">
          <div className="text-center mb-[60px]">
            <h2 className="text-[42px] font-bold mb-4" style={{color: '#294954'}}>
              Los Mejores Docentes
            </h2>
            <p className="text-[18px] text-[#718096]">
              Descubre a nuestros tutores más destacados
            </p>
          </div>
          
          <div className="flex justify-center">
            <div className="grid grid-cols-3 gap-[100px]">
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
              <div key={index} className="group relative overflow-hidden transition-all duration-500 hover:transform hover:scale-[1.02] cursor-pointer h-[320px] flex flex-col" 
                style={{
                  backgroundColor: '#FFFFFF',
                  borderRadius: '16px',
                  boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
                  border: '1px solid rgba(0, 0, 0, 0.05)'
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
                <div className="h-[140px] relative overflow-hidden cursor-pointer" 
                  style={{
                    borderRadius: '16px 16px 0 0'
                  }}
                  onClick={() => setPlayingVideo(playingVideo === index ? null : index)}
                >
                  {playingVideo === index ? (
                    /* Video embebido */
                    <iframe
                      src={`${teacher.videoUrl}?autoplay=1&rel=0&modestbranding=1`}
                      className="w-full h-full"
                      style={{borderRadius: '16px 16px 0 0'}}
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
                
                {/* Información del docente */}
                <div className="p-4 flex-1 flex flex-col">
                  {/* Header con nombre y materia */}
                  <div className="mb-2">
                    <h3 className="text-xs font-bold mb-1 transition-colors duration-300 group-hover:text-opacity-80" 
                      style={{color: '#294954', fontFamily: 'Inter, sans-serif', padding: '5px 5px 5px 5px'}}
                    >
                      {teacher.name}
                    </h3>
                    <div className="flex items-center gap-2" style={{padding: '0 5px 5px 5px'}}>
                      <div className="w-1 h-4 rounded-full" style={{backgroundColor: '#68B2C9'}}></div>
                      <p className="text-[10px] font-semibold" style={{color: '#68B2C9'}}>
                        {teacher.subject}
                      </p>
                    </div>
                  </div>
                  
                  {/* Rating premium con animación */}
                  <div className="flex items-center gap-1 mb-2 transition-all duration-300"
                    style={{padding: '0 5px 5px 5px'}}
                  >
                    <div className="flex items-center gap-1">
                      {[1,2,3,4,5].map((star) => (
                        <span key={star} className="text-[10px] transition-all duration-300 hover:scale-125 cursor-pointer" 
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
                      <span className="text-[10px] font-bold" style={{color: '#294954'}}>
                        {teacher.rating}
                      </span>
                      <div className="w-1 h-1 rounded-full" style={{backgroundColor: '#68B2C9'}}></div>
                      <span className="text-[8px] font-medium" style={{color: '#6B7280'}}>
                        {teacher.reviews} reseñas
                      </span>
                    </div>
                  </div>
                  
                  {/* Descripción con mejor tipografía */}
                  <div className="flex-1 mb-2" style={{padding: '0 5px 5px 5px'}}>
                    <p className="text-[10px] leading-relaxed text-justify" 
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
                        border: '1px solid rgba(104, 178, 201, 0.15)',
                        boxShadow: '0 4px 12px rgba(104, 178, 201, 0.25), 0 2px 6px rgba(0, 0, 0, 0.1)'
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
            <div className="grid grid-cols-4 gap-[30px] justify-items-center" style={{padding: '20px 0'}}>
              <div className="rounded-[20px] p-[30px] shadow-xl hover:shadow-2xl transition-all duration-500 hover:scale-110 hover:-translate-y-2 w-[280px] h-[100px] flex items-center justify-between cursor-pointer border-2 border-pastel-yellow" style={{backgroundColor: '#FAF9F5'}}>
                <div className="flex items-center">
                  <div className="w-[50px] h-[50px] rounded-full flex items-center justify-center mr-4" style={{backgroundColor: '#A8E6CF'}}>
                    <span className="text-[24px]">📊</span>
                  </div>
                  <div className="flex flex-col" style={{padding: '0 0 0 20px'}}>
                    <h4 className="text-[20px] font-bold mb-1" style={{color: '#294954'}}>Matemáticas</h4>
                    <p className="text-[14px]" style={{color: '#6B7280'}}>1200 profesores</p>
                  </div>
                </div>
                <div className="text-[32px] font-bold" style={{color: '#294954'}}>
                  {'>'}
                </div>
              </div>
              <div className="rounded-[20px] p-[30px] shadow-xl hover:shadow-2xl transition-all duration-500 hover:scale-110 hover:-translate-y-2 w-[280px] h-[100px] flex items-center justify-between cursor-pointer border-2 border-pastel-yellow" style={{backgroundColor: '#FAF9F5'}}>
                <div className="flex items-center">
                  <div className="w-[50px] h-[50px] rounded-full flex items-center justify-center mr-4" style={{backgroundColor: '#8ED4BE'}}>
                    <span className="text-[24px]">🧬</span>
                  </div>
                  <div className="flex flex-col" style={{padding: '0 0 0 20px'}}>
                    <h4 className="text-[20px] font-bold mb-1" style={{color: '#294954'}}>Biología</h4>
                    <p className="text-[14px]" style={{color: '#6B7280'}}>850 profesores</p>
                  </div>
                </div>
                <div className="text-[32px] font-bold" style={{color: '#294954'}}>
                  {'>'}
                </div>
              </div>
              <div className="rounded-[20px] p-[30px] shadow-xl hover:shadow-2xl transition-all duration-500 hover:scale-110 hover:-translate-y-2 w-[280px] h-[100px] flex items-center justify-between cursor-pointer border-2 border-pastel-yellow" style={{backgroundColor: '#FAF9F5'}}>
                <div className="flex items-center">
                  <div className="w-[50px] h-[50px] rounded-full flex items-center justify-center mr-4" style={{backgroundColor: '#FFDE97'}}>
                    <span className="text-[24px]">🏛️</span>
                  </div>
                  <div className="flex flex-col" style={{padding: '0 0 0 20px'}}>
                    <h4 className="text-[20px] font-bold mb-1" style={{color: '#294954'}}>Historia</h4>
                    <p className="text-[14px]" style={{color: '#6B7280'}}>720 profesores</p>
                  </div>
                </div>
                <div className="text-[32px] font-bold" style={{color: '#294954'}}>
                  {'>'}
                </div>
              </div>
              <div className="rounded-[20px] p-[30px] shadow-xl hover:shadow-2xl transition-all duration-500 hover:scale-110 hover:-translate-y-2 w-[280px] h-[100px] flex items-center justify-between cursor-pointer border-2 border-pastel-yellow" style={{backgroundColor: '#FAF9F5'}}>
                <div className="flex items-center">
                  <div className="w-[50px] h-[50px] rounded-full flex items-center justify-center mr-4" style={{backgroundColor: '#FF9978'}}>
                    <span className="text-[24px]">📚</span>
                  </div>
                  <div className="flex flex-col" style={{padding: '0 0 0 20px'}}>
                    <h4 className="text-[20px] font-bold mb-1" style={{color: '#294954'}}>Lengua y Literatura</h4>
                    <p className="text-[14px]" style={{color: '#6B7280'}}>950 profesores</p>
                  </div>
                </div>
                <div className="text-[32px] font-bold" style={{color: '#294954'}}>
                  {'>'}
                </div>
              </div>
              <div className="rounded-[20px] p-[30px] shadow-xl hover:shadow-2xl transition-all duration-500 hover:scale-110 hover:-translate-y-2 w-[280px] h-[100px] flex items-center justify-between cursor-pointer border-2 border-pastel-yellow" style={{backgroundColor: '#FAF9F5'}}>
                <div className="flex items-center">
                  <div className="w-[50px] h-[50px] rounded-full flex items-center justify-center mr-4" style={{backgroundColor: '#68B2C9'}}>
                    <span className="text-[24px]">⚗️</span>
                  </div>
                  <div className="flex flex-col" style={{padding: '0 0 0 20px'}}>
                    <h4 className="text-[20px] font-bold mb-1" style={{color: '#294954'}}>Química</h4>
                    <p className="text-[14px]" style={{color: '#6B7280'}}>680 profesores</p>
                  </div>
                </div>
                <div className="text-[32px] font-bold" style={{color: '#294954'}}>
                  {'>'}
                </div>
              </div>
              <div className="rounded-[20px] p-[30px] shadow-xl hover:shadow-2xl transition-all duration-500 hover:scale-110 hover:-translate-y-2 w-[280px] h-[100px] flex items-center justify-between cursor-pointer border-2 border-pastel-yellow" style={{backgroundColor: '#FAF9F5'}}>
                <div className="flex items-center">
                  <div className="w-[50px] h-[50px] rounded-full flex items-center justify-center mr-4" style={{backgroundColor: '#294954'}}>
                    <span className="text-[24px] text-white">🌍</span>
                  </div>
                  <div className="flex flex-col" style={{padding: '0 0 0 20px'}}>
                    <h4 className="text-[20px] font-bold mb-1" style={{color: '#294954'}}>Geografía</h4>
                    <p className="text-[14px]" style={{color: '#6B7280'}}>540 profesores</p>
                  </div>
                </div>
                <div className="text-[32px] font-bold" style={{color: '#294954'}}>
                  {'>'}
                </div>
              </div>
              <div className="rounded-[20px] p-[30px] shadow-xl hover:shadow-2xl transition-all duration-500 hover:scale-110 hover:-translate-y-2 w-[280px] h-[100px] flex items-center justify-between cursor-pointer border-2 border-pastel-yellow" style={{backgroundColor: '#FAF9F5'}}>
                <div className="flex items-center">
                  <div className="w-[50px] h-[50px] rounded-full flex items-center justify-center mr-4" style={{backgroundColor: '#294954'}}>
                    <span className="text-[24px] text-white">🌍</span>
                  </div>
                  <div className="flex flex-col" style={{padding: '0 0 0 20px'}}>
                    <h4 className="text-[20px] font-bold mb-1" style={{color: '#294954'}}>Geografía</h4>
                    <p className="text-[14px]" style={{color: '#6B7280'}}>540 profesores</p>
                  </div>
                </div>
                <div className="text-[32px] font-bold" style={{color: '#294954'}}>
                  {'>'}
                </div>
              </div>
              <div className="rounded-[20px] p-[30px] shadow-xl hover:shadow-2xl transition-all duration-500 hover:scale-110 hover:-translate-y-2 w-[280px] h-[100px] flex items-center justify-between cursor-pointer border-2 border-pastel-yellow" style={{backgroundColor: '#FAF9F5'}}>
                <div className="flex items-center">
                  <div className="w-[50px] h-[50px] rounded-full flex items-center justify-center mr-4" style={{backgroundColor: '#294954'}}>
                    <span className="text-[24px] text-white">🌍</span>
                  </div>
                  <div className="flex flex-col" style={{padding: '0 0 0 20px'}}>
                    <h4 className="text-[20px] font-bold mb-1" style={{color: '#294954'}}>Geografía</h4>
                    <p className="text-[14px]" style={{color: '#6B7280'}}>540 profesores</p>
                  </div>
                </div>
                <div className="text-[32px] font-bold" style={{color: '#294954'}}>
                  {'>'}
                </div>
              </div>
            </div>
            
            {/* Materias adicionales de Preparatoria */}
            {showMorePreparatoria && (
              <div className="grid grid-cols-4 gap-[30px] justify-items-center mb-6" style={{padding: '20px 0'}}>
                <div className="rounded-[20px] p-[30px] shadow-xl hover:shadow-2xl transition-all duration-500 hover:scale-110 hover:-translate-y-2 w-[280px] h-[100px] flex items-center justify-between cursor-pointer border-2 border-pastel-yellow" style={{backgroundColor: '#FAF9F5'}}>
                  <div className="flex items-center">
                    <div className="w-[50px] h-[50px] rounded-full flex items-center justify-center mr-4" style={{backgroundColor: '#FFB6C1'}}>
                      <span className="text-[24px]">🎨</span>
                    </div>
                    <div className="flex flex-col" style={{padding: '0 0 0 20px'}}>
                      <h4 className="text-[20px] font-bold mb-1" style={{color: '#294954'}}>Arte y Cultura</h4>
                      <p className="text-[14px]" style={{color: '#6B7280'}}>420 profesores</p>
                    </div>
                  </div>
                  <div className="text-[32px] font-bold" style={{color: '#294954'}}>
                    {'>'}
                  </div>
                </div>
                <div className="rounded-[20px] p-[30px] shadow-xl hover:shadow-2xl transition-all duration-500 hover:scale-110 hover:-translate-y-2 w-[280px] h-[100px] flex items-center justify-between cursor-pointer border-2 border-pastel-yellow" style={{backgroundColor: '#FAF9F5'}}>
                  <div className="flex items-center">
                    <div className="w-[50px] h-[50px] rounded-full flex items-center justify-center mr-4" style={{backgroundColor: '#DDA0DD'}}>
                      <span className="text-[24px]">🏃</span>
                    </div>
                    <div className="flex flex-col" style={{padding: '0 0 0 20px'}}>
                      <h4 className="text-[20px] font-bold mb-1" style={{color: '#294954'}}>Educación Física</h4>
                      <p className="text-[14px]" style={{color: '#6B7280'}}>380 profesores</p>
                    </div>
                  </div>
                  <div className="text-[32px] font-bold" style={{color: '#294954'}}>
                    {'>'}
                  </div>
                </div>
                <div className="rounded-[20px] p-[30px] shadow-xl hover:shadow-2xl transition-all duration-500 hover:scale-110 hover:-translate-y-2 w-[280px] h-[100px] flex items-center justify-between cursor-pointer border-2 border-pastel-yellow" style={{backgroundColor: '#FAF9F5'}}>
                  <div className="flex items-center">
                    <div className="w-[50px] h-[50px] rounded-full flex items-center justify-center mr-4" style={{backgroundColor: '#98FB98'}}>
                      <span className="text-[24px]">🌱</span>
                    </div>
                    <div className="flex flex-col" style={{padding: '0 0 0 20px'}}>
                      <h4 className="text-[20px] font-bold mb-1" style={{color: '#294954'}}>Ciencias Naturales</h4>
                      <p className="text-[14px]" style={{color: '#6B7280'}}>590 profesores</p>
                    </div>
                  </div>
                  <div className="text-[32px] font-bold" style={{color: '#294954'}}>
                    {'>'}
                  </div>
                </div>
                <div className="rounded-[20px] p-[30px] shadow-xl hover:shadow-2xl transition-all duration-500 hover:scale-110 hover:-translate-y-2 w-[280px] h-[100px] flex items-center justify-between cursor-pointer border-2 border-pastel-yellow" style={{backgroundColor: '#FAF9F5'}}>
                  <div className="flex items-center">
                    <div className="w-[50px] h-[50px] rounded-full flex items-center justify-center mr-4" style={{backgroundColor: '#F0E68C'}}>
                      <span className="text-[24px]">🌍</span>
                    </div>
                    <div className="flex flex-col" style={{padding: '0 0 0 20px'}}>
                      <h4 className="text-[20px] font-bold mb-1" style={{color: '#294954'}}>Inglés</h4>
                      <p className="text-[14px]" style={{color: '#6B7280'}}>820 profesores</p>
                    </div>
                  </div>
                  <div className="text-[32px] font-bold" style={{color: '#294954'}}>
                    {'>'}
                  </div>
                </div>
              </div>
            )}
            
            {/* Botón Ver más/menos para Preparatoria */}
            <div className="text-center">
              <button 
                onClick={() => setShowMorePreparatoria(!showMorePreparatoria)}
                className="text-[18px] font-semibold tracking-[0.5px] transition-colors"
                style={{
                  backgroundColor: '#294954',
                  color: '#FAF9F5',
                  padding: '10px',
                  borderRadius: '20px',
                  border: '2px solid #294954'
                }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#1e3a42'}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#294954'}
              >
                {showMorePreparatoria ? 'Ver menos' : 'Ver más materias'}
              </button>
            </div>
          </div>

          {/* Universidad */}
          <div className="mb-[80px]">
            <h3 className="text-[32px] font-bold mb-8 text-center text-white drop-shadow-lg">
              Universidad
            </h3>
            <div className="grid grid-cols-4 gap-[30px] justify-items-center" style={{padding: '20px 0'}}>
              <div className="rounded-[20px] p-[30px] shadow-xl hover:shadow-2xl transition-all duration-500 hover:scale-110 hover:-translate-y-2 w-[280px] h-[100px] flex items-center justify-between cursor-pointer border-2 border-pastel-yellow" style={{backgroundColor: '#FAF9F5'}}>
                <div className="flex items-center">
                  <div className="w-[50px] h-[50px] rounded-full flex items-center justify-center mr-4" style={{backgroundColor: '#A8E6CF'}}>
                    <span className="text-[24px]">📊</span>
                  </div>
                  <div className="flex flex-col" style={{padding: '0 0 0 20px'}}>
                    <h4 className="text-[20px] font-bold mb-1" style={{color: '#294954'}}>Cálculo y Estadística</h4>
                    <p className="text-[14px]" style={{color: '#6B7280'}}>890 profesores</p>
                  </div>
                </div>
                <div className="text-[32px] font-bold" style={{color: '#294954'}}>
                  {'>'}
                </div>
              </div>
              <div className="rounded-[20px] p-[30px] shadow-xl hover:shadow-2xl transition-all duration-500 hover:scale-110 hover:-translate-y-2 w-[280px] h-[100px] flex items-center justify-between cursor-pointer border-2 border-pastel-yellow" style={{backgroundColor: '#FAF9F5'}}>
                <div className="flex items-center">
                  <div className="w-[50px] h-[50px] rounded-full flex items-center justify-center mr-4" style={{backgroundColor: '#FFDE97'}}>
                    <span className="text-[24px]">💰</span>
                  </div>
                  <div className="flex flex-col" style={{padding: '0 0 0 20px'}}>
                    <h4 className="text-[20px] font-bold mb-1" style={{color: '#294954'}}>Economía</h4>
                    <p className="text-[14px]" style={{color: '#6B7280'}}>650 profesores</p>
                  </div>
                </div>
                <div className="text-[32px] font-bold" style={{color: '#294954'}}>
                  {'>'}
                </div>
              </div>
              <div className="rounded-[20px] p-[30px] shadow-xl hover:shadow-2xl transition-all duration-500 hover:scale-110 hover:-translate-y-2 w-[280px] h-[100px] flex items-center justify-between cursor-pointer border-2 border-pastel-yellow" style={{backgroundColor: '#FAF9F5'}}>
                <div className="flex items-center">
                  <div className="w-[50px] h-[50px] rounded-full flex items-center justify-center mr-4" style={{backgroundColor: '#294954'}}>
                    <span className="text-[24px] text-white">⚖️</span>
                  </div>
                  <div className="flex flex-col" style={{padding: '0 0 0 20px'}}>
                    <h4 className="text-[20px] font-bold mb-1" style={{color: '#294954'}}>Derecho</h4>
                    <p className="text-[14px]" style={{color: '#6B7280'}}>780 profesores</p>
                  </div>
                </div>
                <div className="text-[32px] font-bold" style={{color: '#294954'}}>
                  {'>'}
                </div>
              </div>
              <div className="rounded-[20px] p-[30px] shadow-xl hover:shadow-2xl transition-all duration-500 hover:scale-110 hover:-translate-y-2 w-[280px] h-[100px] flex items-center justify-between cursor-pointer border-2 border-pastel-yellow" style={{backgroundColor: '#FAF9F5'}}>
                <div className="flex items-center">
                  <div className="w-[50px] h-[50px] rounded-full flex items-center justify-center mr-4" style={{backgroundColor: '#68B2C9'}}>
                    <span className="text-[24px]">💻</span>
                  </div>
                  <div className="flex flex-col" style={{padding: '0 0 0 20px'}}>
                    <h4 className="text-[20px] font-bold mb-1" style={{color: '#294954'}}>Ingeniería de Software</h4>
                    <p className="text-[14px]" style={{color: '#6B7280'}}>1150 profesores</p>
                  </div>
                </div>
                <div className="text-[32px] font-bold" style={{color: '#294954'}}>
                  {'>'}
                </div>
              </div>
              <div className="rounded-[20px] p-[30px] shadow-xl hover:shadow-2xl transition-all duration-500 hover:scale-110 hover:-translate-y-2 w-[280px] h-[100px] flex items-center justify-between cursor-pointer border-2 border-pastel-yellow" style={{backgroundColor: '#FAF9F5'}}>
                <div className="flex items-center">
                  <div className="w-[50px] h-[50px] rounded-full flex items-center justify-center mr-4" style={{backgroundColor: '#FF9978'}}>
                    <span className="text-[24px]">🧠</span>
                  </div>
                  <div className="flex flex-col" style={{padding: '0 0 0 20px'}}>
                    <h4 className="text-[20px] font-bold mb-1" style={{color: '#294954'}}>Psicología General</h4>
                    <p className="text-[14px]" style={{color: '#6B7280'}}>620 profesores</p>
                  </div>
                </div>
                <div className="text-[32px] font-bold" style={{color: '#294954'}}>
                  {'>'}
                </div>
              </div>
              <div className="rounded-[20px] p-[30px] shadow-xl hover:shadow-2xl transition-all duration-500 hover:scale-110 hover:-translate-y-2 w-[280px] h-[100px] flex items-center justify-between cursor-pointer border-2 border-pastel-yellow" style={{backgroundColor: '#FAF9F5'}}>
                <div className="flex items-center">
                  <div className="w-[50px] h-[50px] rounded-full flex items-center justify-center mr-4" style={{backgroundColor: '#8ED4BE'}}>
                    <span className="text-[24px]">📢</span>
                  </div>
                  <div className="flex flex-col" style={{padding: '0 0 0 20px'}}>
                    <h4 className="text-[20px] font-bold mb-1" style={{color: '#294954'}}>Comunicación</h4>
                    <p className="text-[14px]" style={{color: '#6B7280'}}>480 profesores</p>
                  </div>
                </div>
                <div className="text-[32px] font-bold" style={{color: '#294954'}}>
                  {'>'}
                </div>
              </div>
            </div>
            
            {/* Materias adicionales de Universidad */}
            {showMoreUniversidad && (
              <div className="grid grid-cols-4 gap-[30px] justify-items-center mb-6" style={{padding: '20px 0'}}>
                <div className="rounded-[20px] p-[30px] shadow-xl hover:shadow-2xl transition-all duration-500 hover:scale-110 hover:-translate-y-2 w-[280px] h-[100px] flex items-center justify-between cursor-pointer border-2 border-pastel-yellow" style={{backgroundColor: '#FAF9F5'}}>
                  <div className="flex items-center">
                    <div className="w-[50px] h-[50px] rounded-full flex items-center justify-center mr-4" style={{backgroundColor: '#FFB6C1'}}>
                      <span className="text-[24px]">🎭</span>
                    </div>
                    <div className="flex flex-col" style={{padding: '0 0 0 20px'}}>
                      <h4 className="text-[20px] font-bold mb-1" style={{color: '#294954'}}>Arte y Diseño</h4>
                      <p className="text-[14px]" style={{color: '#6B7280'}}>340 profesores</p>
                    </div>
                  </div>
                  <div className="text-[32px] font-bold" style={{color: '#294954'}}>
                    {'>'}
                  </div>
                </div>
                <div className="rounded-[20px] p-[30px] shadow-xl hover:shadow-2xl transition-all duration-500 hover:scale-110 hover:-translate-y-2 w-[280px] h-[100px] flex items-center justify-between cursor-pointer border-2 border-pastel-yellow" style={{backgroundColor: '#FAF9F5'}}>
                  <div className="flex items-center">
                    <div className="w-[50px] h-[50px] rounded-full flex items-center justify-center mr-4" style={{backgroundColor: '#DDA0DD'}}>
                      <span className="text-[24px]">🏥</span>
                    </div>
                    <div className="flex flex-col" style={{padding: '0 0 0 20px'}}>
                      <h4 className="text-[20px] font-bold mb-1" style={{color: '#294954'}}>Medicina</h4>
                      <p className="text-[14px]" style={{color: '#6B7280'}}>920 profesores</p>
                    </div>
                  </div>
                  <div className="text-[32px] font-bold" style={{color: '#294954'}}>
                    {'>'}
                  </div>
                </div>
                <div className="rounded-[20px] p-[30px] shadow-xl hover:shadow-2xl transition-all duration-500 hover:scale-110 hover:-translate-y-2 w-[280px] h-[100px] flex items-center justify-between cursor-pointer border-2 border-pastel-yellow" style={{backgroundColor: '#FAF9F5'}}>
                  <div className="flex items-center">
                    <div className="w-[50px] h-[50px] rounded-full flex items-center justify-center mr-4" style={{backgroundColor: '#98FB98'}}>
                      <span className="text-[24px]">🔬</span>
                    </div>
                    <div className="flex flex-col" style={{padding: '0 0 0 20px'}}>
                      <h4 className="text-[20px] font-bold mb-1" style={{color: '#294954'}}>Ciencias Biológicas</h4>
                      <p className="text-[14px]" style={{color: '#6B7280'}}>680 profesores</p>
                    </div>
                  </div>
                  <div className="text-[32px] font-bold" style={{color: '#294954'}}>
                    {'>'}
                  </div>
                </div>
                <div className="rounded-[20px] p-[30px] shadow-xl hover:shadow-2xl transition-all duration-500 hover:scale-110 hover:-translate-y-2 w-[280px] h-[100px] flex items-center justify-between cursor-pointer border-2 border-pastel-yellow" style={{backgroundColor: '#FAF9F5'}}>
                  <div className="flex items-center">
                    <div className="w-[50px] h-[50px] rounded-full flex items-center justify-center mr-4" style={{backgroundColor: '#F0E68C'}}>
                      <span className="text-[24px]">🏗️</span>
                    </div>
                    <div className="flex flex-col" style={{padding: '0 0 0 20px'}}>
                      <h4 className="text-[20px] font-bold mb-1" style={{color: '#294954'}}>Arquitectura</h4>
                      <p className="text-[14px]" style={{color: '#6B7280'}}>450 profesores</p>
                    </div>
                  </div>
                  <div className="text-[32px] font-bold" style={{color: '#294954'}}>
                    {'>'}
                  </div>
                </div>
              </div>
            )}
            
            {/* Botón Ver más/menos para Universidad */}
            <div className="text-center">
              <button 
                onClick={() => setShowMoreUniversidad(!showMoreUniversidad)}
                className="text-[18px] font-semibold tracking-[0.5px] transition-colors"
                style={{
                  backgroundColor: '#294954',
                  color: '#FAF9F5',
                  padding: '10px',
                  borderRadius: '20px',
                  border: '2px solid #294954'
                }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#1e3a42'}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#294954'}
              >
                {showMoreUniversidad ? 'Ver menos' : 'Ver más materias'}
              </button>
            </div>
          </div>

          {/* Posgrado */}
          <div className="mb-[40px]">
            <h3 className="text-[32px] font-bold mb-8 text-center text-white drop-shadow-lg">
              Posgrado
            </h3>
            <div className="grid grid-cols-4 gap-[30px] justify-items-center" style={{padding: '20px 0'}}>
              <div className="rounded-[20px] p-[30px] shadow-xl hover:shadow-2xl transition-all duration-500 hover:scale-110 hover:-translate-y-2 w-[280px] h-[100px] flex items-center justify-between cursor-pointer border-2 border-pastel-yellow" style={{backgroundColor: '#FAF9F5'}}>
                <div className="flex items-center">
                  <div className="w-[50px] h-[50px] rounded-full flex items-center justify-center mr-4" style={{backgroundColor: '#A8E6CF'}}>
                    <span className="text-[24px]">🔍</span>
                  </div>
                  <div className="flex flex-col" style={{padding: '0 0 0 20px'}}>
                    <h4 className="text-[20px] font-bold mb-1" style={{color: '#294954'}}>Metodología de la Investigación</h4>
                    <p className="text-[14px]" style={{color: '#6B7280'}}>320 profesores</p>
                  </div>
                </div>
                <div className="text-[32px] font-bold" style={{color: '#294954'}}>
                  {'>'}
                </div>
              </div>
              <div className="rounded-[20px] p-[30px] shadow-xl hover:shadow-2xl transition-all duration-500 hover:scale-110 hover:-translate-y-2 w-[280px] h-[100px] flex items-center justify-between cursor-pointer border-2 border-pastel-yellow" style={{backgroundColor: '#FAF9F5'}}>
                <div className="flex items-center">
                  <div className="w-[50px] h-[50px] rounded-full flex items-center justify-center mr-4" style={{backgroundColor: '#2ECC71'}}>
                    <span className="text-[24px]">🏥</span>
                  </div>
                  <div className="flex flex-col" style={{padding: '0 0 0 20px'}}>
                    <h4 className="text-[20px] font-bold mb-1" style={{color: '#294954'}}>Medicina Especializada</h4>
                    <p className="text-[14px]" style={{color: '#6B7280'}}>450 profesores</p>
                  </div>
                </div>
                <div className="text-[32px] font-bold" style={{color: '#294954'}}>
                  {'>'}
                </div>
              </div>
              <div className="rounded-[20px] p-[30px] shadow-xl hover:shadow-2xl transition-all duration-500 hover:scale-110 hover:-translate-y-2 w-[280px] h-[100px] flex items-center justify-between cursor-pointer border-2 border-pastel-yellow" style={{backgroundColor: '#FAF9F5'}}>
                <div className="flex items-center">
                  <div className="w-[50px] h-[50px] rounded-full flex items-center justify-center mr-4" style={{backgroundColor: '#FF6B6B'}}>
                    <span className="text-[24px]">🔬</span>
                  </div>
                  <div className="flex flex-col" style={{padding: '0 0 0 20px'}}>
                    <h4 className="text-[20px] font-bold mb-1" style={{color: '#294954'}}>Investigación Avanzada</h4>
                    <p className="text-[14px]" style={{color: '#6B7280'}}>280 profesores</p>
                  </div>
                </div>
                <div className="text-[32px] font-bold" style={{color: '#294954'}}>
                  {'>'}
                </div>
              </div>
              <div className="rounded-[20px] p-[30px] shadow-xl hover:shadow-2xl transition-all duration-500 hover:scale-110 hover:-translate-y-2 w-[280px] h-[100px] flex items-center justify-between cursor-pointer border-2 border-pastel-yellow" style={{backgroundColor: '#FAF9F5'}}>
                <div className="flex items-center">
                  <div className="w-[50px] h-[50px] rounded-full flex items-center justify-center mr-4" style={{backgroundColor: '#68B2C9'}}>
                    <span className="text-[24px]">📊</span>
                  </div>
                  <div className="flex flex-col" style={{padding: '0 0 0 20px'}}>
                    <h4 className="text-[20px] font-bold mb-1" style={{color: '#294954'}}>Análisis de Datos Avanzado</h4>
                    <p className="text-[14px]" style={{color: '#6B7280'}}>380 profesores</p>
                  </div>
                </div>
                <div className="text-[32px] font-bold" style={{color: '#294954'}}>
                  {'>'}
                </div>
              </div>
              <div className="rounded-[20px] p-[30px] shadow-xl hover:shadow-2xl transition-all duration-500 hover:scale-110 hover:-translate-y-2 w-[280px] h-[100px] flex items-center justify-between cursor-pointer border-2 border-pastel-yellow" style={{backgroundColor: '#FAF9F5'}}>
                <div className="flex items-center">
                  <div className="w-[50px] h-[50px] rounded-full flex items-center justify-center mr-4" style={{backgroundColor: '#FF9978'}}>
                    <span className="text-[24px]">🏦</span>
                  </div>
                  <div className="flex flex-col" style={{padding: '0 0 0 20px'}}>
                    <h4 className="text-[20px] font-bold mb-1" style={{color: '#294954'}}>Políticas Públicas</h4>
                    <p className="text-[14px]" style={{color: '#6B7280'}}>220 profesores</p>
                  </div>
                </div>
                <div className="text-[32px] font-bold" style={{color: '#294954'}}>
                  {'>'}
                </div>
              </div>
              <div className="rounded-[20px] p-[30px] shadow-xl hover:shadow-2xl transition-all duration-500 hover:scale-110 hover:-translate-y-2 w-[280px] h-[100px] flex items-center justify-between cursor-pointer border-2 border-pastel-yellow" style={{backgroundColor: '#FAF9F5'}}>
                <div className="flex items-center">
                  <div className="w-[50px] h-[50px] rounded-full flex items-center justify-center mr-4" style={{backgroundColor: '#294954'}}>
                    <span className="text-[24px] text-white">📈</span>
                  </div>
                  <div className="flex flex-col" style={{padding: '0 0 0 20px'}}>
                    <h4 className="text-[20px] font-bold mb-1" style={{color: '#294954'}}>Finanzas Corporativas</h4>
                    <p className="text-[14px]" style={{color: '#6B7280'}}>340 profesores</p>
                  </div>
                </div>
                <div className="text-[32px] font-bold" style={{color: '#294954'}}>
                  {'>'}
                </div>
              </div>
              <div className="rounded-[20px] p-[30px] shadow-xl hover:shadow-2xl transition-all duration-500 hover:scale-110 hover:-translate-y-2 w-[280px] h-[100px] flex items-center justify-between cursor-pointer border-2 border-pastel-yellow" style={{backgroundColor: '#FAF9F5'}}>
                <div className="flex items-center">
                  <div className="w-[50px] h-[50px] rounded-full flex items-center justify-center mr-4" style={{backgroundColor: '#9B59B6'}}>
                    <span className="text-[24px] text-white">📚</span>
                  </div>
                  <div className="flex flex-col" style={{padding: '0 0 0 20px'}}>
                    <h4 className="text-[20px] font-bold mb-1" style={{color: '#294954'}}>Doctorado en Educación</h4>
                    <p className="text-[14px]" style={{color: '#6B7280'}}>180 profesores</p>
                  </div>
                </div>
                <div className="text-[32px] font-bold" style={{color: '#294954'}}>
                  {'>'}
                </div>
              </div>
            </div>
            
            {/* Materias adicionales de Posgrado */}
            {showMorePosgrado && (
              <div className="grid grid-cols-4 gap-[30px] justify-items-center mb-6" style={{padding: '20px 0'}}>
                <div className="rounded-[20px] p-[30px] shadow-xl hover:shadow-2xl transition-all duration-500 hover:scale-110 hover:-translate-y-2 w-[280px] h-[100px] flex items-center justify-between cursor-pointer border-2 border-pastel-yellow" style={{backgroundColor: '#FAF9F5'}}>
                  <div className="flex items-center">
                    <div className="w-[50px] h-[50px] rounded-full flex items-center justify-center mr-4" style={{backgroundColor: '#FFB6C1'}}>
                      <span className="text-[24px]">🎓</span>
                    </div>
                    <div className="flex flex-col" style={{padding: '0 0 0 20px'}}>
                      <h4 className="text-[20px] font-bold mb-1" style={{color: '#294954'}}>Doctorado en Filosofía</h4>
                      <p className="text-[14px]" style={{color: '#6B7280'}}>120 profesores</p>
                    </div>
                  </div>
                  <div className="text-[32px] font-bold" style={{color: '#294954'}}>
                    {'>'}
                  </div>
                </div>
                <div className="rounded-[20px] p-[30px] shadow-xl hover:shadow-2xl transition-all duration-500 hover:scale-110 hover:-translate-y-2 w-[280px] h-[100px] flex items-center justify-between cursor-pointer border-2 border-pastel-yellow" style={{backgroundColor: '#FAF9F5'}}>
                  <div className="flex items-center">
                    <div className="w-[50px] h-[50px] rounded-full flex items-center justify-center mr-4" style={{backgroundColor: '#DDA0DD'}}>
                      <span className="text-[24px]">🧪</span>
                    </div>
                    <div className="flex flex-col" style={{padding: '0 0 0 20px'}}>
                      <h4 className="text-[20px] font-bold mb-1" style={{color: '#294954'}}>Biotecnología Avanzada</h4>
                      <p className="text-[14px]" style={{color: '#6B7280'}}>95 profesores</p>
                    </div>
                  </div>
                  <div className="text-[32px] font-bold" style={{color: '#294954'}}>
                    {'>'}
                  </div>
                </div>
                <div className="rounded-[20px] p-[30px] shadow-xl hover:shadow-2xl transition-all duration-500 hover:scale-110 hover:-translate-y-2 w-[280px] h-[100px] flex items-center justify-between cursor-pointer border-2 border-pastel-yellow" style={{backgroundColor: '#FAF9F5'}}>
                  <div className="flex items-center">
                    <div className="w-[50px] h-[50px] rounded-full flex items-center justify-center mr-4" style={{backgroundColor: '#98FB98'}}>
                      <span className="text-[24px]">🌐</span>
                    </div>
                    <div className="flex flex-col" style={{padding: '0 0 0 20px'}}>
                      <h4 className="text-[20px] font-bold mb-1" style={{color: '#294954'}}>Relaciones Internacionales</h4>
                      <p className="text-[14px]" style={{color: '#6B7280'}}>160 profesores</p>
                    </div>
                  </div>
                  <div className="text-[32px] font-bold" style={{color: '#294954'}}>
                    {'>'}
                  </div>
                </div>
                <div className="rounded-[20px] p-[30px] shadow-xl hover:shadow-2xl transition-all duration-500 hover:scale-110 hover:-translate-y-2 w-[280px] h-[100px] flex items-center justify-between cursor-pointer border-2 border-pastel-yellow" style={{backgroundColor: '#FAF9F5'}}>
                  <div className="flex items-center">
                    <div className="w-[50px] h-[50px] rounded-full flex items-center justify-center mr-4" style={{backgroundColor: '#F0E68C'}}>
                      <span className="text-[24px]">🤖</span>
                    </div>
                    <div className="flex flex-col" style={{padding: '0 0 0 20px'}}>
                      <h4 className="text-[20px] font-bold mb-1" style={{color: '#294954'}}>Inteligencia Artificial</h4>
                      <p className="text-[14px]" style={{color: '#6B7280'}}>240 profesores</p>
                    </div>
                  </div>
                  <div className="text-[32px] font-bold" style={{color: '#294954'}}>
                    {'>'}
                  </div>
                </div>
              </div>
            )}
            
            {/* Botón Ver más/menos para Posgrado */}
            <div className="text-center">
              <button 
                onClick={() => setShowMorePosgrado(!showMorePosgrado)}
                className="text-[18px] font-semibold tracking-[0.5px] transition-colors"
                style={{
                  backgroundColor: '#294954',
                  color: '#FAF9F5',
                  padding: '10px',
                  borderRadius: '20px',
                  border: '2px solid #294954'
                }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#1e3a42'}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#294954'}
              >
                {showMorePosgrado ? 'Ver menos' : 'Ver más materias'}
              </button>
            </div>
          </div>
        </div>
      </section>

 {/* Sección Quiero ser docente */}
 <section className="py-[30px] px-[50px] bg-soft-white">
        <div className="max-w-[1200px] mx-auto">
          <div className="flex items-center gap-[10px]">
            {/* Imagen del zorro docente a la izquierda */}
            <div className="flex-shrink-0 -ml-[50px] overflow-hidden rounded-[20px]">
              <img 
                src="/zorro_docnte_.png" 
                alt="Zorro docente" 
                className="w-[600px] h-[600px] object-cover scale-150"
                style={{objectPosition: 'center'}}
              />
            </div>
            
            {/* Contenido de texto a la derecha en card */}
            <div className="flex-1 ">
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

      {/* Sección Conviértete en estudiante */}
      <section className="py-[80px] px-[50px] bg-soft-white">
        <div className="max-w-[1200px] mx-auto">
          <div className="flex items-center gap-[10px]">
            {/* Contenido de texto a la izquierda en card */}
            <div className="flex-1 " style={{padding: '0 0 0 120px'}}>
              <div className="rounded-[20px] p-[40px] shadow-2xl hover:shadow-3xl transition-all duration-500 w-[500px] h-[600px]" style={{backgroundColor: '#FFD97D', border: '2px solid #FFD97D', boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)'}}>
                <h2 className="text-[72px] font-bold" style={{color: '#294954', padding: '0 0 20px 0'}}>
                  Conviértete en estudiante
                </h2>
                <p className="text-[18px] leading-relaxed" style={{color: '#294954', padding: '0 0 20px 0'}}>
                  Aprende nuevas habilidades y mejora tus conocimientos con la ayuda de tutores en línea. 
                  Regístrate y empieza a recibir clases personalizadas en Preply.
                </p>
                
                {/* Lista de beneficios */}
                <ul className="space-y-3" style={{padding: '0 0 40px 0'}}>
                  <li className="text-[16px]" style={{color: '#294954'}}>
                    <strong>Encuentra profesores expertos</strong>
                  </li>
                  <li className="text-[16px]" style={{color: '#294954'}}>
                    <strong>Aprende a tu propio ritmo</strong>
                  </li>
                  <li className="text-[16px]" style={{color: '#294954'}}>
                    <strong>Usa la herramienta de videoconferencia integrada</strong>
                  </li>
                  <li className="text-[16px]" style={{color: '#294954'}}>
                    <strong>Paga de forma segura y sin riesgos</strong>
                  </li>
                </ul>

                {/* Botón Ver más centrado */}
                <div className="text-center">
                  <button 
                    onClick={() => window.location.href = '/estudiante'}
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
            
            {/* Imagen del zorro estudiante a la derecha */}
            <div className="flex-shrink-0 -mr-[50px] overflow-hidden rounded-[20px]">
              <img 
                src="/buscando_zorro.png" 
                alt="Zorro estudiante" 
                className="w-[600px] h-[600px] object-cover scale-150"
                style={{objectPosition: 'center'}}
              />
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Home;
