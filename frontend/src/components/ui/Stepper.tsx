import { Check, LucideIcon } from 'lucide-react';

export interface Step {
  key: string;
  label: string;
  icon: LucideIcon;
}

interface StepperProps {
  steps: Step[];
  current: number;
}

export default function Stepper({ steps, current }: StepperProps) {
  return (
    <ol className="flex items-center w-full">
      {steps.map((step, i) => {
        const Icon = step.icon;
        const done = i < current;
        const active = i === current;
        return (
          <li key={step.key} className={`flex items-center ${i < steps.length - 1 ? 'flex-1' : ''}`}>
            <div className="flex items-center gap-2.5">
              <span
                className={`relative flex items-center justify-center w-9 h-9 rounded-full border-2 transition-all duration-300 shrink-0 ${
                  done
                    ? 'bg-primary-600 border-primary-600 text-white'
                    : active
                      ? 'bg-white border-primary-600 text-primary-700 shadow-glow'
                      : 'bg-white border-forest-200 text-forest-300'
                }`}
              >
                {done ? <Check className="w-4 h-4" /> : <Icon className="w-4 h-4" />}
                {active && (
                  <span className="absolute -inset-1 rounded-full border-2 border-primary-400/50 animate-ping" />
                )}
              </span>
              <span
                className={`text-sm font-semibold hidden sm:block ${
                  active ? 'text-primary-700' : done ? 'text-forest-700' : 'text-forest-300'
                }`}
              >
                {step.label}
              </span>
            </div>
            {i < steps.length - 1 && (
              <div className={`flex-1 h-0.5 mx-3 rounded-full ${i < current ? 'bg-primary-600' : 'bg-forest-200'}`} />
            )}
          </li>
        );
      })}
    </ol>
  );
}
