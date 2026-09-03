import React, { Component, ErrorInfo, ReactNode } from 'react';
interface Props { children: ReactNode; }
interface State { hasError: boolean; error: Error | null; }
class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false, error: null };
  static getDerivedStateFromError(error: Error): State { return { hasError: true, error }; }
  componentDidCatch(error: Error, errorInfo: ErrorInfo) { console.error('Uncaught error:', error, errorInfo); }
  render() {
    if (this.state.hasError) return (
      <div className="min-h-[400px] flex items-center justify-center p-8">
        <div className="text-center max-w-md">
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Something went wrong</h2>
          <p className="text-gray-500 mb-4">An unexpected error occurred.</p>
          <button onClick={() => this.setState({ hasError: false, error: null })} className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700">Try Again</button>
        </div>
      </div>
    );
    return this.props.children;
  }
}
export default ErrorBoundary;
