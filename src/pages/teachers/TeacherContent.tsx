import React from 'react';
import Ribbon from '../../components/Ribbon';

const TeacherContent: React.FC = () => {
  return (
    <div className="bg-white rounded-3xl shadow-lg p-8 md:p-12 space-y-10">
      {/* Sección tipo “Misión” (alineada a AboutUs) */}
      <section style={{ padding: '80px 0', backgroundColor: '#FFFFFF' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '60px', alignItems: 'center' }}>
            {/* Columna izquierda: texto y Ribbon */}
            <div>
              <Ribbon text="Tu camino para enseñar" backgroundColor="#68B2C9" textColor="#ffffff" fontSize="13px" padding="6px 20px" />
              <h2 style={{ fontSize: '42px', fontWeight: 'bold', color: '#294954', margin: '18px 0', lineHeight: 1.2 }}>
                Conecta con estudiantes y transforma su aprendizaje
              </h2>
              <p style={{ fontSize: '18px', lineHeight: 1.8, color: '#6B7280', marginBottom: '16px' }}>
                Crea tu perfil profesional, muestra tu propuesta en video y gestiona tu agenda con total libertad.
              </p>
              <p style={{ fontSize: '18px', lineHeight: 1.8, color: '#6B7280' }}>
                OnlyCation te ofrece visibilidad, herramientas y soporte para que te enfoques en lo más importante: enseñar.
              </p>
              {/* Subtítulo y puntos clave para aportar más información visual */}
              <h3 style={{ fontSize: '20px', fontWeight: 700, color: '#294954', marginTop: '20px', marginBottom: '12px' }}>
                Tu perfil, paso a paso
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {[
                  'Define tus materias y niveles con claridad',
                  'Presenta un video breve y cercano (1–2 min)',
                  'Activa tu cartera virtual y establece tarifas',
                ].map((t, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <div style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: '#68B2C9' }} />
                    <span style={{ color: '#5F6C7B', fontSize: '14px' }}>{t}</span>
                  </div>
                ))}
              </div>
              {/* Botón principal en esta sección */}
              <div style={{ marginTop: '22px' }}>
                <a
                  href="/register"
                  className="inline-block"
                  style={{
                    backgroundColor: '#294954',
                    color: '#FAF9F5',
                    padding: '12px 20px',
                    borderRadius: '14px',
                    fontWeight: 700,
                    boxShadow: '0 8px 24px rgba(41,73,84,0.18)',
                    textDecoration: 'none'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = '#1e3a42';
                    e.currentTarget.style.textDecoration = 'none';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = '#294954';
                    e.currentTarget.style.textDecoration = 'none';
                  }}
                >
                  Crear mi cuenta docente
                </a>
              </div>
            </div>
            {/* Columna derecha: tarjeta degradada (mismo diseño), con contenido de Ventajas */}
            <div>
              <div
                style={{
                  position: 'relative',
                  padding: '48px',
                  borderRadius: '32px',
                  background: 'linear-gradient(135deg, #8ED4BE 0%, #68B2C9 100%)',
                  boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
                  overflow: 'hidden',
                  minHeight: 420,
                }}
              >
                {/* elementos decorativos */}
                <div style={{ position: 'absolute', top: '-50px', right: '-50px', width: '200px', height: '200px', borderRadius: '50%', background: 'rgba(255,255,255,0.1)', zIndex: 1 }} />
                <div style={{ position: 'absolute', bottom: '-32px', left: '-32px', width: '120px', height: '120px', borderRadius: '50%', background: 'rgba(255, 222, 151, 0.2)', zIndex: 1 }} />
                <div style={{ position: 'relative', zIndex: 2 }}>
                  <h3 style={{ fontSize: '32px', fontWeight: 'bold', color: 'white', marginBottom: '20px', lineHeight: '1.2' }}>
                    Ventajas de ser docente
                  </h3>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
                    {[
                      'Activación sencilla: registro guiado, verificación y publicación del perfil.',
                      'Agenda flexible: configura disponibilidad y gestiona tus clases.',
                      'Mayor visibilidad: video de presentación y reseñas verificadas.',
                      'Pagos seguros: transparencia total en tus ganancias.',
                      'Soporte continuo: te ayudamos a optimizar tu perfil.',
                      'Impacto real: ayuda a estudiantes a cumplir sus metas.',
                    ].map((text, idx) => (
                      <div
                        key={idx}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '14px',
                          padding: '12px 14px',
                          background: 'rgba(255,255,255,0.08)',
                          borderRadius: '12px',
                        }}
                      >
                        <div style={{ width: '26px', height: '26px', borderRadius: '50%', backgroundColor: '#FFDE97', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '14px', fontWeight: 'bold', color: '#294954', flexShrink: 0 }}>
                          ✓
                        </div>
                        <span style={{ color: 'white', fontSize: '15px', lineHeight: 1.7, fontWeight: 500 }}>{text}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      

      {/* Pasos de activación (igual diseño a "Nuestros Valores") */}
      <section>
        <div style={{ maxWidth: '1200px', margin: '0 auto', textAlign: 'center' }}>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <div className="mb-3"><Ribbon text="Activación" backgroundColor="#8ED4BE" /></div>
            <h3 className="text-2xl font-bold text-petroleum-blue mb-8">Cómo activar tu cuenta</h3>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '28px' }}>
            {[
              { color: '#68B2C9', icon: '⚙️', title: 'Preferencias', desc: 'Configura materias, niveles y modalidad (online/presencial).' },
              { color: '#8ED4BE', icon: '📄', title: 'Subida de documentos', desc: 'Carga certificados y tu CV para aumentar la confianza.' },
              { color: '#FFDE97', icon: '💲', title: 'Precio', desc: 'Define tu tarifa por hora y paquetes si lo deseas.' },
              { color: '#68B2C9', icon: '🎬', title: 'Video', desc: 'Graba un video de 1–2 minutos presentándote y tu propuesta.' },
              { color: '#8ED4BE', icon: '🗓️', title: 'Agenda', desc: 'Establece disponibilidad semanal y franjas horarias.' },
              { color: '#FFDE97', icon: '👛', title: 'Cartera virtual', desc: 'Activa tu método de cobro para recibir pagos seguros.' },
            ].map((item, index) => (
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
                  (e.currentTarget as HTMLDivElement).style.transform = 'translateY(-12px) scale(1.02)';
                  (e.currentTarget as HTMLDivElement).style.boxShadow = '0 25px 50px -12px rgba(0, 0, 0, 0.25)';
                  (e.currentTarget as HTMLDivElement).style.borderColor = item.color;
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLDivElement).style.transform = 'translateY(0) scale(1)';
                  (e.currentTarget as HTMLDivElement).style.boxShadow = '0 12px 40px rgba(41, 73, 84, 0.08)';
                  (e.currentTarget as HTMLDivElement).style.borderColor = 'rgba(104, 178, 201, 0.08)';
                }}
              >
                {/* Número de paso en la esquina */}
                <div
                  style={{
                    position: 'absolute',
                    top: '12px',
                    left: '12px',
                    width: '36px',
                    height: '36px',
                    borderRadius: '50%',
                    background: `linear-gradient(135deg, ${item.color}, ${item.color}CC)`,
                    color: '#FFFFFF',
                    fontWeight: 800,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: `0 6px 20px ${item.color}30`,
                    border: '3px solid #FFFFFF',
                    zIndex: 2,
                  }}
                >
                  {index + 1}
                </div>
                {/* Fondo decorativo */}
                <div style={{ position: 'absolute', top: '-20px', right: '-20px', width: '80px', height: '80px', borderRadius: '50%', background: `linear-gradient(135deg, ${item.color}20, ${item.color}10)`, zIndex: 1 }}></div>

                <div style={{ position: 'relative', zIndex: 2, textAlign: 'center' }}>
                  {/* Icono en círculo con gradiente */}
                  <div style={{
                    width: '80px', height: '80px', borderRadius: '50%',
                    background: `linear-gradient(135deg, ${item.color}, ${item.color}CC)`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    margin: '0 auto 24px', fontSize: '36px', boxShadow: `0 8px 32px ${item.color}40`
                  }}>
                    {item.icon}
                  </div>

                  {/* Título y descripción */}
                  <h4 style={{ fontSize: '20px', fontWeight: 'bold', color: '#294954', marginBottom: '12px' }}>{item.title}</h4>
                  <p style={{ fontSize: '14px', lineHeight: 1.7, color: '#6B7280' }}>{item.desc}</p>

                  {/* Línea decorativa */}
                  <div style={{ width: '60px', height: '4px', borderRadius: '2px', background: `linear-gradient(90deg, ${item.color}, ${item.color}80)`, margin: '24px auto 0' }}></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      

      {/* Métricas al estilo AboutUs */}
      <section style={{ padding: '40px 0', backgroundColor: '#FFFFFF' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '32px' }}>
            {[
              { value: '150+', label: 'Docentes activos' },
              { value: '4.8★', label: 'Calificación promedio' },
              { value: '3K+', label: 'Estudiantes impactados' },
            ].map((s, i) => (
              <div key={i} style={{ textAlign: 'center' }}>
                <div
                  style={{
                    fontSize: '42px',
                    fontWeight: 'bold',
                    marginBottom: '8px',
                    background:
                      i === 0
                        ? 'linear-gradient(135deg, #68B2C9, #8ED4BE)'
                        : i === 1
                        ? 'linear-gradient(135deg, #8ED4BE, #68B2C9)'
                        : 'linear-gradient(135deg, #FFDE97, #FF9978)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text',
                  }}
                >
                  {s.value}
                </div>
                <div style={{ fontSize: '14px', fontWeight: 600, color: '#6B7280', textTransform: 'uppercase', letterSpacing: '1px' }}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Metas/beneficios con tarjetas al estilo Vision Section */}
      <section style={{ padding: '40px 0', backgroundColor: '#FAF9F5' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', textAlign: 'center' }}>
          <h3 style={{ fontSize: '36px', fontWeight: 'bold', color: '#294954', marginBottom: '12px', lineHeight: 1.2 }}>
            Potencia tu perfil docente
          </h3>
          <p style={{ fontSize: '18px', lineHeight: 1.8, color: '#6B7280', marginBottom: '40px', maxWidth: '800px', marginInline: 'auto' }}>
            Nuestro equipo te ayuda a optimizar tu presencia: desde tu video de presentación hasta tu propuesta de valor.
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '28px', marginTop: '20px' }}>
            {[
              { number: '1-2 min', title: 'Video ideal', description: 'Un pitch claro y cercano que conecte con estudiantes.' },
              { number: '24-48h', title: 'Publicación', description: 'Tu perfil listo y visible tras la verificación básica.' },
              { number: '100%', title: 'Control de agenda', description: 'Establece horarios, tarifas y modalidades.' },
              { number: 'Top', title: 'Destaca', description: 'Mejores prácticas para aparecer en primeros lugares.' },
            ].map((goal, index) => (
              <div
                key={index}
                style={{
                  backgroundColor: '#FFFFFF',
                  borderRadius: '20px',
                  padding: '24px 20px',
                  textAlign: 'center',
                  border: '2px solid rgba(104, 178, 201, 0.1)',
                  transition: 'all 0.3s ease',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-6px)';
                  e.currentTarget.style.borderColor = '#68B2C9';
                  e.currentTarget.style.boxShadow = '0 12px 40px rgba(104, 178, 201, 0.15)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.borderColor = 'rgba(104, 178, 201, 0.1)';
                  e.currentTarget.style.boxShadow = 'none';
                }}
              >
                <div
                  style={{
                    fontSize: '28px',
                    fontWeight: 'bold',
                    marginBottom: '8px',
                    background:
                      index % 3 === 0
                        ? 'linear-gradient(135deg, #68B2C9, #8ED4BE)'
                        : index % 3 === 1
                        ? 'linear-gradient(135deg, #8ED4BE, #68B2C9)'
                        : 'linear-gradient(135deg, #FFDE97, #FF9978)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text',
                  }}
                >
                  {goal.number}
                </div>
                <h4 style={{ fontSize: '18px', fontWeight: 'bold', color: '#294954', marginBottom: '8px' }}>{goal.title}</h4>
                <p style={{ fontSize: '14px', color: '#6B7280', lineHeight: 1.5 }}>{goal.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Planes de Suscripción */}
      <section style={{ padding: '60px 0', backgroundColor: '#FFFFFF' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', textAlign: 'center' }}>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <div className="mb-3"><Ribbon text="Suscripción" backgroundColor="#68B2C9" /></div>
            <h3 className="text-3xl font-bold text-petroleum-blue mb-3">Planes de Suscripción</h3>
            <p style={{ color: '#6B7280', maxWidth: 760, margin: '0 auto 28px' }}>Elige el plan que mejor se ajuste a tu forma de enseñar. Puedes cambiar de plan en cualquier momento.</p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '32px', alignItems: 'stretch' }}>
            {/* Plan Básico */}
            <div
              style={{
                backgroundColor: '#FFFFFF',
                borderRadius: '20px',
                padding: '28px',
                textAlign: 'left',
                border: '2px solid rgba(104, 178, 201, 0.15)',
                boxShadow: '0 8px 24px rgba(41,73,84,0.06)',
                display: 'flex',
                flexDirection: 'column',
                minHeight: 520
              }}
            >
              <h4 style={{ fontSize: '20px', fontWeight: 'bold', color: '#294954', marginBottom: '8px' }}>Básico</h4>
              <p style={{ color: '#6B7280', lineHeight: 1.6, marginBottom: '12px' }}>
                Ideal para comenzar y explorar la plataforma sin compromiso.
              </p>
              <div style={{ fontSize: '22px', fontWeight: 800, color: '#294954', margin: '8px 0 12px' }}>$0 <span style={{ fontSize: '14px', fontWeight: 600, color: '#6B7280' }}>/mes</span></div>
              <ul className="space-y-2" style={{ color: '#374151', fontSize: '14px' }}>
                <li>✓ Acceso limitado a recursos</li>
                <li>✓ Soporte por correo</li>
                <li>✓ Actualizaciones mensuales</li>
                <li>✓ 1 usuario</li>
              </ul>
              <div style={{ marginTop: 'auto', fontSize: '12px', color: '#6B7280' }}>
                Nota: no incluye certificados ni funciones interactivas.
              </div>
              <div style={{ marginTop: '6px', fontSize: '12px', color: '#9CA3AF' }}>
                Este plan está activado por defecto
              </div>
            </div>

            {/* Plan Premium */}
            <div
              style={{
                backgroundColor: '#68B2C9',
                borderRadius: '20px',
                padding: '32px',
                textAlign: 'left',
                boxShadow: '0 16px 40px rgba(41,73,84,0.18)',
                color: '#FFFFFF',
                position: 'relative',
                display: 'flex',
                flexDirection: 'column',
                minHeight: 520
              }}
            >
              {/* Badge recomendado */}
              <span
                style={{
                  position: 'absolute',
                  top: 14,
                  right: 14,
                  backgroundColor: 'rgba(255,255,255,0.22)',
                  color: '#FFFFFF',
                  fontSize: 12,
                  fontWeight: 700,
                  padding: '6px 10px',
                  borderRadius: 9999,
                  letterSpacing: '0.5px'
                }}
              >
                Recomendado
              </span>
              <h4 style={{ fontSize: '20px', fontWeight: 'bold', marginBottom: '8px' }}>Premium</h4>
              <p style={{ opacity: 0.95, lineHeight: 1.6, marginBottom: '12px' }}>
                Perfecto para docentes que buscan herramientas avanzadas y beneficios exclusivos.
              </p>
              <div style={{ fontSize: '24px', fontWeight: 800, margin: '8px 0 12px' }}>$49 <span style={{ fontSize: '14px', fontWeight: 600, opacity: 0.9 }}>/mes</span></div>
              <ul className="space-y-2" style={{ fontSize: '14px' }}>
                <li>✓ Acceso completo e ilimitado</li>
                <li>✓ Soporte prioritario</li>
                <li>✓ Actualizaciones semanales</li>
                <li>✓ Múltiples usuarios</li>
              </ul>

              {/* Caja de incluye */}
              <div
                style={{
                  marginTop: '14px',
                  backgroundColor: 'rgba(255,255,255,0.18)',
                  borderRadius: '12px',
                  padding: '12px',
                  fontSize: '12px'
                }}
              >
                <div style={{ fontWeight: 700, marginBottom: '6px' }}>Incluye:</div>
                <ul className="space-y-1" style={{ lineHeight: 1.5 }}>
                  <li>• Certificados digitales al finalizar módulos</li>
                  <li>• Recomendaciones personalizadas</li>
                  <li>• Acceso anticipado a nuevos cursos</li>
                  <li>• Promoción en listados premium</li>
                  <li>• Acceso a comunidad privada</li>
                </ul>
              </div>

              <div style={{ marginTop: 'auto' }}>
                <button
                  type="button"
                  className="px-5 py-3 rounded-xl font-semibold shadow-md hover:shadow-lg transition-colors"
                  style={{ backgroundColor: '#294954', color: '#FAF9F5' }}
                  onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#1e3a42')}
                  onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#294954')}
                >
                  Elegir Plan
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
};

export default TeacherContent;
