import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useActivationApi } from '../../hooks/activation/useActivationApi';
import '../../styles/Agenda.css';

const ActivateAccount: React.FC = () => {
  const { activateTeacher, checkActivation } = useActivationApi();
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);
  const [done, setDone] = React.useState(false);
  const navigate = useNavigate();

  // Run only once (guard StrictMode and changing deps)
  const didRunRef = React.useRef(false);
  React.useEffect(() => {
    if (didRunRef.current) return;
    didRunRef.current = true;
    (async () => {
      try {
        setLoading(true);
        setError(null);
        const status = await checkActivation();
        if ((status as any)?.is_active) {
          setDone(true);
        } else {
          await activateTeacher();
          setDone(true);
        }
      } catch (e: any) {
        setError(e?.message || 'No se pudo activar la cuenta');
      } finally {
        setLoading(false);
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="agenda-page agenda-container">
      <div className="agenda-wrap">
        <div className="agenda-header">
          <h1 className="agenda-title agenda-title-lg">Activar cuenta</h1>
          <p className="agenda-subtitle agenda-text-sm">Confirmaremos con el servidor y activaremos tu cuenta docente.</p>
          <div style={{ position: 'fixed', left: '2rem', bottom: '1rem', pointerEvents: 'none' }}>
            <img src="/Activar_cuenta.png" alt="activar cuenta" style={{ width: '330px', height: 'auto' }} />
          </div>
        </div>

        <div className="agenda-card">
          <div className="agenda-body" style={{ textAlign: 'center', paddingTop: '1rem' }}>
            {loading && <p className="agenda-text-sm">Activando tu cuenta...</p>}
            {error && <p className="agenda-alert agenda-alert--error">{error}</p>}
            {done && !error && (
              <>
                <p className="agenda-alert agenda-alert--success" style={{ marginTop: 0 }}>¡Cuenta activada correctamente! 🎉</p>
                <div className="agenda-actions" style={{ justifyContent: 'center', marginTop: '0.5rem' }}>
                  <button className="agenda-btn--primary" onClick={() => navigate('/teacher-home')}>Ir al inicio docente</button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ActivateAccount;
