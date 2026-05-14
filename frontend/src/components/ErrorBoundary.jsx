import { Component } from 'react';
import { FiAlertTriangle } from 'react-icons/fi';
import { Link } from 'react-router-dom';

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('ErrorBoundary caught an error', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-[#0f0f0f] p-4 text-center">
          <div className="max-w-md w-full bg-white dark:bg-[#151515] p-8 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800">
            <div className="w-16 h-16 mx-auto bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 rounded-2xl flex items-center justify-center mb-6">
              <FiAlertTriangle className="text-3xl" />
            </div>
            <h1 className="text-2xl font-bold font-heading text-slate-900 dark:text-white mb-4">Something went wrong</h1>
            <p className="text-slate-600 dark:text-slate-400 mb-8">
              We encountered an unexpected error. Please try refreshing the page or navigating back to the homepage.
            </p>
            <div className="flex flex-col gap-3">
              <button 
                onClick={() => window.location.reload()} 
                className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold transition-colors"
              >
                Refresh Page
              </button>
              <Link 
                to="/" 
                className="w-full py-3 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-xl font-bold transition-colors"
                onClick={() => this.setState({ hasError: false })}
              >
                Back to Home
              </Link>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
