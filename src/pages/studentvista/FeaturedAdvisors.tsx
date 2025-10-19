import React from 'react';

const advisors = [
  {
    name: 'Prof. Carlos Mendoza',
    video: 'https://www.youtube.com/embed/3icoSeGqQtY',
  },
  {
    name: 'Lic. María González',
    video: 'https://www.youtube.com/embed/3icoSeGqQtY',
  },
];

const FeaturedAdvisors: React.FC = () => {
  return (
    <div
      style={{
        display: 'grid',
        gap: '1rem',
        fontFamily: 'Roboto, sans-serif',
      }}
    >
      {advisors.map((a) => (
        <div
          key={a.name}
          style={{
            backgroundColor: '#fff',
            borderRadius: '1rem',
            padding: '0.8rem', // 🔹 menos espacio general
            boxShadow: '0 4px 8px rgba(0, 0, 0, 0.05)',
            transition: 'transform 0.2s ease, box-shadow 0.2s ease',
            cursor: 'pointer',
            display: 'flex',
            flexDirection: 'column',
            gap: '0.3rem', // 🔹 espacio más compacto
          }}
          onMouseEnter={(e) =>
            (e.currentTarget.style.boxShadow = '0 6px 14px rgba(0,0,0,0.1)')
          }
          onMouseLeave={(e) =>
            (e.currentTarget.style.boxShadow = '0 4px 8px rgba(0,0,0,0.05)')
          }
        >
          {/* Video del docente */}
          <div
            style={{
              width: '100%',
              aspectRatio: '16/9', // mantiene proporción rectangular
              borderRadius: '0.5rem',
              overflow: 'hidden',
            }}
          >
            <iframe
              width="100%"
              height="100%"
              src={a.video}
              title={a.name}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              style={{
                border: 'none',
              }}
            ></iframe>
          </div>

          {/* Nombre y botón */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginTop: '0.2rem',
            }}
          >
            <h4
              style={{
                margin: 0,
                fontSize: '1rem',
                fontWeight: 'bold',
                color: '#1F2937',
                lineHeight: '1.2', // 🔹 menos espacio debajo del texto
              }}
            >
              {a.name}
            </h4>

            <button
              style={{
                backgroundColor: 'transparent',
                color: '#2563EB',
                border: 'none',
                fontWeight: 600,
                fontSize: '0.9rem',
                cursor: 'pointer',
                transition: 'color 0.2s ease',
                padding: 0,
              }}
              onMouseOver={(e) => (e.currentTarget.style.color = '#1E40AF')}
              onMouseOut={(e) => (e.currentTarget.style.color = '#2563EB')}
            >
              Ver más →
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default FeaturedAdvisors;
