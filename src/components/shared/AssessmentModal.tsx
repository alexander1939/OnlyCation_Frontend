import React, { useEffect, useMemo, useState } from 'react';
import '../../styles/booking-modal.css';

export type AssessmentModalProps = {
  isOpen: boolean;
  onClose: () => void;
  paymentBookingId: number | string | null;
  teacherName?: string;
  loading?: boolean;
  error?: string | null;
  onSubmit: (args: { qualification: number; comment: string }) => Promise<void>;
};

const sanitizeComment = (value: string) => {
  // Solo letras en español y espacios, coherente con la política de inputs "solo letras" que estás usando.
  // Permite saltos de línea también.
  return value
    .replace(/[^ a-zA-ZáéíóúÁÉÍÓÚñÑüÜ\n]/g, '')
    .replace(/[<>]/g, '')
    .replace(/\s+/g, ' ')
    .trimStart();
};

export default function AssessmentModal({ isOpen, onClose, paymentBookingId, teacherName, loading = false, error = null, onSubmit }: AssessmentModalProps) {
  const [qualification, setQualification] = useState<number>(0);
  const [comment, setComment] = useState('');

  useEffect(() => {
    if (isOpen) document.body.style.overflow = 'hidden';
    else document.body.style.overflow = 'unset';
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  useEffect(() => {
    if (isOpen) {
      setQualification(0);
      setComment('');
    }
  }, [isOpen]);

  const disabled = useMemo(() => !paymentBookingId || loading || qualification < 1 || qualification > 5 || comment.trim().length === 0, [paymentBookingId, loading, qualification, comment]);

  if (!isOpen || !paymentBookingId) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (disabled) return;
    await onSubmit({ qualification, comment });
  };

  const handleCommentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setComment(sanitizeComment(e.target.value));
  };

  return (
    <div className="booking-modal-overlay" onClick={onClose}>
      <div className="booking-modal-container" onClick={(e) => e.stopPropagation()}>
        <div className="booking-modal-header">
          <div>
            <h2 className="booking-modal-title">Calificar docente</h2>
            {teacherName && <p className="booking-modal-id">{teacherName}</p>}
          </div>
          <button className="booking-modal-close" onClick={onClose}>×</button>
        </div>

        <div className="booking-modal-content">
          {error && (
            <div className="booking-modal-error" style={{ marginTop: 0 }}>
              <span className="booking-modal-error-icon">⚠️</span>
              <div>
                <h4 className="booking-modal-error-title">Error</h4>
                <p className="booking-modal-error-message">{error}</p>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="booking-modal-section">
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <div>
                <label style={{ color: '#294954', fontWeight: 600, display: 'block', marginBottom: 8 }}>Calificación</label>
                <div style={{ display: 'flex', gap: 8, fontSize: 28 }}>
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setQualification(star)}
                      aria-label={`${star} estrella${star > 1 ? 's' : ''}`}
                      style={{
                        background: 'transparent',
                        border: 'none',
                        cursor: 'pointer',
                        color: star <= qualification ? '#FBBF24' : '#D1D5DB',
                        lineHeight: 1,
                      }}
                    >
                      ★
                    </button>
                  ))}
                </div>
              </div>

              <label style={{ color: '#294954', fontWeight: 600 }}>
                Comentario (solo letras)
                <textarea
                  value={comment}
                  onChange={handleCommentChange}
                  placeholder="Escribe tu comentario"
                  style={{
                    width: '100%',
                    minHeight: 100,
                    border: '1px solid #e5e7eb',
                    borderRadius: 8,
                    padding: 12,
                    marginTop: 6,
                  }}
                  required
                />
                <small style={{ color: '#6b7280', display: 'block', marginTop: 6 }}>Permitido: letras en español y espacios (sin símbolos como &lt; &gt; / =, etc.).</small>
              </label>

              <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end', marginTop: 8 }}>
                <button type="button" onClick={onClose} className="btn-ver-detalles">
                  Cancelar
                </button>
                <button type="submit" className="btn-unirse" disabled={disabled}>
                  {loading ? 'Enviando…' : 'Enviar evaluación'}
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
