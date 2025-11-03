import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import Home from '../pages/home/Home';
import AllTeachers from '../pages/home/AllTeachers';
import AboutUs from '../pages/about-us/AboutUs';
import BeTeacher from '../pages/home/BeTeacher';
import Login from '../pages/auth/Login';
import Register from '../pages/auth/Register';
import ForgotPassword from '../pages/auth/ForgotPassword';
import ResetPassword from '../pages/auth/ResetPassword';
import TeacherHome from '../pages/teacher/home';
import MyNextBooking from '../pages/booking/my_next_booking';
import AgendaDocente from '../pages/teacher/Agenda';
import DocenteDatosPersonales from '../pages/teacher/DatosPersonales';
import DocenteDocumentos from '../pages/teacher/Documentos';
import StudentHome from '../pages/student/home';
import PrivateRoute from "../components/PrivateRoute";
import Preferences from '../pages/profile/Preferences';
import CreateDocument from '../pages/profile/Document';
import CreatePrice from '../pages/profile/Price';
import { DocumentsProvider } from '../context/documents';
import { PreferencesProvider } from '../context/preferences';
import { CatalogsProvider } from '../context/catalogs/CatalogsContext';
import { ActivationProvider } from '../context/activation/ActivationContext';
import Video from '../pages/profile/Video';
import Cartera from '../pages/profile/Wallet';
import { AgendaProvider } from '../context/wallet';
import Agenda from '../pages/profile/Availability';
import { BookingProvider } from '../context/availability';
import { MyNextClassesProvider, BookingDetailProvider, AllClassesProvider } from '../context/booking';
import ContinueOnboarding from '../pages/profile/ContinueOnboarding';
// NUEVOS: páginas básicas por carpeta
import TeacherBooking from '../pages/booking/my_next_booking';
import TeacherSubscription from '../pages/subscription/TeacherSubscription';
import TeacherConfirmation from '../pages/confirmation/my_confimaction';
import TeacherChat from '../pages/chat/my_chat';
import EstudianteDatosPersonales from '../pages/student/DatosPersonales';
import AllBookings from '../pages/booking/all_bookings';

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
    path: '/profile/wallet',
    element: (
      <AgendaProvider>
        <Cartera />
      </AgendaProvider>
    ),
  },
  {
    path: '/profile/availability',
    element: (
      <ActivationProvider>
        <BookingProvider>
          <Agenda />
        </BookingProvider>
      </ActivationProvider>
    ),
  },
  {
    path: '/profile/document',
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
    path: '/student/personal-data',
    element: (
      <PrivateRoute roles={["student"]}>
        <EstudianteDatosPersonales />
      </PrivateRoute>
    ),
  },
  {
    path: '/student/my_next_booking',
    element: (
      <PrivateRoute roles={["student"]}>
        <MyNextClassesProvider>
          <BookingDetailProvider>
            <MyNextBooking />
          </BookingDetailProvider>
        </MyNextClassesProvider>
      </PrivateRoute>
    ),
  },
  {
    path: '/student/all-bookings',
    element: (
      <PrivateRoute roles={["student"]}>
        <AllClassesProvider>
          <BookingDetailProvider>
            <AllBookings />
          </BookingDetailProvider>
        </AllClassesProvider>
      </PrivateRoute>
    ),
  },
  {
    path: '/teacher/my_next_booking',
    element: (
      <PrivateRoute roles={["teacher"]}>
        <MyNextClassesProvider>
          <BookingDetailProvider>
            <MyNextBooking />
          </BookingDetailProvider>
        </MyNextClassesProvider>
      </PrivateRoute>
    ),
  },
  {
    path: '/teacher/all-bookings',
    element: (
      <PrivateRoute roles={["teacher"]}>
        <AllClassesProvider>
          <BookingDetailProvider>
            <AllBookings />
          </BookingDetailProvider>
        </AllClassesProvider>
      </PrivateRoute>
    ),
  },
  {
    path: '/teacher/availability',
    element: (
      <PrivateRoute roles={["teacher"]}>
        <AgendaDocente />
      </PrivateRoute>
    ),
  },
  {
    path: '/teacher/subscription',
    element: (
      <PrivateRoute roles={["teacher"]}>
        <TeacherSubscription />
      </PrivateRoute>
    ),
  },
  {
    path: '/teacher/confirmation',
    element: (
      <PrivateRoute roles={["teacher"]}>
        <TeacherConfirmation />
      </PrivateRoute>
    ),
  },
  {
    path: '/teacher/chat',
    element: (
      <PrivateRoute roles={["teacher"]}>
        <TeacherChat />
      </PrivateRoute>
    ),
  },
  {
    path: '/teacher/personal-data',
    element: (
      <PrivateRoute roles={["teacher"]}>
        <DocenteDatosPersonales />
      </PrivateRoute>
    ),
  },
  {
    path: '/teacher/documents',
    element: (
      <PrivateRoute roles={["teacher"]}>
        <DocenteDocumentos />
      </PrivateRoute>
    ),
  },
  // Rutas existentes
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
