import React, { useEffect, useMemo, useState } from 'react';
import type { ConfirmationHistoryItem } from '../../context/confirmations';
import '../../styles/booking-modal.css';

export type ConfirmAttendanceModalProps = {
  isOpen: boolean;
  onClose: () => void;
  role: 'teacher' | 'student';
  item: ConfirmationHistoryItem | null;
  loading?: boolean;
  error?: string | null;
  onSubmit: (args: { description: string; file: File | Blob }) => Promise<{ success: boolean; message?: string } | void>;
};

const MAX_FILE_SIZE_MB = 5;
const MAX_FILE_SIZE_BYTES = MAX_FILE_SIZE_MB * 1024 * 1024;
const ALLOWED_MIME_TYPES = ['image/png', 'image/jpeg'];
const ALLOWED_EXTENSIONS = ['.png', '.jpg', '.jpeg'];

const sanitizeDescription = (value: string) => {
  // Solo letras en español y espacios. Elimina números, símbolos, etiquetas <>, etc.
  // Permite acentos y diéresis: áéíóúü y Ñ/ñ
  const cleaned = value
    .replace(/[^ a-zA-ZáéíóúÁÉÍÓÚñÑüÜ\n]/g, '') // solo letras y espacios (y saltos de línea opcional)
    .replace(/[<>]/g, '') // fuera tags
    .replace(/\s+/g, ' ') // colapsar espacios
    .trimStart();
  return cleaned;
};

export default function ConfirmAttendanceModal({ isOpen, onClose, role, item, loading = false, error = null, onSubmit }: ConfirmAttendanceModalProps) {
  const [description, setDescription] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [fileError, setFileError] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  useEffect(() => {
    if (isOpen) {
      setDescription('');
      setFile(null);
      setFileError(null);
    }
  }, [isOpen]);

  const disabledByWindow = useMemo(() => {
    if (!item) return true;
    return !item.confirmable_now || (item.seconds_left ?? 0) <= 0;
  }, [item]);

  if (!isOpen || !item) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) return;
    await onSubmit({ description, file });
  };

  const handleDescriptionChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const raw = e.target.value;
    const clean = sanitizeDescription(raw);
    setDescription(clean);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0] || null;
    setFileError(null);
    setFile(null);
    if (!f) return;

    // Validar tamaño
    if (f.size > MAX_FILE_SIZE_BYTES) {
      setFileError(`El archivo supera el límite de ${MAX_FILE_SIZE_MB}MB.`);
      return;
    }

    // Validar tipo por MIME o extensión
    const lowerName = f.name.toLowerCase();
    const hasAllowedExt = ALLOWED_EXTENSIONS.some(ext => lowerName.endsWith(ext));
    const hasAllowedMime = ALLOWED_MIME_TYPES.includes(f.type);

    if (!hasAllowedExt && !hasAllowedMime) {
      setFileError('Formato no permitido. Solo PNG o JPG.');
      return;
    }

    setFile(f);
  };

  const formatDate = (dateTimeStr: string) => {
    const date = new Date(dateTimeStr);
    return date.toLocaleDateString('es-ES', { day: 'numeric', month: 'long' });
  };
  const formatTime = (dateTimeStr: string) => {
    const date = new Date(dateTimeStr);
    return date.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit', hour12: true });
  };

  const submitDisabled = loading || disabledByWindow || !file || !!fileError || description.trim().length === 0;

  return (
    <div className="booking-modal-overlay" onClick={onClose}>
      <div className="booking-modal-container" onClick={(e) => e.stopPropagation()}>
        <div className="booking-modal-header">
          <div>
            <h2 className="booking-modal-title">Confirmar asistencia</h2>
            <p className="booking-modal-id">Reserva #{item.payment_booking_id}</p>
          </div>
          <button className="booking-modal-close" onClick={onClose}>×</button>
        </div>

        <div className="booking-modal-content">
          <div className="booking-modal-section" style={{ marginTop: 0 }}>
            <h4 style={{ margin: 0, color: '#294954' }}>Información</h4>
            <p style={{ margin: '8px 0 0 0', color: '#374151' }}>
              Finalizó: {formatDate(item.booking_end)}, {formatTime(item.booking_end)}
            </p>
          </div>

          {disabledByWindow && (
            <div className="booking-modal-error" style={{ marginTop: 0 }}>
              <span className="booking-modal-error-icon">⚠️</span>
              <div>
                <h4 className="booking-modal-error-title">Ventana expirada</h4>
                <p className="booking-modal-error-message">Esta confirmación ya no está disponible para ser enviada.</p>
              </div>
            </div>
          )}

          {error && (
            <div className="booking-modal-error" style={{ marginTop: 0 }}>
              <span className="booking-modal-error-icon">⚠️</span>
              <div>
                <h4 className="booking-modal-error-title">Error</h4>
                <p className="booking-modal-error-message">{error}</p>
              </div>
            </div>
          )}

          {fileError && (
            <div className="booking-modal-error" style={{ marginTop: 0 }}>
              <span className="booking-modal-error-icon">⚠️</span>
              <div>
                <h4 className="booking-modal-error-title">Archivo no válido</h4>
                <p className="booking-modal-error-message">{fileError}</p>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="booking-modal-section">
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <label style={{ color: '#294954', fontWeight: 600 }}>
                Descripción (solo letras)
                <textarea
                  value={description}
                  onChange={handleDescriptionChange}
                  placeholder={role === 'teacher' ? 'Describe brevemente la clase impartida (solo letras)' : 'Describe brevemente tu asistencia (solo letras)'}
                  style={{
                    width: '100%',
                    minHeight: 90,
                    border: '1px solid #e5e7eb',
                    borderRadius: 8,
                    padding: 12,
                    marginTop: 6,
                  }}
                  required
                />
                <small style={{ color: '#6b7280', display: 'block', marginTop: 6 }}>Permitido: letras en español y espacios. No se permiten números ni símbolos (&lt; &gt; / = etc.).</small>
              </label>

              <label style={{ color: '#294954', fontWeight: 600 }}>
                Evidencia (PNG o JPG, máx. {MAX_FILE_SIZE_MB}MB)
                <input
                  type="file"
                  accept={ALLOWED_EXTENSIONS.join(',')}
                  onChange={handleFileChange}
                  style={{ marginTop: 6 }}
                  required
                />
                <small style={{ color: '#6b7280', display: 'block', marginTop: 6 }}>Formatos permitidos: PNG o JPG. Tamaño máximo: {MAX_FILE_SIZE_MB}MB.</small>
              </label>

              <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end', marginTop: 8 }}>
                <button type="button" onClick={onClose} className="btn-ver-detalles">
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="btn-unirse"
                  disabled={submitDisabled}
                >
                  {loading ? 'Enviando…' : 'Enviar confirmación'}
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
