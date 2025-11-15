import React from 'react';
import Ribbon from '../../components/ui/Ribbon';

const TeacherContent: React.FC = () => {
  return (
    <div className="bg-white rounded-3xl shadow-lg p-8 md:p-12 space-y-10">
      {/* Sección tipo "Misión" (alineada a AboutUs) - RESPONSIVE */}
      <section className="teacher-mission-section">
        <div className="teacher-mission-container">
          <div className="teacher-mission-grid">
            {/* Columna izquierda: texto y Ribbon */}
            <div className="teacher-mission-text">
              <Ribbon text="Tu camino para enseñar" backgroundColor="#68B2C9" textColor="#ffffff" fontSize="13px" padding="6px 20px" />
              <h2 className="teacher-mission-title">
                Conecta con estudiantes y transforma su aprendizaje
              </h2>
              <p className="teacher-mission-description">
                Crea tu perfil profesional, muestra tu propuesta en video y gestiona tu agenda con total libertad.
              </p>
              <p className="teacher-mission-description">
                OnlyCation te ofrece visibilidad, herramientas y soporte para que te enfoques en lo más importante: enseñar.
              </p>
              {/* Subtítulo y puntos clave para aportar más información visual */}
              <h3 className="teacher-mission-subtitle">
                Tu perfil, paso a paso
              </h3>
              <div className="teacher-mission-list">
                {[
                  'Define tus materias y niveles con claridad',
                  'Presenta un video breve y cercano (1–2 min)',
                  'Activa tu cartera virtual y establece tarifas',
                ].map((t, i) => (
                  <div key={i} className="teacher-mission-list-item">
                    <div className="teacher-mission-bullet" />
                    <span className="teacher-mission-list-text">{t}</span>
                  </div>
                ))}
              </div>
              {/* Botón principal en esta sección */}
              <div className="teacher-mission-cta">
                <a
                  href="/register"
                  className="teacher-mission-button"
                >
                  Crear mi cuenta docente
                </a>
              </div>
            </div>
            {/* Columna derecha: tarjeta degradada (mismo diseño), con contenido de Ventajas */}
            <div className="teacher-mission-card-wrapper">
              <div className="teacher-mission-card">
                {/* elementos decorativos */}
                <div className="teacher-mission-card-deco-1" />
                <div className="teacher-mission-card-deco-2" />
                <div className="teacher-mission-card-content">
                  <h3 className="teacher-mission-card-title">
                    Ventajas de ser docente
                  </h3>
                  <div className="teacher-mission-advantages">
                    {[
                      'Activación sencilla: registro guiado, verificación y publicación del perfil.',
                      'Agenda flexible: configura disponibilidad y gestiona tus clases.',
                      'Mayor visibilidad: video de presentación y reseñas verificadas.',
                      'Pagos seguros: transparencia total en tus ganancias.',
                      'Soporte continuo: te ayudamos a optimizar tu perfil.',
                      'Impacto real: ayuda a estudiantes a cumplir sus metas.',
                    ].map((text, idx) => (
                      <div key={idx} className="teacher-mission-advantage-item">
                        <div className="teacher-mission-advantage-check">
                          ✓
                        </div>
                        <span className="teacher-mission-advantage-text">{text}</span>
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
      <section className="activation-section">
        <div className="activation-container">
          <div className="activation-header">
            <div className="mb-3"><Ribbon text="Activación" backgroundColor="#8ED4BE" /></div>
            <h3 className="activation-title">Cómo activar tu cuenta</h3>
          </div>
          <div className="activation-grid">
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
                className={`activation-card ${item.color === '#68B2C9' ? 'is-sky' : item.color === '#8ED4BE' ? 'is-mint' : 'is-yellow'}`}
              >
                {/* Número de paso */}
                <div className="activation-step-number">
                  {index + 1}
                </div>
                {/* Fondo decorativo */}
                <div className="activation-decor"></div>

                <div className="activation-card-inner">
                  {/* Icono en círculo con gradiente */}
                  <div className="activation-icon">
                    {item.icon}
                  </div>

                  {/* Título y descripción */}
                  <h4 className="activation-card-title">{item.title}</h4>
                  <p className="activation-card-desc">{item.desc}</p>

                  {/* Línea decorativa */}
                  <div className="activation-card-divider"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Métricas al estilo AboutUs */}
      <section className="metrics-section">
        <div className="metrics-container">
          <div className="metrics-grid">
            {[
              { value: '150+', label: 'Docentes activos' },
              { value: '4.8★', label: 'Calificación promedio' },
              { value: '3K+', label: 'Estudiantes impactados' },
            ].map((s, i) => (
              <div key={i} className="metric-item">
                <div className="metric-value">{s.value}</div>
                <div className="metric-label">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Metas/beneficios con tarjetas al estilo Vision Section */}
      <section className="goals-section">
        <div className="goals-container">
          <h3 className="goals-title">Potencia tu perfil docente</h3>
          <p className="goals-description">
            Nuestro equipo te ayuda a optimizar tu presencia: desde tu video de presentación hasta tu propuesta de valor.
          </p>
          <div className="goals-grid">
            {[
              { number: '1-2 min', title: 'Video ideal', description: 'Un pitch claro y cercano que conecte con estudiantes.' },
              { number: '24-48h', title: 'Publicación', description: 'Tu perfil listo y visible tras la verificación básica.' },
              { number: '100%', title: 'Control de agenda', description: 'Establece horarios, tarifas y modalidades.' },
              { number: 'Top', title: 'Destaca', description: 'Mejores prácticas para aparecer en primeros lugares.' },
            ].map((goal, index) => (
              <div key={index} className="goal-card">
                <div className="goal-number">{goal.number}</div>
                <h4 className="goal-title">{goal.title}</h4>
                <p className="goal-desc">{goal.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>


    </div>
  );
};

export default TeacherContent;
