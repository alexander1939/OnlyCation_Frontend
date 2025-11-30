import React, { useEffect } from 'react';
import '../../styles/booking-modal.css';

export type ConfirmDialogProps = {
  isOpen: boolean;
  title?: string;
  description?: string | React.ReactNode;
  confirmText?: string;
  cancelText?: string;
  onConfirm: () => void | Promise<void>;
  onCancel: () => void;
  loading?: boolean;
};

const ConfirmDialog: React.FC<ConfirmDialogProps> = ({
  isOpen,
  title = 'Confirmar acción',
  description = '¿Estás seguro de realizar esta acción?',
  confirmText = 'Confirmar',
  cancelText = 'Cancelar',
  onConfirm,
  onCancel,
  loading = false,
}) => {
  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : 'unset';
    return () => { document.body.style.overflow = 'unset'; };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="booking-modal-overlay" onClick={() => (!loading ? onCancel() : void 0)}>
      <div className="booking-modal-container" onClick={(e) => e.stopPropagation()}>
        <div className="booking-modal-header">
          <h2 className="booking-modal-title">{title}</h2>
          <button className="booking-modal-close" onClick={onCancel} disabled={loading}>×</button>
        </div>

        <div className="booking-modal-content">
          <div
            className="booking-modal-section"
            style={{ display: 'grid', gap: 14 }}
          >
            <div
              style={{
                position: 'relative',
                borderRadius: 16,
                padding: '14px 16px',
                background:
                  'linear-gradient(135deg, rgba(248,250,252,0.88), rgba(241,245,249,0.96))',
                border: '1px solid rgba(148,163,184,0.5)',
                boxShadow: '0 10px 25px rgba(15,23,42,0.15)',
                overflow: 'hidden',
              }}
            >
              <div
                className="confirm-dialog-blur"
                style={{
                  position: 'absolute',
                  inset: -20,
                  backdropFilter: 'blur(10px)',
                  WebkitBackdropFilter: 'blur(10px)',
                  opacity: 0.7,
                  pointerEvents: 'none',
                }}
              />

              <div
                style={{
                  position: 'relative',
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: 12,
                }}
              >
                <div
                  style={{
                    width: 40,
                    height: 40,
                    borderRadius: '9999px',
                    background:
                      'radial-gradient(circle at 30% 20%, #facc15, #eab308)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#111827',
                    fontWeight: 800,
                    fontSize: 22,
                    boxShadow: '0 8px 18px rgba(234,179,8,0.5)',
                    flexShrink: 0,
                  }}
                >
                  !
                </div>
                <div style={{ display: 'grid', gap: 6 }}>
                  <span
                    style={{
                      fontSize: 12,
                      fontWeight: 600,
                      letterSpacing: 0.12,
                      textTransform: 'uppercase',
                      color: '#6b7280',
                    }}
                  >
                    Confirmar cambios
                  </span>
                  <div
                    style={{
                      color: '#111827',
                      fontSize: 14,
                      lineHeight: 1.6,
                    }}
                  >
                    {description}
                  </div>
                </div>
              </div>
            </div>

            <div
              style={{
                display: 'flex',
                gap: 10,
                justifyContent: 'flex-end',
                marginTop: 4,
              }}
            >
              <button
                type="button"
                className="btn-ver-detalles"
                onClick={onCancel}
                disabled={loading}
              >
                {cancelText}
              </button>
              <button
                type="button"
                className="btn-unirse"
                onClick={onConfirm}
                disabled={loading}
              >
                {loading ? 'Procesando…' : confirmText}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConfirmDialog;
