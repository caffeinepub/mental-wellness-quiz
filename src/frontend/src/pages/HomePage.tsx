import { useNavigate } from '@tanstack/react-router';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Heart, Sparkles, Shield } from 'lucide-react';

export default function HomePage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-[calc(100vh-200px)] flex items-center justify-center px-4 py-12">
      <div className="max-w-4xl w-full space-y-8">
        <div className="text-center space-y-4">
          <div className="flex justify-center mb-6">
            <img 
              src="/assets/generated/wellness-icon.dim_256x256.png" 
              alt="Wellness" 
              className="w-24 h-24 object-contain"
            />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-foreground tracking-tight">
            Your Mental Wellness Journey
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
            Take a moment for yourself. This supportive quiz helps you reflect on your mental wellness and provides personalized insights.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 mt-12">
          <Card className="border-warm-peach/20 bg-card/50 backdrop-blur">
            <CardHeader>
              <div className="w-12 h-12 rounded-full bg-warm-peach/10 flex items-center justify-center mb-2">
                <Heart className="w-6 h-6 text-warm-peach" />
              </div>
              <CardTitle className="text-lg">Safe Space</CardTitle>
              <CardDescription>
                Your responses are private and supportive
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="border-soft-pink/20 bg-card/50 backdrop-blur">
            <CardHeader>
              <div className="w-12 h-12 rounded-full bg-soft-pink/10 flex items-center justify-center mb-2">
                <Sparkles className="w-6 h-6 text-soft-pink" />
              </div>
              <CardTitle className="text-lg">Personalized</CardTitle>
              <CardDescription>
                Get insights tailored to your unique journey
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="border-gentle-lavender/20 bg-card/50 backdrop-blur">
            <CardHeader>
              <div className="w-12 h-12 rounded-full bg-gentle-lavender/10 flex items-center justify-center mb-2">
                <Shield className="w-6 h-6 text-gentle-lavender" />
              </div>
              <CardTitle className="text-lg">Supportive</CardTitle>
              <CardDescription>
                Encouraging feedback to support your wellbeing
              </CardDescription>
            </CardHeader>
          </Card>
        </div>

        <div className="flex justify-center mt-12">
          <Button 
            size="lg" 
            onClick={() => navigate({ to: '/quiz' })}
            className="text-lg px-8 py-6 rounded-full shadow-lg hover:shadow-xl transition-all"
          >
            Start Your Wellness Check-In
          </Button>
        </div>
      </div>
    </div>
  );
}
