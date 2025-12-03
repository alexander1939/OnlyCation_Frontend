import React from 'react';
import { useAgendaContext } from '../../context/wallet';
import '../../styles/Agenda.css';
import OnboardingSteps from '../../components/OnboardingSteps';
import { useLoginApi } from '../../hooks/auth/useLoginApi';
import { useNavigate } from 'react-router-dom';

const AgendaPage: React.FC = () => {
  const { createWallet, creating, error, success, lastResponse, resetStatus } = useAgendaContext();
  const { logout } = useLoginApi();
  const navigate = useNavigate();

  const handleCreate = async () => {
    await createWallet({});
  };

  // Al volver de Stripe, cerrar sesión automáticamente si marcamos bandera
  React.useEffect(() => {
    const checkAndLogout = async () => {
      const flag = localStorage.getItem('post_stripe_logout');
      if (flag === '1') {
        localStorage.removeItem('post_stripe_logout');
        try { await logout(); } catch {}
        navigate('/login', { replace: true });
      }
    };
    // Check on mount
    checkAndLogout();
    // Check on focus
    const onFocus = () => { void checkAndLogout(); };
    const onStorage = (e: StorageEvent) => {
      if (e.key === 'post_stripe_logout' && e.newValue === '1') {
        void checkAndLogout();
      }
    };
    window.addEventListener('focus', onFocus);
    window.addEventListener('storage', onStorage);
    return () => {
      window.removeEventListener('focus', onFocus);
      window.removeEventListener('storage', onStorage);
    };
  }, [logout, navigate]);

  // Route-specific modal: must acknowledge importance of completing wallet setup.
  const [showWalletModal, setShowWalletModal] = React.useState<boolean>(true);
  const [secondsLeft, setSecondsLeft] = React.useState<number>(5);

  React.useEffect(() => {
    // Show modal on mount and start 5s countdown for the OK button
    setShowWalletModal(true);
    setSecondsLeft(5);
    const id = window.setInterval(() => {
      setSecondsLeft((prev) => {
        if (prev <= 1) {
          window.clearInterval(id);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => window.clearInterval(id);
  }, []);

  return (
    <div className="agenda-page agenda-container">
      <div className="agenda-wrap">
        <OnboardingSteps />
        <div className="agenda-header">
          <h1 className="agenda-title agenda-title-lg">Configura tu Cartera</h1>
          <p className="agenda-subtitle agenda-text-sm">
            Necesitas una cartera para administrar pagos. Crea tu cuenta de Stripe Connect.
          </p>
        </div>

        <div className="agenda-card">
          <div className="agenda-body">
            <div className="agenda-actions">
              <button
                type="button"
                onClick={() => navigate('/teacher-home')}
                className="agenda-btn--danger agenda-btn--lg agenda-btn--exit"
              >
                Salir de activación
              </button>
              <button
                type="button"
                onClick={handleCreate}
                disabled={creating}
                className="agenda-btn--primary"
              >
                {creating ? 'Creando...' : 'Crear Cartera'}
              </button>
            </div>

            {error && <p className="agenda-alert agenda-alert--error">{error}</p>}
            {success && lastResponse && (
              <div className="agenda-result">
                <p className="agenda-alert agenda-alert--success">
                  {lastResponse.data?.stripe_setup_url
                    ? 'Cartera lista. Completa la configuración en Stripe usando el link de abajo.'
                    : (lastResponse.message || 'Cartera creada correctamente.')}
                </p>
                <div className="agenda-kv">
                  <div>
                    <span className="agenda-k">Stripe Account</span>
                    <span className="agenda-v">{lastResponse.data.stripe_account_id}</span>
                  </div>
                  <div>
                    <span className="agenda-k">Estado Stripe</span>
                    <span className="agenda-v">{lastResponse.data.stripe_status}</span>
                  </div>
                </div>
              </div>
            )}

            {/* CTA centrado para completar en Stripe al final */}
            {success && lastResponse?.data?.stripe_setup_url && (
              <div className="agenda-cta-center">
                <a
                  className="agenda-btn--cta agenda-btn--pulse"
                  href={lastResponse.data.stripe_setup_url}
                  target="_blank"
                  rel="noreferrer"
                  onClick={() => {
                    try { localStorage.setItem('post_stripe_logout', '1'); } catch {}
                  }}
                >
                  Completar configuración en Stripe
                </a>
              </div>
            )}
          </div>
        </div>
      </div>
      <div className="onboarding-mascot">
        <img src="/Activar_cuenta.png" alt="activar cuenta" />
      </div>
      {showWalletModal && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="wallet-modal-title"
          aria-describedby="wallet-modal-desc"
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(0,0,0,0.6)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 9999,
            padding: 16,
          }}
        >
          <div
            style={{
              background: '#fff',
              borderRadius: 16,
              border: '1px solid rgba(104,178,201,0.25)',
              boxShadow: '0 14px 44px rgba(41,73,84,0.25)',
              width: '100%',
              maxWidth: 520,
              padding: 20,
            }}
          >
            <h2 id="wallet-modal-title" style={{ margin: 0, color: '#294954', fontWeight: 800, fontSize: 20 }}>
              Completa este paso
            </h2>
            <p id="wallet-modal-desc" style={{ color: '#35586a', lineHeight: 1.6, marginTop: 10 }}>
              Es importante completar la configuración de tu cartera (Stripe Connect) para gestionar tus ingresos en la plataforma y poder retirarlos a tu tarjeta o cuenta bancaria.
            </p>
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, marginTop: 16 }}>
              <button
                type="button"
                disabled={secondsLeft > 0}
                onClick={() => setShowWalletModal(false)}
                style={{
                  padding: '10px 16px',
                  borderRadius: 10,
                  fontWeight: 700,
                  border: '1px solid rgba(104,178,201,0.35)',
                  background: secondsLeft > 0 ? '#f3f4f6' : '#68B2C9',
                  color: secondsLeft > 0 ? '#9ca3af' : '#FAF9F5',
                  cursor: secondsLeft > 0 ? 'not-allowed' : 'pointer',
                }}
              >
                {secondsLeft > 0 ? `OK (${secondsLeft})` : 'OK'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AgendaPage;
