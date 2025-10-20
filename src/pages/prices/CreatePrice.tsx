import React, { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PricesProvider, usePricesContext } from '../../context/prices';
import '../../styles/prices.css';

const CreatePriceForm: React.FC = () => {
  const navigate = useNavigate();
  const { createPrice, creating, error, lastCreated, resetStatus } = usePricesContext();

  const [preferenceId, setPreferenceId] = useState('');
  const [priceRangeId, setPriceRangeId] = useState('');
  const [selectedPricesRaw, setSelectedPricesRaw] = useState('');
  const [extraHourPrice, setExtraHourPrice] = useState('');

  const isValid = useMemo(() => {
    return (
      preferenceId.trim() !== '' &&
      priceRangeId.trim() !== '' &&
      selectedPricesRaw.trim() !== '' &&
      extraHourPrice.trim() !== ''
    );
  }, [preferenceId, priceRangeId, selectedPricesRaw, extraHourPrice]);

  const parseSelectedPrices = (): number[] => {
    return selectedPricesRaw
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean)
      .map((n) => Number(n))
      .filter((n) => !Number.isNaN(n));
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isValid) return;

    await createPrice({
      preference_id: Number(preferenceId),
      price_range_id: Number(priceRangeId),
      selected_prices: parseSelectedPrices(),
      extra_hour_price: Number(extraHourPrice),
    });
  };

  const onCancel = () => {
    resetStatus();
    navigate(-1);
  };

  return (
    <div className="price-page price-container">
      <div className="price-wrap">
        <div className="price-header">
          <h1 className="price-title">Registrar Precio</h1>
          <p className="price-subtitle" style={{ marginTop: '0.5rem' }}>
            Complete los campos para registrar el precio asociado a sus preferencias.
          </p>
        </div>

        <div className="price-card">
          <form onSubmit={onSubmit} className="price-form" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <div className="price-grid">
              <div>
                <label className="price-label">Preferencia</label>
                <input
                  type="number"
                  className="price-input"
                  placeholder="Ingresa tu preferencia"
                  value={preferenceId}
                  onChange={(e) => setPreferenceId(e.target.value)}
                />
              </div>
              <div>
                <label className="price-label">Rango de Precios</label>
                <input
                  type="number"
                  className="price-input"
                  placeholder="Selecciona el rango"
                  value={priceRangeId}
                  onChange={(e) => setPriceRangeId(e.target.value)}
                />
              </div>
            </div>

            <div className="price-grid">
              <div>
                <label className="price-label">Precio Seleccionado</label>
                <input
                  type="text"
                  className="price-input"
                  placeholder="Ingresa los precios seleccionados"
                  value={selectedPricesRaw}
                  onChange={(e) => setSelectedPricesRaw(e.target.value)}
                />
              </div>
              <div>
                <label className="price-label">Precio por Hora Extra</label>
                <div>
                  <input
                    type="range"
                    min={0}
                    max={1000}
                    step={10}
                    value={extraHourPrice || '0'}
                    onChange={(e) => setExtraHourPrice(e.target.value)}
                    className="price-range"
                  />
                  <div className="price-subtitle" style={{ marginTop: '0.25rem' }}>
                    Valor seleccionado: ${extraHourPrice || '0'}
                  </div>
                </div>
              </div>
            </div>

            <div className="price-actions">
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
    </div>
  );
};

const CreatePrice: React.FC = () => (
  <PricesProvider>
    <CreatePriceForm />
  </PricesProvider>
);

export default CreatePrice;
