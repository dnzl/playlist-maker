import { useState, useCallback } from "react";

type UseStepperParams = {
  onFinish: () => void;
};

export const useStepper = ({ onFinish }: UseStepperParams) => {
  const totalSteps = 5;
  const [currentStep, setCurrentStep] = useState(1);
  const goToStep = useCallback(
    (step: number) => {
      setCurrentStep(step);
    },
    [setCurrentStep]
  );
  const goToNextStep = useCallback(() => {
    if (currentStep === totalSteps) onFinish();
    goToStep(currentStep + 1);
  }, [currentStep, goToStep, onFinish]);

  return {
    totalSteps,
    currentStep,
    goToStep,
    goToNextStep,
  };
};
