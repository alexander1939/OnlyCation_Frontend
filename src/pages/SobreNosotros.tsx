import React, { useEffect, useState } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import Ribbon from '../components/Ribbon';

const SobreNosotros: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  // Datos de los desarrolladores
  const developers = [
    {
      name: "Gael Espinosa Fernandez",
      role: "Frontend Developer",
      email: "fernandezgael707@gmail.com",
      image: "/yo.jpg",
      skills: ["React", "TypeScript", "TailwindCSS", "Vite", "UI/UX"]
    },
    {
      name: "Jesus Guzman Jimenez",
      role: "Backend Developer",
      email: "jesusguzmanjimenez53@gmail.com",
      image: "/chus.jpeg",
      skills: ["React", "Express", "Docker", "PostgreSQL", "Node.js"]
    },
    {
      name: "Gustavo Alexander Medina Cifuentes",
      role: "Full Stack Developer",
      email: "Alexcifuentes72818@gmail.com",
      image: "/tavazo.jpeg",
      skills: ["React", "Node.js", "AWS", "Docker", "DevOps"]
    },
    {
      name: "Roberto Carlos Nuñez Cruz",
      role: "Frontend Developer",
      email: "robertocarlosnunezcruz9@gmail.com",
      image: "/rober.jpeg",
      skills: ["React", "TypeScript", "TailwindCSS", "Vite", "UI/UX"]
    },
  ];

  return (
    <div className="min-h-screen w-full" style={{backgroundColor: '#FAF9F5', margin: 0, padding: 0}}>
      <Header />
      
      <main style={{paddingTop: '120px', paddingBottom: '64px'}}>
        {/* Hero Section */}
        <section className="py-20 px-6" style={{backgroundColor: '#FAF9F5'}}>
          <div className="max-w-6xl mx-auto text-center">
            <div 
              className={`transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
            >
              <h1 
                className="text-5xl md:text-6xl font-bold mb-6" 
                style={{color: '#294954', fontSize: '3rem'}}
              >
                Sobre Nosotros
              </h1>
              <p 
                className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto" 
                style={{color: '#6B7280', fontSize: '1.25rem'}}
              >
                Conoce nuestra misión, visión y al equipo detrás de OnlyCation
              </p>
              
              {/* Decorative line */}
              <div className="flex justify-center mb-12">
                <div className="w-24 h-1 rounded-full" style={{backgroundColor: '#68B2C9'}}></div>
              </div>
            </div>
          </div>
        </section>


        {/* Mission Section */}
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

        {/* Values Section */}
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
              {[
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
              ].map((value, index) => (
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

        {/* Vision Section */}
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
              {[
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
              ].map((goal, index) => (
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

        {/* Developers Grid */}
        <section style={{padding: '100px 50px', backgroundColor: '#FAF9F5'}}>
          <div style={{maxWidth: '1400px', margin: '0 auto'}}>
            <div style={{textAlign: 'center', marginBottom: '60px'}}>

              <Ribbon text="Nuestro Equipo" backgroundColor="#68B2C9"/>
              
              <h2 style={{
                fontSize: '48px',
                fontWeight: 'bold',
                color: '#294954',
                marginBottom: '24px',
                lineHeight: '1.2'
              }}>
                Conoce a los desarrolladores
              </h2>
              
              <p style={{
                fontSize: '20px',
                lineHeight: '1.8',
                color: '#6B7280',
                maxWidth: '600px',
                margin: '0 auto'
              }}>
                Los profesionales apasionados por la educación y la tecnología que hacen posible OnlyCation
              </p>
            </div>
            
            <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '40px'}}>
              {developers.map((developer, index) => (
                <div
                  key={index}
                  style={{
                    position: 'relative',
                    backgroundColor: '#FFFFFF',
                    borderRadius: '32px',
                    padding: '0',
                    boxShadow: '0 8px 32px rgba(41, 73, 84, 0.06)',
                    border: '1px solid rgba(104, 178, 201, 0.1)',
                    transition: 'all 0.6s cubic-bezier(0.4, 0, 0.2, 1)',
                    cursor: 'pointer',
                    overflow: 'hidden',
                    transform: 'translateY(0)',
                    opacity: isVisible ? 1 : 0,
                    animation: `fadeInUp 0.8s ease-out ${index * 0.2}s forwards`
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-16px) scale(1.03)';
                    e.currentTarget.style.boxShadow = '0 32px 80px rgba(41, 73, 84, 0.2)';
                    e.currentTarget.style.borderColor = '#68B2C9';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0) scale(1)';
                    e.currentTarget.style.boxShadow = '0 8px 32px rgba(41, 73, 84, 0.06)';
                    e.currentTarget.style.borderColor = 'rgba(104, 178, 201, 0.1)';
                  }}
                >
                  {/* Gradient Background */}
                  <div style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    height: '200px',
                    background: `linear-gradient(135deg, ${index % 3 === 0 ? '#68B2C9' : index % 3 === 1 ? '#8ED4BE' : '#FFDE97'}, ${index % 3 === 0 ? '#8ED4BE' : index % 3 === 1 ? '#68B2C9' : '#FF9978'})`,
                    opacity: 0.1,
                    zIndex: 1
                  }}></div>
                  
                  {/* Decorative Elements */}
                  <div style={{
                    position: 'absolute',
                    top: '-50px',
                    right: '-50px',
                    width: '120px',
                    height: '120px',
                    borderRadius: '50%',
                    background: `linear-gradient(135deg, ${index % 3 === 0 ? '#68B2C9' : index % 3 === 1 ? '#8ED4BE' : '#FFDE97'}20, transparent)`,
                    zIndex: 1
                  }}></div>
                  
                  <div style={{
                    position: 'absolute',
                    bottom: '-30px',
                    left: '-30px',
                    width: '80px',
                    height: '80px',
                    borderRadius: '50%',
                    background: `linear-gradient(135deg, ${index % 3 === 0 ? '#8ED4BE' : index % 3 === 1 ? '#FFDE97' : '#68B2C9'}15, transparent)`,
                    zIndex: 1
                  }}></div>
                  
                  {/* Content */}
                  <div style={{position: 'relative', zIndex: 2, padding: '40px 32px'}}>
                    {/* Profile Section */}
                    <div style={{textAlign: 'center', marginBottom: '32px'}}>
                      <div style={{position: 'relative', marginBottom: '32px'}}>
                        {/* Outer Ring */}
                        <div style={{
                          position: 'relative',
                          width: '140px',
                          height: '140px',
                          margin: '0 auto',
                          borderRadius: '50%',
                          background: `linear-gradient(135deg, ${index % 3 === 0 ? '#68B2C9' : index % 3 === 1 ? '#8ED4BE' : '#FFDE97'}, ${index % 3 === 0 ? '#8ED4BE' : index % 3 === 1 ? '#68B2C9' : '#FF9978'})`,
                          padding: '6px',
                          boxShadow: `0 12px 40px ${index % 3 === 0 ? '#68B2C9' : index % 3 === 1 ? '#8ED4BE' : '#FFDE97'}40`
                        }}>
                          {/* Inner Ring */}
                          <div style={{
                            width: '100%',
                            height: '100%',
                            borderRadius: '50%',
                            background: 'linear-gradient(135deg, #FFFFFF, #FAF9F5)',
                            padding: '4px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                          }}>
                            {/* Image Container */}
                            <div style={{
                              width: '100%',
                              height: '100%',
                              borderRadius: '50%',
                              overflow: 'hidden',
                              background: '#f8f9fa',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center'
                            }}>
                              <img
                                src={developer.image}
                                alt={developer.name}
                                style={{
                                  width: '100%',
                                  height: '100%',
                                  objectFit: 'cover',
                                  transition: 'transform 0.3s ease'
                                }}
                                onMouseEnter={(e) => {
                                  e.currentTarget.style.transform = 'scale(1.1)';
                                }}
                                onMouseLeave={(e) => {
                                  e.currentTarget.style.transform = 'scale(1)';
                                }}
                              />
                            </div>
                          </div>
                        </div>
                        
                        {/* Number Badge */}
                        <div style={{
                          position: 'absolute',
                          top: '8px',
                          right: '8px',
                          width: '36px',
                          height: '36px',
                          borderRadius: '50%',
                          background: `linear-gradient(135deg, ${index % 3 === 0 ? '#68B2C9' : index % 3 === 1 ? '#8ED4BE' : '#FFDE97'}, ${index % 3 === 0 ? '#8ED4BE' : index % 3 === 1 ? '#68B2C9' : '#FF9978'})`,
                          color: 'white',
                          fontWeight: 'bold',
                          fontSize: '16px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          boxShadow: '0 6px 20px rgba(0, 0, 0, 0.15)',
                          border: '3px solid white'
                        }}>
                          {index + 1}
                        </div>
                        
                        {/* Status Indicator */}
                        <div style={{
                          position: 'absolute',
                          bottom: '8px',
                          left: '50%',
                          transform: 'translateX(-50%)',
                          width: '16px',
                          height: '16px',
                          borderRadius: '50%',
                          backgroundColor: '#10B981',
                          border: '3px solid white',
                          boxShadow: '0 2px 8px rgba(16, 185, 129, 0.3)'
                        }}></div>
                      </div>
                      
                      {/* Name and Role */}
                      <h3 style={{
                        fontSize: '28px',
                        fontWeight: 'bold',
                        marginBottom: '12px',
                        color: '#294954',
                        lineHeight: '1.2'
                      }}>
                        {developer.name}
                      </h3>
                      
                      <div style={{
                        display: 'inline-block',
                        padding: '12px 24px',
                        borderRadius: '25px',
                        fontSize: '14px',
                        fontWeight: '700',
                        marginBottom: '20px',
                        background: `linear-gradient(135deg, ${index % 3 === 0 ? '#68B2C9' : index % 3 === 1 ? '#8ED4BE' : '#FFDE97'}, ${index % 3 === 0 ? '#8ED4BE' : index % 3 === 1 ? '#68B2C9' : '#FF9978'})`,
                        color: 'white',
                        textTransform: 'uppercase',
                        letterSpacing: '1px',
                        boxShadow: `0 4px 16px ${index % 3 === 0 ? '#68B2C9' : index % 3 === 1 ? '#8ED4BE' : '#FFDE97'}40`
                      }}>
                        {developer.role}
                      </div>
                    </div>
                    
                    {/* Skills */}
                    <div style={{
                      display: 'flex',
                      flexWrap: 'wrap',
                      justifyContent: 'center',
                      gap: '8px',
                      marginBottom: '32px'
                    }}>
                      {developer.skills.map((skill, skillIndex) => (
                        <span
                          key={skillIndex}
                          style={{
                            padding: '8px 16px',
                            borderRadius: '20px',
                            fontSize: '12px',
                            fontWeight: '600',
                            background: `linear-gradient(135deg, ${index % 3 === 0 ? '#68B2C9' : index % 3 === 1 ? '#8ED4BE' : '#FFDE97'}15, ${index % 3 === 0 ? '#8ED4BE' : index % 3 === 1 ? '#68B2C9' : '#FF9978'}15)`,
                            color: index % 3 === 0 ? '#68B2C9' : index % 3 === 1 ? '#8ED4BE' : '#B88010',
                            border: `2px solid ${index % 3 === 0 ? '#68B2C9' : index % 3 === 1 ? '#8ED4BE' : '#FFDE97'}20`,
                            transition: 'all 0.3s ease'
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.transform = 'translateY(-2px) scale(1.05)';
                            e.currentTarget.style.boxShadow = `0 4px 12px ${index % 3 === 0 ? '#68B2C9' : index % 3 === 1 ? '#8ED4BE' : '#FFDE97'}30`;
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.transform = 'translateY(0) scale(1)';
                            e.currentTarget.style.boxShadow = 'none';
                          }}
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                    
                    {/* Contact */}
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '12px',
                      padding: '16px 24px',
                      borderRadius: '20px',
                      background: 'linear-gradient(135deg, #FAF9F5, #F3F4F6)',
                      border: '2px solid rgba(104, 178, 201, 0.1)',
                      transition: 'all 0.3s ease'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.borderColor = index % 3 === 0 ? '#68B2C9' : index % 3 === 1 ? '#8ED4BE' : '#FFDE97';
                      e.currentTarget.style.boxShadow = `0 4px 16px ${index % 3 === 0 ? '#68B2C9' : index % 3 === 1 ? '#8ED4BE' : '#FFDE97'}20`;
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.borderColor = 'rgba(104, 178, 201, 0.1)';
                      e.currentTarget.style.boxShadow = 'none';
                    }}>
                      <div style={{
                        width: '20px',
                        height: '20px',
                        borderRadius: '50%',
                        background: `linear-gradient(135deg, ${index % 3 === 0 ? '#68B2C9' : index % 3 === 1 ? '#8ED4BE' : '#FFDE97'}, ${index % 3 === 0 ? '#8ED4BE' : index % 3 === 1 ? '#68B2C9' : '#FF9978'})`,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}>
                        <svg
                          style={{width: '12px', height: '12px', color: 'white'}}
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                        </svg>
                      </div>
                      <a
                        href={`mailto:${developer.email}`}
                        style={{
                          fontSize: '14px',
                          fontWeight: '600',
                          color: '#294954',
                          textDecoration: 'none',
                          transition: 'color 0.3s ease'
                        }}
                        onMouseEnter={(e) => e.currentTarget.style.color = index % 3 === 0 ? '#68B2C9' : index % 3 === 1 ? '#8ED4BE' : '#FFDE97'}
                        onMouseLeave={(e) => e.currentTarget.style.color = '#294954'}
                      >
                        {developer.email}
                      </a>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
};

export default SobreNosotros;
