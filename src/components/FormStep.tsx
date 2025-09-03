import { ReactNode } from 'react';

interface FormStepProps {
  children: ReactNode;
  title: string;
}

export const FormStep = ({ children, title }: FormStepProps) => {
  return (
    <div className="w-full max-w-md mx-auto animate-fade-in">
      <div className="bg-card shadow-card rounded-2xl p-8 border border-border/50">
        <h2 className="text-2xl font-semibold text-foreground mb-6 text-center">
          {title}
        </h2>
        {children}
      </div>
    </div>
  );
};