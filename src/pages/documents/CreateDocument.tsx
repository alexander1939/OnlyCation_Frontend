import React, { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDocumentsContext } from '../../context';
import '../../styles/Documents.css';

const CreateDocument: React.FC = () => {
  const navigate = useNavigate();
  const { createDocument, creating, error, lastCreated, resetStatus } = useDocumentsContext();

  const [rfc, setRfc] = useState('');
  const [expertise, setExpertise] = useState('');
  const [description, setDescription] = useState('');
  const [certificate, setCertificate] = useState<File | null>(null);
  const [curriculum, setCurriculum] = useState<File | null>(null);

  const isValid = useMemo(() => {
    return rfc.trim() && expertise.trim() && description.trim() && certificate && curriculum;
  }, [rfc, expertise, description, certificate, curriculum]);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isValid || !certificate || !curriculum) return;
    await createDocument({
      rfc: rfc.trim(),
      expertise_area: expertise.trim(),
      description: description.trim(),
      certificate,
      curriculum,
    });
  };

  const onCancel = () => {
    resetStatus();
    navigate(-1);
  };

  return (
    <div className="doc-page doc-container">
      <div className="doc-wrap">
        <div className="doc-header">
          <h1 className="doc-title">Cargar Documentos</h1>
          <p className="doc-subtitle" style={{ marginTop: '0.5rem' }}>Por favor, complete el formulario para cargar sus documentos de forma segura.</p>
        </div>

        <div className="doc-card">
          <form onSubmit={onSubmit} className="doc-form" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            {/* RFC */}
            <div>
              <label className="doc-label">RFC Cifrado</label>
              <div className="doc-field">
                <input
                  type="text"
                  className="doc-input"
                  placeholder="Ingresar RFC Cifrado"
                  value={rfc}
                  onChange={(e) => setRfc(e.target.value)}
                />
                <span className="doc-trailing" aria-hidden>🔒</span>
              </div>
            </div>

            {/* Files */}
            <div className="doc-grid">
              <div>
                <label className="doc-label">Certificado (.enc)</label>
                <div>
                  <input
                    type="file"
                    accept=".enc,.pdf,.txt"
                    onChange={(e) => setCertificate(e.target.files?.[0] || null)}
                    className="doc-file"
                  />
                </div>
              </div>
              <div>
                <label className="doc-label">Curriculum (.enc)</label>
                <div>
                  <input
                    type="file"
                    accept=".enc,.pdf,.txt"
                    onChange={(e) => setCurriculum(e.target.files?.[0] || null)}
                    className="doc-file"
                  />
                </div>
              </div>
            </div>

            {/* Expertise */}
            <div>
              <label className="doc-label">Área de Experiencia</label>
              <input
                type="text"
                className="doc-input"
                placeholder="Ej. Desarrollo Frontend"
                value={expertise}
                onChange={(e) => setExpertise(e.target.value)}
              />
            </div>

            {/* Description */}
            <div>
              <label className="doc-label">Descripción</label>
              <textarea
                className="doc-textarea"
                placeholder="Breve descripción de sus habilidades y experiencia."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>

            {/* Footer */}
            <div className="doc-actions">
              <button type="button" className="doc-link" onClick={() => alert(rfc || 'Sin RFC')}>Previsualizar RFC</button>
              <div style={{ display: 'flex', gap: '0.75rem' }}>
                <button type="button" className="doc-btn--secondary" onClick={onCancel}>Cancelar</button>
                <button type="submit" className="doc-btn--primary" disabled={!isValid || creating}>{creating ? 'Guardando...' : 'Guardar'}</button>
              </div>
            </div>

            {/* Status */}
            {error && (
              <div className="text-red-600 text-sm">{error}</div>
            )}
            {lastCreated && (
              <div className="text-green-600 text-sm">Documento creado exitosamente (ID {lastCreated.id}).</div>
            )}
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreateDocument;
