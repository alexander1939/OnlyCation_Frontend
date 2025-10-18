import React, { useState } from 'react';
import '../../styles/TeachersSection.css';

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
          <div className="cards-container">
          {teachers.map((teacher, index) => (
            <div key={index} className="teacher-card">
              <div className="teacher-card-content">
                {/* Sección del video */}
                <div className="video-section" onClick={() => setPlayingVideo(playingVideo === index ? null : index)}>
                  <div className="video-container">
                    {playingVideo === index ? (
                      <iframe
                        src={`${teacher.videoUrl}?autoplay=1&rel=0&modestbranding=1`}
                        className="w-full h-full"
                        style={{borderRadius: '16px'}}
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                        title={`Video de ${teacher.name}`}
                      />
                    ) : (
                      <>
                        <img 
                          src={`https://img.youtube.com/vi/${teacher.videoUrl.split('/embed/')[1]}/maxresdefault.jpg`}
                          alt={`Video de ${teacher.name}`}
                          className="video-thumbnail"
                        />
                        <div className="video-overlay"></div>
                        <div className="play-button">
                          <div className="play-icon"></div>
                        </div>
                        <div className="video-badge">
                          <div className="video-badge-dot"></div>
                          <span className="video-badge-text">Video</span>
                        </div>
                      </>
                    )}
                  </div>
                </div>
                
                {/* Sección de información */}
                <div className="info-section">
                  <h3 className="teacher-name">{teacher.name}</h3>
                  
                  <div className="teacher-subject">
                    <div className="subject-dot"></div>
                    <p className="subject-text">{teacher.subject}</p>
                  </div>
                  
                  <div className="rating-section">
                    <div className="stars">
                      {[1,2,3,4,5].map((star) => (
                        <span key={star} className={`star ${star <= Math.floor(teacher.rating) ? 'filled' : ''}`}>
                          ★
                        </span>
                      ))}
                    </div>
                    <span className="rating-number">{teacher.rating}</span>
                    <span className="rating-reviews">({teacher.reviews} reseñas)</span>
                  </div>
                  
                  <div className="teacher-description">
                    <p>{teacher.description}</p>
                  </div>
                  
                  <div className="additional-info">
                    <div className="info-item">
                      <div className="info-dot"></div>
                      <span className="info-text">Clases online disponibles</span>
                    </div>
                    <div className="info-item">
                      <div className="info-dot"></div>
                      <span className="info-text">Respuesta rápida</span>
                    </div>
                    <div className="info-item">
                      <div className="info-dot"></div>
                      <span className="info-text">Primera clase gratis</span>
                    </div>
                  </div>
                  
                  <div className="price-section">
                    <div className="price-badge">
                      <p className="price-text">{teacher.price}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
          </div>
        </div>
        
        {/* Botón Ver más centrado */}
        <div className="text-center mt-[60px]">
          <a 
            href="/teachers"
            className="inline-block text-[18px] font-semibold tracking-[0.5px] transition-colors" 
            style={{
              backgroundColor: '#294954', 
              color: '#FAF9F5', 
              padding: '12px 24px', 
              borderRadius: '20px', 
              border: '2px solid #294954',
              textDecoration: 'none',
              cursor: 'pointer'
            }} 
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#1e3a42'} 
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#294954'}>
            Ver más docentes
          </a>
        </div>
      </div>
    </section>
  );
};

export default TeachersSection;
