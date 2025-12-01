import React from 'react';
import { useNavigate } from 'react-router-dom';

const Privacy: React.FC = () => {
  const navigate = useNavigate();
  const handleBack = () => {
    try {
      if (window.history.length > 1) navigate(-1);
      else navigate('/login');
    } catch {
      navigate('/login');
    }
  };

  return (
    <div className="w-full" style={{margin: 0, padding: 0}}>
      <main style={{paddingTop: '120px', paddingBottom: '64px'}}>
        <div className="max-w-3xl mx-auto px-4 sm:px-6 md:px-8">
          <div className="mb-4 sm:mb-6">
            <button onClick={handleBack} className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-white" style={{ backgroundColor: '#68B2C9' }}>
              ← Volver
            </button>
          </div>
          <div className="text-center mb-12">
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-6" style={{color: '#294954'}}>
              Política de Privacidad
            </h1>
            <p className="text-base sm:text-lg" style={{color: '#6B7280'}}>
              Aviso de privacidad de OnlyCation
            </p>
            <div className="w-24 h-1 rounded-full mx-auto mt-6" style={{backgroundColor: '#68B2C9'}}></div>
          </div>
          
          <div className="bg-white rounded-3xl shadow-xl p-4 sm:p-6 md:p-10" style={{border: '1px solid #E5E7EB', margin: '0 8px'}}>
            <div className="prose max-w-none">
              
              <section className="mb-12">
                <h2 className="text-2xl sm:text-3xl font-bold mb-6" style={{color: '#294954'}}>
                  1. Información que Recopilamos
                </h2>
                <div className="space-y-6">
                  <p className="text-base sm:text-lg leading-relaxed" style={{color: '#4B5563', textAlign: 'justify'}}>
                    En OnlyCation recopilamos diferentes tipos de información para brindarle el mejor servicio posible. 
                    Esta información nos permite conectar estudiantes con tutores de manera efectiva, procesar pagos de 
                    forma segura y mejorar continuamente nuestra plataforma educativa.
                  </p>
                  
                  <h3 className="text-lg sm:text-xl font-semibold mb-4 mt-8" style={{color: '#294954'}}>
                    Información Personal:
                  </h3>
                  <ul className="list-disc pl-6 space-y-3 text-base sm:text-lg mb-8" style={{color: '#4B5563'}}>
                    <li style={{textAlign: 'justify'}}>Nombre completo y datos de contacto necesarios para la identificación y comunicación</li>
                    <li style={{textAlign: 'justify'}}>Dirección de correo electrónico para notificaciones y acceso a la cuenta</li>
                    <li style={{textAlign: 'justify'}}>Información de pago y facturación para procesar transacciones de manera segura</li>
                    <li style={{textAlign: 'justify'}}>Credenciales académicas y certificaciones (específicamente para tutores)</li>
                    <li style={{textAlign: 'justify'}}>Fotografías de perfil para facilitar la identificación entre usuarios</li>
                  </ul>

                  <h3 className="text-lg sm:text-xl font-semibold mb-4 mt-8" style={{color: '#294954'}}>
                    Información de Uso:
                  </h3>
                  <ul className="list-disc pl-6 space-y-3 text-base sm:text-lg" style={{color: '#4B5563'}}>
                    <li style={{textAlign: 'justify'}}>Historial de navegación en la plataforma para mejorar la experiencia del usuario</li>
                    <li style={{textAlign: 'justify'}}>Preferencias de aprendizaje y enseñanza para optimizar las conexiones</li>
                    <li style={{textAlign: 'justify'}}>Registros de sesiones y comunicaciones para garantizar la calidad del servicio</li>
                    <li style={{textAlign: 'justify'}}>Datos de dispositivo y conexión para optimización técnica y seguridad</li>
                  </ul>
                </div>
              </section>

              <section className="mb-12">
                <h2 className="text-2xl sm:text-3xl font-bold mb-6" style={{color: '#294954'}}>
                  2. Cómo Utilizamos su Información
                </h2>
                <div className="space-y-6">
                  <p className="text-base sm:text-lg leading-relaxed mb-6" style={{color: '#4B5563', textAlign: 'justify'}}>
                    La información que recopilamos se utiliza exclusivamente para mejorar su experiencia en OnlyCation 
                    y proporcionar servicios educativos de alta calidad. Cada uso de sus datos está orientado a crear 
                    valor tanto para estudiantes como para tutores en nuestra plataforma.
                  </p>
                  <ul className="list-disc pl-6 space-y-3 text-base sm:text-lg" style={{color: '#4B5563'}}>
                    <li style={{textAlign: 'justify'}}>Facilitar la conexión efectiva entre estudiantes y tutores especializados</li>
                    <li style={{textAlign: 'justify'}}>Procesar pagos y transacciones de manera segura y transparente</li>
                    <li style={{textAlign: 'justify'}}>Mejorar continuamente nuestros servicios y la experiencia general del usuario</li>
                    <li style={{textAlign: 'justify'}}>Enviar comunicaciones importantes relacionadas con su cuenta y servicios</li>
                    <li style={{textAlign: 'justify'}}>Proporcionar soporte técnico especializado y atención al cliente personalizada</li>
                    <li style={{textAlign: 'justify'}}>Cumplir con todas las obligaciones legales y regulatorias aplicables</li>
                    <li style={{textAlign: 'justify'}}>Prevenir fraudes y garantizar la máxima seguridad de nuestra plataforma</li>
                  </ul>
                </div>
              </section>

              <section className="mb-12">
                <h2 className="text-2xl sm:text-3xl font-bold mb-6" style={{color: '#294954'}}>
                  3. Compartir Información
                </h2>
                <div className="space-y-6">
                  <p className="text-base sm:text-lg leading-relaxed mb-6" style={{color: '#4B5563', textAlign: 'justify'}}>
                    OnlyCation mantiene un compromiso firme con la privacidad de sus usuarios. No vendemos, alquilamos 
                    ni compartimos su información personal con terceros para fines comerciales. Únicamente compartimos 
                    información en circunstancias específicas y controladas que benefician directamente su experiencia 
                    educativa o que son requeridas por ley.
                  </p>
                  <ul className="list-disc pl-6 space-y-3 text-base sm:text-lg" style={{color: '#4B5563'}}>
                    <li style={{textAlign: 'justify'}}>Con su consentimiento explícito y revocable en cualquier momento</li>
                    <li style={{textAlign: 'justify'}}>Para facilitar las sesiones de tutoría (únicamente información básica de contacto)</li>
                    <li style={{textAlign: 'justify'}}>Con proveedores de servicios certificados que nos ayudan a operar la plataforma</li>
                    <li style={{textAlign: 'justify'}}>Cuando sea legalmente requerido por autoridades competentes</li>
                    <li style={{textAlign: 'justify'}}>Para proteger nuestros derechos legales o la seguridad de todos los usuarios</li>
                  </ul>
                </div>
              </section>

              <section className="mb-12">
                <h2 className="text-2xl sm:text-3xl font-bold mb-6" style={{color: '#294954'}}>
                  4. Seguridad de los Datos
                </h2>
                <div className="space-y-6">
                  <p className="text-base sm:text-lg leading-relaxed mb-6" style={{color: '#4B5563', textAlign: 'justify'}}>
                    La seguridad de su información es nuestra máxima prioridad. Implementamos múltiples capas de 
                    protección utilizando las mejores prácticas de la industria y tecnologías de vanguardia para 
                    salvaguardar todos los datos personales y sensibles almacenados en nuestros sistemas.
                  </p>
                  <ul className="list-disc pl-6 space-y-3 text-base sm:text-lg" style={{color: '#4B5563'}}>
                    <li style={{textAlign: 'justify'}}>Encriptación SSL/TLS de grado militar para todas las transmisiones de datos</li>
                    <li style={{textAlign: 'justify'}}>Almacenamiento seguro en servidores protegidos con certificaciones internacionales</li>
                    <li style={{textAlign: 'justify'}}>Acceso estrictamente restringido a información personal mediante autenticación multifactor</li>
                    <li style={{textAlign: 'justify'}}>Monitoreo continuo las 24 horas para detectar actividades sospechosas</li>
                    <li style={{textAlign: 'justify'}}>Actualizaciones regulares de seguridad y parches de protección</li>
                    <li style={{textAlign: 'justify'}}>Auditorías periódicas de seguridad realizadas por terceros especializados</li>
                  </ul>
                </div>
              </section>

              <div className="text-center pt-8 border-t" style={{borderColor: '#E5E7EB'}}>
                <p className="text-xs sm:text-sm" style={{color: '#9CA3AF'}}>
                  Última actualización: Noviembre 2024 | OnlyCation - Plataforma Educativa
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Privacy;
