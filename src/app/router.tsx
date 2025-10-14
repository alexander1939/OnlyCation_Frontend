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
import DocenteGeneral from '../pages/docente/General';
import AgendaDocente from '../pages/docente/Agenda';
import DocenteDatosPersonales from '../pages/docente/DatosPersonales';
import StudentHome from '../pages/studentvista/home';
import PrivateRoute from "../components/PrivateRoute";

const router = createBrowserRouter([
  {
    path: '/',
    element: <Home />,
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
