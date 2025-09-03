interface ProgressBarProps {
  currentStep: number;
  totalSteps: number;
}

export const ProgressBar = ({ currentStep, totalSteps }: ProgressBarProps) => {
  const progress = (currentStep / totalSteps) * 100;
  
  return (
    <div className="w-full mb-8">
      <div className="flex justify-between text-sm text-muted-foreground mb-2">
        <span>Pergunta {currentStep} de {totalSteps}</span>
        <span>{Math.round(progress)}%</span>
      </div>
      <div className="w-full bg-muted rounded-full h-2 overflow-hidden">
        <div 
          className="h-full bg-gradient-primary transition-all duration-700 ease-out rounded-full"
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
};