// import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/profile-dropdown.css';

type ProfileDropdownProps = {
  user: any;
  isTeacher: boolean;
  isStudent: boolean;
  onClose: () => void;
  onLogout: () => void;
};

export default function ProfileDropdown({ user, isTeacher, isStudent, onClose, onLogout }: ProfileDropdownProps) {
  const userInitials = user 
    ? `${user.first_name?.[0] ?? ''}${user.last_name?.[0] ?? ''}`.toUpperCase() || 'U'
    : '';
  const fullName = user ? `${user.first_name} ${user.last_name}`.trim() : '';
  const userEmail = user?.email || '';

  return (
    <div className="profile-dropdown">
      {/* Avatar y info del usuario (solo si está logueado) */}
      {user && (
        <div className="profile-dropdown-header">
          <div className="profile-dropdown-avatar">
            {userInitials}
          </div>
          <div className="profile-dropdown-name">
            {fullName}
          </div>
          <div className="profile-dropdown-email">
            {userEmail}
          </div>
        </div>
      )}
      
      <div className="profile-dropdown-menu">
        {!user && (
          <>
            <Link
              to="/login"
              className="profile-dropdown-item"
              onClick={onClose}
            >
              <span className="profile-dropdown-icon">🔑</span>
              Iniciar sesión
            </Link>
            <Link
              to="/register"
              className="profile-dropdown-item"
              onClick={onClose}
            >
              <span className="profile-dropdown-icon">📝</span>
              Registrarse
            </Link>
          </>
        )}

        {isStudent && (
          <>
            <Link to="/student/personal-data" className="profile-dropdown-item" onClick={onClose}>
              <span className="profile-dropdown-icon">👤</span>
              Actualizar Datos Personales
            </Link>
            <div className="profile-dropdown-divider"></div>
            <button className="profile-dropdown-item profile-dropdown-button" onClick={onLogout}>
              <span className="profile-dropdown-icon">🚪</span>
              Cerrar Sesión
            </button>
          </>
        )}

        {isTeacher && (
          <>
            <Link to="/teacher/personal-data" className="profile-dropdown-item" onClick={onClose}>
              <span className="profile-dropdown-icon">👤</span>
              Actualizar Datos Personales
            </Link>
            <Link to="/teacher/documents" className="profile-dropdown-item" onClick={onClose}>
              <span className="profile-dropdown-icon">📁</span>
              Documentos
            </Link>
            <div className="profile-dropdown-divider"></div>
            <button className="profile-dropdown-item profile-dropdown-button" onClick={onLogout}>
              <span className="profile-dropdown-icon">🚪</span>
              Cerrar Sesión
            </button>
          </>
        )}
      </div>
    </div>
  );
}
