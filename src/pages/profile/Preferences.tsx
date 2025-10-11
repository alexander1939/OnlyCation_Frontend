import React, { useState } from 'react';
import { usePreferences } from '../../hooks/profile/usePreferences';
import type { PreferenceCreateRequest } from '../../context/preferences/types';

const PreferencesPage: React.FC = () => {
  const { createPreferences, loading, error, success } = usePreferences();
  const [form, setForm] = useState<PreferenceCreateRequest>({
    educational_level_id: 1,
    modality_id: 1,
    location: '',
    location_description: '',
  });

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm(prev => ({
      ...prev,
      [name]: name.endsWith('_id') ? Number(value) : value,
    }));
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await createPreferences(form);
  };

  return (
    <div style={{ maxWidth: 520, margin: '32px auto' }}>
      <h1>Preferencias</h1>
      <form onSubmit={onSubmit}>
        <div style={{ marginBottom: 12 }}>
          <label>Educational Level ID</label>
          <input
            type="number"
            name="educational_level_id"
            value={form.educational_level_id}
            onChange={onChange}
            min={1}
          />
        </div>
        <div style={{ marginBottom: 12 }}>
          <label>Modality ID</label>
          <input
            type="number"
            name="modality_id"
            value={form.modality_id}
            onChange={onChange}
            min={1}
          />
        </div>
        <div style={{ marginBottom: 12 }}>
          <label>Location</label>
          <input
            type="text"
            name="location"
            value={form.location}
            onChange={onChange}
            placeholder="Ciudad, estado..."
          />
        </div>
        <div style={{ marginBottom: 12 }}>
          <label>Descripción de la ubicación</label>
          <input
            type="text"
            name="location_description"
            value={form.location_description}
            onChange={onChange}
            placeholder="Cerca de..."
          />
        </div>
        <button type="submit" disabled={loading}>
          {loading ? 'Guardando...' : 'Guardar preferencias'}
        </button>
      </form>

      {error && <p style={{ color: 'red', marginTop: 12 }}>{error}</p>}
      {success && <p style={{ color: 'green', marginTop: 12 }}>Preferencias creadas exitosamente</p>}
    </div>
  );
};

export default PreferencesPage;
