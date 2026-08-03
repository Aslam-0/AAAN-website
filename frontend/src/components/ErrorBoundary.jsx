import React from 'react';

export class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("ErrorBoundary caught an error:", error, errorInfo);
    this.setState({ errorInfo });
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null, errorInfo: null });
    window.location.href = '/';
  };

  render() {
    if (this.state.hasError) {
      return (
        <div style={{
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '24px',
          background: '#F8FAFC',
          color: '#0F172A',
          fontFamily: 'sans-serif'
        }}>
          <div style={{
            background: 'white',
            borderRadius: '24px',
            padding: '40px',
            maxWidth: '560px',
            width: '100%',
            boxShadow: '0 20px 50px rgba(0,0,0,0.1)',
            textAlign: 'center',
            border: '1px solid #E2E8F0'
          }}>
            <h1 style={{ fontSize: '1.8rem', margin: '0 0 12px', color: '#4F46E5' }}>AAAN Enterprises</h1>
            <h2 style={{ fontSize: '1.2rem', margin: '0 0 16px', color: '#EF4444' }}>Something went wrong loading this view</h2>
            <p style={{ color: '#64748B', fontSize: '0.9rem', marginBottom: '24px' }}>
              {this.state.error?.message || 'An unexpected error occurred.'}
            </p>
            <button
              onClick={this.handleReset}
              style={{
                background: 'linear-gradient(135deg, #4F46E5 0%, #7C3AED 100%)',
                color: 'white',
                fontWeight: 800,
                padding: '12px 28px',
                borderRadius: '50px',
                border: 'none',
                cursor: 'pointer',
                fontSize: '0.95rem'
              }}
            >
              🔄 Return to Home
            </button>

            {process.env.NODE_ENV !== 'production' && this.state.errorInfo && (
              <details style={{ marginTop: '24px', textAlign: 'left', background: '#F1F5F9', padding: '12px', borderRadius: '8px', fontSize: '0.75rem', overflowX: 'auto' }}>
                <summary style={{ cursor: 'pointer', fontWeight: 700 }}>Debug Error Details</summary>
                <pre style={{ marginTop: '8px', whiteSpace: 'pre-wrap' }}>
                  {this.state.error?.toString()}
                  {'\n'}
                  {this.state.errorInfo.componentStack}
                </pre>
              </details>
            )}
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
export default ErrorBoundary;
