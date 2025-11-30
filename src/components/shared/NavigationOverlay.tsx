import React, { useEffect, useState } from 'react';
import { useNavigation } from 'react-router-dom';
import LoadingOverlay from './LoadingOverlay';

const NavigationOverlay: React.FC = () => {
  const navigation = useNavigation();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (navigation.state !== 'idle') {
      const t = setTimeout(() => setOpen(true), 120); // evita parpadeos en cargas muy cortas
      return () => clearTimeout(t);
    }
    setOpen(false);
  }, [navigation.state]);

  return (
    <LoadingOverlay
      open={open}
      message="Preparando tu experiencia..."
      logoSrc="/logo.png"
      gifSrc="/icons8-rhombus-loader-96.gif"
    />
  );
};

export default NavigationOverlay;
