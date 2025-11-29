import React from 'react';
import ErrorPage from './ErrorPage';

const ServerError: React.FC = () => (
  <ErrorPage
    code={500}
    title="Error interno del servidor"
    message={
      'Ha ocurrido un problema inesperado.\n' +
      'Intenta nuevamente en unos momentos o vuelve al inicio.'
    }
    imageSrc="/zorro_back_home.png"
    linkAriaLabel="Volver al inicio"
  />
);

export default ServerError;
