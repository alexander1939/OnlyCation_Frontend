import React, { useState } from 'react';

interface Teacher {
  name: string;
  subject: string;
  price: string;
  rating: number;
  reviews: number;
  description: string;
  videoUrl: string;
}

const TeachersSection: React.FC = () => {
  const [playingVideo, setPlayingVideo] = useState<number | null>(null);

  const teachers: Teacher[] = [
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
  ];

  return (
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
          {teachers.map((teacher, index) => (
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
  );
};

export default TeachersSection;
