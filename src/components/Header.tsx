import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuthContext } from '../context/auth';
import { useLoginApi } from '../hooks/auth/useLoginApi';

const Header: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const location = useLocation();
  const { user, setUser } = useAuthContext();
  const isTeacher = user?.role === 'teacher';
  const isStudent = user?.role === 'student';
  const { logout } = useLoginApi();
  const handleLogout = async () => {
    // Temporary global logout using API hook
    try {
      if (logout) {
        await logout();
      }
    } catch (e) {
      // ignore
    } finally {
      setUser(null);
      setIsProfileOpen(false);
    }
  };

  // Componente NavItem con CSS puro - sin Tailwind
  const NavItem: React.FC<{ to: string; label: string; onClick?: () => void; mobile?: boolean }> = ({ to, label, onClick, mobile = false }) => {
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
        onClick={onClick}
        onMouseEnter={() => setHover(true)}
        onMouseLeave={() => setHover(false)}
        style={linkStyle}
      >
        <span style={{ position: 'relative', zIndex: 10 }}>{label}</span>
        {/* Línea de hover - desde el centro */}
        <span style={underlineStyle} />
        {/* Punto minimalista para estado activo */}
        {isActive && <span style={activeDotStyle} />}
      </Link>
    );
  };

  return (
    <>
      {/* Desktop Header */}
      <header 
        className="fixed top-0 left-0 right-0 z-50 w-full" 
        style={{
          fontFamily: 'Roboto, sans-serif',
          backgroundColor: 'transparent',
          padding: '16px 0'
        }}
      >
        <div 
          className="w-full" 
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          <div 
            style={{
              display: 'flex',
              alignItems: 'center',
              backgroundColor: '#FFFFFF',
              borderRadius: '50px',
              padding: '8px 24px',
              gap: '32px',
              boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
            }}
          >
          
          {/* Logo Simple */}
          <div className="flex items-center space-x-2">
            <img 
              src="/logo.png" 
              alt="OnlyCation Logo" 
              className="w-[60px] h-[60px]"
              style={{
                objectFit: 'contain'
              }}
            />
            <span className="font-semibold text-lg" style={{color: '#294954', fontFamily: 'Inter, sans-serif'}}>OnlyCation</span>
          </div>

          {/* Navigation Menu */}
          <nav className="flex items-center space-x-12">
            <NavItem to="/" label="Inicio" />
            <NavItem to="/ser-docente" label="¿Ser docente?" />
            <NavItem to="/about-us" label="Sobre nosotros" />
            <NavItem to="/register" label="Registrate" />
            {/* Temporary global logout control */}
            <button
              onClick={handleLogout}
              style={{
                background: 'transparent',
                border: 'none',
                color: '#294954',
                fontWeight: 600,
                fontSize: '18px',
                fontFamily: 'Inter, sans-serif',
                cursor: 'pointer'
              }}
            >
              Cerrar sesión (tmp)
            </button>
          </nav>

          {/* Perfil Dropdown */}
          <div className="relative ml-8">
            <button 
              className="w-[30px] h-[30px] rounded-full flex items-center justify-center transition-all duration-300 hover:bg-gray-100 overflow-hidden"
              onClick={() => setIsProfileOpen(!isProfileOpen)}
            >
              <img 
                src="/usuario.png" 
                alt="Usuario" 
               className="w-[30px] h-[30px]"
               style={{
                objectFit: 'contain',
              }}
              />
            </button>

            {/* Dropdown Menu */}
            {isProfileOpen && (
              <div 
                className="absolute right-0 mt-2 w-56 rounded-lg shadow-lg border"
                style={{
                  backgroundColor: '#FFFFFF',
                  borderColor: 'rgba(104, 178, 201, 0.2)',
                  zIndex: 1000
                }}
              >
                <div className="py-2">
                  {!user && (
                    <>
                      <Link
                        to="/login"
                        className="w-full text-left px-4 py-2 text-sm transition-colors duration-200 hover:bg-gray-50 block"
                        style={{ color: '#294954', fontFamily: 'Roboto, sans-serif', textDecoration: 'none' }}
                        onClick={() => setIsProfileOpen(false)}
                      >
                        Iniciar sesión
                      </Link>
                      <Link
                        to="/register"
                        className="w-full text-left px-4 py-2 text-sm transition-colors duration-200 hover:bg-gray-50 block"
                        style={{ color: '#294954', fontFamily: 'Roboto, sans-serif', textDecoration: 'none' }}
                        onClick={() => setIsProfileOpen(false)}
                      >
                        Registrarse
                      </Link>
                    </>
                  )}

                  {isStudent && (
                    <>
                      <Link to="/estudiante/general" className="block px-4 py-2 text-sm hover:bg-gray-50" style={{ color: '#294954', textDecoration: 'none' }} onClick={() => setIsProfileOpen(false)}>General</Link>
                      <Link to="/estudiante/datos-personales" className="block px-4 py-2 text-sm hover:bg-gray-50" style={{ color: '#294954', textDecoration: 'none' }} onClick={() => setIsProfileOpen(false)}>Datos personales</Link>
                      <button className="w-full text-left px-4 py-2 text-sm hover:bg-gray-50" style={{ color: '#294954' }} onClick={handleLogout}>Cerrar sesión</button>
                    </>
                  )}

                  {isTeacher && (
                    <>
                      <Link to="/docente/general" className="block px-4 py-2 text-sm hover:bg-gray-50" style={{ color: '#294954', textDecoration: 'none' }} onClick={() => setIsProfileOpen(false)}>General</Link>
                      <Link to="/docente/datos-personales" className="block px-4 py-2 text-sm hover:bg-gray-50" style={{ color: '#294954', textDecoration: 'none' }} onClick={() => setIsProfileOpen(false)}>Datos personales</Link>
                      <Link to="/docente/documentos" className="block px-4 py-2 text-sm hover:bg-gray-50" style={{ color: '#294954', textDecoration: 'none' }} onClick={() => setIsProfileOpen(false)}>Documentos</Link>
                      <Link to="/docente/agenda" className="block px-4 py-2 text-sm hover:bg-gray-50" style={{ color: '#294954', textDecoration: 'none' }} onClick={() => setIsProfileOpen(false)}>Agenda</Link>
                      <button className="w-full text-left px-4 py-2 text-sm hover:bg-gray-50" style={{ color: '#294954' }} onClick={handleLogout}>Cerrar sesión</button>
                    </>
                  )}
                </div>
              </div>
            )}
          </div>
          </div>
        </div>
      </header>

      {/* Click outside to close profile dropdown */}
      {isProfileOpen && (
        <div 
          className="fixed inset-0 z-30" 
          onClick={() => setIsProfileOpen(false)}
        />
      )}

      {/* Mobile Menu Overlay */}
      {isMenuOpen && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <div className="fixed inset-0 bg-[#294954]/20 backdrop-blur-sm" onClick={() => setIsMenuOpen(false)}></div>
          <div className="fixed top-24 left-4 right-4 bg-[#FAF9F5]/95 backdrop-blur-xl rounded-3xl shadow-2xl border border-[#68B2C9]/20 p-8">
            <nav className="flex flex-col space-y-6 font-['Roboto']">
              <NavItem to="/" label="Inicio" onClick={() => setIsMenuOpen(false)} mobile />
              <NavItem to="/teachers" label="Tutores" onClick={() => setIsMenuOpen(false)} mobile />
              <NavItem to="/about-us" label="Sobre nosotros" onClick={() => setIsMenuOpen(false)} mobile />
              <NavItem to="/be-teacher" label="¿Ser docente?" onClick={() => setIsMenuOpen(false)} mobile />
              
              <div className="pt-6 border-t border-[#68B2C9]/20">
                <button className="w-full bg-[#68B2C9] text-[#FAF9F5] rounded-2xl px-6 py-4 text-base font-medium shadow-lg hover:bg-[#294954] hover:shadow-xl transition-all duration-300 font-['Roboto']">
                  Perfil
                </button>
              </div>
            </nav>
          </div>
        </div>
      )}
    </>
  );
};

export default Header;
