import { useState } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { useGetAllQuestions, useSubmitAnswers } from '../hooks/useQueries';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import QuizQuestion from '../components/QuizQuestion';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ChevronLeft, ChevronRight, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

export default function QuizPage() {
  const navigate = useNavigate();
  const { data: questions, isLoading } = useGetAllQuestions();
  const submitAnswersMutation = useSubmitAnswers();
  const { loginStatus } = useInternetIdentity();
  
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<number[]>([]);

  const isAuthenticated = loginStatus === 'success';
  const currentQuestion = questions?.[currentQuestionIndex];
  const progress = questions ? ((currentQuestionIndex + 1) / questions.length) * 100 : 0;
  const isLastQuestion = questions && currentQuestionIndex === questions.length - 1;

  const handleAnswerSelect = (answerIndex: number) => {
    const newAnswers = [...answers];
    newAnswers[currentQuestionIndex] = answerIndex;
    setAnswers(newAnswers);
  };

  const handleNext = () => {
    if (answers[currentQuestionIndex] === undefined) {
      toast.error('Please select an answer before continuing');
      return;
    }

    if (isLastQuestion) {
      handleSubmit();
    } else {
      setCurrentQuestionIndex(prev => prev + 1);
    }
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prev => prev - 1);
    }
  };

  const handleSubmit = async () => {
    if (answers.length !== questions?.length) {
      toast.error('Please answer all questions');
      return;
    }

    try {
      const answersAsBigInt = answers.map(a => BigInt(a));
      
      if (isAuthenticated) {
        // Submit to backend when authenticated
        const score = await submitAnswersMutation.mutateAsync({
          answers: answersAsBigInt,
        });

        // Store results in localStorage for the results page
        localStorage.setItem('quizResults', JSON.stringify({
          answers,
          questions,
          score: Number(score),
          timestamp: Date.now(),
          saved: true,
        }));
      } else {
        // For anonymous users, just store in localStorage
        const score = answers.reduce((acc, answer, index) => {
          const question = questions[index];
          return acc + (answer === Number(question.correctAnswerIndex) ? 1 : 0);
        }, 0);

        localStorage.setItem('quizResults', JSON.stringify({
          answers,
          questions,
          score,
          timestamp: Date.now(),
          saved: false,
        }));
      }

      navigate({ to: '/results' });
    } catch (error) {
      toast.error('Failed to submit quiz. Please try again.');
      console.error('Submit error:', error);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-[calc(100vh-200px)] flex items-center justify-center">
        <div className="text-center space-y-4">
          <Loader2 className="w-12 h-12 animate-spin text-warm-peach mx-auto" />
          <p className="text-muted-foreground">Loading your wellness check-in...</p>
        </div>
      </div>
    );
  }

  if (!questions || questions.length === 0) {
    return (
      <div className="min-h-[calc(100vh-200px)] flex items-center justify-center px-4">
        <Card className="max-w-md w-full">
          <CardHeader>
            <CardTitle>No Questions Available</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4">
              There are no quiz questions available at the moment. Please check back later.
            </p>
            <Button onClick={() => navigate({ to: '/' })}>
              Return Home
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-200px)] flex items-center justify-center px-4 py-12">
      <div className="max-w-3xl w-full space-y-6">
        <div className="space-y-2">
          <div className="flex justify-between items-center text-sm text-muted-foreground">
            <span>Question {currentQuestionIndex + 1} of {questions.length}</span>
            <span>{Math.round(progress)}% Complete</span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>

        <Card className="border-warm-peach/20 shadow-lg">
          <CardContent className="pt-8">
            {currentQuestion && (
              <QuizQuestion
                question={currentQuestion}
                selectedAnswer={answers[currentQuestionIndex]}
                onAnswerSelect={handleAnswerSelect}
              />
            )}
          </CardContent>
        </Card>

        <div className="flex justify-between items-center gap-4">
          <Button
            variant="outline"
            onClick={handlePrevious}
            disabled={currentQuestionIndex === 0}
            className="rounded-full"
          >
            <ChevronLeft className="w-4 h-4 mr-2" />
            Previous
          </Button>

          <Button
            onClick={handleNext}
            disabled={answers[currentQuestionIndex] === undefined || submitAnswersMutation.isPending}
            className="rounded-full"
          >
            {submitAnswersMutation.isPending ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Submitting...
              </>
            ) : isLastQuestion ? (
              'Complete Quiz'
            ) : (
              <>
                Next
                <ChevronRight className="w-4 h-4 ml-2" />
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
