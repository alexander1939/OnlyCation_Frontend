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
import AgendaDocente from '../pages/availability/Agenda';
import DocenteDatosPersonales from '../pages/teacher/DatosPersonales';
import DocenteDocumentos from '../pages/teacher/Documentos';
import StudentHome from '../pages/student/home';
import PrivateRoute from "../components/PrivateRoute";
import DocenteProfile from '../pages/teacher/Profile';
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
import { WeeklyAgendaProvider } from '../context/availability';
import { ScheduleProvider } from '../context/availability/ScheduleContext';
import ContinueOnboarding from '../pages/profile/ContinueOnboarding';
import ActivateAccount from '../pages/profile/ActivateAccount';
import StepLock from '../components/StepLock';
// NUEVOS: páginas básicas por carpeta
import TeacherSubscription from '../pages/subscription/TeacherSubscription';
import TeacherConfirmation from '../pages/confirmation/my_confimaction';
import TeacherChat from '../pages/chat/my_chat';
import EstudianteDatosPersonales from '../pages/student/DatosPersonales';
import TeacherCatalog from '../pages/catalog/TeacherCatalog';
import PublicOrStudentRoute from '../components/PublicOrStudentRoute';
import AllBookings from '../pages/booking/all_bookings';
import { TeachersProvider } from '../context/teachers/TeachersContext';
import Terms from '../pages/legal/Terms';
import Privacy from '../pages/legal/Privacy';
import ActivateAccountCard from '../components/comptHome/activate-account';
import Chat from '../components/comptHome/chat';

const router = createBrowserRouter([
  {
    path: '/',
    element: <Home />,
  },
  {
    path: '/profile/preferences',
    element: (
        <PrivateRoute roles={["teacher"]}>
          <ActivationProvider>
            <StepLock>
              <CatalogsProvider>
                <PreferencesProvider>
                  <Preferences />
                </PreferencesProvider>
              </CatalogsProvider>
            </StepLock>
          </ActivationProvider>
        </PrivateRoute>
    ),
  },
  {
    path: '/profile/wallet',
    element: (
      <PrivateRoute roles={["teacher"]}>
        <ActivationProvider>
          <StepLock>
            <AgendaProvider>
              <Cartera />
            </AgendaProvider>
          </StepLock>
        </ActivationProvider>
      </PrivateRoute>
    ),
  },
  {
    path: '/profile/availability',
    element: (
      <PrivateRoute roles={["teacher"]}>
        <ActivationProvider>
          <StepLock>
            <BookingProvider>
              <Agenda />
            </BookingProvider>
          </StepLock>
        </ActivationProvider>
      </PrivateRoute>
    ),
  },
  {
    path: '/profile/document',
    element: (
      <PrivateRoute roles={["teacher"]}>
        <ActivationProvider>
          <StepLock>
            <DocumentsProvider>
              <CreateDocument />
            </DocumentsProvider>
          </StepLock>
        </ActivationProvider>
      </PrivateRoute>
    ),
  },
  {
    path: '/profile/price',
    element: (
      <PrivateRoute roles={["teacher"]}>
        <ActivationProvider>
          <StepLock>
            <CreatePrice />
          </StepLock>
        </ActivationProvider>
      </PrivateRoute>
    ),
  },
  {
    path: '/profile/video',
    element: (
      <PrivateRoute roles={["teacher"]}>
        <ActivationProvider>
          <StepLock>
            <Video />
          </StepLock>
        </ActivationProvider>
      </PrivateRoute>
    ),
  },
  {
    path: '/profile/continue',
    element: (
      <PrivateRoute roles={["teacher"]}>
        <ActivationProvider>
          <ContinueOnboarding />
        </ActivationProvider>
      </PrivateRoute>
    ),
  },
  {
    path: '/profile/activate',
    element: (
      <PrivateRoute roles={["teacher"]}>
        <ActivationProvider>
          <StepLock>
            <ActivateAccount />
          </StepLock>
        </ActivationProvider>
      </PrivateRoute>
    ),
  },
  {
    path: "/teacher-home",
    element: (
      <PrivateRoute roles={["teacher"]} requireTeacherStatus="active">
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
    path: '/docente/profile',
    element: (
      <PrivateRoute roles={["teacher"]}>
        <DocenteProfile />
      </PrivateRoute>
    ),
  },
  {
    path: '/docente/profile',
    element: (
      <PrivateRoute roles={["teacher"]}>
        <DocenteProfile />
      </PrivateRoute>
    ),
  },
  {
    path: '/teacher/availability',
    element: (
      <PrivateRoute roles={["teacher"]}>
        <WeeklyAgendaProvider>
          <ScheduleProvider>
            <AgendaDocente />
          </ScheduleProvider>
        </WeeklyAgendaProvider>
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
        <Chat />
      </PrivateRoute>
    ),
  },
  {
    path: '/student/chat',
    element: (
      <PrivateRoute roles={["student"]}>
        <Chat />
      </PrivateRoute>
    ),
  },
  {
    path: '/teachers',
    element: <AllTeachers />,
  },
  {
    path: '/catalog/teachers',
    element: (
      <PublicOrStudentRoute>
        <TeachersProvider>
          <TeacherCatalog />
        </TeachersProvider>
      </PublicOrStudentRoute>
    ),
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
  {
    path: '/terms',
    element: <Terms />,
  },
  {
    path: '/privacy',
    element: <Privacy />,
  },
]);

export default function AppRouter() {
  return <RouterProvider router={router} />;
}
