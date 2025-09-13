import React from 'react';
import Ribbon from '../../components/Ribbon';

const MissionSection: React.FC = () => {
  return (
    <section style={{padding: '100px 50px', backgroundColor: '#FFFFFF'}}>
      <div style={{maxWidth: '1200px', margin: '0 auto'}}>
        <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '80px', alignItems: 'center'}}>
          {/* Left side - Mission content */}
          <div>
            <Ribbon text="Nuestra Misión" backgroundColor="#68B2C9" textColor="#ffffff" fontSize="13px" padding="6px 20px" />
            
            <h2 style={{
              fontSize: '48px',
              fontWeight: 'bold',
              color: '#294954',
              marginBottom: '32px',
              lineHeight: '1.2'
            }}>
              Transformamos la educación a través de la tecnología
            </h2>
            
            <p style={{
              fontSize: '18px',
              lineHeight: '1.8',
              color: '#6B7280',
              marginBottom: '24px'
            }}>
              En OnlyCation, creemos que la educación de calidad debe ser accesible para todos. 
              Conectamos estudiantes con los mejores tutores especializados para crear experiencias 
              de aprendizaje personalizadas y efectivas.
            </p>
            
            <p style={{
              fontSize: '18px',
              lineHeight: '1.8',
              color: '#6B7280',
              marginBottom: '48px'
            }}>
              Nuestra plataforma facilita el encuentro entre estudiantes que buscan conocimiento 
              y profesores apasionados por enseñar, creando una comunidad educativa sólida y confiable.
            </p>
            
            {/* Stats */}
            <div style={{display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '32px'}}>
              <div style={{textAlign: 'center'}}>
                <div style={{
                  fontSize: '48px',
                  fontWeight: 'bold',
                  color: '#68B2C9',
                  marginBottom: '8px',
                  background: 'linear-gradient(135deg, #68B2C9, #8ED4BE)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text'
                }}>
                  500+
                </div>
                <div style={{
                  fontSize: '14px',
                  fontWeight: '600',
                  color: '#6B7280',
                  textTransform: 'uppercase',
                  letterSpacing: '1px'
                }}>
                  Estudiantes
                </div>
              </div>
              <div style={{textAlign: 'center'}}>
                <div style={{
                  fontSize: '48px',
                  fontWeight: 'bold',
                  color: '#8ED4BE',
                  marginBottom: '8px',
                  background: 'linear-gradient(135deg, #8ED4BE, #68B2C9)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text'
                }}>
                  50+
                </div>
                <div style={{
                  fontSize: '14px',
                  fontWeight: '600',
                  color: '#6B7280',
                  textTransform: 'uppercase',
                  letterSpacing: '1px'
                }}>
                  Tutores
                </div>
              </div>
              <div style={{textAlign: 'center'}}>
                <div style={{
                  fontSize: '48px',
                  fontWeight: 'bold',
                  color: '#FFDE97',
                  marginBottom: '8px',
                  background: 'linear-gradient(135deg, #FFDE97, #FF9978)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text'
                }}>
                  1000+
                </div>
                <div style={{
                  fontSize: '14px',
                  fontWeight: '600',
                  color: '#6B7280',
                  textTransform: 'uppercase',
                  letterSpacing: '1px'
                }}>
                  Clases
                </div>
              </div>
            </div>
          </div>
          
          {/* Right side - Features card */}
          <div>
            <div style={{
              position: 'relative',
              padding: '48px',
              borderRadius: '32px',
              background: 'linear-gradient(135deg, #8ED4BE 0%, #68B2C9 100%)',
              boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
              overflow: 'hidden'
            }}>
              {/* Decorative background elements */}
              <div style={{
                position: 'absolute',
                top: '-50px',
                right: '-50px',
                width: '200px',
                height: '200px',
                borderRadius: '50%',
                background: 'rgba(255, 255, 255, 0.1)',
                zIndex: 1
              }}></div>
              <div style={{
                position: 'absolute',
                bottom: '-30px',
                left: '-30px',
                width: '120px',
                height: '120px',
                borderRadius: '50%',
                background: 'rgba(255, 222, 151, 0.2)',
                zIndex: 1
              }}></div>
              
              <div style={{position: 'relative', zIndex: 2}}>
                <Ribbon text="¿Por qué OnlyCation?" backgroundColor="rgba(255, 255, 255, 0.2)" />

                <h3 style={{
                  fontSize: '36px',
                  fontWeight: 'bold',
                  color: 'white',
                  marginBottom: '32px',
                  lineHeight: '1.2'
                }}>
                  La plataforma educativa del futuro
                </h3>
                
                <div style={{display: 'flex', flexDirection: 'column', gap: '20px'}}>
                  {[
                    { icon: '✓', text: 'Tutores verificados y especializados' },
                    { icon: '✓', text: 'Clases personalizadas y flexibles' },
                    { icon: '✓', text: 'Plataforma segura y confiable' },
                    { icon: '✓', text: 'Precios accesibles y transparentes' },
                    { icon: '✓', text: 'Soporte 24/7 para estudiantes' },
                    { icon: '✓', text: 'Tecnología de vanguardia' }
                  ].map((feature, index) => (
                    <div key={index} style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '16px',
                      padding: '12px 0'
                    }}>
                      <div style={{
                        width: '24px',
                        height: '24px',
                        borderRadius: '50%',
                        backgroundColor: '#FFDE97',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '14px',
                        fontWeight: 'bold',
                        color: '#294954',
                        flexShrink: 0
                      }}>
                        {feature.icon}
                      </div>
                      <span style={{
                        color: 'white',
                        fontSize: '16px',
                        fontWeight: '500',
                        lineHeight: '1.5'
                      }}>
                        {feature.text}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default MissionSection;
