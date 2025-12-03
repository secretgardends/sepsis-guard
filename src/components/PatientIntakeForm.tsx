import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Heart, 
  TestTube, 
  Stethoscope, 
  AlertCircle, 
  Activity,
  Zap,
  FileText
} from 'lucide-react';
import { PatientData, PatientVitals, PatientLabs, Comorbidities, RiskFactors } from '@/types/patient';

interface PatientIntakeFormProps {
  initialData: Partial<PatientData>;
  onSubmit: (data: PatientData) => void;
}

export function PatientIntakeForm({ initialData, onSubmit }: PatientIntakeFormProps) {
  const [vitals, setVitals] = useState<PatientVitals>({
    heartRate: 95,
    systolicBP: 90,
    diastolicBP: 60,
    respiratoryRate: 22,
    oxygenSaturation: 92,
    temperature: 38.9,
  });

  const [labs, setLabs] = useState<PatientLabs>({
    lactate: 2.5,
    wbc: 15.2,
    creatinine: 1.4,
    gfr: 55,
    alt: 45,
    ast: 52,
    procalcitonin: 2.8,
    crp: 180,
  });

  const [demographics, setDemographics] = useState({
    age: 68,
    weight: 75,
  });

  const [scores, setScores] = useState({
    sofa: 4,
    qsofa: 2,
    qtcProlonged: false,
    qtcValue: 440,
  });

  const [comorbidities, setComorbidities] = useState<Comorbidities>({
    copd: false,
    diabetes: true,
    immunosuppression: false,
    heartFailure: false,
    ckd: false,
    esrd: false,
    priorMRSA: false,
    priorPseudomonas: false,
  });

  const [riskFactors, setRiskFactors] = useState<RiskFactors>({
    hospitalizationLast90Days: false,
    ivAntibioticsLast90Days: false,
    longTermCareFacility: false,
    mechanicalVentilation: false,
  });

  const [imagingFindings, setImagingFindings] = useState('');

  const handleSubmit = () => {
    onSubmit({
      age: demographics.age,
      weight: demographics.weight,
      vitals,
      labs,
      sofa: scores.sofa,
      qsofa: scores.qsofa,
      qtcProlonged: scores.qtcProlonged,
      qtcValue: scores.qtcValue,
      allergies: initialData.allergies || [],
      allergiesVerified: true,
      comorbidities,
      riskFactors,
      imagingFindings: imagingFindings || undefined,
    });
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <Tabs defaultValue="vitals" className="w-full">
        <TabsList className="grid w-full grid-cols-5 h-14 bg-muted/50">
          <TabsTrigger value="vitals" className="flex items-center gap-2 data-[state=active]:bg-accent data-[state=active]:text-accent-foreground">
            <Heart className="w-4 h-4" />
            <span className="hidden sm:inline">Vitals</span>
          </TabsTrigger>
          <TabsTrigger value="labs" className="flex items-center gap-2 data-[state=active]:bg-accent data-[state=active]:text-accent-foreground">
            <TestTube className="w-4 h-4" />
            <span className="hidden sm:inline">Labs</span>
          </TabsTrigger>
          <TabsTrigger value="scores" className="flex items-center gap-2 data-[state=active]:bg-accent data-[state=active]:text-accent-foreground">
            <Activity className="w-4 h-4" />
            <span className="hidden sm:inline">Scores</span>
          </TabsTrigger>
          <TabsTrigger value="comorbidities" className="flex items-center gap-2 data-[state=active]:bg-accent data-[state=active]:text-accent-foreground">
            <Stethoscope className="w-4 h-4" />
            <span className="hidden sm:inline">History</span>
          </TabsTrigger>
          <TabsTrigger value="risk" className="flex items-center gap-2 data-[state=active]:bg-accent data-[state=active]:text-accent-foreground">
            <AlertCircle className="w-4 h-4" />
            <span className="hidden sm:inline">Risk</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="vitals" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Heart className="w-5 h-5 text-critical" />
                Vital Signs
              </CardTitle>
              <CardDescription>Current patient vital signs</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label className="text-sm">Age (years)</Label>
                  <Input
                    type="number"
                    value={demographics.age}
                    onChange={(e) => setDemographics({ ...demographics, age: parseInt(e.target.value) || 0 })}
                    className="input-medical"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-sm">Weight (kg)</Label>
                  <Input
                    type="number"
                    value={demographics.weight}
                    onChange={(e) => setDemographics({ ...demographics, weight: parseInt(e.target.value) || 0 })}
                    className="input-medical"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-sm">Heart Rate (bpm)</Label>
                  <Input
                    type="number"
                    value={vitals.heartRate}
                    onChange={(e) => setVitals({ ...vitals, heartRate: parseInt(e.target.value) || 0 })}
                    className="input-medical"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-sm">Systolic BP (mmHg)</Label>
                  <Input
                    type="number"
                    value={vitals.systolicBP}
                    onChange={(e) => setVitals({ ...vitals, systolicBP: parseInt(e.target.value) || 0 })}
                    className="input-medical"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-sm">Diastolic BP (mmHg)</Label>
                  <Input
                    type="number"
                    value={vitals.diastolicBP}
                    onChange={(e) => setVitals({ ...vitals, diastolicBP: parseInt(e.target.value) || 0 })}
                    className="input-medical"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-sm">Respiratory Rate (/min)</Label>
                  <Input
                    type="number"
                    value={vitals.respiratoryRate}
                    onChange={(e) => setVitals({ ...vitals, respiratoryRate: parseInt(e.target.value) || 0 })}
                    className="input-medical"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-sm">SpO₂ (%)</Label>
                  <Input
                    type="number"
                    value={vitals.oxygenSaturation}
                    onChange={(e) => setVitals({ ...vitals, oxygenSaturation: parseInt(e.target.value) || 0 })}
                    className="input-medical"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-sm">Temperature (°C)</Label>
                  <Input
                    type="number"
                    step="0.1"
                    value={vitals.temperature}
                    onChange={(e) => setVitals({ ...vitals, temperature: parseFloat(e.target.value) || 0 })}
                    className="input-medical"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="labs" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TestTube className="w-5 h-5 text-info" />
                Laboratory Values
              </CardTitle>
              <CardDescription>Recent lab results</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="space-y-2">
                  <Label className="text-sm">Lactate (mmol/L)</Label>
                  <Input
                    type="number"
                    step="0.1"
                    value={labs.lactate}
                    onChange={(e) => setLabs({ ...labs, lactate: parseFloat(e.target.value) || 0 })}
                    className="input-medical"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-sm">WBC (×10⁹/L)</Label>
                  <Input
                    type="number"
                    step="0.1"
                    value={labs.wbc}
                    onChange={(e) => setLabs({ ...labs, wbc: parseFloat(e.target.value) || 0 })}
                    className="input-medical"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-sm">Creatinine (mg/dL)</Label>
                  <Input
                    type="number"
                    step="0.1"
                    value={labs.creatinine}
                    onChange={(e) => setLabs({ ...labs, creatinine: parseFloat(e.target.value) || 0 })}
                    className="input-medical"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-sm">GFR (mL/min)</Label>
                  <Input
                    type="number"
                    value={labs.gfr}
                    onChange={(e) => setLabs({ ...labs, gfr: parseInt(e.target.value) || 0 })}
                    className="input-medical"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-sm">ALT (U/L)</Label>
                  <Input
                    type="number"
                    value={labs.alt}
                    onChange={(e) => setLabs({ ...labs, alt: parseInt(e.target.value) || 0 })}
                    className="input-medical"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-sm">AST (U/L)</Label>
                  <Input
                    type="number"
                    value={labs.ast}
                    onChange={(e) => setLabs({ ...labs, ast: parseInt(e.target.value) || 0 })}
                    className="input-medical"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-sm">Procalcitonin (ng/mL)</Label>
                  <Input
                    type="number"
                    step="0.1"
                    value={labs.procalcitonin}
                    onChange={(e) => setLabs({ ...labs, procalcitonin: parseFloat(e.target.value) || 0 })}
                    className="input-medical"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-sm">CRP (mg/L)</Label>
                  <Input
                    type="number"
                    value={labs.crp}
                    onChange={(e) => setLabs({ ...labs, crp: parseInt(e.target.value) || 0 })}
                    className="input-medical"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="scores" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="w-5 h-5 text-accent" />
                Clinical Scores & EKG
              </CardTitle>
              <CardDescription>Severity scores and cardiac assessment</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="space-y-2">
                  <Label className="text-sm">SOFA Score (0-24)</Label>
                  <Input
                    type="number"
                    min="0"
                    max="24"
                    value={scores.sofa}
                    onChange={(e) => setScores({ ...scores, sofa: parseInt(e.target.value) || 0 })}
                    className="input-medical"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-sm">qSOFA Score (0-3)</Label>
                  <Input
                    type="number"
                    min="0"
                    max="3"
                    value={scores.qsofa}
                    onChange={(e) => setScores({ ...scores, qsofa: parseInt(e.target.value) || 0 })}
                    className="input-medical"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-sm">QTc (ms)</Label>
                  <Input
                    type="number"
                    value={scores.qtcValue}
                    onChange={(e) => setScores({ ...scores, qtcValue: parseInt(e.target.value) || 0 })}
                    className="input-medical"
                  />
                </div>
              </div>
              <div className="flex items-center space-x-3 p-4 bg-warning/10 rounded-lg border border-warning/20">
                <Checkbox
                  id="qtc"
                  checked={scores.qtcProlonged}
                  onCheckedChange={(checked) => setScores({ ...scores, qtcProlonged: !!checked })}
                />
                <div>
                  <Label htmlFor="qtc" className="text-sm font-medium cursor-pointer">
                    QTc Prolongation (&gt;500ms or &gt;60ms increase)
                  </Label>
                  <p className="text-xs text-muted-foreground mt-1">
                    Check if QTc is prolonged - will avoid QT-prolonging antibiotics
                  </p>
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-sm flex items-center gap-2">
                  <FileText className="w-4 h-4" />
                  Imaging Findings (CXR/CT)
                </Label>
                <Textarea
                  value={imagingFindings}
                  onChange={(e) => setImagingFindings(e.target.value)}
                  placeholder="e.g., Right lower lobe consolidation, bilateral infiltrates..."
                  className="input-medical min-h-[80px]"
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="comorbidities" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Stethoscope className="w-5 h-5 text-primary" />
                Medical History & Comorbidities
              </CardTitle>
              <CardDescription>Relevant past medical history</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                  { key: 'copd', label: 'COPD' },
                  { key: 'diabetes', label: 'Diabetes' },
                  { key: 'immunosuppression', label: 'Immunosuppression' },
                  { key: 'heartFailure', label: 'Heart Failure' },
                  { key: 'ckd', label: 'CKD (non-dialysis)' },
                  { key: 'esrd', label: 'ESRD (dialysis)' },
                  { key: 'priorMRSA', label: 'Prior MRSA colonization/infection' },
                  { key: 'priorPseudomonas', label: 'Prior Pseudomonas infection' },
                ].map(({ key, label }) => (
                  <div key={key} className="flex items-center space-x-3 p-3 bg-muted/50 rounded-lg">
                    <Checkbox
                      id={key}
                      checked={comorbidities[key as keyof Comorbidities]}
                      onCheckedChange={(checked) =>
                        setComorbidities({ ...comorbidities, [key]: !!checked })
                      }
                    />
                    <Label htmlFor={key} className="text-sm cursor-pointer">
                      {label}
                    </Label>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="risk" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertCircle className="w-5 h-5 text-warning" />
                MDRO Risk Factors
              </CardTitle>
              <CardDescription>Factors that increase risk for resistant organisms</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  { key: 'hospitalizationLast90Days', label: 'Hospitalization in last 90 days' },
                  { key: 'ivAntibioticsLast90Days', label: 'IV antibiotics in last 90 days' },
                  { key: 'longTermCareFacility', label: 'Long-term care facility residence' },
                  { key: 'mechanicalVentilation', label: 'Current mechanical ventilation' },
                ].map(({ key, label }) => (
                  <div key={key} className="flex items-center space-x-3 p-4 bg-warning/5 rounded-lg border border-warning/20">
                    <Checkbox
                      id={key}
                      checked={riskFactors[key as keyof RiskFactors]}
                      onCheckedChange={(checked) =>
                        setRiskFactors({ ...riskFactors, [key]: !!checked })
                      }
                    />
                    <Label htmlFor={key} className="text-sm cursor-pointer font-medium">
                      {label}
                    </Label>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <div className="flex justify-end pt-4">
        <Button onClick={handleSubmit} size="lg" className="btn-accent px-8">
          <Zap className="w-5 h-5 mr-2" />
          Generate Therapy Recommendation
        </Button>
      </div>
    </div>
  );
}
