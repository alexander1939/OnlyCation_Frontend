import React from 'react';
import ErrorPage from './ErrorPage';

const Forbidden: React.FC = () => (
  <ErrorPage
    code={403}
    title="Acceso denegado"
    message={
      'No tienes permisos para ver esta página.\n' +
      'Si crees que es un error, inicia sesión con otra cuenta o vuelve al inicio.'
    }
    imageSrc="/zorro_back_home.png"
    linkTo="/"
    linkAriaLabel="Volver al inicio"
  />
);

export default Forbidden;
