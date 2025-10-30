import React from 'react';
import Ribbon from '../../components/ui/Ribbon';

const VisionSection: React.FC = () => {
  const goals = [
    {
      number: "2025",
      title: "Expansión Global",
      description: "Llegar a 10 países de América Latina"
    },
    {
      number: "10K+",
      title: "Estudiantes Activos",
      description: "Comunidad educativa en crecimiento"
    },
    {
      number: "500+",
      title: "Tutores Expertos",
      description: "Red de profesionales especializados"
    },
    {
      number: "95%",
      title: "Satisfacción",
      description: "Calificación promedio de nuestros usuarios"
    }
  ];

  return (
    <section style={{padding: '100px 50px', backgroundColor: '#FFFFFF'}}>
      <div style={{maxWidth: '1200px', margin: '0 auto', textAlign: 'center'}}>
        <Ribbon text="Nuestros Valores" backgroundColor="#8ED4BE"/>

        <h2 style={{
          fontSize: '48px',
          fontWeight: 'bold',
          color: '#294954',
          marginBottom: '32px',
          lineHeight: '1.2'
        }}>
          El futuro de la educación está aquí
        </h2>
        
        <p style={{
          fontSize: '20px',
          lineHeight: '1.8',
          color: '#6B7280',
          marginBottom: '60px',
          maxWidth: '800px',
          margin: '0 auto 60px'
        }}>
          Visualizamos un mundo donde cada estudiante tenga acceso a educación de calidad, 
          independientemente de su ubicación o circunstancias económicas.
        </p>
        
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
          gap: '40px',
          marginTop: '60px'
        }}>
          {goals.map((goal, index) => (
            <div 
              key={index}
              style={{
                backgroundColor: '#FAF9F5',
                borderRadius: '20px',
                padding: '32px 24px',
                textAlign: 'center',
                border: '2px solid rgba(104, 178, 201, 0.1)',
                transition: 'all 0.3s ease'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-8px)';
                e.currentTarget.style.borderColor = '#68B2C9';
                e.currentTarget.style.boxShadow = '0 12px 40px rgba(104, 178, 201, 0.15)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.borderColor = 'rgba(104, 178, 201, 0.1)';
                e.currentTarget.style.boxShadow = 'none';
              }}
            >
              <div style={{
                fontSize: '36px',
                fontWeight: 'bold',
                color: '#68B2C9',
                marginBottom: '16px',
                background: 'linear-gradient(135deg, #68B2C9, #8ED4BE)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text'
              }}>
                {goal.number}
              </div>
              <h3 style={{
                fontSize: '18px',
                fontWeight: 'bold',
                color: '#294954',
                marginBottom: '8px'
              }}>
                {goal.title}
              </h3>
              <p style={{
                fontSize: '14px',
                color: '#6B7280',
                lineHeight: '1.5'
              }}>
                {goal.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default VisionSection;
