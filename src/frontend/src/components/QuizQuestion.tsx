import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import type { Question } from '../backend';

interface QuizQuestionProps {
  question: Question;
  selectedAnswer?: number;
  onAnswerSelect: (answerIndex: number) => void;
}

export default function QuizQuestion({ question, selectedAnswer, onAnswerSelect }: QuizQuestionProps) {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold text-foreground leading-relaxed">
        {question.questionText}
      </h2>

      <RadioGroup
        value={selectedAnswer?.toString()}
        onValueChange={(value) => onAnswerSelect(parseInt(value))}
        className="space-y-3"
      >
        {question.options.map((option, index) => (
          <div
            key={index}
            className={`flex items-start space-x-3 p-4 rounded-xl border-2 transition-all cursor-pointer hover:border-warm-peach/50 hover:bg-warm-peach/5 ${
              selectedAnswer === index
                ? 'border-warm-peach bg-warm-peach/10'
                : 'border-border'
            }`}
            onClick={() => onAnswerSelect(index)}
          >
            <RadioGroupItem value={index.toString()} id={`option-${index}`} className="mt-0.5" />
            <Label
              htmlFor={`option-${index}`}
              className="flex-1 text-base leading-relaxed cursor-pointer font-normal"
            >
              {option}
            </Label>
          </div>
        ))}
      </RadioGroup>
    </div>
  );
}
