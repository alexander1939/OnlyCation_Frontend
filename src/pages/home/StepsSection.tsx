import React, { useRef } from 'react';
import '../../styles/StepsSection.css';

interface Step {
  id: number;
  title: string;
  description: string;
  image: string;
  color: string;
}

const StepsSection: React.FC = () => {
  const sectionRef = useRef<HTMLElement | null>(null);

  const steps: Step[] = [
    {
      id: 1,
      title: "Encuentra a tu profesor",
      description: "El alumno elige en la plataforma el nivel educativo y la materia que necesita, para que se le muestren los tutores disponibles.",
      image: "/buscando_zorro.png",
      color: "#A8E6CF"
    },
    {
      id: 2,
      title: "Selecciona disponibilidad",
      description: "Revisa el calendario de cada docente y selecciona el día y la hora que mejor se adapten a tus necesidades.",
      image: "/Penzando_zorro.png",
      color: "#FFD97D"
    },
    {
      id: 3,
      title: "Asiste a tu tutoría",
      description: "Conéctate a la sesión en línea a través de la herramienta de videoconferencia que ofrece la plataforma.",
      image: "/zorro_Turoria.png",
      color: "#87CEEB"
    },
    {
      id: 4,
      title: "Confirma tu asistencia",
      description: "Al finalizar la sesión, confirma tu participación directamente en la plataforma para llevar un registro de tus tutorías.",
      image: "/zorro_confiormando.png",
      color: "#DDA0DD"
    }
  ];

  return (
    <section 
      ref={sectionRef} 
      className="h-[100vh] snap-start flex items-center justify-center px-[50px] mb-[160px] sm:mb-[180px] md:mb-[220px]" 
      style={{backgroundColor: '#FAF9F5'}}
    >
      <div className="max-w-[1700px] mx-auto w-full">
        {/* Tablet contenedora */}
        <div className="steps-tablet-container">
          {/* Marco de la tablet */}
          <div className="tablet-frame">
            {/* Botón home */}
            <div className="tablet-home-button"></div>
            
            {/* Pantalla de la tablet */}
            <div className="tablet-screen">
              {/* Barra superior con hora y batería */}
              <div className="tablet-status-bar">
                <div className="status-left">
                  <span className="status-time">15:42</span>
                </div>
                <div className="status-right">
                  <div className="wifi-icon">📶</div>
                  <div className="battery-icon">🔋</div>
                  <span className="battery-percentage">87%</span>
                </div>
              </div>
              
              {/* Contenido de la aplicación */}
              <div className="tablet-app-content">
                {/* Header de la app */}
                <div className="app-header">
                  <div className="app-title">
                    <h2 className="digital-title">
                      La química perfecta para tu aprendizaje
                    </h2>
                    <div className="title-indicator"></div>
                  </div>
                  <p className="app-subtitle">
                    Sigue estos pasos para reservar tu tutoría y aprovechar al máximo la plataforma
                  </p>
                </div>
                
                {/* Contenido con scroll de pasos */}
                <div className="tablet-content-scroll">
                  {/* Grid de pasos */}
                  <div className="steps-grid">
                    {steps.map((step) => (
                      <div key={step.id} className="step-card">
                        <div className="step-number" style={{backgroundColor: step.color}}>
                          {step.id}
                        </div>
                        <div className="step-content">
                          <h3 className="step-title">{step.title}</h3>
                          <p className="step-description">{step.description}</p>
                          <div className="step-image-container" style={{backgroundColor: step.color}}>
                            <img 
                              src={step.image}
                              alt={step.title}
                              className="step-image"
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Elementos decorativos de tablet */}
          <div className="tablet-decorations">
            <div className="screen-glare"></div>
            <div className="reflection-1"></div>
            <div className="reflection-2"></div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default StepsSection;
