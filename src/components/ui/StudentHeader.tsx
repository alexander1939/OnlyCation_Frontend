import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import ProfileDropdown from '../ProfileDropdown';
import { useChatContext } from '../../context/chat';
import { useBookingApi } from '../../hooks/booking/useBookingApi';
import { useConfirmationsApi } from '../../hooks/confirmations/useConfirmationsApi';
import { User, LogOut, ChevronDown } from 'lucide-react';

type StudentHeaderProps = {
  user: any;
  onLogout: () => void;
};

const StudentHeader: React.FC<StudentHeaderProps> = ({ user, onLogout }) => {
  const location = useLocation();
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileExpanded, setIsProfileExpanded] = useState(false);
  const [isDesktop, setIsDesktop] = useState<boolean>(typeof window !== 'undefined' ? window.innerWidth >= 1024 : false);

  // Counters (alumno)
  const { getMyNextClasses } = useBookingApi();
  const { getStudentHistoryRecent } = useConfirmationsApi();
  const [bookingsCount, setBookingsCount] = useState(0);
  const [confirmationsCount, setConfirmationsCount] = useState(0);
  const COUNTS_KEY = 'student_nav_counts';
  const MIN_INTERVAL_MS = 300_000; // 5 minutos
  const VIS_DEBOUNCE_MS = 800;
  const lastFetchRef = React.useRef<number>(0);
  const debounceRef = React.useRef<number | null>(null);

  const { getUnreadCount, fetchChats } = useChatContext();
  const unreadTotal = getUnreadCount();
  const hasFetchedRef = React.useRef(false);

  React.useEffect(() => {
    const onResize = () => setIsDesktop(window.innerWidth >= 1024);
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  // Cargar previews una sola vez para tener contador total
  React.useEffect(() => {
    if (!hasFetchedRef.current) {
      hasFetchedRef.current = true;
      fetchChats();
    }
  }, [fetchChats]);

  const userInitials = user
    ? `${user.first_name?.[0] ?? ''}${user.last_name?.[0] ?? ''}`.toUpperCase() || 'U'
    : '';

  const dropdownRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsProfileOpen(false);
      }
    };

    if (isProfileOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isProfileOpen]);

  const menuItems = [
    { to: '/catalog/teachers', label: 'Docentes' },
    { to: '/student/my_next_booking', label: 'Reservas y confirmaciones' },
    { to: '/student/chat', label: 'Chat', badgeCount: unreadTotal },
  ];

  const NavItem: React.FC<{ to: string; label: string; mobile?: boolean; rsvCount?: number; confCount?: number; badgeCount?: number }> = ({ to, label, mobile = false, rsvCount, confCount, badgeCount }) => {
    const isActive = location.pathname === to;
    const [hover, setHover] = useState(false);

    const linkStyle: React.CSSProperties = {
      position: 'relative',
      fontWeight: '600',
      fontSize: mobile ? '15px' : '18px',
      textDecoration: 'none',
      color: isActive ? '#68B2C9' : '#294954',
      fontFamily: 'Inter, sans-serif',
      padding: mobile ? '14px 20px' : '8px 12px',
      borderRadius: mobile ? '12px' : '12px',
      textAlign: mobile ? 'left' : 'left',
      display: 'block',
      width: mobile ? '100%' : undefined,
      backgroundColor: mobile ? (isActive ? 'rgba(104, 178, 201, 0.12)' : 'transparent') : 'transparent',
      border: 'none',
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

    const renderBadge = (count: number, bg: string = '#F59E0B', visible: boolean = true) => {
      const text = count > 99 ? '99+' : String(count);
      return (
        <span
          style={{
            display: 'inline-block',
            minWidth: 18,
            padding: '0 6px',
            height: 18,
            lineHeight: '18px',
            fontSize: 11,
            fontWeight: 700,
            color: '#FFFFFF',
            background: bg,
            borderRadius: 999,
            textAlign: 'center',
            opacity: visible ? 1 : 0,
            transition: 'opacity 180ms ease',
            pointerEvents: 'none',
          }}
        >
          {text}
        </span>
      );
    };

    return (
      <Link
        to={to}
        onMouseEnter={!mobile ? () => setHover(true) : undefined}
        onMouseLeave={!mobile ? () => setHover(false) : undefined}
        style={linkStyle}
      >
        {mobile && isActive && <span style={{ marginRight: '8px', fontSize: '18px' }}>•</span>}
        <span style={{ position: 'relative', zIndex: 10, display: 'inline-flex', alignItems: 'center', gap: 8 }}>
          {label === 'Reservas y confirmaciones' ? (
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
              <span>Reservas</span>
              {renderBadge(rsvCount ?? 0, '#F59E0B', !!(rsvCount && rsvCount > 0))}
              <span style={{ opacity: 0.8, margin: '0 2px' }}>y</span>
              <span>Confirmaciones</span>
              {renderBadge(confCount ?? 0, '#F59E0B', !!(confCount && confCount > 0))}
            </span>
          ) : (
            <>
              {label}
              {!!badgeCount && badgeCount > 0 && (
                <span
                  style={{
                    display: 'inline-block',
                    minWidth: 18,
                    padding: '0 6px',
                    height: 18,
                    lineHeight: '18px',
                    fontSize: 11,
                    fontWeight: 700,
                    color: '#FFFFFF',
                    background: '#F59E0B',
                    borderRadius: 999,
                    textAlign: 'center',
                  }}
                >
                  {badgeCount}
                </span>
              )}
            </>
          )}
        </span>
        {!mobile && <span style={underlineStyle} />}
        {!mobile && isActive && <span style={activeDotStyle} />}
      </Link>
    );
  };

  return (
    <>
      <header
        className="fixed top-0 left-0 right-0 z-[70] w-full"
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
            padding: isDesktop ? '8px 24px' : '14px 24px',
            gap: '32px',
            boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
            width: isDesktop ? 'auto' : 'calc(100% - 32px)',
            maxWidth: isDesktop ? '100%' : '500px',
            margin: isDesktop ? undefined : '0 auto',
            justifyContent: 'space-between'
          }}>
            <Link to="/student-home" className="flex items-center space-x-2" style={{ textDecoration: 'none' }}>
              <img src="/logo.png" alt="OnlyCation Logo" className="w-[60px] h-[60px]" style={{ objectFit: 'contain', width: isDesktop ? 60 : 56, height: isDesktop ? 60 : 56 }} />
              <span className="font-semibold text-lg" style={{ color: '#294954', fontFamily: 'Inter, sans-serif', fontSize: isDesktop ? '18px' : '17px' }}>OnlyCation</span>
            </Link>

            {isDesktop && (
              <nav className="flex items-center" style={{ gap: '48px' }}>
                {menuItems.map((item) => (
                  <NavItem
                    key={item.label}
                    to={item.to}
                    label={item.label}
                    rsvCount={bookingsCount}
                    confCount={confirmationsCount}
                    badgeCount={item.badgeCount}
                  />
                ))}
              </nav>
            )}

            {isDesktop && (
              <div className="relative ml-8" ref={dropdownRef}>
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

      {!isDesktop && (
        <div
          style={{
            position: 'fixed',
            top: '92px',
            left: '50%',
            transform: isMenuOpen ? 'translateX(-50%)' : 'translateX(-50%) translateY(-10px)',
            width: 'calc(100% - 32px)',
            maxWidth: '500px',
            backgroundColor: '#FAF9F5',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.08)',
            borderRadius: '0 0 20px 20px',
            padding: '20px',
            maxHeight: isMenuOpen ? '80vh' : '0',
            overflowY: isMenuOpen ? 'auto' : 'hidden',
            opacity: isMenuOpen ? 1 : 0,
            transition: 'all 300ms ease',
            pointerEvents: isMenuOpen ? 'auto' : 'none',
            WebkitOverflowScrolling: 'touch',
            zIndex: 40
          }}
        >
          <nav className="flex flex-col" style={{ gap: '0', maxWidth: '600px', margin: '0 auto' }}>
            {menuItems.map((item, index) => (
              <div key={item.label}>
                <NavItem
                  to={item.to}
                  label={item.label}
                  mobile
                  rsvCount={bookingsCount}
                  confCount={confirmationsCount}
                  badgeCount={item.badgeCount}
                />
                {index < menuItems.length - 1 && (
                  <div style={{ height: '1px', backgroundColor: 'rgba(104, 178, 201, 0.15)', margin: '0 20px' }} />
                )}
              </div>
            ))}

            <div style={{ marginTop: '16px', paddingTop: '16px', borderTop: '2px solid rgba(104, 178, 201, 0.25)' }}>
              <button
                onClick={() => setIsProfileExpanded(!isProfileExpanded)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  padding: '12px 20px',
                  marginBottom: '8px',
                  width: '100%',
                  border: 'none',
                  background: 'transparent',
                  cursor: 'pointer',
                  borderRadius: '12px',
                  transition: 'background-color 200ms ease'
                }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'rgba(104, 178, 201, 0.08)'}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
              >
                <div style={{ width: 40, height: 40, borderRadius: '50%', backgroundColor: '#0f9d68', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'Roboto, sans-serif', fontWeight: 700, fontSize: '14px' }}>
                  {userInitials}
                </div>
                <div style={{ flex: 1, minWidth: 0, textAlign: 'left' }}>
                  <div style={{ color: '#294954', fontFamily: 'Roboto, sans-serif', fontWeight: 700, fontSize: '14px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{user?.first_name} {user?.last_name}</div>
                  <div style={{ color: '#294954', opacity: 0.7, fontFamily: 'Roboto, sans-serif', fontSize: '12px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{user?.email}</div>
                </div>
                <div style={{ color: '#294954', fontSize: '18px', transition: 'transform 200ms ease', transform: isProfileExpanded ? 'rotate(180deg)' : 'rotate(0deg)' }}>
                  <ChevronDown size={18} color="#294954" />
                </div>
              </button>

              {isProfileExpanded && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  <Link
                    to="/student/personal-data"
                    onClick={() => setIsMenuOpen(false)}
                    style={{
                      position: 'relative',
                      fontWeight: '600',
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
                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'rgba(104, 178, 201, 0.12)'}
                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                  >
                    <span style={{ marginRight: '8px', display: 'inline-flex' }}><User size={18} color="#294954" /></span>
                    Datos Personales
                  </Link>

                  <button
                    onClick={() => { setIsMenuOpen(false); onLogout(); }}
                    style={{
                      position: 'relative',
                      fontWeight: '600',
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
                      border: 'none',
                      cursor: 'pointer',
                      transition: 'all 200ms ease'
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'rgba(104, 178, 201, 0.12)'}
                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                  >
                    <span style={{ marginRight: '8px', display: 'inline-flex' }}><LogOut size={18} color="#FF9978" /></span>
                    Cerrar sesión
                  </button>
                </div>
              )}
            </div>
          </nav>
        </div>
      )}
    </>
  );
};

export default StudentHeader;
