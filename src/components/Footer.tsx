import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer 
      style={{
        backgroundColor: '#294954',
        color: '#FFFFFF',
        fontFamily: 'Inter, sans-serif',
        padding: '20px 48px 30px 48px'
      }}
    >
      <div className="max-w-7xl mx-auto px-12">
        {/* Contenido principal del footer */}
        <div 
          style={{
            display: 'grid',
            gridTemplateColumns: '3fr 1fr 1fr 1fr',
            gap: '80px',
            alignItems: 'start'
          }}
        >
          {/* Logo y descripción - Sección principal */}
          <div>
            <div className="flex items-center space-x-3 mb-6">
              <img 
                src="/logo.png" 
                alt="OnlyCation Logo" 
                className="w-[100px] h-[100px]"
                style={{ objectFit: 'contain' }}
              />
              <span 
                className="font-bold text-2xl"
                style={{ 
                  color: '#FFFFFF',
                  letterSpacing: '-0.5px'
                }}
              >
                OnlyCation
              </span>
            </div>
            <p 
              className="text-base leading-relaxed mb-8"
              style={{ 
                color: 'rgba(255, 255, 255, 0.75)',
                maxWidth: '320px',
                lineHeight: '1.6'
              }}
            >
              La plataforma educativa que conecta estudiantes con los mejores profesores. Aprende de manera personalizada y alcanza tus metas académicas.
            </p>
            
            {/* Redes sociales integradas */}
            <div className="flex space-x-3">
              {[
                { name: 'Facebook', icon: '📘' },
                { name: 'Twitter', icon: '🐦' },
                { name: 'Instagram', icon: '📷' },
                { name: 'LinkedIn', icon: '💼' }
              ].map((social, index) => (
                <a
                  key={index}
                  href="#"
                  className="w-11 h-11 rounded-xl flex items-center justify-center text-lg transition-all duration-300"
                  style={{
                    backgroundColor: 'rgba(255, 255, 255, 0.08)',
                    color: '#FFFFFF',
                    border: '1px solid rgba(255, 255, 255, 0.1)'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = '#68B2C9';
                    e.currentTarget.style.borderColor = '#68B2C9';
                    e.currentTarget.style.transform = 'translateY(-2px)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.08)';
                    e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.1)';
                    e.currentTarget.style.transform = 'translateY(0)';
                  }}
                >
                  {social.icon}
                </a>
              ))}
            </div>
          </div>

          {/* Enlaces rápidos */}
          <div>
            <h3 
              className="font-semibold text-lg mb-6"
              style={{ 
                color: '#68B2C9',
                letterSpacing: '-0.3px',
                padding: '40px 0px 0px 0px'
              }}
            >
              Enlaces Rápidos
            </h3>
            <ul className="space-y-4">
              {[
                'Inicio',
                'Profesores',
                'Materias',
                'Precios'
              ].map((link, index) => (
                <li key={index}>
                  <a 
                    href="#"
                    className="text-sm font-medium transition-all duration-200"
                    style={{ 
                      color: 'rgba(255, 255, 255, 0.7)',
                      textDecoration: 'none',
                      display: 'block',
                      padding: '2px 0'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.color = '#68B2C9';
                      e.currentTarget.style.paddingLeft = '8px';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.color = 'rgba(255, 255, 255, 0.7)';
                      e.currentTarget.style.paddingLeft = '0px';
                    }}
                  >
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Soporte */}
          <div>
            <h3 
              className="font-semibold text-lg mb-6"
              style={{ 
                color: '#68B2C9',
                letterSpacing: '-0.3px',
                padding: '40px 0px 0px 0px'
              }}
            >
              Soporte
            </h3>
            <ul className="space-y-4">
              {[
                'Centro de Ayuda',
                'FAQ',
                'Contacto',
                'Reportar Problema'
              ].map((link, index) => (
                <li key={index}>
                  <a 
                    href="#"
                    className="text-sm font-medium transition-all duration-200"
                    style={{ 
                      color: 'rgba(255, 255, 255, 0.7)',
                      textDecoration: 'none',
                      display: 'block',
                      padding: '2px 0'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.color = '#68B2C9';
                      e.currentTarget.style.paddingLeft = '8px';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.color = 'rgba(255, 255, 255, 0.7)';
                      e.currentTarget.style.paddingLeft = '0px';
                    }}
                  >
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Información de contacto */}
          <div>
            <h3 
              className="font-semibold text-lg mb-6"
              style={{ 
                color: '#68B2C9',
                letterSpacing: '-0.3px',
                padding: '40px 0px 0px 0px'
              }}
            >
              Contacto
            </h3>
            <div className="space-y-4">
              <div 
                className="text-sm font-medium"
                style={{ color: 'rgba(255, 255, 255, 0.7)' }}
              >
                info@onlycation.com
              </div>
              <div 
                className="text-sm font-medium"
                style={{ color: 'rgba(255, 255, 255, 0.7)' }}
              >
                +52 (55) 1234-5678
              </div>
              <div 
                className="text-sm font-medium"
                style={{ color: 'rgba(255, 255, 255, 0.7)' }}
              >
                Ciudad de México, México
              </div>
            </div>
          </div>
        </div>

        {/* Línea divisoria y copyright */}
        <div 
          className="mt-16 pt-8"
          style={{
            borderTop: '1px solid rgba(255, 255, 255, 0.15)'
          }}
        >
          <div 
            className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0"
          >
            <p 
              className="text-sm font-medium"
              style={{ color: 'rgba(255, 255, 255, 0.5)' }}
            >
              © 2024 OnlyCation. Todos los derechos reservados.
            </p>
            <div className="flex space-x-8">
              {[
                'Términos de uso',
                'Política de privacidad',
                'Cookies'
              ].map((term, index) => (
                <a
                  key={index}
                  href="#"
                  className="text-sm font-medium transition-colors duration-200"
                  style={{ 
                    color: 'rgba(255, 255, 255, 0.5)',
                    textDecoration: 'none'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.color = '#68B2C9';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.color = 'rgba(255, 255, 255, 0.5)';
                  }}
                >
                  {term}
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
