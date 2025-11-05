import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';

export default function PWAInstaller() {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleBeforeInstallPrompt = (e: Event) => {
      // Previene que el navegador muestre el mensaje de instalación automática
      e.preventDefault();
      // Guarda el evento para usarlo más tarde
      setDeferredPrompt(e);
      // Muestra el botón de instalación
      setIsVisible(true);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    // Comprueba si la aplicación ya está instalada
    window.addEventListener('appinstalled', () => {
      console.log('¡Aplicación instalada con éxito!');
      setIsVisible(false);
    });

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;

    // Muestra el mensaje de instalación
    deferredPrompt.prompt();
    
    // Espera a que el usuario responda al mensaje
    const { outcome } = await deferredPrompt.userChoice;
    
    if (outcome === 'accepted') {
      console.log('El usuario aceptó la instalación');
      toast.success('¡Aplicación instalada con éxito!');
    } else {
      console.log('El usuario rechazó la instalación');
      toast.info('Puedes instalar la aplicación más tarde desde el menú de tu navegador.');
    }
    
    // Limpia el evento guardado
    setDeferredPrompt(null);
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <button
      onClick={handleInstallClick}
      className="fixed bottom-4 right-4 bg-[#8ED4BE] hover:bg-[#7EC5B0] text-white font-bold py-2 px-4 rounded-full shadow-lg flex items-center gap-2 z-50"
      aria-label="Instalar aplicación"
    >
      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clipRule="evenodd" />
      </svg>
      Instalar aplicación
    </button>
  );
}
