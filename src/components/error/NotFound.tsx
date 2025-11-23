import React from 'react';
import ErrorPage from './ErrorPage';

const NotFound: React.FC = () => {
  return (
    <ErrorPage
      code={404}
      title="Página no encontrada"
      message={
        'Parece que tomamos un desvío equivocado. La dirección que escribiste no existe o ya cambió de lugar.\n' +
        'Vuelve al inicio y deja que el zorro te guíe nuevamente.'
      }
      imageSrc="/zorro_back_home.png"
      linkTo="/"
      linkAriaLabel="Volver al inicio"
    />
  );
};

export default NotFound;