import React from 'react';

export default class ErrorBoundary extends React.Component {
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
      return <div style={{ padding: 40 }}>Something went wrong. Please refresh the page.</div>;
    }
    return this.props.children;
  }
}


