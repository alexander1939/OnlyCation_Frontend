import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLoginApi } from '../../hooks/auth/useLoginApi';

interface ActivateAccountCardProps {
  route?: string;
  backgroundColor?: string;
  fullScreen?: boolean;
}

const ActivateAccountCard: React.FC<ActivateAccountCardProps> = ({
  route = '/profile/preferences',
  backgroundColor = 'white',
  fullScreen = true,
}) => {
  const navigate = useNavigate();
  const { logout } = useLoginApi();
  const [logoutHover, setLogoutHover] = useState(false);

  const CardWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => (
    <div
      data-activate-account-card
      style={{
        backgroundColor,
        borderRadius: '1rem',
        padding: '1.5rem',
        boxShadow: '0 4px 8px rgba(0,0,0,0.05)',
        transition: 'transform 0.2s ease, box-shadow 0.2s ease',
        cursor: 'pointer',
        fontFamily: 'Roboto, sans-serif',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
      }}
      onClick={() => navigate(route)}
      onMouseEnter={(e) => {
        e.currentTarget.style.boxShadow = '0 6px 14px rgba(0,0,0,0.1)';
        e.currentTarget.style.transform = 'translateY(-2px)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.boxShadow = '0 4px 8px rgba(0,0,0,0.05)';
        e.currentTarget.style.transform = 'translateY(0)';
      }}
    >
      {children}
    </div>
  );

  const FullscreenWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => (
    <div style={{ position: 'relative', minHeight: '100vh', background: '#FAF9F5', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      {children}
      {/* Ilustración a la derecha */}
      <img
        src="/alert_zorro.png"
        alt="Ilustración"
        style={{
          position: 'fixed',
          right: 24,
          top: '58%',
          transform: 'translateY(-50%)',
          width: '36vw',
          maxWidth: 600,
          minWidth: 260,
          height: 'auto',
          pointerEvents: 'none',
          userSelect: 'none',
          zIndex: 1,
          opacity: 1
        }}
      />
      <style>{`
        @media (max-width: 1024px) {
          img[alt="Ilustración"] { display: none; }
        }
      `}</style>
    </div>
  );

  const Content = (
    <>
      {/* Libreta */}
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          position: 'relative',
          width: '100%',
          maxWidth: 420,
          minHeight: 580,
          borderRadius: '18px',
          boxShadow: '0 10px 20px rgba(0,0,0,0.08)',
          background: '#FFFFFF',
          padding: '20px 18px 22px 28px',
          overflow: 'hidden',
          border: '1px solid rgba(148,163,184,0.15)',
          fontFamily: 'Roboto, sans-serif'
        }}
      >
        {/* Líneas horizontales */}
        <div
          aria-hidden
          style={{
            position: 'absolute',
            inset: 0,
            backgroundImage:
              'repeating-linear-gradient(0deg, rgba(0,0,0,0) 0px, rgba(0,0,0,0) 21px, rgba(15,23,42,0.08) 22px, rgba(15,23,42,0.08) 23px)'
          }}
        />

        {/* Borde derecho con sombra para dar profundidad */}
        <div
          aria-hidden
          style={{
            position: 'absolute',
            top: 0,
            right: 0,
            width: 24,
            height: '100%',
            background:
              'linear-gradient(90deg, rgba(0,0,0,0) 0%, rgba(2,6,23,0.06) 60%, rgba(2,6,23,0.12) 100%)'
          }}
        />

        {/* Anillos (espiral) */}
        <div
          aria-hidden
          style={{
            position: 'absolute',
            left: '-12px',
            top: '28px',
            bottom: '28px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between'
          }}
        >
          {Array.from({ length: 12 }).map((_, i) => (
            <div key={i} style={{ width: '28px', height: '12px', background: '#000', borderRadius: '12px' }} />
          ))}
        </div>

        {/* Contenido */}
        <div style={{ position: 'relative' }}>
          {/* Icono */}
          <div
            style={{
              width: 48,
              height: 48,
              borderRadius: '9999px',
              background: 'rgba(241,245,249,0.9)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '4px auto 16px',
              border: '1px solid rgba(203,213,225,0.9)'
            }}
          >
            <span style={{ color: '#294954B3', fontSize: 20 }}>🎓</span>
          </div>

          {/* Título */}
          <h2 style={{ textAlign: 'center', color: '#294954', fontWeight: 700, marginBottom: 30 }}>
            ¡Activa tu cuenta de docente!
          </h2>

          {/* Hoja amarilla con espiral (según referencia) */}
          <div style={{ position: 'relative', maxWidth: '92%', margin: '0 auto 36px' }}>
            {/* Espiral superior */}
            <div style={{ position: 'absolute', top: -18, left: 8, right: 8, height: 22, display: 'flex', gap: 14, justifyContent: 'flex-start', pointerEvents: 'none' }}>
              {Array.from({ length: 10 }).map((_, i) => (
                <div
                  key={i}
                  style={{
                    width: 26,
                    height: 26,
                    borderRadius: '50%',
                    border: '6px solid #000',
                    borderBottomColor: 'transparent',
                    background: 'transparent',
                    boxShadow: '0 2px 0 rgba(0,0,0,0.15)',
                    transform: 'rotate(15deg)'
                  }}
                />
              ))}
            </div>

            {/* Hoja */}
            <div style={{
              background: '#FFDE97',
              color: '#294954E6',
              fontSize: 13.5,
              lineHeight: 1.55,
              padding: '18px 16px',
              borderRadius: 6,
              border: '3px solid #000',
              textAlign: 'center',
              wordBreak: 'break-word',
              overflowWrap: 'anywhere',
              boxShadow: '0 8px 14px rgba(0,0,0,0.12)'
            }}>
              ¡Activa tu cuenta ahora para impartir clases y ayudar a estudiantes mediante Onlycation! Podrás personalizar tu disponibilidad, cobrar por compartir tus conocimientos y generar un ingreso extra. ¡Empieza a transformar vidas hoy mismo!
            </div>
          </div>

          {/* Botón */}
          <button
            onClick={(e) => { e.stopPropagation(); navigate(route); }}
            style={{
              width: '100%',
              background: '#8ED4BE',
              color: '#fff',
              fontWeight: 600,
              padding: '12px 14px',
              borderRadius: 10,
              border: 'none',
              boxShadow: '0 1px 0 rgba(0,0,0,0.08) inset',
              cursor: 'pointer',
              marginBottom: 18
            }}
          >
            Activar Cuenta
          </button>

          {/* Cerrar sesión */}
          <div style={{ textAlign: 'center', marginTop: 22 }}>
            <span
              role="button"
              tabIndex={0}
              onClick={async (e) => {
                e.stopPropagation();
                try { await logout?.(); } finally { navigate('/login', { replace: true }); }
              }}
              onKeyDown={async (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  try { await logout?.(); } finally { navigate('/login', { replace: true }); }
                }
              }}
              onMouseEnter={() => setLogoutHover(true)}
              onMouseLeave={() => setLogoutHover(false)}
              style={{
                color: logoutHover ? '#DC2626' : '#294954B3',
                fontWeight: 700,
                fontSize: 14,
                textDecoration: logoutHover ? 'underline' : 'none',
                transition: 'color .2s ease, transform .2s ease, text-decoration-color .2s ease',
                cursor: 'pointer',
                padding: '2px 6px',
                borderRadius: 6,
                transform: logoutHover ? 'translateY(-1px)' : 'translateY(0)'
              }}
            >
              Cerrar Sesión
            </span>
          </div>
        </div>
      </div>

      {/* Responsividad */}
      <style>{`
        @media (max-width: 768px) {
          [data-activate-account-card] { padding: 1.2rem !important; }
        }
      `}</style>
    </>
  );

  if (fullScreen) {
    return <FullscreenWrapper>{Content}</FullscreenWrapper>;
  }

  return <CardWrapper>{Content}</CardWrapper>;
};

export default ActivateAccountCard;
