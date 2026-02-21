import { Card, CardContent } from '@/components/ui/card';
import { CheckCircle2 } from 'lucide-react';
import { useEffect, useState } from 'react';

interface FeedbackCardProps {
  message: string;
  delay?: number;
}

export default function FeedbackCard({ message, delay = 0 }: FeedbackCardProps) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, delay);

    return () => clearTimeout(timer);
  }, [delay]);

  return (
    <Card 
      className={`border-soft-pink/20 bg-card/50 backdrop-blur transition-all duration-500 ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
      }`}
    >
      <CardContent className="pt-6">
        <div className="flex gap-4">
          <div className="flex-shrink-0">
            <CheckCircle2 className="w-6 h-6 text-gentle-lavender" />
          </div>
          <p className="text-foreground leading-relaxed flex-1">
            {message}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
