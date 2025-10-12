import React from 'react';

const advisors = [
  {
    name: 'Prof. Carlos Mendoza',
    subject: 'Matemáticas Avanzadas',
    rating: 4.9,
    reviews: 4934,
    description:
      'Profesor con 15 años de experiencia en matemáticas universitarias, especializado en cálculo diferencial e integral.',
    price: 450,
    video: 'https://www.youtube.com/embed/2K8mNwJZ5Zs', // ejemplo
  },
  {
    name: 'Lic. María González',
    subject: 'Inglés Conversacional',
    rating: 4.8,
    reviews: 4189,
    description:
      'Licenciada en lenguas extranjeras con certificación TESOL, enfoque en conversación y pronunciación nativa.',
    price: 320,
    video: 'https://www.youtube.com/embed/3hYtR1gYjV4', // ejemplo
  },
  {
    name: 'Dra. Ana López',
    subject: 'Química para Universidad',
    rating: 4.7,
    reviews: 4156,
    description:
      'Doctora en química orgánica especializada en bioquímica y química analítica, con métodos didácticos innovadores.',
    price: 560,
    video: 'https://www.youtube.com/embed/1T9HkIh1qG8', // ejemplo
  },
];

const FeaturedAdvisors: React.FC = () => {
  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'center',
        padding: '2rem',
      }}
    >
      {/* 🔹 solo se muestra el primer asesor */}
      {advisors.slice(0, 1).map((a) => (
        <div
          key={a.name}
          style={{
            backgroundColor: '#fff',
            borderRadius: '1rem',
            width: '370px',
            boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
            overflow: 'hidden',
          }}
        >
          {/* Video superior */}
          <div
            style={{
              position: 'relative',
              width: '100%',
              height: '220px',
              overflow: 'hidden',
              borderTopLeftRadius: '1rem',
              borderTopRightRadius: '1rem',
            }}
          >
            <iframe
              width="100%"
              height="220"
              src={a.video}
              title={a.name}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              style={{ border: 'none' }}
            ></iframe>
          </div>

          {/* Contenido inferior */}
          <div style={{ padding: '1.2rem' }}>
            <h4
              style={{
                margin: '0',
                fontSize: '1.1rem',
                fontWeight: 'bold',
                color: '#1F3C48',
              }}
            >
              {a.name}
            </h4>
            <p
              style={{
                color: '#4A6D73',
                fontWeight: '500',
                margin: '0.2rem 0',
              }}
            >
              {a.subject}
            </p>
            <p style={{ color: '#FBBF24', fontSize: '0.9rem', margin: '0.3rem 0' }}>
              ⭐ {a.rating} | {a.reviews.toLocaleString()} reseñas
            </p>
            <p
              style={{
                fontSize: '0.9rem',
                color: '#444',
                lineHeight: '1.4',
                marginBottom: '1rem',
              }}
            >
              {a.description}
            </p>
            <div
              style={{
                backgroundColor: '#F2F6F8',
                textAlign: 'center',
                borderRadius: '0.5rem',
                padding: '0.6rem',
                fontWeight: 'bold',
                color: '#1F3C48',
                boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
              }}
            >
              ${a.price} MX/hora
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default FeaturedAdvisors;
