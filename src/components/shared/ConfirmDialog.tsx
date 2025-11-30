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
            className="booking-modal-section confirm-dialog-section"
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: 24,
            }}
          >
            {/* Texto a la izquierda */}
            <div
              style={{
                alignSelf: 'center',
              }}
            >
              <div
                style={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: 8,
                  color: '#374151',
                  fontSize: 16,
                }}
              >
                <span
                  style={{
                    fontSize: 22,
                    lineHeight: 1,
                    color: '#f97316',
                  }}
                >
                  ⚠️
                </span>
                <div>
                  <p style={{ margin: 0, fontWeight: 600, fontSize: 17 }}>
                    ¿Estás seguro de que deseas guardar este cambio?
                  </p>
                  <p style={{ margin: '4px 0 0 0', fontSize: 15 }}>
                    Este ajuste actualizará la información actual. Revisa bien los datos antes de guardar.
                  </p>
                </div>
              </div>
            </div>

            {/* Imagen al centro */}
            <div
              style={{
                flex: '0 0 150px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <img
                src="/alert_zorro.png"
                alt="Alerta zorro"
                style={{
                  maxHeight: 120,
                  width: '100%',
                  objectFit: 'contain',
                  display: 'block',
                }}
              />
            </div>
          </div>

          {/* Botones debajo, fuera del recuadro de texto/imagen */}
          <div
            style={{
              display: 'flex',
              gap: 10,
              justifyContent: 'flex-end',
              marginTop: 24,
            }}
          >
            <button type="button" className="btn-ver-detalles" onClick={onCancel} disabled={loading}>
              {cancelText}
            </button>
            <button type="button" className="btn-unirse" onClick={onConfirm} disabled={loading}>
              {loading ? 'Procesando…' : confirmText}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConfirmDialog;