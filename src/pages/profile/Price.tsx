import React, { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PricesProvider, usePricesContext } from '../../context/prices';
import '../../styles/prices.css';
import OnboardingSteps from '../../components/OnboardingSteps';
import { PriceAvailabilityProvider, usePriceAvailabilityContext } from '../../context/catalogs/PriceAvailabilityContext';
import { useActivation } from '../../context/activation/useActivation';

const CreatePriceForm: React.FC = () => {
  const navigate = useNavigate();
  const { createPrice, creating, error, lastCreated, resetStatus } = usePricesContext();
  const { data: availability, priceRanges, loading: loadingAvail, error: availError } = usePriceAvailabilityContext();
  const { check } = useActivation();

  const [preferenceId, setPreferenceId] = useState('');
  const [priceRangeId, setPriceRangeId] = useState('');
  const [selectedPrice, setSelectedPrice] = useState<number>(0);
  const [extraHourPrice, setExtraHourPrice] = useState<number>(0);

  const isValid = useMemo(() => {
    return (
      preferenceId.trim() !== '' &&
      priceRangeId.trim() !== ''
    );
  }, [preferenceId, priceRangeId]);

  React.useEffect(() => {
    if (availability?.preference_id) {
      setPreferenceId(String(availability.preference_id));
    } else {
      const stored = localStorage.getItem('user_preference_id');
      if (stored) setPreferenceId(stored);
    }
  }, [availability?.preference_id]);

  // Selected price range and bounds
  const selectedRange = useMemo(() => priceRanges.find(r => String(r.id) === String(priceRangeId)), [priceRanges, priceRangeId]);
  const minPrice = selectedRange?.minimum_price ?? selectedRange?.min_price ?? 0;
  const maxPrice = selectedRange?.maximum_price ?? selectedRange?.max_price ?? 0;

  // When range changes, snap selectedPrice to minimum within bounds
  React.useEffect(() => {
    if (!selectedRange) return;
    const next = Math.max(minPrice, Math.min(maxPrice || minPrice, selectedPrice || minPrice));
    setSelectedPrice(next);
    setExtraHourPrice(next / 2);
  }, [selectedRange, minPrice, maxPrice]);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isValid) return;

    await createPrice({
      preference_id: Number(preferenceId),
      price_range_id: Number(priceRangeId),
      selected_prices: Number(selectedPrice),
      extra_hour_price: Number(extraHourPrice),
    });
  };

  const onCancel = () => {
    resetStatus();
    navigate(-1);
  };

  React.useEffect(() => {
    if (lastCreated) {
      (async () => {
        try { await check(true); } catch {}
        navigate('/profile/video');
      })();
    }
  }, [lastCreated, navigate, check]);

  return (
    <div className="price-page price-container">
      <div className="price-wrap">
        <OnboardingSteps />
        <div className="price-header">
          <h1 className="price-title">Registrar Precio</h1>
          <p className="price-subtitle" style={{ marginTop: '0.5rem' }}>
            Complete los campos para registrar el precio asociado a sus preferencias.
          </p>
        </div>

        <div className="price-card">
          <form onSubmit={onSubmit} className="price-form" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <div className="price-grid">
              <div style={{ display: 'none' }}>
                <label className="price-label">Preferencia</label>
                <input
                  type="number"
                  className="price-input"
                  placeholder="Preferencia derivada del token"
                  value={preferenceId}
                  onChange={(e) => setPreferenceId(e.target.value)}
                  readOnly
                />
              </div>
              <div>
                <label className="price-label">Rango de Precios</label>
                <select
                  className="price-input"
                  value={priceRangeId}
                  onChange={(e) => setPriceRangeId(e.target.value)}
                  disabled={loadingAvail || !!availError}
                >
                  <option value="">{loadingAvail ? 'Cargando...' : 'Selecciona un rango'}</option>
                  {priceRanges.map((r) => (
                    <option key={r.id} value={r.id}>
                      {r.label || r.name || `${r.minimum_price ?? r.min_price ?? ''} - ${r.maximum_price ?? r.max_price ?? ''}`}
                    </option>
                  ))}
                </select>
                {availError && <div className="price-alert price-alert--error" style={{ marginTop: '0.25rem' }}>{availError}</div>}
              </div>
              <div>
                <label className="price-label">Precio por hora extra</label>
                <input
                  type="number"
                  min={0}
                  className="price-input"
                  placeholder="0"
                  value={extraHourPrice}
                  onChange={(e) => setExtraHourPrice(Number(e.target.value))}
                />
              </div>
            </div>

            <div className="price-grid">
              <div className="price-col-2">
                <label className="price-label">Precio Seleccionado</label>
                <div>
                  <input
                    type="range"
                    min={minPrice}
                    max={Math.max(minPrice, maxPrice)}
                    step={10}
                    value={selectedPrice}
                    onChange={(e) => {
                      const val = Number(e.target.value);
                      setSelectedPrice(val);
                      setExtraHourPrice(val / 2);
                    }}
                    className="price-range"
                    disabled={!selectedRange}
                  />
                  <div className="price-subtitle" style={{ marginTop: '0.25rem' }}>
                    Valor seleccionado: ${selectedPrice}
                  </div>
                </div>
              </div>
            </div>

            

            <div className="price-actions">
              <button type="button" className="price-btn--secondary" onClick={() => navigate('/teacher-home')}>Terminar proceso</button>
              <button type="button" className="price-btn--secondary" onClick={onCancel}>Cancelar</button>
              <button type="submit" className="price-btn--primary" disabled={!isValid || creating}>{creating ? 'Guardando...' : 'Guardar'}</button>
            </div>

            {error && <div className="price-alert price-alert--error">{error}</div>}
            {lastCreated && (
              <div className="price-alert price-alert--success">Precio creado exitosamente (ID {lastCreated.id}).</div>
            )}
          </form>
        </div>
      </div>
      <div className="onboarding-mascot">
        <img src="/Activar_cuenta.png" alt="activar cuenta" />
      </div>
    </div>
  );
};

const CreatePrice: React.FC = () => (
  <PricesProvider>
    <PriceAvailabilityProvider>
      <CreatePriceForm />
    </PriceAvailabilityProvider>
  </PricesProvider>
);

export default CreatePrice;
