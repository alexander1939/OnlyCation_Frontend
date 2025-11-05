import React from 'react';

const Terms: React.FC = () => {
  return (
    <div className="w-full" style={{margin: 0, padding: 0}}>
      <main style={{paddingTop: '120px', paddingBottom: '64px'}}>
        <div className="max-w-4xl mx-auto px-8 md:px-12 lg:px-16" style={{padding:50}}>
          <div className="text-center mb-12">
            <h1 className="text-5xl font-bold mb-6" style={{color: '#294954'}}>
              Términos y Condiciones
            </h1>
            <p className="text-xl" style={{color: '#6B7280'}}>
              Términos de servicio de OnlyCation
            </p>
            <div className="w-24 h-1 rounded-full mx-auto mt-6" style={{backgroundColor: '#68B2C9'}}></div>
          </div>
          
          <div className="bg-white rounded-3xl shadow-xl p-8 md:p-12 lg:p-16" style={{border: '1px solid #E5E7EB', margin: '0 16px'}}>
            <div className="prose max-w-none">
              
              <section className="mb-12">
                <h2 className="text-3xl font-bold mb-6" style={{color: '#294954'}}>
                  1. Aceptación de los Términos
                </h2>
                <p className="text-lg leading-relaxed mb-6" style={{color: '#4B5563', textAlign: 'justify'}}>
                  Al acceder y utilizar la plataforma OnlyCation, usted acepta estar sujeto a estos Términos y Condiciones 
                  de Uso de manera integral. Si no está de acuerdo con alguna parte de estos términos, le solicitamos 
                  respetuosamente que no utilice nuestros servicios. El uso continuado de la plataforma constituye su 
                  aceptación plena de todas las condiciones aquí establecidas.
                </p>
              </section>

              <section className="mb-12">
                <h2 className="text-3xl font-bold mb-6" style={{color: '#294954'}}>
                  2. Descripción del Servicio
                </h2>
                <p className="text-lg leading-relaxed mb-6" style={{color: '#4B5563', textAlign: 'justify'}}>
                  OnlyCation es una plataforma digital innovadora que conecta estudiantes con tutores especializados 
                  para sesiones de aprendizaje personalizadas y de alta calidad. Facilitamos el encuentro entre personas 
                  que buscan conocimiento específico y profesionales apasionados por enseñar, creando un ecosistema 
                  educativo que beneficia a ambas partes mediante tecnología de vanguardia y procesos seguros.
                </p>
              </section>

              <section className="mb-12">
                <h2 className="text-3xl font-bold mb-6" style={{color: '#294954'}}>
                  3. Registro y Cuentas de Usuario
                </h2>
                <div className="space-y-6">
                  <p className="text-lg leading-relaxed" style={{color: '#4B5563', textAlign: 'justify'}}>
                    Para utilizar ciertos servicios de nuestra plataforma, debe crear una cuenta proporcionando información 
                    precisa, completa y actualizada. Es fundamental mantener la veracidad de estos datos para garantizar 
                    la seguridad y efectividad del servicio.
                  </p>
                  <ul className="list-disc pl-6 space-y-3 text-lg" style={{color: '#4B5563'}}>
                    <li style={{textAlign: 'justify'}}>Debe ser mayor de 18 años para crear una cuenta o contar con autorización parental</li>
                    <li style={{textAlign: 'justify'}}>Es completamente responsable de mantener la confidencialidad de su contraseña</li>
                    <li style={{textAlign: 'justify'}}>Debe notificar inmediatamente cualquier uso no autorizado de su cuenta</li>
                    <li style={{textAlign: 'justify'}}>OnlyCation se reserva el derecho de suspender cuentas que violen estos términos</li>
                  </ul>
                </div>
              </section>

              <section className="mb-12">
                <h2 className="text-3xl font-bold mb-6" style={{color: '#294954'}}>
                  4. Responsabilidades del Usuario
                </h2>
                <div className="space-y-6">
                  <h3 className="text-xl font-semibold mb-4 mt-8" style={{color: '#294954'}}>
                    Para Estudiantes:
                  </h3>
                  <ul className="list-disc pl-6 space-y-3 text-lg mb-8" style={{color: '#4B5563'}}>
                    <li style={{textAlign: 'justify'}}>Proporcionar información precisa y detallada sobre sus necesidades de aprendizaje</li>
                    <li style={{textAlign: 'justify'}}>Respetar estrictamente los horarios acordados con los tutores</li>
                    <li style={{textAlign: 'justify'}}>Realizar los pagos de manera oportuna según los términos establecidos</li>
                    <li style={{textAlign: 'justify'}}>Mantener un comportamiento respetuoso y profesional durante todas las sesiones</li>
                  </ul>
                  
                  <h3 className="text-xl font-semibold mb-4 mt-8" style={{color: '#294954'}}>
                    Para Tutores:
                  </h3>
                  <ul className="list-disc pl-6 space-y-3 text-lg" style={{color: '#4B5563'}}>
                    <li style={{textAlign: 'justify'}}>Poseer las credenciales, certificaciones y experiencia necesarias en su área de especialización</li>
                    <li style={{textAlign: 'justify'}}>Proporcionar servicios de tutoría de la más alta calidad y profesionalismo</li>
                    <li style={{textAlign: 'justify'}}>Mantener la puntualidad absoluta y el profesionalismo en todas las interacciones</li>
                    <li style={{textAlign: 'justify'}}>Respetar estrictamente la confidencialidad de toda información del estudiante</li>
                  </ul>
                </div>
              </section>

              <section className="mb-12">
                <h2 className="text-3xl font-bold mb-6" style={{color: '#294954'}}>
                  5. Pagos y Reembolsos
                </h2>
                <div className="space-y-6">
                  <p className="text-lg leading-relaxed mb-6" style={{color: '#4B5563', textAlign: 'justify'}}>
                    Los pagos se procesan de forma completamente segura a través de nuestra plataforma utilizando 
                    tecnología de encriptación de última generación. Los precios están claramente indicados en cada 
                    perfil y pueden variar según el tutor, la materia y la complejidad del contenido educativo.
                  </p>
                  <ul className="list-disc pl-6 space-y-3 text-lg" style={{color: '#4B5563'}}>
                    <li style={{textAlign: 'justify'}}>Los pagos deben realizarse completamente antes de la sesión programada</li>
                    <li style={{textAlign: 'justify'}}>Las cancelaciones con más de 24 horas de anticipación son elegibles para reembolso completo</li>
                    <li style={{textAlign: 'justify'}}>Las cancelaciones con menos de 24 horas pueden estar sujetas a cargos parciales</li>
                    <li style={{textAlign: 'justify'}}>OnlyCation retiene una comisión transparente por cada transacción exitosa</li>
                  </ul>
                </div>
              </section>

              <section className="mb-12">
                <h2 className="text-3xl font-bold mb-6" style={{color: '#294954'}}>
                  6. Limitación de Responsabilidad
                </h2>
                <p className="text-lg leading-relaxed mb-6" style={{color: '#4B5563', textAlign: 'justify'}}>
                  OnlyCation actúa exclusivamente como intermediario tecnológico entre estudiantes y tutores, facilitando 
                  la conexión y proporcionando herramientas seguras para la interacción. No somos responsables por la 
                  calidad específica del contenido educativo, disputas entre usuarios, o cualquier daño directo o 
                  indirecto que pueda surgir del uso de nuestros servicios, más allá de lo establecido por la ley aplicable.
                </p>
              </section>

              <section className="mb-12">
                <h2 className="text-3xl font-bold mb-6" style={{color: '#294954'}}>
                  7. Modificaciones a los Términos
                </h2>
                <p className="text-lg leading-relaxed mb-6" style={{color: '#4B5563', textAlign: 'justify'}}>
                  Nos reservamos el derecho de modificar estos términos en cualquier momento para reflejar cambios 
                  en nuestros servicios, regulaciones legales o mejoras en la plataforma. Los cambios entrarán en 
                  vigor inmediatamente después de su publicación en la plataforma. Es su responsabilidad revisar 
                  periódicamente estos términos para mantenerse informado de cualquier actualización.
                </p>
              </section>

              <section className="mb-12">
                <h2 className="text-3xl font-bold mb-6" style={{color: '#294954'}}>
                  8. Contacto y Soporte
                </h2>
                <p className="text-lg leading-relaxed mb-6" style={{color: '#4B5563', textAlign: 'justify'}}>
                  Si tiene preguntas, inquietudes o comentarios sobre estos Términos y Condiciones, nuestro equipo 
                  de soporte legal está disponible para brindarle asistencia especializada y resolver cualquier duda 
                  que pueda tener sobre el uso de nuestra plataforma.
                </p>
                <div className="bg-gray-50 p-8 rounded-xl">
                  <p className="text-lg font-semibold mb-3" style={{color: '#294954'}}>Departamento Legal - OnlyCation</p>
                  <p className="text-lg mb-2" style={{color: '#4B5563'}}>Email: legal@onlycation.com</p>
                  <p className="text-lg mb-2" style={{color: '#4B5563'}}>Teléfono: +52 (55) 1234-5678</p>
                  <p className="text-lg" style={{color: '#4B5563'}}>Horario de atención: Lunes a Viernes, 9:00 AM - 6:00 PM (GMT-6)</p>
                </div>
              </section>

              <div className="text-center pt-8 border-t" style={{borderColor: '#E5E7EB'}}>
                <p className="text-sm" style={{color: '#9CA3AF'}}>
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

export default Terms;
