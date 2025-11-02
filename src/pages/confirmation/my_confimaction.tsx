import React from 'react';
import { useAuthContext } from '../../context/auth';
import ConfirmationView from '../../components/shared/ConfirmationView';

const StudentConfirmation: React.FC = () => {
  const { user } = useAuthContext();
  return <ConfirmationView role={user?.role} />;
};

export default StudentConfirmation;
