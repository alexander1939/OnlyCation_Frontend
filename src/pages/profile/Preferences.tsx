import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { usePreferencesContext } from '../../context/preferences';
import type { PreferenceCreateRequest } from '../../context/preferences/types';
import '../../styles/Preferences.css';
import { useCatalogsContext } from '../../context/catalogs/CatalogsContext';
import OnboardingSteps from '../../components/OnboardingSteps';
import { useActivation } from '../../context/activation/useActivation';

// Las opciones ahora provienen del CatalogsContext

const initialForm: PreferenceCreateRequest = {
  educational_level_id: 1,
  modality_id: 1,
  location: '',
  location_description: '',
};

const PreferencesPage: React.FC = () => {
  const { createPreferences, creating: loading, error, success } = usePreferencesContext();
  const navigate = useNavigate();
  const { educationalLevels, modalities, loading: loadingCatalogs, error: catalogsError } = useCatalogsContext();
  const { check, getNextRoute } = useActivation();
  const [form, setForm] = useState<PreferenceCreateRequest>(initialForm);
  const [locationError, setLocationError] = useState<string | null>(null);
  const [locationDescError, setLocationDescError] = useState<string | null>(null);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    const sanitize = (s: string) => s.replace(/[^A-Za-zÀ-ÿ0-9 ,\.]+/g, ' ').replace(/\s{2,}/g, ' ').trimStart();
    setForm(prev => ({
      ...prev,
      [name]: name.endsWith('_id') ? Number(value) : sanitize(value),
    }));
    if (name === 'location') {
      const v = sanitize(value).trim();
      const onlyLetters = v.replace(/[^A-Za-zÀ-ÿ]/g, '');
      const hasLetters = /[A-Za-zÀ-ÿ]/.test(v);
      const hasMinLetters = onlyLetters.length >= 3;
      const repeatedChar = /(.)\1{3,}/i.test(v);
      const laughter = /(ja|je|ji|jo|ju|ha|he|hi|ho|hu){3,}/i.test(v);
      const hasVowel = /[AEIOUÁÉÍÓÚaeiouáéíóú]/.test(v);
      const valid = hasLetters && hasMinLetters && hasVowel && !repeatedChar && !laughter;
      setLocationError(valid ? null : 'Ingresa una ubicación válida.');
    }
    if (name === 'location_description') {
      const v = sanitize(value).trim();
      const onlyLetters = v.replace(/[^A-Za-zÀ-ÿ]/g, '');
      const hasLetters = /[A-Za-zÀ-ÿ]/.test(v);
      const hasMinLetters = onlyLetters.length >= 3;
      const repeatedChar = /(.)\1{3,}/i.test(v);
      const laughter = /(ja|je|ji|jo|ju|ha|he|hi|ho|hu){3,}/i.test(v);
      const hasVowel = /[AEIOUÁÉÍÓÚaeiouáéíóú]/.test(v);
      const valid = hasLetters && hasMinLetters && hasVowel && !repeatedChar && !laughter;
      setLocationDescError(valid ? null : 'Ingresa una descripción de ubicación válida.');
    }
  };

  const handleCancel = () => setForm(initialForm);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const loc = String(form.location).trim();
    const onlyLetters = loc.replace(/[^A-Za-zÀ-ÿ]/g, '');
    const hasLetters = /[A-Za-zÀ-ÿ]/.test(loc);
    const hasMinLetters = onlyLetters.length >= 3;
    const repeatedChar = /(.)\1{3,}/i.test(loc);
    const laughter = /(ja|je|ji|jo|ju|ha|he|hi|ho|hu){3,}/i.test(loc);
    const hasVowel = /[AEIOUÁÉÍÓÚaeiouáéíóú]/.test(loc);
    const validLoc = hasLetters && hasMinLetters && hasVowel && !repeatedChar && !laughter;
    if (!validLoc) { setLocationError('Ingresa una ubicación válida.'); return; }
    const locDesc = String(form.location_description).trim();
    const onlyLettersD = locDesc.replace(/[^A-Za-zÀ-ÿ]/g, '');
    const hasLettersD = /[A-Za-zÀ-ÿ]/.test(locDesc);
    const hasMinLettersD = onlyLettersD.length >= 3;
    const repeatedCharD = /(.)\1{3,}/i.test(locDesc);
    const laughterD = /(ja|je|ji|jo|ju|ha|he|hi|ho|hu){3,}/i.test(locDesc);
    const hasVowelD = /[AEIOUÁÉÍÓÚaeiouáéíóú]/.test(locDesc);
    const validLocDesc = hasLettersD && hasMinLettersD && hasVowelD && !repeatedCharD && !laughterD;
    if (!validLocDesc) { setLocationDescError('Ingresa una descripción de ubicación válida.'); return; }
    if (!loc || !locDesc) return;
    await createPreferences(form);
  };

  React.useEffect(() => {
    if (success) {
      (async () => {
        try { await check(true); } catch {}
        navigate('/profile/document');
      })();
    }
  }, [success, navigate, check]);

  // Guard: si el backend dice que ya completó este paso, redirigir al siguiente
  // Evita llamadas repetidas re-ejecutando solo una vez en el primer montaje
  const didCheckRef = React.useRef(false);
  React.useEffect(() => {
    if (didCheckRef.current) return;
    didCheckRef.current = true;
    (async () => {
      try {
        await check();
        const next = getNextRoute();
        if (next !== '/profile/preferences') navigate(next, { replace: true });
      } catch {}
    })();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="pref-page pref-container">
      <div className="pref-wrap">
        <OnboardingSteps />
        {/* Header */}
        <div className="pref-header">
          <h1 className="pref-title pref-title-lg">Configura tus Preferencias Educativas</h1>
          <p className="pref-subtitle pref-text-sm" style={{ marginTop: '0.5rem' }}>
            Personaliza tus opciones para encontrar la mejor experiencia de aprendizaje.
          </p>
        </div>

        {/* Card */}
        <div className="pref-card">
          <form onSubmit={handleSubmit} className="pref-form">
            <div className="pref-grid">
              {/* Nivel educativo */}
              <div>
                <label htmlFor="educational_level_id" className="pref-label">
                  Nivel Educativo
                </label>
                <div className="pref-field">
                  {/* Icono */}
                  <span className="pref-icon pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 14l9-5-9-5-9 5 9 5zm0 0v6" />
                    </svg>
                  </span>
                  <select
                    id="educational_level_id"
                    name="educational_level_id"
                    value={form.educational_level_id}
                    onChange={handleChange}
                    className="pref-select with-icon pr-8"
                  >
                    {loadingCatalogs && <option>Cargando...</option>}
                    {catalogsError && <option disabled>Error al cargar niveles</option>}
                    {!loadingCatalogs && educationalLevels.length === 0 && (
                      <option disabled>No hay niveles disponibles</option>
                    )}
                    {educationalLevels.map((level) => (
                      <option key={level.id} value={level.id}>
                        {level.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Modalidad */}
              <div>
                <label htmlFor="modality_id" className="pref-label">
                  Modalidad
                </label>
                <div className="relative mt-1">
                  <span className="pref-icon pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M3 7h18M3 12h18M3 17h18" />
                    </svg>
                  </span>
                  <select
                    id="modality_id"
                    name="modality_id"
                    value={form.modality_id}
                    onChange={handleChange}
                    className="pref-select with-icon pr-8"
                  >
                    {loadingCatalogs && <option>Cargando...</option>}
                    {catalogsError && <option disabled>Error al cargar modalidades</option>}
                    {!loadingCatalogs && modalities.length === 0 && (
                      <option disabled>No hay modalidades disponibles</option>
                    )}
                    {modalities.map((m) => (
                      <option key={m.id} value={m.id}>
                        {m.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Ubicación */}
              <div className="pref-col-2">
                <label htmlFor="location" className="pref-label">
                  Ubicación
                </label>
                <div className="pref-field">
                  <span className="pref-icon pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 11c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm0 0c-4.418 0-8 3.134-8 7 0 2 2 3 8 3s8-1 8-3c0-3.866-3.582-7-8-7z" />
                    </svg>
                  </span>
                  <input
                    type="text"
                    id="location"
                    name="location"
                    value={form.location}
                    onChange={handleChange}
                    placeholder="Ej: Tuxtla Gutiérrez, Chiapas"
                    className="pref-input with-icon pr-3"
                  />
                </div>
                {locationError && (
                  <p className="pref-alert pref-alert--error" style={{ marginTop: '0.25rem' }}>{locationError}</p>
                )}
              </div>

              {/* Descripción de la ubicación */}
              <div className="pref-col-2">
                <label htmlFor="location_description" className="pref-label">
                  Descripción de la Ubicación
                </label>
                <div className="pref-field">
                  <span className="pref-icon pointer-events-none absolute top-3 left-0 flex items-start pl-3">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M8 10h8M8 14h6M5 6h14a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2z" />
                    </svg>
                  </span>
                  <textarea
                    id="location_description"
                    name="location_description"
                    value={form.location_description}
                    onChange={handleChange}
                    placeholder="Describe tus preferencias de ubicación, como cercanía a transporte público, zonas verdes, etc."
                    rows={4}
                    className="pref-textarea with-icon pr-3 resize-y"
                  />
                </div>
                {locationDescError && (
                  <p className="pref-alert pref-alert--error" style={{ marginTop: '0.25rem' }}>{locationDescError}</p>
                )}
              </div>
            </div>

            {/* Actions */}
            <div className="pref-actions">
              <button
                type="button"
                onClick={() => navigate('/teacher-home')}
                className="pref-btn--secondary"
              >
                Terminar proceso
              </button>
              <button
                type="button"
                onClick={handleCancel}
                className="pref-btn--secondary"
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={loading}
                className={`pref-btn--primary ${loading ? 'cursor-not-allowed' : ''}`}
              >
                {loading ? 'Guardando...' : 'Guardar Cambios'}
              </button>
            </div>

            {/* Alerts */}
            {error && (
              <p className="pref-alert pref-alert--error">{error}</p>
            )}
            {success && (
              <p className="pref-alert pref-alert--success">¡Tus preferencias se han guardado correctamente!</p>
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

export default PreferencesPage;
