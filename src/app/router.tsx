import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import Home from '../pages/Home';
import VerMas from '../pages/VerMas';
import SobreNosotros from '../pages/SobreNosotros';
import SerDocente from '../pages/SerDocente';
import Register from '../pages/Register';
import RegisterStudent from '../pages/RegisterStudent';
import RegisterTeacher from '../pages/RegisterTeacher';

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
  {
    path: '/register',
    element: <Register />,
  },
  // Mantener rutas individuales para compatibilidad
  {
    path: '/register/student',
    element: <RegisterStudent />,
  },
  {
    path: '/register/teacher',
    element: <RegisterTeacher />,
  },
]);

export default function AppRouter() {
  return <RouterProvider router={router} />;
}
