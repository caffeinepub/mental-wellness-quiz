import { Button } from '@/components/ui/button';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { LogIn, LogOut, Loader2, UserPlus } from 'lucide-react';

interface AuthButtonProps {
  variant?: 'signin' | 'signup';
  size?: 'default' | 'sm' | 'lg';
  className?: string;
}

export default function AuthButton({ variant = 'signin', size = 'default', className = '' }: AuthButtonProps) {
  const { login, clear, loginStatus, isLoggingIn } = useInternetIdentity();

  const handleAuth = () => {
    if (loginStatus === 'success') {
      clear();
    } else {
      login();
    }
  };

  if (isLoggingIn) {
    return (
      <Button variant="outline" disabled size={size} className={`rounded-full ${className}`}>
        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
        Connecting...
      </Button>
    );
  }

  // If user is logged in, always show logout
  if (loginStatus === 'success') {
    return (
      <Button 
        variant="outline"
        onClick={handleAuth}
        size={size}
        className={`rounded-full ${className}`}
      >
        <LogOut className="w-4 h-4 mr-2" />
        Log Out
      </Button>
    );
  }

  // For unauthenticated users, show sign in or sign up based on variant
  if (variant === 'signup') {
    return (
      <Button 
        variant="default"
        onClick={handleAuth}
        size={size}
        className={`rounded-full ${className}`}
      >
        <UserPlus className="w-4 h-4 mr-2" />
        Sign Up
      </Button>
    );
  }

  return (
    <Button 
      variant="outline"
      onClick={handleAuth}
      size={size}
      className={`rounded-full ${className}`}
    >
      <LogIn className="w-4 h-4 mr-2" />
      Sign In
    </Button>
  );
}
