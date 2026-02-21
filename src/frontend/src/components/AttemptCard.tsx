import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Calendar, TrendingUp } from 'lucide-react';
import type { Attempt } from '../backend';

interface AttemptCardProps {
  attempt: Attempt;
}

export default function AttemptCard({ attempt }: AttemptCardProps) {
  const date = new Date(Number(attempt.timestamp) / 1000000); // Convert nanoseconds to milliseconds
  const formattedDate = date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
  const formattedTime = date.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
  });

  const score = Number(attempt.score);
  const totalQuestions = attempt.answers.length;
  const percentage = totalQuestions > 0 ? Math.round((score / totalQuestions) * 100) : 0;

  const getFeedbackLevel = () => {
    if (percentage >= 80) {
      return {
        label: 'Excellent',
        color: 'bg-gentle-lavender/10 text-gentle-lavender border-gentle-lavender/20',
        message: 'You demonstrated strong wellness awareness',
      };
    } else if (percentage >= 60) {
      return {
        label: 'Good Progress',
        color: 'bg-soft-pink/10 text-soft-pink border-soft-pink/20',
        message: 'You showed positive wellness understanding',
      };
    } else {
      return {
        label: 'Growing',
        color: 'bg-warm-peach/10 text-warm-peach border-warm-peach/20',
        message: 'You took an important step in your journey',
      };
    }
  };

  const feedback = getFeedbackLevel();

  return (
    <Card className="border-warm-peach/20 bg-card/50 backdrop-blur hover:shadow-lg transition-shadow">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <CardTitle className="text-lg flex items-center gap-2">
              <Calendar className="w-4 h-4 text-warm-peach" />
              {formattedDate}
            </CardTitle>
            <CardDescription>{formattedTime}</CardDescription>
          </div>
          <Badge variant="outline" className={feedback.color}>
            {feedback.label}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-warm-peach" />
            <span className="text-2xl font-bold text-foreground">{percentage}%</span>
          </div>
          <span className="text-sm text-muted-foreground">
            {score} / {totalQuestions} questions
          </span>
        </div>
        <p className="text-sm text-muted-foreground">{feedback.message}</p>
      </CardContent>
    </Card>
  );
}
