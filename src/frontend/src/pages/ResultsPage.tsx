import { useNavigate } from '@tanstack/react-router';
import { useEffect, useState } from 'react';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import FeedbackCard from '../components/FeedbackCard';
import AuthButton from '../components/AuthButton';
import { Heart, Home, Sparkles, Save } from 'lucide-react';
import type { Question } from '../backend';

interface ResultsData {
  answers: number[];
  questions: Question[];
  score?: number;
  timestamp: number;
  saved?: boolean;
}

export default function ResultsPage() {
  const navigate = useNavigate();
  const { loginStatus } = useInternetIdentity();
  const [resultsData, setResultsData] = useState<ResultsData | null>(null);

  const isAuthenticated = loginStatus === 'success';

  useEffect(() => {
    // Retrieve results from localStorage
    const storedResults = localStorage.getItem('quizResults');
    if (storedResults) {
      try {
        const data = JSON.parse(storedResults) as ResultsData;
        setResultsData(data);
      } catch (error) {
        console.error('Failed to parse quiz results:', error);
      }
    }
  }, []);

  if (!resultsData) {
    return (
      <div className="min-h-[calc(100vh-200px)] flex items-center justify-center px-4">
        <Card className="max-w-md w-full">
          <CardHeader>
            <CardTitle>No Results Available</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4">
              Please complete the quiz first to see your results.
            </p>
            <Button onClick={() => navigate({ to: '/quiz' })}>
              Take the Quiz
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const { answers, questions, saved } = resultsData;
  const score = resultsData.score ?? answers.reduce((acc, answer, index) => {
    const question = questions[index];
    return acc + (answer === Number(question.correctAnswerIndex) ? 1 : 0);
  }, 0);
  
  const percentage = Math.round((score / questions.length) * 100);

  const getFeedbackMessages = () => {
    if (percentage >= 80) {
      return {
        title: "You're Doing Wonderfully! ✨",
        description: "Your responses show strong self-awareness and healthy coping strategies.",
        messages: [
          "You demonstrate excellent emotional awareness and self-care practices.",
          "Keep nurturing these positive habits - they're serving you well.",
          "Remember to celebrate your progress and continue being kind to yourself.",
        ],
        color: "gentle-lavender"
      };
    } else if (percentage >= 60) {
      return {
        title: "You're on a Positive Path 🌸",
        description: "You're showing good awareness and taking steps toward wellness.",
        messages: [
          "You're making meaningful progress in understanding your mental wellness.",
          "Consider exploring new self-care practices that resonate with you.",
          "Remember, growth is a journey - be patient and compassionate with yourself.",
        ],
        color: "soft-pink"
      };
    } else {
      return {
        title: "You're Taking Important Steps 💕",
        description: "Completing this quiz shows courage and self-awareness.",
        messages: [
          "Acknowledging where you are is a powerful first step toward wellness.",
          "Consider reaching out to supportive friends, family, or a counselor.",
          "Small, consistent steps can lead to meaningful positive changes.",
          "Remember: seeking support is a sign of strength, not weakness.",
        ],
        color: "warm-peach"
      };
    }
  };

  const feedback = getFeedbackMessages();

  return (
    <div 
      className="min-h-[calc(100vh-200px)] px-4 py-12 relative"
      style={{
        backgroundImage: 'url(/assets/generated/background-calm.dim_1920x1080.png)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed',
      }}
    >
      <div className="absolute inset-0 bg-background/80 backdrop-blur-sm" />
      
      <div className="max-w-4xl mx-auto space-y-8 relative z-10">
        <div className="text-center space-y-4">
          <div className="flex justify-center mb-4">
            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-warm-peach to-soft-pink flex items-center justify-center shadow-lg">
              <Heart className="w-10 h-10 text-white" fill="currentColor" />
            </div>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-foreground">
            {feedback.title}
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            {feedback.description}
          </p>
        </div>

        {!isAuthenticated && !saved && (
          <Alert className="border-warm-peach/20 bg-card/95 backdrop-blur">
            <Save className="w-4 h-4 text-warm-peach" />
            <AlertDescription className="ml-2">
              <div className="flex flex-col gap-4">
                <span className="text-sm">
                  Your results are temporary. Create an account to save your progress and track your wellness journey over time.
                </span>
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
                  <AuthButton variant="signup" size="default" />
                  <span className="text-sm text-muted-foreground">
                    Already have an account?{' '}
                    <AuthButton variant="signin" size="sm" className="inline-flex" />
                  </span>
                </div>
              </div>
            </AlertDescription>
          </Alert>
        )}

        {saved && (
          <Alert className="border-gentle-lavender/20 bg-card/95 backdrop-blur">
            <Save className="w-4 h-4 text-gentle-lavender" />
            <AlertDescription className="ml-2 text-sm">
              Your results have been saved to your account! View your progress history in your profile.
            </AlertDescription>
          </Alert>
        )}

        <Card className="border-warm-peach/20 shadow-xl bg-card/95 backdrop-blur">
          <CardHeader className="text-center pb-4">
            <div className="flex justify-center mb-4">
              <div className="relative w-32 h-32">
                <svg className="w-32 h-32 transform -rotate-90">
                  <circle
                    cx="64"
                    cy="64"
                    r="56"
                    stroke="currentColor"
                    strokeWidth="8"
                    fill="none"
                    className="text-muted/20"
                  />
                  <circle
                    cx="64"
                    cy="64"
                    r="56"
                    stroke="currentColor"
                    strokeWidth="8"
                    fill="none"
                    strokeDasharray={`${2 * Math.PI * 56}`}
                    strokeDashoffset={`${2 * Math.PI * 56 * (1 - percentage / 100)}`}
                    className="text-warm-peach transition-all duration-1000"
                    strokeLinecap="round"
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-3xl font-bold text-foreground">{percentage}%</span>
                </div>
              </div>
            </div>
            <CardTitle className="text-2xl">Your Wellness Score</CardTitle>
            <CardDescription>
              You answered {score} out of {questions.length} questions in a way that reflects strong wellness awareness
            </CardDescription>
          </CardHeader>
        </Card>

        <div className="space-y-4">
          <div className="flex items-center gap-2 text-foreground">
            <Sparkles className="w-5 h-5 text-warm-peach" />
            <h2 className="text-2xl font-semibold">Personalized Insights</h2>
          </div>
          
          <div className="grid gap-4">
            {feedback.messages.map((message, index) => (
              <FeedbackCard key={index} message={message} delay={index * 100} />
            ))}
          </div>
        </div>

        <Card className="border-soft-pink/20 bg-card/95 backdrop-blur">
          <CardContent className="pt-6">
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-foreground">Remember:</h3>
              <p className="text-muted-foreground leading-relaxed">
                This quiz is designed to support your self-reflection and is not a substitute for professional mental health care. 
                If you're experiencing persistent difficulties, please consider reaching out to a mental health professional, 
                counselor, or trusted support person. You deserve support, and help is available.
              </p>
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-center gap-4 flex-wrap">
          {isAuthenticated && (
            <Button 
              variant="outline"
              onClick={() => navigate({ to: '/profile' })}
              className="rounded-full"
            >
              View My Progress
            </Button>
          )}
          <Button 
            variant="outline" 
            onClick={() => navigate({ to: '/quiz' })}
            className="rounded-full"
          >
            Retake Quiz
          </Button>
          <Button 
            onClick={() => navigate({ to: '/' })}
            className="rounded-full"
          >
            <Home className="w-4 h-4 mr-2" />
            Return Home
          </Button>
        </div>
      </div>
    </div>
  );
}
