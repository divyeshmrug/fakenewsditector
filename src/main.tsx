import { StrictMode, Component, type ReactNode } from 'react'
import { createRoot } from 'react-dom/client'
import { GoogleOAuthProvider } from '@react-oauth/google'
import './index.css'
import './i18n'
import App from './App.tsx'

class ErrorBoundary extends Component<{ children: ReactNode }, { hasError: boolean; error: Error | null }> {
  constructor(props: { children: ReactNode }) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: any) {
    console.error("Uncaught error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex items-center justify-center min-h-screen bg-gray-900 text-white p-4">
          <div className="max-w-md w-full bg-gray-800 rounded-lg shadow-xl p-8 border border-gray-700">
            <h1 className="text-2xl font-bold text-red-500 mb-4">Application Error</h1>
            <p className="mb-4 text-gray-300">
              The application failed to start properly. This is likely due to invalid API keys in your .env file.
            </p>
            <div className="bg-gray-950 p-4 rounded border border-gray-700 overflow-auto text-xs font-mono text-red-400 mb-6">
              {this.state.error?.message}
            </div>
            <div className="text-sm text-gray-400">
              <p className="mb-2 font-semibold">To fix this:</p>
              <ol className="list-decimal list-inside space-y-1">
                <li>Open the <code className="bg-gray-700 px-1 rounded">.env</code> file in the project root.</li>
                <li>Replace the dummy keys with valid API keys.</li>
                <li>Restart the server.</li>
              </ol>
            </div>
            <button
              onClick={() => window.location.reload()}
              className="mt-6 w-full bg-blue-600 hover:bg-blue-500 text-white font-medium py-2 px-4 rounded transition-colors"
            >
              Reload Application
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

console.log('Google Client ID Loaded:', import.meta.env.VITE_GOOGLE_CLIENT_ID ? 'YES (Masked: ' + import.meta.env.VITE_GOOGLE_CLIENT_ID.substring(0, 10) + '...)' : 'MISSING');

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
      <ErrorBoundary>
        <App />
      </ErrorBoundary>
    </GoogleOAuthProvider>
  </StrictMode>,
)


