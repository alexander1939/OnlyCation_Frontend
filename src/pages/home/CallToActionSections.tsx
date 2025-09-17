import React from 'react';

const CallToActionSections: React.FC = () => {
  return (
    <>
      {/* Sección Quiero ser docente */}
      <section className="py-[30px] px-[50px] bg-soft-white">
        <div className="max-w-[1200px] mx-auto">
          <div className="flex items-center gap-[10px]">
            {/* Imagen del zorro docente a la izquierda */}
            <div className="flex-shrink-0 -ml-[50px] overflow-hidden rounded-[20px]">
              <img 
                src="/zorro_docnte_.png" 
                alt="Zorro docente" 
                className="w-[600px] h-[600px] object-cover scale-150"
                style={{objectPosition: 'center'}}
              />
            </div>
            
            {/* Contenido de texto a la derecha en card */}
            <div className="flex-1">
              <div className="rounded-[20px] p-[40px] shadow-2xl hover:shadow-3xl transition-all duration-500 w-[500px] h-[600px]" style={{backgroundColor: '#8ED4BE', border: '2px solid #8ED4BE', boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)'}}>
                <h2 className="text-[72px] font-bold" style={{color: '#294954', padding: '0 0 20px 0'}}>
                  Conviértete en profesor
                </h2>
                <p className="text-[18px] leading-relaxed" style={{color: '#294954', padding: '0 0 20px 0'}}>
                  Gana dinero compartiendo tus conocimientos con los estudiantes.
                  Regístrate para empezar a dar clases particulares en línea con Preply.
                </p>
                
                {/* Lista de beneficios */}
                <ul className="space-y-3" style={{padding: '0 0 40px 0'}}>
                  <li className="text-[16px]" style={{color: '#294954'}}>
                    <strong>Encuentra estudiantes nuevos</strong>
                  </li>
                  <li className="text-[16px]" style={{color: '#294954'}}>
                    <strong>Haz crecer tu negocio</strong>
                  </li>
                  <li className="text-[16px]" style={{color: '#294954'}}>
                    <strong>Recibe tus pagos sin riesgos</strong>
                  </li>
                </ul>

                {/* Botón Ver más centrado */}
                <div className="text-center">
                  <button 
                    onClick={() => window.location.href = '/ver-mas'}
                    className="text-[18px] font-semibold tracking-[0.5px] transition-colors" 
                    style={{
                      backgroundColor: '#294954', 
                      color: '#FAF9F5', 
                      padding: '12px 24px', 
                      borderRadius: '20px', 
                      border: '2px solid #294954'
                    }} 
                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#1e3a42'} 
                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#294954'}>
                    Ver más
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Sección Conviértete en estudiante */}
      <section className="py-[80px] px-[50px] bg-soft-white">
        <div className="max-w-[1200px] mx-auto">
          <div className="flex items-center gap-[10px]">
            {/* Contenido de texto a la izquierda en card */}
            <div className="flex-1">
              <div className="rounded-[20px] p-[40px] shadow-2xl hover:shadow-3xl transition-all duration-500 w-[500px] h-[600px]" style={{backgroundColor: '#FFD97D', border: '2px solid #FFD97D', boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)'}}>
                <h2 className="text-[72px] font-bold" style={{color: '#294954', padding: '0 0 20px 0'}}>
                  Conviértete en estudiante
                </h2>
                <p className="text-[18px] leading-relaxed" style={{color: '#294954', padding: '0 0 20px 0'}}>
                  Aprende nuevas habilidades y mejora tus conocimientos con la ayuda de tutores en línea. 
                  Regístrate y empieza a recibir clases personalizadas en Preply.
                </p>
                
                {/* Lista de beneficios */}
                <ul className="space-y-3" style={{padding: '0 0 40px 0'}}>
                  <li className="text-[16px]" style={{color: '#294954'}}>
                    <strong>Encuentra profesores expertos</strong>
                  </li>
                  <li className="text-[16px]" style={{color: '#294954'}}>
                    <strong>Aprende a tu propio ritmo</strong>
                  </li>
                  <li className="text-[16px]" style={{color: '#294954'}}>
                    <strong>Usa la herramienta de videoconferencia integrada</strong>
                  </li>
                  <li className="text-[16px]" style={{color: '#294954'}}>
                    <strong>Paga de forma segura y sin riesgos</strong>
                  </li>
                </ul>

                {/* Botón Ver más centrado */}
                <div className="text-center">
                  <button 
                    onClick={() => window.location.href = '/estudiante'}
                    className="text-[18px] font-semibold tracking-[0.5px] transition-colors" 
                    style={{
                      backgroundColor: '#294954', 
                      color: '#FAF9F5', 
                      padding: '12px 24px', 
                      borderRadius: '20px', 
                      border: '2px solid #294954'
                    }} 
                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#1e3a42'} 
                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#294954'}>
                    Ver más
                  </button>
                </div>
              </div>
            </div>
            
            {/* Imagen del zorro estudiante a la derecha */}
            <div className="flex-shrink-0 -mr-[50px] overflow-hidden rounded-[20px]">
              <img 
                src="/buscando_zorro.png" 
                alt="Zorro estudiante" 
                className="w-[600px] h-[600px] object-cover scale-150"
                style={{objectPosition: 'center'}}
              />
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default CallToActionSections;
