import { Button } from '@/components/ui/button';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { LogIn, LogOut, Loader2 } from 'lucide-react';

export default function AuthButton() {
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
      <Button variant="outline" disabled className="rounded-full">
        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
        Connecting...
      </Button>
    );
  }

  return (
    <Button 
      variant={loginStatus === 'success' ? 'outline' : 'default'}
      onClick={handleAuth}
      className="rounded-full"
    >
      {loginStatus === 'success' ? (
        <>
          <LogOut className="w-4 h-4 mr-2" />
          Log Out
        </>
      ) : (
        <>
          <LogIn className="w-4 h-4 mr-2" />
          Log In
        </>
      )}
    </Button>
  );
}
