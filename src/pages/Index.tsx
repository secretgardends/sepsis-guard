import { useState } from 'react';
import { Header } from '@/components/Header';
import { ProgressSteps } from '@/components/ProgressSteps';
import { AllergyGate } from '@/components/AllergyGate';
import { PatientIntakeForm } from '@/components/PatientIntakeForm';
import { RecommendationDisplay } from '@/components/RecommendationDisplay';
import { PatientData, TherapyRecommendation, Allergy } from '@/types/patient';
import { generateRecommendation } from '@/lib/algorithm';

const STEPS = ['Allergies', 'Patient Data', 'Review'];

export default function Index() {
  const [currentStep, setCurrentStep] = useState(0);
  const [allergies, setAllergies] = useState<Allergy[]>([]);
  const [patientData, setPatientData] = useState<Partial<PatientData>>({});
  const [recommendation, setRecommendation] = useState<TherapyRecommendation | null>(null);

  const handleAllergyVerified = () => {
    setPatientData({ ...patientData, allergies, allergiesVerified: true });
    setCurrentStep(1);
  };

  const handlePatientDataSubmit = (data: PatientData) => {
    const fullData = { ...data, allergies, allergiesVerified: true };
    setPatientData(fullData);
    const result = generateRecommendation(fullData);
    setRecommendation(result);
    setCurrentStep(2);
  };

  const handleReset = () => {
    setCurrentStep(0);
    setAllergies([]);
    setPatientData({});
    setRecommendation(null);
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="max-w-5xl mx-auto px-4 py-6">
        <ProgressSteps currentStep={currentStep} steps={STEPS} />

        <div className="mt-8">
          {currentStep === 0 && (
            <AllergyGate
              allergies={allergies}
              onAllergiesChange={setAllergies}
              onVerified={handleAllergyVerified}
            />
          )}

          {currentStep === 1 && (
            <PatientIntakeForm
              initialData={patientData}
              onSubmit={handlePatientDataSubmit}
            />
          )}

          {currentStep === 2 && recommendation && (
            <RecommendationDisplay
              recommendation={recommendation}
              onReset={handleReset}
            />
          )}
        </div>
      </main>

      <footer className="mt-12 py-6 border-t bg-muted/30">
        <div className="max-w-5xl mx-auto px-4 text-center text-sm text-muted-foreground">
          <p>RapidSepsis-ABX™ is a clinical decision support tool. All recommendations should be verified by a qualified healthcare provider.</p>
          <p className="mt-2">Not a substitute for clinical judgment. Always consider patient-specific factors not captured by this tool.</p>
        </div>
      </footer>
    </div>
  );
}
