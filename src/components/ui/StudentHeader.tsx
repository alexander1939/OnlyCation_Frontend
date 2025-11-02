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
  
  const userInitials = user 
    ? `${user.first_name?.[0] ?? ''}${user.last_name?.[0] ?? ''}`.toUpperCase() || 'U'
    : '';

  const menuItems = [
    { to: '/teachers', label: 'Docentes' },
    { to: '/student/chat', label: 'Chat' },
    { to: '/student/my_next_booking', label: 'Reservas' },
    { to: '/student/confirmation', label: 'Confirmación' },
  ];

  const NavItem: React.FC<{ to: string; label: string }> = ({ to, label }) => {
    const isActive = location.pathname === to;
    const [hover, setHover] = useState(false);

    const linkStyle: React.CSSProperties = {
      position: 'relative',
      fontWeight: '600',
      fontSize: '18px',
      textDecoration: 'none',
      color: isActive ? '#68B2C9' : '#294954',
      fontFamily: 'Inter, sans-serif',
      padding: '8px 12px',
      display: 'block',
      transition: 'color 200ms ease'
    };

    const underlineStyle: React.CSSProperties = {
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

    const activeDotStyle: React.CSSProperties = {
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
        <div className="w-full" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            backgroundColor: '#FFFFFF',
            borderRadius: '50px',
            padding: '8px 24px',
            gap: '32px',
            boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
          }}>
            <Link to="/student-home" className="flex items-center space-x-2" style={{ textDecoration: 'none' }}>
              <img src="/logo.png" alt="OnlyCation Logo" className="w-[60px] h-[60px]" style={{ objectFit: 'contain' }} />
              <span className="font-semibold text-lg" style={{ color: '#294954', fontFamily: 'Inter, sans-serif' }}>OnlyCation</span>
            </Link>

            <nav className="flex items-center space-x-12">
              {menuItems.map((item) => (
                <NavItem key={item.label} to={item.to} label={item.label} />
              ))}
            </nav>

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
          </div>
        </div>
      </header>

      {isProfileOpen && (
        <div 
          className="fixed inset-0 z-30" 
          onClick={() => setIsProfileOpen(false)}
        />
      )}
    </>
  );
};

export default StudentHeader;
