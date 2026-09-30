import React, { useState } from 'react';
import { OnboardingWizard } from './OnboardingWizard';
import { Button, Card, Badge, Typography } from '../design-system';
import { OnboardingBusinessState } from '../types/onboarding';
import { CheckCircle2, Sparkles, Building, Layers, Eye } from 'lucide-react';

export const Phase37OnboardingShowcase: React.FC = () => {
  const [completedState, setCompletedState] = useState<OnboardingBusinessState | null>(null);

  return (
    <div className="space-y-6 text-left">
      <OnboardingWizard
        onComplete={(state) => {
          setCompletedState(state);
        }}
        onNavigateToAdmin={(slug) => {
          alert(`Onboarding completed! Configuration for tenant "${slug}" saved in state.`);
        }}
      />
    </div>
  );
};
