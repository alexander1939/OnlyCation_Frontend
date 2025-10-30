import React from 'react';
import { useAgendaContext } from '../../context/cartera';
import '../../styles/Agenda.css';
import OnboardingSteps from '../../components/OnboardingSteps';

const AgendaPage: React.FC = () => {
  const { createWallet, creating, error, success, lastResponse, resetStatus } = useAgendaContext();

  const handleCreate = async () => {
    await createWallet({});
  };

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
                onClick={handleCreate}
                disabled={creating}
                className="agenda-btn--primary"
              >
                {creating ? 'Creando...' : 'Crear Cartera'}
              </button>
              <button
                type="button"
                onClick={resetStatus}
                className="agenda-btn--secondary"
              >
                Limpiar estado
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
                >
                  Completar configuración en Stripe
                </a>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AgendaPage;
