import { useNavigate } from '@tanstack/react-router';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { useMyAttempts } from '../hooks/useQueries';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import AttemptCard from '../components/AttemptCard';
import { Loader2, TrendingUp, LogIn, Heart } from 'lucide-react';

export default function ProfilePage() {
  const navigate = useNavigate();
  const { loginStatus, identity, login, isLoggingIn } = useInternetIdentity();
  const { data: attempts, isLoading } = useMyAttempts();

  const isAuthenticated = loginStatus === 'success';

  if (!isAuthenticated) {
    return (
      <div className="min-h-[calc(100vh-200px)] flex items-center justify-center px-4">
        <Card className="max-w-md w-full border-warm-peach/20">
          <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-warm-peach to-soft-pink flex items-center justify-center">
                <Heart className="w-8 h-8 text-white" fill="currentColor" />
              </div>
            </div>
            <CardTitle className="text-2xl">Track Your Wellness Journey</CardTitle>
            <CardDescription className="text-base">
              Log in to save your quiz results and see your progress over time
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button 
              onClick={login} 
              disabled={isLoggingIn}
              className="w-full rounded-full"
              size="lg"
            >
              {isLoggingIn ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Connecting...
                </>
              ) : (
                <>
                  <LogIn className="w-4 h-4 mr-2" />
                  Log In to View Progress
                </>
              )}
            </Button>
            <Button 
              variant="outline" 
              onClick={() => navigate({ to: '/' })}
              className="w-full rounded-full"
            >
              Return Home
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-[calc(100vh-200px)] flex items-center justify-center">
        <div className="text-center space-y-4">
          <Loader2 className="w-12 h-12 animate-spin text-warm-peach mx-auto" />
          <p className="text-muted-foreground">Loading your wellness journey...</p>
        </div>
      </div>
    );
  }

  const hasAttempts = attempts && attempts.length > 0;
  const totalAttempts = attempts?.length || 0;
  const averageScore = hasAttempts
    ? Math.round(
        (attempts.reduce((sum, attempt) => sum + Number(attempt.score), 0) / totalAttempts)
      )
    : 0;

  return (
    <div className="min-h-[calc(100vh-200px)] px-4 py-12">
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="text-center space-y-4">
          <div className="flex justify-center mb-4">
            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-warm-peach to-soft-pink flex items-center justify-center shadow-lg">
              <TrendingUp className="w-10 h-10 text-white" />
            </div>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-foreground">
            Your Wellness Journey
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Track your progress and celebrate your growth
          </p>
        </div>

        {hasAttempts && (
          <div className="grid md:grid-cols-2 gap-6">
            <Card className="border-warm-peach/20 bg-card/50 backdrop-blur">
              <CardHeader>
                <CardTitle className="text-lg">Total Check-Ins</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-4xl font-bold text-warm-peach">{totalAttempts}</p>
              </CardContent>
            </Card>

            <Card className="border-soft-pink/20 bg-card/50 backdrop-blur">
              <CardHeader>
                <CardTitle className="text-lg">Average Score</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-4xl font-bold text-soft-pink">{averageScore}</p>
              </CardContent>
            </Card>
          </div>
        )}

        <div className="space-y-4">
          <h2 className="text-2xl font-semibold text-foreground">Your Check-In History</h2>
          
          {!hasAttempts ? (
            <Alert className="border-warm-peach/20 bg-card/50 backdrop-blur">
              <Heart className="w-4 h-4 text-warm-peach" />
              <AlertDescription className="ml-2">
                You haven't completed any wellness check-ins yet. Take your first quiz to start tracking your journey!
              </AlertDescription>
            </Alert>
          ) : (
            <div className="space-y-4">
              {attempts.map((attempt, index) => (
                <AttemptCard key={index} attempt={attempt} />
              ))}
            </div>
          )}
        </div>

        <div className="flex justify-center gap-4">
          <Button 
            onClick={() => navigate({ to: '/quiz' })}
            className="rounded-full"
            size="lg"
          >
            Take Another Check-In
          </Button>
          <Button 
            variant="outline"
            onClick={() => navigate({ to: '/' })}
            className="rounded-full"
            size="lg"
          >
            Return Home
          </Button>
        </div>
      </div>
    </div>
  );
}
