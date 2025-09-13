import React, { useRef } from 'react';

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
      className="h-[100vh] snap-start flex items-center justify-center px-[50px]" 
      style={{backgroundColor: '#FAF9F5'}}
    >
      <div className="max-w-[1400px] mx-auto w-full">
        {/* Container principal con scroll snap interno */}
        <div 
          className="h-[80vh] overflow-y-auto [&::-webkit-scrollbar]:hidden"
          style={{scrollbarWidth: 'none', msOverflowStyle: 'none'}}
        >
          {/* Snap Point 1 - Introducción */}
          <div className="h-[80vh] flex items-center justify-center">
            <div className="grid grid-cols-2 gap-[40px] items-center w-full">
              <div className="flex flex-col justify-center items-center text-center">
                <h2 className="text-[42px] font-bold mb-6 leading-tight" style={{color: '#294954'}}>
                  La química perfecta<br />
                  para tu aprendizaje 
                </h2>
                <p className="text-[18px] py-[10px] px-[50px] leading-relaxed max-w-lg" style={{color: '#6B7280'}}>
                  Sigue estos pasos para reservar tu tutoría <br />
                  y aprovechar al máximo la plataforma:
                </p>
              </div>
              <div className="flex items-center justify-center">
                <div className="w-full h-[400px] bg-gray-100 rounded-lg flex items-center justify-center">
                  <img 
                    src="/buscando_zorro.png"
                    alt="Buscando zorro"
                    className="w-[700px] h-[700px] object-contain"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Snap Points 2-5 - Cada paso */}
          {steps.map((step) => (
            <div key={step.id} className="h-[80vh] flex items-center justify-center">
              <div className="grid grid-cols-2 gap-[40px] items-center w-full">
                <div className="flex flex-col justify-center items-center text-center">
                  <h2 className="text-[42px] font-bold mb-6 leading-tight" style={{color: '#294954'}}>
                    Paso {step.id}<br />
                    {step.title}
                  </h2>
                  <p className="text-[18px] py-[10px] px-[50px] leading-relaxed max-w-lg" style={{color: '#6B7280'}}>
                    {step.description}
                  </p>
                </div>
                <div className="flex items-center justify-center">
                  <div 
                    className="rounded-[20px] p-[30px] text-center shadow-xl border border-gray-100 w-[350px] h-[450px]"
                    style={{backgroundColor: step.color}}
                  >
                    <div 
                      className="w-[60px] h-[60px] rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg"
                      style={{backgroundColor: '#294954'}}
                    >
                      <span className="text-[24px] font-bold text-white">{step.id}</span>
                    </div>
                    <h3 className="text-[20px] font-bold mb-4" style={{color: '#294954'}}>
                      {step.title}
                    </h3>
                    <p className="text-[14px] leading-relaxed mb-6" style={{color: '#294954'}}>
                      {step.description}
                    </p>
                    <div 
                      className="rounded-[15px] p-4 h-[120px] flex items-center justify-center"
                      style={{backgroundColor: 'rgba(255, 255, 255, 0.3)'}}
                    >
                      <img 
                        src={step.image}
                        alt={step.title}
                        className="w-[100px] h-[100px] object-contain"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default StepsSection;
