import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import Home from '../pages/home/Home';
import AllTeachers from '../pages/teachers/AllTeachers';
import AboutUs from '../pages/about-us/AboutUs';
import BeTeacher from '../pages/teachers/BeTeacher';
import Login from '../pages/auth/Login';
import Register from '../pages/auth/Register';
import RegisterStudent from '../pages/RegisterStudent';
import RegisterTeacher from '../pages/RegisterTeacher';
import TeacherHome from '../pages/teachervista/home';
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
