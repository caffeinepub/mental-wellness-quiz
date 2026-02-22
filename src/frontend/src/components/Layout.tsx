import { ReactNode } from 'react';
import { useNavigate, useRouterState } from '@tanstack/react-router';
import { Button } from '@/components/ui/button';
import { Heart, User } from 'lucide-react';
import AuthButton from './AuthButton';
import { useInternetIdentity } from '../hooks/useInternetIdentity';

interface LayoutProps {
  children: ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const navigate = useNavigate();
  const routerState = useRouterState();
  const currentPath = routerState.location.pathname;
  const { loginStatus } = useInternetIdentity();
  const isAuthenticated = loginStatus === 'success';

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-background via-warm-peach/5 to-soft-pink/5">
      <header className="border-b border-border/40 bg-background/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <button
              onClick={() => navigate({ to: '/' })}
              className="flex items-center gap-2 hover:opacity-80 transition-opacity"
            >
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-warm-peach to-soft-pink flex items-center justify-center">
                <Heart className="w-5 h-5 text-white" fill="currentColor" />
              </div>
              <span className="text-xl font-semibold text-foreground">Wellness Check-In</span>
            </button>

            <div className="flex items-center gap-2">
              {isAuthenticated && currentPath !== '/profile' && (
                <Button
                  variant="ghost"
                  onClick={() => navigate({ to: '/profile' })}
                  className="rounded-full"
                >
                  <User className="w-4 h-4 mr-2" />
                  My Progress
                </Button>
              )}
              
              {currentPath !== '/' && !isAuthenticated && (
                <Button
                  variant="ghost"
                  onClick={() => navigate({ to: '/' })}
                  className="rounded-full"
                >
                  Home
                </Button>
              )}

              {!isAuthenticated ? (
                <>
                  <AuthButton variant="signup" className="hidden sm:inline-flex" />
                  <AuthButton variant="signin" />
                </>
              ) : (
                <AuthButton />
              )}
            </div>
          </div>
        </div>
      </header>

      <main className="flex-1">
        {children}
      </main>

      <footer className="border-t border-border/40 bg-background/80 backdrop-blur-sm mt-auto">
        <div className="container mx-auto px-4 py-6">
          <div className="text-center text-sm text-muted-foreground">
            <p className="flex items-center justify-center gap-1 flex-wrap">
              <span>© {new Date().getFullYear()} Wellness Check-In.</span>
              <span>Built with</span>
              <Heart className="w-4 h-4 text-warm-peach inline" fill="currentColor" />
              <span>using</span>
              <a
                href={`https://caffeine.ai/?utm_source=Caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(typeof window !== 'undefined' ? window.location.hostname : 'wellness-quiz')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-warm-peach hover:text-soft-pink transition-colors font-medium"
              >
                caffeine.ai
              </a>
            </p>
            <p className="mt-2 text-xs">
              This tool is for self-reflection and is not a substitute for professional mental health care.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
