import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';

const PublicHeader: React.FC = () => {
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const NavItem: React.FC<{ to: string; label: string; mobile?: boolean }> = ({ to, label, mobile = false }) => {
    const isActive = location.pathname === to;
    const [hover, setHover] = useState(false);

    const linkStyle: React.CSSProperties = {
      position: 'relative',
      fontWeight: '600',
      fontSize: '18px',
      textDecoration: 'none',
      color: isActive ? '#68B2C9' : '#294954',
      fontFamily: 'Inter, sans-serif',
      padding: mobile ? '16px 24px' : '8px 12px',
      borderRadius: mobile ? '16px' : '0',
      textAlign: mobile ? 'center' : 'left',
      display: 'block',
      transition: 'color 200ms ease'
    };

    const underlineStyle: React.CSSProperties = {
      position: 'absolute',
      left: mobile ? '24px' : '0',
      right: mobile ? '24px' : 'auto',
      bottom: mobile ? '8px' : '-4px',
      width: mobile ? 'auto' : '100%',
      height: '2px',
      backgroundColor: '#68B2C9',
      transform: hover ? 'scaleX(1)' : 'scaleX(0)',
      transformOrigin: 'center center',
      transition: 'transform 300ms cubic-bezier(0.4, 0, 0.2, 1)'
    };

    const activeDotStyle: React.CSSProperties = {
      position: 'absolute',
      right: mobile ? '20px' : '-8px',
      top: mobile ? '16px' : '8px',
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
        <span style={{ position: 'relative', zIndex: 10 }}>{label}</span>
        <span style={underlineStyle} />
        {isActive && <span style={activeDotStyle} />}
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
            width: '100%',
            maxWidth: '1200px',
            justifyContent: 'space-between'
          }}>
            <Link to="/" className="flex items-center space-x-2" style={{ textDecoration: 'none' }}>
              <img src="/logo.png" alt="OnlyCation Logo" className="w-[50px] h-[50px] md:w-[60px] md:h-[60px]" style={{ objectFit: 'contain' }} />
              <span className="font-semibold text-base md:text-lg" style={{ color: '#294954', fontFamily: 'Inter, sans-serif' }}>OnlyCation</span>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-12">
              <NavItem to="/" label="Inicio" />
              <NavItem to="/be-teacher" label="¿Ser docente?" />
              <NavItem to="/about-us" label="Sobre nosotros" />
              <NavItem to="/register" label="Regístrate" />
            </nav>

            {/* Desktop User Icon */}
            <Link to="/login" className="hidden md:block">
              <img src="/usuario.png" alt="Usuario" className="w-[30px] h-[30px]" style={{ objectFit: 'contain' }} />
            </Link>

            {/* Mobile Hamburger */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden flex flex-col justify-center items-center w-8 h-8"
              style={{ border: 'none', background: 'transparent', cursor: 'pointer' }}
            >
              <span style={{
                display: 'block',
                width: '24px',
                height: '2px',
                backgroundColor: '#294954',
                marginBottom: '5px',
                transition: 'all 0.3s',
                transform: isMenuOpen ? 'rotate(45deg) translate(5px, 5px)' : 'none'
              }} />
              <span style={{
                display: 'block',
                width: '24px',
                height: '2px',
                backgroundColor: '#294954',
                marginBottom: '5px',
                opacity: isMenuOpen ? 0 : 1,
                transition: 'all 0.3s'
              }} />
              <span style={{
                display: 'block',
                width: '24px',
                height: '2px',
                backgroundColor: '#294954',
                transition: 'all 0.3s',
                transform: isMenuOpen ? 'rotate(-45deg) translate(5px, -5px)' : 'none'
              }} />
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Menu Overlay */}
      {isMenuOpen && (
        <div className="fixed inset-0 z-40 md:hidden">
          <div className="fixed inset-0 bg-[#294954]/20 backdrop-blur-sm" onClick={() => setIsMenuOpen(false)}></div>
          <div className="fixed top-24 left-4 right-4 bg-[#FAF9F5]/95 backdrop-blur-xl rounded-3xl shadow-2xl border border-[#68B2C9]/20 p-8">
            <nav className="flex flex-col space-y-6">
              <NavItem to="/" label="Inicio" mobile />
              <NavItem to="/be-teacher" label="¿Ser docente?" mobile />
              <NavItem to="/about-us" label="Sobre nosotros" mobile />
              <NavItem to="/register" label="Regístrate" mobile />
              
              <div className="pt-6 border-t border-[#68B2C9]/20">
                <Link 
                  to="/login"
                  onClick={() => setIsMenuOpen(false)}
                  className="w-full bg-[#68B2C9] text-[#FAF9F5] rounded-2xl px-6 py-4 text-base font-medium shadow-lg hover:bg-[#294954] transition-all duration-300 block text-center"
                  style={{ textDecoration: 'none' }}
                >
                  Iniciar Sesión
                </Link>
              </div>
            </nav>
          </div>
        </div>
      )}
    </>
  );
};

export default PublicHeader;
