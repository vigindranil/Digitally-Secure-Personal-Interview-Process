import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Cookies from 'js-cookie';

// Authentication Wrapper Component
export function AuthWrapper({ children, redirectTo = '/', fallback = null }) {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        setIsLoading(true);
        setError(null);

        // Get access token from cookies using js-cookie
        const accessToken = Cookies.get('access_token');

        if (!accessToken) {
          throw new Error('No access token found');
        }

        // Optional: Validate token with your API
        // const response = await fetch('/api/auth/validate', {
        //   headers: { Authorization: `Bearer ${accessToken}` }
        // });
        // if (!response.ok) throw new Error('Invalid token');

        setIsAuthenticated(true);
      } catch (err) {
        console.error('Authentication error:', err);
        setError(err.message);
        setIsAuthenticated(false);
        
        // Redirect to login if not authenticated
        if (redirectTo) {
          router.push(redirectTo);
        }
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, [router, redirectTo]);

  // Show loading state
  if (isLoading) {
    return fallback || (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-blue-600 border-r-transparent"></div>
          <p className="mt-2 text-gray-600">Checking authentication...</p>
        </div>
      </div>
    );
  }

  // Show error state (optional, as we redirect anyway)
  if (error && !redirectTo) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center text-red-600">
          <p className="text-xl font-semibold">Authentication Error</p>
          <p className="mt-2">{error}</p>
        </div>
      </div>
    );
  }

  // Render protected content only if authenticated
  return isAuthenticated ? children : null;
}
