import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useActivation } from '../context/activation/useActivation';

// Enforce forward-only navigation in onboarding. If el paso actual ya fue completado,
// redirige al siguiente pendiente (o a activar / inicio docente) usando getNextRoute().
// Evita loops ejecutando check() solo una vez.
const StepLock: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { data, check, getNextRoute } = useActivation();
  const [checked, setChecked] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const location = useLocation();

  // Ejecuta check solo una vez si no hay datos todavía
  const didRunRef = React.useRef(false);
  React.useEffect(() => {
    if (didRunRef.current) { setChecked(true); return; }
    didRunRef.current = true;
    (async () => {
      try {
        if (!data) {
          await check();
        }
      } catch (e: any) {
        setError(e?.message || 'Error al validar progreso');
      } finally {
        setChecked(true);
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (!checked) return null;
  if (error) return <>{children}</>; // en caso de error no bloquear

  // Decide siguiente ruta válida y evita retroceder a pasos ya completos
  const next = getNextRoute();

  // Si la ruta actual no es la siguiente esperada y pertenece al flujo de perfil, redirige
  const profilePaths = [
    '/profile/preferences',
    '/profile/document',
    '/profile/price',
    '/profile/video',
    '/profile/availability',
    '/profile/wallet',
    '/profile/activate',
  ];

  // Evitar interferir con rutas fuera del flujo
  const isProfileFlow = profilePaths.some(p => location.pathname.startsWith(p));

  if (isProfileFlow && !location.pathname.startsWith(next)) {
    return <Navigate to={next} replace />;
  }

  return <>{children}</>;
};

export default StepLock;
