import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useActivation } from '../../context/activation/ActivationContext';

const ContinueOnboarding: React.FC = () => {
  const { check, getNextRoute } = useActivation();
  const navigate = useNavigate();

  React.useEffect(() => {
    (async () => {
      try {
        await check();
        navigate(getNextRoute(), { replace: true });
      } catch {
        navigate('/profile/preferences', { replace: true });
      }
    })();
  }, [check, getNextRoute, navigate]);

  return null;
};

export default ContinueOnboarding;
