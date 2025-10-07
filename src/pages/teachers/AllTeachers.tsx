import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../../styles/AllTeachers.css';

// Tipos de datos
interface Teacher {
  id: string;
  name: string;
  subject: string;
  price: string;
  rating: number;
  reviews: number;
  description: string;
  image: string;
  videoUrl: string;
  experience: number;
  university: string;
  degree: string;
}

const AllTeachers: React.FC = () => {
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSubject, setSelectedSubject] = useState('todos');
  const [isLoading, setIsLoading] = useState(true);
  const [playingVideo, setPlayingVideo] = useState<string | null>(null);
  
  // Materias disponibles
  const subjects = [
    'todos', 
    'matemáticas', 
    'inglés', 
    'química', 
    'programación', 
    'física', 
    'literatura',
    'biología',
    'historia',
    'economía'
  ];

  // Generar datos de prueba realistas
  useEffect(() => {
    const generateMockTeachers = async () => {
      try {
        // Obtener datos de la API de Random User
        const response = await fetch('https://randomuser.me/api/?results=12&nat=es');
        const data = await response.json();
        
        const mockTeachers = data.results.map((user: any, index: number) => {
          // Generar materias aleatorias
          const subjectIndex = Math.floor(Math.random() * (subjects.length - 1)) + 1;
          const subject = subjects[subjectIndex];
          
          // Generar precios realistas basados en la materia
          const basePrice = {
            'matemáticas': 350,
            'inglés': 300,
            'química': 400,
            'programación': 450,
            'física': 380,
            'literatura': 320,
            'biología': 370,
            'historia': 300,
            'economía': 390
          }[subject] || 350;
          
          // Añadir variación al precio
          const price = basePrice + Math.floor(Math.random() * 100) - 20;
          
          // Generar rating realista (entre 4.0 y 5.0)
          const rating = Number((4 + Math.random()).toFixed(1));
          
          // Generar número de reseñas realista
          const reviews = Math.floor(Math.random() * 200) + 50;
          
          // Experiencia en años
          const experience = Math.floor(Math.random() * 15) + 3;
          
          // Universidades
          const universities = [
            'UNAM', 'IPN', 'UAM', 'Tec de Monterrey', 'UANL', 'UDG', 'UABC', 'UANL', 'UNAM', 'IPN'
          ];
          
          // Grados académicos
          const degrees = [
            'Licenciatura', 'Maestría', 'Doctorado', 'Especialidad'
          ];
          
          // Títulos profesionales según la materia
          const titles: Record<string, string> = {
            'matemáticas': 'Matemáticas',
            'inglés': 'Lenguas Extranjeras',
            'química': 'Química',
            'programación': 'Ciencias de la Computación',
            'física': 'Física',
            'literatura': 'Letras',
            'biología': 'Biología',
            'historia': 'Historia',
            'economía': 'Economía'
          };
          
          return {
            id: user.login.uuid,
            name: `${user.name.title} ${user.name.first} ${user.name.last}`,
            subject: subject.charAt(0).toUpperCase() + subject.slice(1),
            price: `$${price} MXN/h`,
            rating,
            reviews,
            description: `Profesor de ${subject} con ${experience} años de experiencia. ${[
              'Especializado en enseñanza personalizada.',
              'Enfoque práctico y dinámico.',
              'Métodos de enseñanza innovadores.',
              'Clases interactivas y participativas.',
              'Atención personalizada a cada estudiante.'
            ][Math.floor(Math.random() * 5)]} Egresado de ${universities[Math.floor(Math.random() * universities.length)]} con ${degrees[Math.floor(Math.random() * degrees.length)]} en ${titles[subject] || 'su campo'}.`,
            image: user.picture.large,
            videoUrl: `https://www.youtube.com/embed/${['3icoSeGqQtY', 'VqmKSAF4bHI', 'yQhQnyhzC6s', 'dQw4w9WgXcQ', 'jNQXAC9IVRw'][index % 5]}`,
            experience,
            university: universities[Math.floor(Math.random() * universities.length)],
            degree: degrees[Math.floor(Math.random() * degrees.length)]
          };
        });
        
        setTeachers(mockTeachers);
      } catch (error) {
        console.error('Error al cargar datos de prueba:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    generateMockTeachers();
  }, []);
  
  // Función para generar estrellas de calificación con animación
  const renderStars = (rating: number) => {
    return Array(5).fill(0).map((_, i) => {
      const starValue = i + 1;
      const isFilled = starValue <= Math.floor(rating);
      const isHalfFilled = !isFilled && starValue - 0.5 <= rating;
      
      return (
        <div key={i} className="relative inline-block">
          <svg 
            className={`w-5 h-5 text-gray-200`} 
            fill="currentColor" 
            viewBox="0 0 20 20"
          >
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
          <div 
            className={`absolute top-0 left-0 overflow-hidden ${isFilled ? 'w-full' : isHalfFilled ? 'w-1/2' : 'w-0'}`}
            style={{ transition: 'width 0.3s ease-in-out' }}
          >
            <svg 
              className="w-5 h-5 text-yellow-400" 
              fill="currentColor" 
              viewBox="0 0 20 20"
            >
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
          </div>
        </div>
      );
    });
  };

  const filteredTeachers = teachers.filter(teacher => {
    const matchesSearch = teacher.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         teacher.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         teacher.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSubject = selectedSubject === 'todos' || 
                          teacher.subject.toLowerCase().includes(selectedSubject.toLowerCase());
    return matchesSearch && matchesSubject;
  });

  const navigate = useNavigate();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-[#8ED4BE] mx-auto mb-4"></div>
          <p className="text-[#294954] text-lg">Cargando docentes...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="all-teachers-container">
      <header className="teachers-header">
        <div className="header-content">
          <button 
            onClick={() => navigate(-1)}
            className="back-button"
          >
            <svg className="back-icon" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
            </svg>
            Volver al inicio
          </button>
          
          <h1>Encuentra al Profesor Perfecto</h1>
          <p>Conectamos estudiantes con los mejores docentes en todas las materias</p>
          
          <div className="search-container">
            <div className="search-box">
              <input
                type="text"
                placeholder="Buscar por nombre, materia o palabras clave..."
                className="search-input"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <svg className="search-icon" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
              </svg>
            </div>
            
            <div className="filters-container">
              {subjects.map((subject) => (
                <button
                  key={subject}
                  className={`filter-btn ${selectedSubject === subject ? 'active' : ''}`}
                  onClick={() => setSelectedSubject(subject)}
                >
                  {subject.charAt(0).toUpperCase() + subject.slice(1)}
                </button>
              ))}
            </div>
            
            <div className="results-count">
              {filteredTeachers.length} {filteredTeachers.length === 1 ? 'profesor encontrado' : 'profesores encontrados'}
            </div>
          </div>
        </div>
      </header>
      
      <main className="teachers-main">
        <div className="teachers-grid">
          {filteredTeachers.length > 0 ? (
            filteredTeachers.map((teacher) => (
              <div key={teacher.id} className="teacher-card">
                <div className="teacher-card-container">
                  <div className="teacher-image-container">
                    <img 
                      src={teacher.image}
                      alt={teacher.name}
                      className="teacher-image"
                    />
                    <div className="teacher-overlay">
                      <h3>{teacher.name}</h3>
                      <p className="teacher-subject">{teacher.subject}</p>
                      <div className="teacher-rating">
                        <div className="teacher-stars">
                          {renderStars(teacher.rating)}
                        </div>
                        <span className="teacher-reviews">
                          {teacher.rating} ({teacher.reviews} reseñas)
                        </span>
                      </div>
                    </div>
                    <div className="teacher-price">{teacher.price}</div>
                  </div>
                  
                  <div className="teacher-info">
                    <h3 className="teacher-name">{teacher.name}</h3>
                    <p className="teacher-subject">{teacher.subject}</p>
                    
                    <div className="teacher-rating">
                      <div className="teacher-stars">
                        {renderStars(teacher.rating)}
                      </div>
                      <span className="teacher-reviews">
                        {teacher.rating} ({teacher.reviews})
                      </span>
                    </div>
                    
                    <p className="teacher-description">
                      {teacher.description}
                    </p>
                    
                    <div className="teacher-details">
                      <div className="detail-item">
                        <div className="detail-icon">
                          <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                          </svg>
                        </div>
                        <span>{teacher.university}</span>
                      </div>
                      
                      <div className="detail-item">
                        <div className="detail-icon">
                          <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                          </svg>
                        </div>
                        <span>{teacher.degree}</span>
                      </div>
                      
                      <div className="detail-item">
                        <div className="detail-icon">
                          <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                        </div>
                        <span>{teacher.experience} años de experiencia</span>
                      </div>
                    </div>
                    
                    <div className="teacher-actions">
                      <button 
                        className="btn-primary"
                        onClick={() => {/* Lógica para agendar clase */}}
                      >
                        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        Agendar Clase
                      </button>
                      <button 
                        className="btn-icon"
                        onClick={() => setPlayingVideo(playingVideo === teacher.id ? null : teacher.id)}
                        title="Ver video de presentación"
                      >
                        <svg fill="currentColor" viewBox="0 0 20 20">
                          <path d="M2 6a2 2 0 012-2h6a2 2 0 012 2v8a2 2 0 01-2 2H4a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v8a2 2 0 01-2 2h-2a2 2 0 01-2-2V6z" />
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
                
                {playingVideo === teacher.id && (
                  <div className="video-modal" onClick={() => setPlayingVideo(null)}>
                    <div className="video-container" onClick={e => e.stopPropagation()}>
                      <button
                        className="close-button"
                        onClick={() => setPlayingVideo(null)}
                      >
                        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                      <div className="video-wrapper">
                        <iframe
                          src={`${teacher.videoUrl}?autoplay=1`}
                          className="video-iframe"
                          frameBorder="0"
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                          allowFullScreen
                          title={`Video de ${teacher.name}`}
                        />
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))
          ) : (
            <div className="no-results">
              <svg className="no-results-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <h3 className="no-results-title">No se encontraron profesores</h3>
              <p className="no-results-text">
                No hay profesores que coincidan con tu búsqueda.
              </p>
              <button
                className="clear-filters"
                onClick={() => {
                  setSearchTerm('');
                  setSelectedSubject('todos');
                }}
              >
                <svg className="refresh-icon" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clipRule="evenodd" />
                </svg>
                Limpiar filtros
              </button>
            </div>
          )}
        </div>
      </main>
      
      <footer className="teachers-footer">
        <div className="footer-content">
          <p> 2024 OnlyCation. Todos los derechos reservados.</p>
        </div>
      </footer>
    </div>
  );
};

export default AllTeachers;
