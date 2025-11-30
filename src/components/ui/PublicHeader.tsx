import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import HintBadge from './HintBadge';
import { KeyRound } from 'lucide-react';

const PublicHeader: React.FC = () => {
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDesktop, setIsDesktop] = useState<boolean>(typeof window !== 'undefined' ? window.innerWidth >= 1024 : false);

  React.useEffect(() => {
    const onResize = () => setIsDesktop(window.innerWidth >= 1024);
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  // Tooltip auto-hint behavior moved to reusable HintBadge component

  // No bloquear el scroll del fondo en móvil para mantener la interacción fluida

  const NavItem: React.FC<{ to: string; label: string; mobile?: boolean }> = ({ to, label, mobile = false }) => {
    const isActive = location.pathname === to;
    const [hover, setHover] = useState(false);

    const linkStyle: React.CSSProperties = {
      position: 'relative',
      fontWeight: '600',
      fontSize: mobile ? '15px' : '16px',
      textDecoration: 'none',
      color: isActive ? '#68B2C9' : '#294954',
      fontFamily: 'Roboto, sans-serif',
      padding: mobile ? '14px 20px' : '4px 6px',
      borderRadius: mobile ? '12px' : '0',
      textAlign: 'left',
      display: 'block',
      width: mobile ? '100%' : undefined,
      backgroundColor: mobile ? (hover || isActive ? 'rgba(104, 178, 201, 0.12)' : 'transparent') : 'transparent',
      transition: 'all 200ms ease'
    };

    const underlineStyle: React.CSSProperties = mobile ? {} : {
      position: 'absolute',
      left: '0',
      bottom: '-4px',
      width: '100%',
      height: '2px',
      backgroundColor: '#68B2C9',
      transform: hover ? 'scaleX(1)' : 'scaleX(0)',
      transformOrigin: 'center center',
      transition: 'transform 300ms cubic-bezier(0.4, 0, 0.2, 1)'
    };

    const activeDotStyle: React.CSSProperties = mobile ? {} : {
      position: 'absolute',
      right: '-8px',
      top: '8px',
      width: '6px',
      height: '6px',
      backgroundColor: '#68B2C9',
      borderRadius: '50%'
    };

    return (
      <Link
        to={to}
        onClick={() => mobile && setIsMenuOpen(false)}
        onMouseEnter={() => setHover(true)}
        onMouseLeave={() => setHover(false)}
        style={linkStyle}
      >
        {mobile && isActive && <span style={{ marginRight: '8px', fontSize: '18px' }}>•</span>}
        <span style={{ position: 'relative', zIndex: 10 }}>{label}</span>
        {!mobile && <span style={underlineStyle} />}
        {!mobile && isActive && <span style={activeDotStyle} />}
      </Link>
    );
  };

  return (
    <>
      <header 
        className="fixed top-0 left-0 right-0 z-50 w-full" 
        style={{
          fontFamily: 'Roboto, sans-serif',
          backgroundColor: 'transparent',
          padding: '16px 0'
        }}
      >
        <div className="w-full px-4" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            backgroundColor: '#FFFFFF',
            borderRadius: '50px',
            padding: '8px 24px',
            gap: '32px',
            boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
            width: isDesktop ? 'auto' : 'calc(100% - 32px)',
            maxWidth: isDesktop ? '100%' : '500px',
            margin: isDesktop ? undefined : '0 auto',
            justifyContent: 'space-between'
          }}>
            <Link to="/" className="flex items-center space-x-2" style={{ textDecoration: 'none' }}>
              <img src="/logo.png" alt="OnlyCation Logo" className="w-[60px] h-[60px]" style={{ objectFit: 'contain' }} />
              <span className="font-semibold text-lg" style={{ color: '#294954', fontFamily: 'Roboto, sans-serif' }}>OnlyCation</span>
            </Link>

            {/* Desktop Navigation */}
            {isDesktop && (
              <nav className="flex items-center" style={{ gap: '48px' }}>
                <NavItem to="/" label="Inicio" />
                <NavItem to="/catalog/teachers" label="Docentes" />
                <NavItem to="/be-teacher" label="¿Ser docente?" />
                <NavItem to="/about-us" label="Sobre nosotros" />
                <NavItem to="/register" label="Regístrate" />
              </nav>
            )}

            {/* Desktop User Icon */}
            {isDesktop && (
              <HintBadge text="Inicia sesión aquí" intervalMs={15000} showDurationMs={5000} fixed={false}>
                <Link to="/login" aria-label="Iniciar sesión">
                  <img src="/usuario.png" alt="Usuario" className="w-[30px] h-[30px]" style={{ objectFit: 'contain' }} />
                </Link>
              </HintBadge>
            )}

            {/* Mobile Hamburger */}
            {!isDesktop && (
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="flex flex-col justify-center items-center"
                style={{ 
                  border: 'none', 
                  background: 'transparent', 
                  cursor: 'pointer', 
                  position: 'relative',
                  width: '44px',
                  height: '44px',
                  padding: '10px'
                }}
              >
                <span style={{
                  display: 'block',
                  width: '24px',
                  height: '2px',
                  backgroundColor: '#294954',
                  position: 'absolute',
                  transition: 'all 0.3s ease',
                  transform: isMenuOpen ? 'rotate(45deg)' : 'translateY(-6px)'
                }} />
                <span style={{
                  display: 'block',
                  width: '24px',
                  height: '2px',
                  backgroundColor: '#294954',
                  position: 'absolute',
                  opacity: isMenuOpen ? 0 : 1,
                  transition: 'all 0.3s ease'
                }} />
                <span style={{
                  display: 'block',
                  width: '24px',
                  height: '2px',
                  backgroundColor: '#294954',
                  position: 'absolute',
                  transition: 'all 0.3s ease',
                  transform: isMenuOpen ? 'rotate(-45deg)' : 'translateY(6px)'
                }} />
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Mobile Menu Panel */}
      {!isDesktop && (
        <div
          style={{
            position: 'fixed',
            top: '92px',
            left: '50%',
            transform: isMenuOpen ? 'translateX(-50%)' : 'translateX(-50%) translateY(-10px)',
            width: 'calc(100% - 32px)',
            maxWidth: '500px',
            backgroundColor: '#FFFFFF',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.08)',
            borderRadius: '0 0 20px 20px',
            padding: isMenuOpen ? '20px' : '0',
            maxHeight: isMenuOpen ? '80vh' : '0',
            overflow: isMenuOpen ? 'auto' : 'hidden',
            opacity: isMenuOpen ? 1 : 0,
            transition: 'all 300ms ease',
            pointerEvents: isMenuOpen ? 'auto' : 'none',
            WebkitOverflowScrolling: 'touch',
            zIndex: 60
          }}
        >
          <nav className="flex flex-col" style={{ gap: '0', maxWidth: '600px', margin: '0 auto' }}>
            {[
              { to: '/', label: 'Inicio' },
              { to: '/catalog/teachers', label: 'Docentes' },
              { to: '/be-teacher', label: '¿Ser docente?' },
              { to: '/about-us', label: 'Sobre nosotros' },
              { to: '/register', label: 'Regístrate' }
            ].map((item, index, arr) => (
              <div key={item.to}>
                <NavItem to={item.to} label={item.label} mobile />
                {index < arr.length - 1 && (
                  <div style={{ height: '1px', backgroundColor: 'rgba(104, 178, 201, 0.15)', margin: '0 20px' }} />
                )}
              </div>
            ))}

            <div style={{ marginTop: '16px', paddingTop: '16px', borderTop: '2px solid rgba(104, 178, 201, 0.25)' }}>
              <Link
                to="/login"
                onClick={() => setIsMenuOpen(false)}
                style={{
                  position: 'relative',
                  fontWeight: 600,
                  fontSize: '15px',
                  textDecoration: 'none',
                  color: '#294954',
                  fontFamily: 'Inter, sans-serif',
                  padding: '14px 20px',
                  borderRadius: '12px',
                  textAlign: 'left',
                  display: 'block',
                  width: '100%',
                  backgroundColor: 'transparent',
                  transition: 'all 200ms ease'
                }}
                onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'rgba(104, 178, 201, 0.12)')}
                onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
              >
                <span style={{ marginRight: '8px', display: 'inline-flex' }}><KeyRound size={18} color="#68B2C9" /></span>
                Iniciar Sesión
              </Link>
            </div>
          </nav>
        </div>
      )}
    </>
  );
};

export default PublicHeader;
