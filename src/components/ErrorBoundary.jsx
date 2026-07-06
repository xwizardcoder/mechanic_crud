import { Component } from 'react';
import { Link } from 'react-router-dom';

export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, info) {
    console.error('[ErrorBoundary] Caught error:', error, info);
  }

  render() {
    if (this.state.hasError) {
      return (
        <main className="page-wrapper" id="main-content">
          <div
            className="container page-content flex-center"
            style={{ flexDirection: 'column', gap: 16, paddingTop: 80, textAlign: 'center' }}
            role="alert"
            aria-live="assertive"
          >
            <h1>Something went wrong</h1>
            <p className="text-muted">
              An unexpected error occurred. Please refresh the page or go back to the dashboard.
            </p>
            {process.env.NODE_ENV === 'development' && this.state.error && (
              <pre
                style={{
                  background: 'var(--color-850)',
                  border: '1px solid var(--color-700)',
                  borderRadius: 8,
                  padding: 16,
                  fontSize: 12,
                  color: 'var(--danger)',
                  maxWidth: 600,
                  textAlign: 'left',
                  overflowX: 'auto',
                }}
              >
                {this.state.error.toString()}
              </pre>
            )}
            <div style={{ display: 'flex', gap: 12 }}>
              <button
                className="btn btn-secondary"
                onClick={() => this.setState({ hasError: false, error: null })}
                aria-label="Try again"
              >
                Try Again
              </button>
              <Link to="/" className="btn btn-primary" aria-label="Go back to dashboard">
                ← Dashboard
              </Link>
            </div>
          </div>
        </main>
      );
    }

    return this.props.children;
  }
}
