import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
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

const AllTeachersPage: React.FC = () => {
  const navigate = useNavigate();
  const [playingVideo, setPlayingVideo] = useState<number | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSubject, setSelectedSubject] = useState('todos');

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
    },
    // Agrega más docentes según sea necesario
    {
      name: 'Ing. Luis Ramírez',
      subject: 'Programación Avanzada',
      price: '$500 MX/hora',
      rating: 4.9,
      reviews: 201,
      description: 'Ingeniero en sistemas con 10 años de experiencia en desarrollo de software y docencia universitaria.',
      videoUrl: 'https://www.youtube.com/embed/example1'
    },
    {
      name: 'Lic. Sofía Martínez',
      subject: 'Física Cuántica',
      price: '$580 MX/hora',
      rating: 4.8,
      reviews: 178,
      description: 'Especialista en física cuántica con maestría en física teórica y amplia experiencia docente.',
      videoUrl: 'https://www.youtube.com/embed/example2'
    },
    {
      name: 'Mtro. Jorge Sánchez',
      subject: 'Literatura Universal',
      price: '$380 MX/hora',
      rating: 4.7,
      reviews: 145,
      description: 'Maestro en letras con especialización en literatura universal y experiencia en preparatoria y universidad.',
      videoUrl: 'https://www.youtube.com/embed/example3'
    }
  ];

  const subjects = ['todos', 'matemáticas', 'inglés', 'química', 'programación', 'física', 'literatura'];

  const filteredTeachers = teachers.filter(teacher => {
    const matchesSearch = teacher.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         teacher.subject.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSubject = selectedSubject === 'todos' || 
                          teacher.subject.toLowerCase().includes(selectedSubject.toLowerCase());
    return matchesSearch && matchesSubject;
  });

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#FAF9F5' }}>
      {/* Header */}
      <header className="py-8 px-4 md:px-8">
        <div className="max-w-7xl mx-auto">
          <button 
            onClick={() => navigate(-1)}
            className="flex items-center text-[#294954] hover:text-[#1e3a42] transition-colors mb-6"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
            </svg>
            Volver al inicio
          </button>
          
          <h1 className="text-4xl md:text-5xl font-bold text-center mb-4" style={{ color: '#294954' }}>
            Nuestros Docentes
          </h1>
          <p className="text-center text-lg text-[#5F6C7B] max-w-3xl mx-auto mb-8">
            Encuentra al profesor ideal para tus necesidades de aprendizaje
          </p>
          
          {/* Search and Filter */}
          <div className="max-w-4xl mx-auto mb-12">
            <div className="relative">
              <input
                type="text"
                placeholder="Buscar por nombre o materia..."
                className="w-full px-6 py-4 rounded-full border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#8ED4BE] focus:border-transparent"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <svg 
                className="absolute right-6 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" 
                xmlns="http://www.w3.org/2000/svg" 
                viewBox="0 0 20 20" 
                fill="currentColor"
              >
                <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
              </svg>
            </div>
            
            <div className="flex flex-wrap justify-center gap-3 mt-6">
              {subjects.map((subject) => (
                <button
                  key={subject}
                  className={`px-5 py-2 rounded-full font-medium transition-colors ${
                    selectedSubject === subject 
                      ? 'bg-[#8ED4BE] text-white' 
                      : 'bg-white text-[#5F6C7B] border border-[#E2E8F0] hover:bg-gray-50'
                  }`}
                  onClick={() => setSelectedSubject(subject)}
                >
                  {subject.charAt(0).toUpperCase() + subject.slice(1)}
                </button>
              ))}
            </div>
          </div>
        </div>
      </header>

      {/* Teachers Grid */}
      <main className="pb-20 px-4 md:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredTeachers.map((teacher, index) => (
              <div 
                key={index} 
                className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300"
              >
                <div className="relative pt-[56.25%] bg-gray-100">
                  {playingVideo === index ? (
                    <iframe
                      src={`${teacher.videoUrl}?autoplay=1&rel=0&modestbranding=1`}
                      className="absolute inset-0 w-full h-full"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                      title={`Video de ${teacher.name}`}
                    />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <img 
                        src={`https://img.youtube.com/vi/${teacher.videoUrl.split('/embed/')[1] || 'default'}/maxresdefault.jpg`}
                        alt={`Video de ${teacher.name}`}
                        className="w-full h-full object-cover"
                      />
                      <button 
                        className="absolute inset-0 w-full h-full flex items-center justify-center bg-black bg-opacity-30 hover:bg-opacity-40 transition-colors"
                        onClick={() => setPlayingVideo(index)}
                      >
                        <div className="w-16 h-16 bg-white bg-opacity-90 rounded-full flex items-center justify-center hover:scale-110 transform transition-transform">
                          <svg className="w-8 h-8 text-[#8ED4BE] ml-1" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M6.3 2.84A1.5 1.5 0 004 4.11v11.78a1.5 1.5 0 002.3 1.27l9.344-5.89a1.5 1.5 0 000-2.54L6.3 2.84z" />
                          </svg>
                        </div>
                      </button>
                    </div>
                  )}
                </div>
                
                <div className="p-6">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h3 className="text-xl font-bold text-gray-900">{teacher.name}</h3>
                      <p className="text-[#8ED4BE] font-medium">{teacher.subject}</p>
                    </div>
                    <span className="px-3 py-1 bg-[#EFF8F5] text-[#2D9D78] text-sm font-semibold rounded-full">
                      {teacher.price}
                    </span>
                  </div>
                  
                  <div className="flex items-center mb-4">
                    <div className="flex text-yellow-400 mr-2">
                      {[...Array(5)].map((_, i) => (
                        <svg 
                          key={i} 
                          className={`w-5 h-5 ${i < Math.floor(teacher.rating) ? 'text-yellow-400' : 'text-gray-300'}`} 
                          fill="currentColor" 
                          viewBox="0 0 20 20"
                        >
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                      ))}
                    </div>
                    <span className="text-sm text-gray-500">
                      {teacher.rating} ({teacher.reviews} reseñas)
                    </span>
                  </div>
                  
                  <p className="text-gray-600 mb-4 line-clamp-3">{teacher.description}</p>
                  
                  <div className="flex justify-between items-center">
                    <button 
                      className="px-6 py-2 bg-[#8ED4BE] text-white rounded-full font-medium hover:bg-[#7cc5af] transition-colors"
                      onClick={() => {/* Lógica para agendar clase */}}
                    >
                      Agendar Clase
                    </button>
                    <button 
                      className="text-[#294954] hover:text-[#1e3a42] font-medium"
                      onClick={() => {/* Lógica para ver perfil */}}
                    >
                      Ver perfil →
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          {filteredTeachers.length === 0 && (
            <div className="text-center py-12">
              <svg 
                className="mx-auto h-12 w-12 text-gray-400" 
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <h3 className="mt-2 text-lg font-medium text-gray-900">No se encontraron docentes</h3>
              <p className="mt-1 text-gray-500">Intenta con otros términos de búsqueda o categorías.</p>
              <div className="mt-6">
                <button 
                  className="px-4 py-2 bg-white border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
                  onClick={() => {
                    setSearchTerm('');
                    setSelectedSubject('todos');
                  }}
                >
                  Limpiar filtros
                </button>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default AllTeachersPage;
