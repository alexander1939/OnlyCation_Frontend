import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import Home from '../pages/home/Home';
import AllTeachers from '../pages/teachers/AllTeachers';
import AboutUs from '../pages/about-us/AboutUs';
import BeTeacher from '../pages/teachers/BeTeacher';
import Login from '../pages/auth/Login';
import Register from '../pages/auth/Register';
import ForgotPassword from '../pages/auth/ForgotPassword';
import ResetPassword from '../pages/auth/ResetPassword';
import TeacherHome from '../pages/teachervista/home';
import StudentHome from '../pages/studentvista/home';
import PrivateRoute from "../components/PrivateRoute";
import Preferences from '../pages/profile/Preferences';
import CreateDocument from '../pages/documents/CreateDocument';
import CreatePrice from '../pages/prices/CreatePrice';
import { DocumentsProvider } from '../context/documents';
import { PreferencesProvider } from '../context/preferences';
import { CatalogsProvider } from '../context/catalogs/CatalogsContext';
import Video from '../pages/profile/Video';
import Cartera from '../pages/profile/Cartera';
import { AgendaProvider } from '../context/cartera';
import Agenda from '../pages/profile/Agenda';
import { BookingProvider } from '../context/booking';

const router = createBrowserRouter([
  {
    path: '/',
    element: <Home />,
  },
  {
    path: '/profile/preferences',
    element: (
      <CatalogsProvider>
        <PreferencesProvider>
          <Preferences />
        </PreferencesProvider>
      </CatalogsProvider>
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
      <BookingProvider>
        <Agenda />
      </BookingProvider>
    ),
  },
  {
    path: '/documents/create',
    element: (
      <DocumentsProvider>
        <CreateDocument />
      </DocumentsProvider>
    ),
  },
  {
    path: '/prices/create',
    element: ( <CreatePrice />
    ),
  },
  {
    path: '/profile/video',
    element: <Video />,
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

