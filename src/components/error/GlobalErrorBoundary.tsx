import React from 'react';
import ServerError from './ServerError';

interface GlobalErrorBoundaryState {
  hasError: boolean;
}

export default class GlobalErrorBoundary extends React.Component<React.PropsWithChildren<{}>, GlobalErrorBoundaryState> {
  state: GlobalErrorBoundaryState = { hasError: false };

  static getDerivedStateFromError(): GlobalErrorBoundaryState {
    return { hasError: true };
  }

  componentDidCatch(error: unknown, errorInfo: unknown) {
    // Log non-sensitive info for debugging; adjust to your logger if you have one
    // eslint-disable-next-line no-console
    console.error('[GlobalErrorBoundary] Caught error', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return <ServerError />;
    }
    return this.props.children;
  }
}
