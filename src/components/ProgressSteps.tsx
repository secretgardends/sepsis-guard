import { Check } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ProgressStepsProps {
  currentStep: number;
  steps: string[];
}

export function ProgressSteps({ currentStep, steps }: ProgressStepsProps) {
  return (
    <div className="flex items-center justify-center gap-2 py-6">
      {steps.map((step, index) => (
        <div key={step} className="flex items-center">
          <div className="flex flex-col items-center">
            <div
              className={cn(
                'w-10 h-10 rounded-full flex items-center justify-center font-semibold text-sm transition-all duration-300',
                index < currentStep
                  ? 'bg-success text-success-foreground'
                  : index === currentStep
                  ? 'bg-accent text-accent-foreground ring-4 ring-accent/30'
                  : 'bg-muted text-muted-foreground'
              )}
            >
              {index < currentStep ? (
                <Check className="w-5 h-5" />
              ) : (
                index + 1
              )}
            </div>
            <span
              className={cn(
                'text-xs mt-2 font-medium max-w-[80px] text-center',
                index === currentStep ? 'text-accent' : 'text-muted-foreground'
              )}
            >
              {step}
            </span>
          </div>
          {index < steps.length - 1 && (
            <div
              className={cn(
                'w-16 h-1 mx-2 rounded-full transition-all duration-300',
                index < currentStep ? 'bg-success' : 'bg-muted'
              )}
            />
          )}
        </div>
      ))}
    </div>
  );
}
