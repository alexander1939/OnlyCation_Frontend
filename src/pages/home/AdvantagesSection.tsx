import React from 'react';
import Ribbon from '../../components/ui/Ribbon';

const AdvantagesSection: React.FC = () => {
  const advantages = [
    {
      icon: "⏱️",
      title: "Horarios Flexibles",
      description: "Elige el horario que mejor se adapte a tu rutina, según la disponibilidad de cada docente.",
      color: "#68B2C9"
    },
    {
      icon: "🎥",
      title: "Videos de Presentación",
      description: "Conoce a cada docente a través de su video de presentación antes de agendar una clase.",
      color: "#8ED4BE"
    },
    {
      icon: "💬",
      title: "Comentarios Verificados",
      description: "Lee opiniones reales de otros estudiantes para tomar la mejor decisión.",
      color: "#FFDE97"
    },
    {
      icon: "📅",
      title: "Calendario Integrado",
      description: "Revisa la disponibilidad en tiempo real y agenda tus sesiones al instante.",
      color: "#FF9F7E"
    },
    {
      icon: "💳",
      title: "Pagos Seguros",
      description: "Sistema de pagos integrado y seguro para tu tranquilidad.",
      color: "#A78BFA"
    },
    {
      icon: "🔒",
      title: "Plataforma Segura",
      description: "Videollamadas protegidas y datos personales resguardados.",
      color: "#68B2C9"
    }
  ];

  return (
    <section style={{padding: '100px 20px', backgroundColor: '#FFFFFF'}}>
      <div style={{maxWidth: '1200px', margin: '0 auto', textAlign: 'center'}}>
        <Ribbon text="Ventajas de Nuestra Plataforma" backgroundColor="#68B2C9"/>
        
        <h2 style={{
          fontSize: '48px',
          fontWeight: 'bold',
          color: '#294954',
          marginBottom: '20px',
          lineHeight: '1.2'
        }}>
          El futuro de la educación está aquí
        </h2>
        
        <p style={{
          fontSize: '20px',
          color: '#5F6C7B',
          maxWidth: '800px',
          margin: '0 auto 60px',
          lineHeight: '1.6'
        }}>
          Descubre por qué miles de estudiantes confían en nosotros para su aprendizaje
        </p>
        
        <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '40px', padding: '0 20px'}}>
          {advantages.map((advantage, index) => (
            <div 
              key={index}
              style={{
                backgroundColor: '#FAF9F5',
                borderRadius: '24px',
                padding: '48px 32px',
                boxShadow: '0 12px 40px rgba(41, 73, 84, 0.08)',
                border: '2px solid rgba(104, 178, 201, 0.08)',
                transition: 'all 0.5s ease',
                cursor: 'pointer',
                position: 'relative',
                overflow: 'hidden',
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                textAlign: 'center'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-12px) scale(1.02)';
                e.currentTarget.style.boxShadow = '0 25px 50px -12px rgba(0, 0, 0, 0.25)';
                e.currentTarget.style.borderColor = advantage.color;
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
                background: `linear-gradient(135deg, ${advantage.color}20, ${advantage.color}10)`,
                zIndex: 1
              }}></div>
              
              <div style={{position: 'relative', zIndex: 2, textAlign: 'center', width: '100%'}}>
                <div style={{
                  width: '80px',
                  height: '80px',
                  borderRadius: '50%',
                  background: `linear-gradient(135deg, ${advantage.color}, ${advantage.color}CC)`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 32px',
                  fontSize: '36px',
                  boxShadow: `0 8px 32px ${advantage.color}40`
                }}>
                  {advantage.icon}
                </div>
                
                <h3 style={{
                  fontSize: '28px',
                  fontWeight: 'bold',
                  color: '#294954',
                  marginBottom: '20px',
                  lineHeight: '1.3',
                  minHeight: '68px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  {advantage.title}
                </h3>
                
                <p style={{
                  color: '#5F6C7B',
                  fontSize: '16px',
                  lineHeight: '1.7',
                  margin: 0
                }}>
                  {advantage.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default AdvantagesSection;
