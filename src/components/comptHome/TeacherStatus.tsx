import React from 'react';
import { useNavigate } from 'react-router-dom';
import { CheckCircle, AlertTriangle } from 'lucide-react';

const TeacherStatus: React.FC = () => {
  const [status, setStatus] = React.useState<string | null>(null);
  const navigate = useNavigate();

  React.useEffect(() => {
    setStatus(localStorage.getItem('user_status'));
    const handleStorage = (e: StorageEvent) => {
      if (e.key === 'user_status') {
        setStatus(e.newValue);
      }
    };
    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
  }, []);

  const panelStyle: React.CSSProperties = {
    backgroundColor: '#fff',
    borderRadius: '0.75rem',
    padding: '1rem',
    boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
    fontFamily: "Roboto, -apple-system, BlinkMacSystemFont, 'Segoe UI', Helvetica, Arial, 'Apple Color Emoji', 'Segoe UI Emoji'",
    width: '100%',
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
  };

  const cardBodyStyle: React.CSSProperties = {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    gap: '0.75rem',
  };

  const Title = ({ children }: { children: React.ReactNode }) => (
    <h3 style={{ margin: 0, fontWeight: 600, fontSize: '1rem', color: '#0f172a' }}>{children}</h3>
  );

  const HeaderRow: React.FC<{ kind: 'active' | 'pending' }> = ({ kind }) => (
    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
      {kind === 'active' ? (
        <CheckCircle size={18} color="#16A34A" />
      ) : (
        <AlertTriangle size={18} color="#F59E0B" />
      )}
      <Title>{kind === 'active' ? 'Estado de tu cuenta' : 'Activa tu cuenta docente'}</Title>
    </div>
  );

  const Divider = () => (
    <div style={{ height: 1, backgroundColor: '#E5E7EB', margin: '0.25rem 0 0.5rem' }} />
  );

  const Badge: React.FC<{ text: string }> = ({ text }) => (
    <span
      style={{
        display: 'inline-block',
        backgroundColor: '#F3F4F6',
        color: '#374151',
        borderRadius: '999px',
        padding: '0.25rem 0.5rem',
        fontSize: '0.8rem',
        fontWeight: 500,
      }}
    >
      {text}
    </span>
  );

  // ACTIVE VIEW
  if (status === 'active') {
    return (
      <div style={panelStyle}>
        <div style={cardBodyStyle}>
          <div>
            <HeaderRow kind="active" />
            <Divider />
            <div className="agenda-alert agenda-alert--success" role="status" style={{ marginTop: '0.25rem' }}>
              Cuenta activada
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem', marginTop: '0.6rem' }}>
              <Badge text="Impartir clases" />
              <Badge text="Recibir pagos" />
              <Badge text="Personalizar agenda" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  // PENDING OR UNKNOWN VIEW
  if (status === 'pending' || !status) {
    return (
      <div style={panelStyle}>
        <div style={cardBodyStyle}>
          <div>
            <HeaderRow kind="pending" />
            <Divider />
            <div
              style={{
                marginTop: '0.25rem',
                backgroundColor: '#FFF8E5',
                border: '1px solid #FDE68A',
                borderRadius: '0.5rem',
                padding: '0.75rem',
                display: 'flex',
                gap: '0.5rem',
                alignItems: 'flex-start',
              }}
            >
              <div
                style={{
                  backgroundColor: '#FEF3C7',
                  borderRadius: '999px',
                  width: 28,
                  height: 28,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flex: '0 0 auto',
                }}
              >
                <AlertTriangle size={16} color="#B45309" />
              </div>
              <div style={{ color: '#7C2D12' }}>
                <strong style={{ display: 'block', marginBottom: '0.15rem' }}>Advertencia</strong>
                <span style={{ fontSize: '0.9rem', lineHeight: 1.4 }}>
                  Si quieres impartir clases tendrás que activar tu cuenta.
                </span>
              </div>
            </div>
          </div>
          <div className="agenda-actions">
            <button className="agenda-btn--primary" onClick={() => navigate('/profile/activate')}>
              Activar cuenta
            </button>
          </div>
        </div>
      </div>
    );
  }

  // FALLBACK VIEW
  return (
    <div style={panelStyle}>
      <div style={cardBodyStyle}>
        <div>
          <HeaderRow kind="pending" />
          <Divider />
          <div className="agenda-alert" role="status" style={{ marginTop: '0.25rem' }}>
            Estado: {status}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TeacherStatus;
