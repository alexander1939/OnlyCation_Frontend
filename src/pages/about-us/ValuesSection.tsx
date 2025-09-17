import React from 'react';
import Ribbon from '../../components/Ribbon';

const ValuesSection: React.FC = () => {
  const values = [
    {
      icon: "🎓",
      title: "Excelencia Educativa",
      description: "Nos comprometemos a ofrecer la más alta calidad en educación y aprendizaje, garantizando que cada estudiante reciba una formación excepcional.",
      color: "#68B2C9"
    },
    {
      icon: "🤝",
      title: "Comunidad",
      description: "Construimos una comunidad sólida donde estudiantes y tutores crecen juntos, fomentando el aprendizaje colaborativo y el apoyo mutuo.",
      color: "#8ED4BE"
    },
    {
      icon: "🚀",
      title: "Innovación",
      description: "Utilizamos tecnología de vanguardia para mejorar la experiencia de aprendizaje, adaptándonos constantemente a las nuevas tendencias educativas.",
      color: "#FFDE97"
    }
  ];

  return (
    <section style={{padding: '100px 50px', backgroundColor: '#FAF9F5'}}>
      <div style={{maxWidth: '1200px', margin: '0 auto', textAlign: 'center'}}>
        <Ribbon text="Nuestros Valores" backgroundColor="#68B2C9"/>
        
        <h2 style={{
          fontSize: '48px',
          fontWeight: 'bold',
          color: '#294954',
          marginBottom: '80px',
          lineHeight: '1.2'
        }}>
          Los principios que nos guían
        </h2>
        
        <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '40px'}}>
          {values.map((value, index) => (
            <div 
              key={index}
              style={{
                backgroundColor: '#FFFFFF',
                borderRadius: '24px',
                padding: '48px 32px',
                boxShadow: '0 12px 40px rgba(41, 73, 84, 0.08)',
                border: '2px solid rgba(104, 178, 201, 0.08)',
                transition: 'all 0.5s ease',
                cursor: 'pointer',
                position: 'relative',
                overflow: 'hidden'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-12px) scale(1.02)';
                e.currentTarget.style.boxShadow = '0 25px 50px -12px rgba(0, 0, 0, 0.25)';
                e.currentTarget.style.borderColor = value.color;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0) scale(1)';
                e.currentTarget.style.boxShadow = '0 12px 40px rgba(41, 73, 84, 0.08)';
                e.currentTarget.style.borderColor = 'rgba(104, 178, 201, 0.08)';
              }}
            >
              {/* Decorative background */}
              <div style={{
                position: 'absolute',
                top: '-20px',
                right: '-20px',
                width: '80px',
                height: '80px',
                borderRadius: '50%',
                background: `linear-gradient(135deg, ${value.color}20, ${value.color}10)`,
                zIndex: 1
              }}></div>
              
              <div style={{position: 'relative', zIndex: 2, textAlign: 'center'}}>
                <div style={{
                  width: '80px',
                  height: '80px',
                  borderRadius: '50%',
                  background: `linear-gradient(135deg, ${value.color}, ${value.color}CC)`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 32px',
                  fontSize: '36px',
                  boxShadow: `0 8px 32px ${value.color}40`
                }}>
                  {value.icon}
                </div>
                
                <h3 style={{
                  fontSize: '28px',
                  fontWeight: 'bold',
                  color: '#294954',
                  marginBottom: '20px',
                  lineHeight: '1.3'
                }}>
                  {value.title}
                </h3>
                
                <p style={{
                  fontSize: '16px',
                  lineHeight: '1.7',
                  color: '#6B7280',
                  textAlign: 'center'
                }}>
                  {value.description}
                </p>
                
                {/* Decorative line */}
                <div style={{
                  width: '60px',
                  height: '4px',
                  borderRadius: '2px',
                  background: `linear-gradient(90deg, ${value.color}, ${value.color}80)`,
                  margin: '32px auto 0'
                }}></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ValuesSection;
