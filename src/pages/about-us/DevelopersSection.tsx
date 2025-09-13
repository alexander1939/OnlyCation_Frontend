import React from 'react';
import Ribbon from '../../components/Ribbon';

interface Developer {
  name: string;
  role: string;
  email: string;
  image: string;
  skills: string[];
}

interface DevelopersSectionProps {
  developers: Developer[];
  isVisible: boolean;
}

const DevelopersSection: React.FC<DevelopersSectionProps> = ({ developers, isVisible }) => {
  return (
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
  );
};

export default DevelopersSection;
