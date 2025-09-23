import React, { useMemo } from 'react';

// Minimal class component to hook into error lifecycle; wrapped by a functional component API
class ErrorCatcher extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }
  static getDerivedStateFromError() {
    return { hasError: true };
  }
  componentDidCatch(err, info) {
    // eslint-disable-next-line no-console
    console.error('ErrorBoundary caught an error', err, info);
  }
  render() {
    if (this.state.hasError) {
      return this.props.fallback || (
        <div style={{ padding: 40 }}>Something went wrong. Please refresh the page.</div>
      );
    }
    return this.props.children;
  }
}

export default function ErrorBoundary({ children, fallback = null }) {
  // Memoize fallback element to avoid re-mounting the class on every render
  const fallbackEl = useMemo(() => fallback, [fallback]);
  return (
    <ErrorCatcher fallback={fallbackEl}>
      {children}
    </ErrorCatcher>
  );
}


