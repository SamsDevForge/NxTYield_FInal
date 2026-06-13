import { Component } from 'react';

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { error: null };
  }

  static getDerivedStateFromError(error) {
    return { error };
  }

  handleRetry = () => {
    this.setState({ error: null });
  };

  render() {
    if (this.state.error) {
      return (
        <div className="container">
          <div className="panel app-fallback-panel">
            <h2 className="panel-title">Page unavailable</h2>
            <p className="text-muted">
              This view could not render. The rest of the dashboard is still available.
            </p>
            <p className="text-warning text-sm">{this.state.error.message || 'Unexpected UI error'}</p>
            <button className="btn btn-primary" type="button" onClick={this.handleRetry}>
              Retry
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
