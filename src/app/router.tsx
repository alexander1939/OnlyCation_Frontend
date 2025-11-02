import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import Home from '../pages/home/Home';
import AllTeachers from '../pages/teachers/AllTeachers';
import AboutUs from '../pages/about-us/AboutUs';
import BeTeacher from '../pages/teachers/BeTeacher';
import Login from '../pages/auth/Login';
import Register from '../pages/auth/Register';
import ForgotPassword from '../pages/auth/ForgotPassword';
import ResetPassword from '../pages/auth/ResetPassword';
import TeacherHome from '../pages/teacher/home';
import DocenteGeneral from '../pages/teacher/General';
import AgendaDocente from '../pages/teacher/Agenda';
import DocenteDatosPersonales from '../pages/teacher/DatosPersonales';
import DocenteDocumentos from '../pages/teacher/Documentos';
import StudentHome from '../pages/student/home';
import PrivateRoute from "../components/PrivateRoute";
import Preferences from '../pages/profile/Preferences';
import CreateDocument from '../pages/documents/CreateDocument';
import CreatePrice from '../pages/prices/CreatePrice';
import { DocumentsProvider } from '../context/documents';
import { PreferencesProvider } from '../context/preferences';
import { CatalogsProvider } from '../context/catalogs/CatalogsContext';
import { ActivationProvider } from '../context/activation/ActivationContext';
import Video from '../pages/profile/Video';
import Cartera from '../pages/profile/Cartera';
import { AgendaProvider } from '../context/cartera';
import Agenda from '../pages/profile/Agenda';
import { BookingProvider } from '../context/booking';
import ContinueOnboarding from '../pages/profile/ContinueOnboarding';

const router = createBrowserRouter([
  {
    path: '/',
    element: <Home />,
  },
  {
    path: '/profile/preferences',
    element: (
        <ActivationProvider>
          <CatalogsProvider>
            <PreferencesProvider>
              <Preferences />
            </PreferencesProvider>
          </CatalogsProvider>
        </ActivationProvider>
    ),
  },
  {
    path: '/profile/cartera',
    element: (
      <AgendaProvider>
        <Cartera />
      </AgendaProvider>
    ),
  },
  {
    path: '/profile/agenda',
    element: (
      <ActivationProvider>
        <BookingProvider>
          <Agenda />
        </BookingProvider>
      </ActivationProvider>
    ),
  },
  {
    path: '/profile/documentos',
    element: (
      <ActivationProvider>
        <DocumentsProvider>
          <CreateDocument />
        </DocumentsProvider>
      </ActivationProvider>
    ),
  },
  {
    path: '/profile/price',
    element: (
      <ActivationProvider>
        <CreatePrice />
      </ActivationProvider>
    ),
  },
  {
    path: '/profile/video',
    element: (
      <ActivationProvider>
        <Video />
      </ActivationProvider>
    ),
  },
  {
    path: '/profile/continue',
    element: (
      <ActivationProvider>
        <ContinueOnboarding />
      </ActivationProvider>
    ),
  },
  {
    path: "/teacher-home",
    element: (
      <PrivateRoute roles={["teacher"]}>
        <TeacherHome />
      </PrivateRoute>
    ),
  },
  {
    path: "/student-home",
    element: (
      <PrivateRoute roles={["student"]}>
        <StudentHome />
      </PrivateRoute>
    ),
  },
  {
    path: '/docente/general',
    element: (
      <PrivateRoute roles={["teacher"]}>
        <DocenteGeneral />
      </PrivateRoute>
    ),
  },
  {
    path: '/docente/agenda',
    element: (
      <PrivateRoute roles={["teacher"]}>
        <AgendaDocente />
      </PrivateRoute>
    ),
  },
  {
    path: '/docente/datos-personales',
    element: (
      <PrivateRoute roles={["teacher"]}>
        <DocenteDatosPersonales />
      </PrivateRoute>
    ),
  },
  {
    path: '/docente/documentos',
    element: (
      <PrivateRoute roles={["teacher"]}>
        <DocenteDocumentos />
      </PrivateRoute>
    ),
  },
  {
    path: '/teachers',
    element: <AllTeachers />,
  },
  {
    path: '/about-us',
    element: <AboutUs />,
  },
  {
    path: '/be-teacher',
    element: <BeTeacher />,
  },

  {
    path: '/login',
    element: <Login />,
  },
  {
    path: '/register',
    element: <Register />,
  },
  {
    path: '/forgot-password',
    element: <ForgotPassword />,
  },
  {
    path: '/reset-password',
    element: <ResetPassword />,
  },
]);

export default function AppRouter() {
  return <RouterProvider router={router} />;
}

