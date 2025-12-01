import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import ProfileDropdown from '../ProfileDropdown';
import { useChatContext } from '../../context/chat';
import { useBookingApi } from '../../hooks/booking/useBookingApi';
import { useConfirmationsApi } from '../../hooks/confirmations/useConfirmationsApi';
import { BarChart3, Wallet, User, Folder, LogOut, ChevronDown } from 'lucide-react';

type TeacherHeaderProps = {
  user: any;
  onLogout: () => void;
};

const TeacherHeader: React.FC<TeacherHeaderProps> = ({ user, onLogout }) => {
  const location = useLocation();
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileExpanded, setIsProfileExpanded] = useState(false);
  const [isDesktop, setIsDesktop] = useState<boolean>(typeof window !== 'undefined' ? window.innerWidth >= 1024 : false);

  const { getUnreadCount, fetchChats } = useChatContext();
  const unreadTotal = getUnreadCount();
  const hasFetchedRef = React.useRef(false);

  // Counts for bookings and confirmations
  const { getMyNextClasses } = useBookingApi();
  const { getTeacherHistoryRecent } = useConfirmationsApi();
  const [bookingsCount, setBookingsCount] = useState(0);
  const [confirmationsCount, setConfirmationsCount] = useState(0);

  // Shared-cache and throttling for counts
  const COUNTS_KEY = 'teacher_nav_counts';
  const MIN_INTERVAL_MS = 300_000; // at most once every 5 minutes
  const VIS_DEBOUNCE_MS = 800;  // collapse rapid visibility events
  const lastFetchRef = React.useRef<number>(0);
  const debounceRef = React.useRef<number | null>(null);

  const readCountsFromStorage = () => {
    try {
      const raw = localStorage.getItem(COUNTS_KEY);
      if (!raw) return null;
      const parsed = JSON.parse(raw);
      if (typeof parsed?.ts !== 'number') return null;
      return parsed as { ts: number; bookings: number; confirmations: number };
    } catch {
      return null;
    }
  };

  const writeCountsToStorage = (bookings: number, confirmations: number) => {
    try {
      localStorage.setItem(COUNTS_KEY, JSON.stringify({ ts: Date.now(), bookings, confirmations }));
    } catch {}
  };

  const fetchCounts = React.useCallback(async () => {
    try {
      const [nextClassesRes, recentConfRes] = await Promise.all([
        getMyNextClasses(1, 0), // small payload, use `total` when available
        getTeacherHistoryRecent(),
      ]);

      const bookings = nextClassesRes.success
        ? (nextClassesRes.data?.total ?? nextClassesRes.data?.data?.length ?? 0)
        : 0;

      const confItems = recentConfRes.success ? (recentConfRes.data?.items ?? []) : [];
      // Pending confirmations for teacher: confirmable_now and not yet confirmed by teacher
      const pendingConf = confItems.filter((it: any) => it?.confirmable_now && !it?.confirmed_by_teacher).length;

      setBookingsCount(bookings);
      setConfirmationsCount(pendingConf);
      writeCountsToStorage(bookings, pendingConf);
      lastFetchRef.current = Date.now();
    } catch {
      // silent fail
    }
  }, [getMyNextClasses, getTeacherHistoryRecent]);

  React.useEffect(() => {
    const onResize = () => setIsDesktop(window.innerWidth >= 1024);
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  // Cargar previews una sola vez para tener contador total
  React.useEffect(() => {
    if (!hasFetchedRef.current) {
      hasFetchedRef.current = true;
      // Defer chat previews to idle to avoid competing with route paints
      const run = () => { fetchChats(); };
      if ('requestIdleCallback' in window) {
        (window as any).requestIdleCallback(run, { timeout: 600 });
      } else {
        setTimeout(run, 200);
      }
    }
  }, [fetchChats]);

  React.useEffect(() => {
    const cached = readCountsFromStorage();
    if (cached && Date.now() - cached.ts < MIN_INTERVAL_MS) {
      setBookingsCount(cached.bookings);
      setConfirmationsCount(cached.confirmations);
    } else {
      fetchCounts();
    }
  }, [fetchCounts]);

  React.useEffect(() => {
    const onVisibility = () => {
      if (document.visibilityState === 'visible') {
        if (debounceRef.current) window.clearTimeout(debounceRef.current);
        debounceRef.current = window.setTimeout(() => {
          const now = Date.now();
          if (now - lastFetchRef.current >= MIN_INTERVAL_MS) {
            fetchCounts();
          }
        }, VIS_DEBOUNCE_MS) as unknown as number;
      }
    };
    document.addEventListener('visibilitychange', onVisibility);
    return () => {
      document.removeEventListener('visibilitychange', onVisibility);
      if (debounceRef.current) window.clearTimeout(debounceRef.current);
    };
  }, [fetchCounts]);

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
    { to: '/teacher/availability', label: 'Agenda' },
    { to: '/teacher/my_next_booking', label: 'Reservas y confirmaciones' },
    { to: '/teacher/chat', label: 'Chat' },
  ];

  const NavItem: React.FC<{ to: string; label: string; mobile?: boolean; badgeCount?: number; rsvCount?: number; confCount?: number }> = ({ to, label, mobile = false, badgeCount, rsvCount, confCount }) => {
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
      backgroundColor: mobile ? (hover || isActive ? 'rgba(104, 178, 201, 0.12)' : 'transparent') : 'transparent',
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
      if (!visible || !count || count <= 0) return null;
      const text = count > 99 ? '99+' : String(count);
      return (
        <span
          style={{
            display: 'inline-block',
            width: 28, // fixed width to avoid layout shift (fits up to '99+')
            padding: '0 6px',
            height: 18,
            lineHeight: '18px',
            fontSize: 11,
            fontWeight: 700,
            color: '#FFFFFF',
            background: bg,
            borderRadius: 999,
            textAlign: 'center',
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
        onMouseEnter={() => setHover(true)}
        onMouseLeave={() => setHover(false)}
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
              {renderBadge(badgeCount ?? 0, '#F59E0B', !!(badgeCount && badgeCount > 0))}
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
          backgroundColor: '#FAF9F5', // opaque to mask route content repaint
          padding: '16px 0',
          willChange: 'transform, opacity',
          transform: 'translateZ(0)',
          backfaceVisibility: 'hidden'
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
            width: 'auto',
            maxWidth: '100%',
            minWidth: isDesktop ? undefined : 'min(92vw, 440px)',
            justifyContent: 'space-between'
          }}>
            <Link to="/teacher-home" className="flex items-center space-x-2" style={{ textDecoration: 'none' }}>
              <img src="/logo.png" alt="OnlyCation Logo" className="w-[60px] h-[60px]" style={{ objectFit: 'contain', width: isDesktop ? 60 : 56, height: isDesktop ? 60 : 56 }} />
              <span className="font-semibold text-lg" style={{ color: '#294954', fontFamily: 'Inter, sans-serif', fontSize: isDesktop ? '18px' : '18px' }}>OnlyCation</span>
            </Link>

            {isDesktop && (
              <nav className="flex items-center" style={{ gap: '48px' }}>
                {menuItems.map((item) => (
                  <NavItem
                    key={item.label}
                    to={item.to}
                    label={item.label}
                    badgeCount={item.label === 'Chat' ? unreadTotal : undefined}
                    rsvCount={item.label === 'Reservas y confirmaciones' ? bookingsCount : undefined}
                    confCount={item.label === 'Reservas y confirmaciones' ? confirmationsCount : undefined}
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
                    isTeacher={true}
                    isStudent={false}
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
            zIndex: 120, // above catalog filters (101) and sticky headers (40)
            maxHeight: isMenuOpen ? '80vh' : '0',
            overflowY: 'auto',
            opacity: isMenuOpen ? 1 : 0,
            transition: 'all 300ms ease',
            pointerEvents: isMenuOpen ? 'auto' : 'none',
            WebkitOverflowScrolling: 'touch'
          }}
        >
          <nav className="flex flex-col" style={{ gap: '0', maxWidth: '600px', margin: '0 auto' }}>
            {menuItems.map((item, index) => (
              <div key={item.label}>
                <NavItem
                  to={item.to}
                  label={item.label}
                  mobile
                  badgeCount={item.label === 'Chat' ? unreadTotal : undefined}
                  rsvCount={item.label === 'Reservas y confirmaciones' ? bookingsCount : undefined}
                  confCount={item.label === 'Reservas y confirmaciones' ? confirmationsCount : undefined}
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
                    to="/teacher/profile"
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
                    <span style={{ marginRight: '8px', display: 'inline-flex' }}><BarChart3 size={18} color="#68B2C9" /></span>
                    Mi Perfil
                  </Link>

                  <Link
                    to="/teacher/wallet"
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
                    <span style={{ marginRight: '8px', display: 'inline-flex' }}><Wallet size={18} color="#68B2C9" /></span>
                    Cartera
                  </Link>

                  <Link
                    to="/teacher/personal-data"
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

                  <Link
                    to="/teacher/documents"
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
                    <span style={{ marginRight: '8px', display: 'inline-flex' }}><Folder size={18} color="#294954" /></span>
                    Documentos
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

export default TeacherHeader;
