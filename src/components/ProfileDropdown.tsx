// import React from 'react';
import { Link } from 'react-router-dom';
import { useWallet } from '../context/wallet/WalletContext';
import '../styles/profile-dropdown.css';
import { LogIn, UserPlus, GraduationCap, User, LogOut, BarChart3, Wallet, Folder } from 'lucide-react';

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
  const { fetchWalletBalance } = useWallet();

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
              <span className="profile-dropdown-icon"><LogIn size={16} color="#68B2C9" /></span>
              Iniciar sesión
            </Link>
            <Link
              to="/register"
              className="profile-dropdown-item"
              onClick={onClose}
            >
              <span className="profile-dropdown-icon"><UserPlus size={16} color="#FF9978" /></span>
              Registrarse
            </Link>
          </>
        )}

        {isStudent && (
          <>
            <Link to="/catalog/teachers" className="profile-dropdown-item" onClick={onClose}>
              <span className="profile-dropdown-icon"><GraduationCap size={16} color="#8ED4BE" /></span>
              Buscar Docentes
            </Link>
            <Link to="/student/personal-data" className="profile-dropdown-item" onClick={onClose}>
              <span className="profile-dropdown-icon"><User size={16} color="#294954" /></span>
              Actualizar Datos Personales
            </Link>
            <div className="profile-dropdown-divider"></div>
            <button className="profile-dropdown-item profile-dropdown-button" onClick={onLogout}>
              <span className="profile-dropdown-icon"><LogOut size={16} color="#FF9978" /></span>
              Cerrar Sesión
            </button>
          </>
        )}

        {isTeacher && (
          <>
            <Link to="/teacher/profile" className="profile-dropdown-item" onClick={onClose}>
              <span className="profile-dropdown-icon"><BarChart3 size={16} color="#68B2C9" /></span>
              Mi Perfil
            </Link>
            <Link 
              to="#" 
              className="profile-dropdown-item" 
              onClick={(e) => {
                e.preventDefault();
                onClose();
                fetchWalletBalance();
              }}
            >
              <span className="profile-dropdown-icon"><Wallet size={16} color="#68B2C9" /></span>
              Cartera
            </Link>
            <Link to="/teacher/personal-data" className="profile-dropdown-item" onClick={onClose}>
              <span className="profile-dropdown-icon"><User size={16} color="#294954" /></span>
              Actualizar Datos Personales
            </Link>
            <Link to="/teacher/documents" className="profile-dropdown-item" onClick={onClose}>
              <span className="profile-dropdown-icon"><Folder size={16} color="#294954" /></span>
              Documentos
            </Link>
            <div className="profile-dropdown-divider"></div>
            <button className="profile-dropdown-item profile-dropdown-button" onClick={onLogout}>
              <span className="profile-dropdown-icon"><LogOut size={16} color="#FF9978" /></span>
              Cerrar Sesión
            </button>
          </>
        )}
      </div>
    </div>
  );
}
