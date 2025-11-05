import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import ProfileDropdown from '../ProfileDropdown';

type StudentHeaderProps = {
  user: any;
  onLogout: () => void;
};

const StudentHeader: React.FC<StudentHeaderProps> = ({ user, onLogout }) => {
  const location = useLocation();
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDesktop, setIsDesktop] = useState<boolean>(typeof window !== 'undefined' ? window.innerWidth >= 768 : false);

  React.useEffect(() => {
    const onResize = () => setIsDesktop(window.innerWidth >= 768);
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  React.useEffect(() => {
    if (!isDesktop) {
      document.body.style.overflow = isMenuOpen ? 'hidden' : '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isMenuOpen, isDesktop]);
  
  const userInitials = user 
    ? `${user.first_name?.[0] ?? ''}${user.last_name?.[0] ?? ''}`.toUpperCase() || 'U'
    : '';

  const menuItems = [
    { to: '/catalog/teachers', label: 'Docentes' },
    { to: '/student/chat', label: 'Chat' },
    { to: '/student/my_next_booking', label: 'Reservas' },
    { to: '/student/confirmation', label: 'Confirmación' },
  ];

  const NavItem: React.FC<{ to: string; label: string; mobile?: boolean }> = ({ to, label, mobile = false }) => {
    const isActive = location.pathname === to;
    const [hover, setHover] = useState(false);

    const linkStyle: React.CSSProperties = {
      position: 'relative',
      fontWeight: '600',
      fontSize: mobile ? '16px' : '18px',
      textDecoration: 'none',
      color: isActive ? '#68B2C9' : '#294954',
      fontFamily: 'Inter, sans-serif',
      padding: mobile ? '16px 24px' : '8px 12px',
      borderRadius: mobile ? '16px' : 0,
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
            padding: isDesktop ? '8px 24px' : '12px 22px',
            gap: '32px',
            boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
            width: 'auto',
            maxWidth: '100%',
            minWidth: isDesktop ? undefined : 'min(92vw, 440px)',
            justifyContent: 'space-between'
          }}>
            <Link to="/student-home" className="flex items-center space-x-2" style={{ textDecoration: 'none' }}>
              <img src="/logo.png" alt="OnlyCation Logo" className="w-[60px] h-[60px]" style={{ objectFit: 'contain', width: isDesktop ? 60 : 52, height: isDesktop ? 60 : 52 }} />
              <span className="font-semibold text-lg" style={{ color: '#294954', fontFamily: 'Inter, sans-serif', fontSize: isDesktop ? '18px' : '17px' }}>OnlyCation</span>
            </Link>

            {isDesktop && (
              <nav className="flex items-center" style={{ gap: '48px' }}>
                {menuItems.map((item) => (
                  <NavItem key={item.label} to={item.to} label={item.label} />
                ))}
              </nav>
            )}

            {isDesktop && (
              <div className="relative ml-8">
                <button 
                  className="rounded-full flex items-center justify-center transition-all duration-300 overflow-hidden"
                  onClick={() => setIsProfileOpen(!isProfileOpen)}
                  style={{
                    width: '44px',
                    height: '44px',
                    backgroundColor: '#0f9d68',
                    color: '#fff',
                    fontFamily: 'Roboto, sans-serif',
                    fontWeight: 700,
                    fontSize: '16px',
                    border: 'none',
                    cursor: 'pointer'
                  }}
                >
                  {userInitials}
                </button>

                {isProfileOpen && (
                  <ProfileDropdown
                    user={user}
                    isTeacher={false}
                    isStudent={true}
                    onClose={() => setIsProfileOpen(false)}
                    onLogout={onLogout}
                  />
                )}
              </div>
            )}

            {!isDesktop && (
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="flex flex-col justify-center items-center w-8 h-8"
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
            )}
          </div>
        </div>
      </header>

      {isDesktop && isProfileOpen && (
        <div 
          className="fixed inset-0 z-30" 
          onClick={() => setIsProfileOpen(false)}
        />
      )}

      {!isDesktop && isMenuOpen && (
        <div className="fixed inset-0 z-[60]">
          <div className="fixed inset-0 bg-[#294954]/20 backdrop-blur-sm" onClick={() => setIsMenuOpen(false)}></div>
          <div className="fixed top-24 left-4 right-4 bg-[#FAF9F5]/95 backdrop-blur-xl rounded-[28px] shadow-xl border border-[#68B2C9]/20 p-8">
            <nav className="flex flex-col space-y-6">
              {menuItems.map((item) => (
                <NavItem key={item.label} to={item.to} label={item.label} mobile />
              ))}

              <div className="pt-6 border-t border-[#68B2C9]/20">
                <button 
                  onClick={() => { setIsMenuOpen(false); onLogout(); }}
                  className="w-full bg-[#68B2C9] text-[#FAF9F5] rounded-2xl px-6 py-4 text-base font-medium shadow-lg hover:bg-[#294954] transition-all duration-300 block text-center"
                  style={{ border: 'none', cursor: 'pointer' }}
                >
                  Cerrar sesión
                </button>
              </div>
            </nav>
          </div>
        </div>
      )}
    </>
  );
};

export default StudentHeader;
