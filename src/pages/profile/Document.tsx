import React, { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDocumentsContext } from '../../context';
import '../../styles/documents.css';
import OnboardingSteps from '../../components/OnboardingSteps';
import { useActivation } from '../../context/activation/useActivation';
import { useAuthContext } from '../../context/auth';
import { SUBJECTS } from '../../components/subjects/SubjectsCatalog';

const CreateDocument: React.FC = () => {
  const navigate = useNavigate();
  const { createDocument, creating, error, lastCreated, resetStatus } = useDocumentsContext();
  const { check } = useActivation();
  const { user } = useAuthContext();

  const [rfc, setRfc] = useState('');
  const [expertise, setExpertise] = useState('');
  const [selectedSubjectId, setSelectedSubjectId] = useState('');
  const [description, setDescription] = useState('');
  const [certificate, setCertificate] = useState<File | null>(null);
  const [curriculum, setCurriculum] = useState<File | null>(null);
  const [certError, setCertError] = useState<string | null>(null);
  const [cvError, setCvError] = useState<string | null>(null);
  const [rfcError, setRfcError] = useState<string | null>(null);
  const [expertiseError, setExpertiseError] = useState<string | null>(null);
  const [descriptionError, setDescriptionError] = useState<string | null>(null);
  const certInputRef = React.useRef<HTMLInputElement | null>(null);
  const cvInputRef = React.useRef<HTMLInputElement | null>(null);

  const fullName = `${user?.first_name ?? ''} ${user?.last_name ?? ''}`.trim();
  const stripAccents = (s: string) => s.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
  const properCaseBaseName = (full: string) => {
    const ascii = stripAccents(full);
    return ascii
      .split(/\s+/)
      .filter(Boolean)
      .map(t => t.charAt(0).toUpperCase() + t.slice(1).toLowerCase())
      .join('')
      .replace(/[^A-Za-z0-9]/g, '');
  };
  const matchesExpectedPdfName = (f: File | null, kind: 'cert' | 'cv') => {
    if (!f) return false;
    const name = f.name;
    const hasPdfExt = /\.pdf$/i.test(name); // aceptar .pdf en cualquier caso
    if (!hasPdfExt) return false;
    if (!(f.type === 'application/pdf' || f.type === '')) return false;
    const nameNoExt = name.replace(/\.pdf$/i, '');
    const baseName = properCaseBaseName(fullName);
    const suffix = kind === 'cert' ? 'certificado' : 'curriculum'; // sufijo en minúsculas
    const expected = `${baseName}_${suffix}`;
    return nameNoExt === expected;
  };

  const validateFiles = () => {
    const certOk = matchesExpectedPdfName(certificate, 'cert');
    const cvOk = matchesExpectedPdfName(curriculum, 'cv');
    const baseName = properCaseBaseName(fullName);
    const msgCert = `El PDF debe llamarse exactamente: "${baseName}_certificado.pdf"`;
    const msgCv = `El PDF debe llamarse exactamente: "${baseName}_curriculum.pdf"`;
    setCertError(certOk ? null : msgCert);
    setCvError(cvOk ? null : msgCv);
    return certOk && cvOk;
  };

  // RFC validation (SAT): 12 (moral) o 13 (física) con estructura.
  const rfcRegex = /^[A-ZÑ&]{3,4}\d{6}[A-Z0-9]{2}[A0-9]$/;
  const rfcSanitize = (s: string) => s.toUpperCase().replace(/[^A-ZÑ&0-9]/g, '').slice(0, 13);
  const validateRfc = (val: string) => {
    if (!val) return 'Ingresa tu RFC.';
    if (val.length < 12) return 'El RFC debe tener 12 o 13 caracteres.';
    if (!(val.length === 12 || val.length === 13)) return 'El RFC debe tener 12 o 13 caracteres.';
    if (!rfcRegex.test(val)) return 'Formato de RFC inválido.';
    return null;
  };

  const isValid = useMemo(() => {
    const rfcOk = !validateRfc(rfcSanitize(rfc));
    const expOk = selectedSubjectId.trim() !== '' && expertise.trim() !== '';
    const descOk = String(description).trim().length >= 10;
    const base = rfcOk && expOk && descOk && certificate && curriculum;
    if (!base) return false;
    return matchesExpectedPdfName(certificate, 'cert') && matchesExpectedPdfName(curriculum, 'cv');
  }, [rfc, selectedSubjectId, expertise, description, certificate, curriculum]);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isValid || !certificate || !curriculum) {
      validateFiles();
      return;
    }
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

  React.useEffect(() => {
    if (lastCreated) {
      (async () => {
        try { await check(true); } catch {}
        navigate('/profile/price');
      })();
    }
  }, [lastCreated, navigate, check]);

  return (
    <div className="doc-page doc-container">
      <div className="doc-wrap">
        <OnboardingSteps />
        <div className="doc-header">
          <h1 className="doc-title">Cargar Documentos</h1>
          <p className="doc-subtitle" style={{ marginTop: '0.5rem' }}>Por favor, complete el formulario para cargar sus documentos de forma segura.</p>
        </div>

        <div className="doc-card">
          <form onSubmit={onSubmit} className="doc-form" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            {/* RFC */}
            <div>
              <label className="doc-label">RFC</label>
              <div className="doc-field">
                <input
                  type="text"
                  className="doc-input"
                  placeholder="Ej: GOCJ800101AB1"
                  value={rfc}
                  onChange={(e) => {
                    const next = rfcSanitize(e.target.value);
                    setRfc(next);
                    setRfcError(validateRfc(next));
                    // Revalidar PDFs al cambiar RFC
                    const baseName = properCaseBaseName(fullName);
                    const msgCert = `El PDF debe llamarse exactamente: "${baseName}_certificado.pdf"`;
                    const msgCv = `El PDF debe llamarse exactamente: "${baseName}_curriculum.pdf"`;
                    if (certificate) setCertError(matchesExpectedPdfName(certificate, 'cert') ? null : msgCert);
                    if (curriculum) setCvError(matchesExpectedPdfName(curriculum, 'cv') ? null : msgCv);
                  }}
                  maxLength={13} 
                />
                <span className="doc-trailing" aria-hidden>🔒</span>
              </div>
              {rfcError && <div className="doc-alert doc-alert--error" style={{ marginTop: '0.25rem' }}>{rfcError}</div>}
            </div>

            {/* Files */}
            <div className="doc-grid">
              <div>
                <label className="doc-label">Certificado</label>
                <div className="doc-hint" style={{ fontSize: '0.85rem', color: '#6b7280', marginTop: '0.25rem' }}>
                  Ejemplo con tu nombre: {properCaseBaseName(fullName) || 'TuNombreApellido'}_certificado.pdf
                </div>
                <div style={{ marginTop: '0.5rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <button type="button" className="doc-btn--secondary" onClick={() => certInputRef.current?.click()}>
                      📄 Elegir PDF
                    </button>
                    <span className="doc-file-name">{certificate?.name || 'Ningún archivo seleccionado'}</span>
                  </div>
                  <input
                    ref={certInputRef}
                    type="file"
                    accept=".pdf"
                    onChange={(e) => {
                      const f = e.target.files?.[0] || null;
                      setCertificate(f);
                      const baseName = properCaseBaseName(fullName);
                      const msgCert = `El PDF debe llamarse exactamente: "${baseName}_certificado.pdf"`;
                      setCertError(f && matchesExpectedPdfName(f, 'cert') ? null : msgCert);
                    }}
                    style={{ display: 'none' }}
                  />
                  {certError && <div className="doc-alert doc-alert--error" style={{ marginTop: '0.25rem' }}>{certError}</div>}
                </div>
              </div>
              <div>
                <label className="doc-label">Curriculum</label>
                <div className="doc-hint" style={{ fontSize: '0.85rem', color: '#6b7280', marginTop: '0.25rem' }}>
                  Ejemplo con tu nombre: {properCaseBaseName(fullName) || 'TuNombreApellido'}_curriculum.pdf
                </div>
                <div style={{ marginTop: '0.5rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <button type="button" className="doc-btn--secondary" onClick={() => cvInputRef.current?.click()}>
                      📄 Elegir PDF
                    </button>
                    <span className="doc-file-name">{curriculum?.name || 'Ningún archivo seleccionado'}</span>
                  </div>
                  <input
                    ref={cvInputRef}
                    type="file"
                    accept=".pdf"
                    onChange={(e) => {
                      const f = e.target.files?.[0] || null;
                      setCurriculum(f);
                      const baseName = properCaseBaseName(fullName);
                      const msgCv = `El PDF debe llamarse exactamente: "${baseName}_curriculum.pdf"`;
                      setCvError(f && matchesExpectedPdfName(f, 'cv') ? null : msgCv);
                    }}
                    style={{ display: 'none' }}
                  />
                  {cvError && <div className="doc-alert doc-alert--error" style={{ marginTop: '0.25rem' }}>{cvError}</div>}
                </div>
              </div>
            </div>

            {/* Materia */}
            <div>
              <label className="doc-label">Materia</label>
              <select
                className="doc-input"
                value={selectedSubjectId}
                onChange={(e) => {
                  const id = e.target.value;
                  setSelectedSubjectId(id);
                  const subj = SUBJECTS.find(s => s.id === id);
                  setExpertise(subj ? subj.name : '');
                  setExpertiseError(id ? null : 'Seleccione una materia.');
                }}
              >
                <option value="">Selecciona una materia</option>
                {SUBJECTS.map(s => (
                  <option key={s.id} value={s.id}>{s.name}</option>
                ))}
              </select>
              {expertiseError && <div className="doc-alert doc-alert--error" style={{ marginTop: '0.25rem' }}>{expertiseError}</div>}
            </div>

            {/* Description */}
            <div>
              <label className="doc-label">Descripción</label>
              <textarea
                className="doc-textarea"
                placeholder="Breve descripción de sus habilidades y experiencia."
                value={description}
                onChange={(e) => {
                  const sanitize = (s: string) => s.replace(/[^A-Za-zÀ-ÿ0-9 ,\.]+/g, ' ').replace(/\s{2,}/g, ' ').trimStart();
                  const v = sanitize(e.target.value);
                  setDescription(v);
                  const s = v.trim();
                  setDescriptionError(s.length >= 10 ? null : 'El campo Descripción debe tener al menos 10 caracteres.');
                }}
                maxLength={500}
              />
              {descriptionError && <div className="doc-alert doc-alert--error" style={{ marginTop: '0.25rem' }}>{descriptionError}</div>}
            </div>

            {/* Footer */}
            <div className="doc-actions">
              <button
                type="button"
                className="doc-btn--danger doc-btn--lg doc-btn--exit"
                onClick={() => navigate('/teacher-home')}
              >
                Salir de activación
              </button>
              <button
                type="submit"
                className="doc-btn--primary doc-btn--lg doc-btn--next"
                disabled={!isValid || creating}
              >
                {creating ? 'Guardando...' : 'Siguiente'}
              </button>
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
      <div className="onboarding-mascot">
        <img src="/Activar_cuenta.png" alt="activar cuenta" />
      </div>
    </div>
  );
};

export default CreateDocument;
