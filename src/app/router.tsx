import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import Home from '../pages/Home';
import VerMas from '../pages/VerMas';
import SobreNosotros from '../pages/SobreNosotros';
import SerDocente from '../pages/SerDocente';

const router = createBrowserRouter([
  {
    path: '/',
    element: <Home />,
  },
  {
    path: '/ver-mas',
    element: <VerMas />,
  },
  {
    path: '/sobre-nosotros',
    element: <SobreNosotros />,
  },
  {
    path: '/ser-docente',
    element: <SerDocente />,
  },
]);

export default function AppRouter() {
  return <RouterProvider router={router} />;
}
