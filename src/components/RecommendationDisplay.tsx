import { 
  AlertTriangle, 
  CheckCircle2, 
  Info, 
  Pill, 
  Shield, 
  ArrowRight,
  RefreshCw,
  FileText,
  Bug,
  Clock
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { TherapyRecommendation, AntibioticRecommendation } from '@/types/patient';

interface RecommendationDisplayProps {
  recommendation: TherapyRecommendation;
  onReset: () => void;
}

function AntibioticCard({ antibiotic, isPrimary = true }: { antibiotic: AntibioticRecommendation; isPrimary?: boolean }) {
  return (
    <div className={`p-4 rounded-lg border-2 ${isPrimary ? 'border-accent bg-accent/5' : 'border-border bg-muted/30'}`}>
      <div className="flex items-start justify-between">
        <div>
          <h4 className="font-bold text-lg flex items-center gap-2">
            <Pill className={`w-5 h-5 ${isPrimary ? 'text-accent' : 'text-muted-foreground'}`} />
            {antibiotic.name}
          </h4>
          <div className="mt-2 space-y-1 text-sm">
            <p className="font-mono bg-background px-2 py-1 rounded inline-block">
              {antibiotic.dose} {antibiotic.route} {antibiotic.frequency}
            </p>
            <p className="text-muted-foreground flex items-center gap-1">
              <Clock className="w-4 h-4" />
              Duration: {antibiotic.duration}
            </p>
          </div>
        </div>
      </div>
      {(antibiotic.renalAdjustment || antibiotic.hepaticAdjustment) && (
        <div className="mt-3 pt-3 border-t border-border/50">
          {antibiotic.renalAdjustment && (
            <p className="text-sm text-warning flex items-center gap-2">
              <AlertTriangle className="w-4 h-4" />
              {antibiotic.renalAdjustment}
            </p>
          )}
          {antibiotic.hepaticAdjustment && (
            <p className="text-sm text-warning flex items-center gap-2">
              <AlertTriangle className="w-4 h-4" />
              {antibiotic.hepaticAdjustment}
            </p>
          )}
        </div>
      )}
    </div>
  );
}

export function RecommendationDisplay({ recommendation, onReset }: RecommendationDisplayProps) {
  const riskColors = {
    low: 'bg-success/20 text-success border-success/30',
    moderate: 'bg-warning/20 text-warning border-warning/30',
    high: 'bg-critical/20 text-critical border-critical/30',
  };

  return (
    <div className="space-y-6 animate-slide-up">
      {/* Warnings Section */}
      {recommendation.warnings.length > 0 && (
        <Card className="border-2 border-warning/30 bg-warning/5">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-warning">
              <AlertTriangle className="w-5 h-5" />
              Clinical Alerts
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {recommendation.warnings.map((warning, index) => (
                <li key={index} className="text-sm flex items-start gap-2">
                  <span className="mt-0.5">•</span>
                  <span>{warning}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}

      {/* Risk Assessment */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2">
            <Bug className="w-5 h-5 text-primary" />
            Risk Assessment
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap items-center gap-4">
            <div>
              <p className="text-sm text-muted-foreground mb-1">MDRO Risk Score</p>
              <Badge className={`text-base px-4 py-1 ${riskColors[recommendation.mdroRiskScore]}`}>
                {recommendation.mdroRiskScore.toUpperCase()}
              </Badge>
            </div>
            <div className="flex-1">
              <p className="text-sm text-muted-foreground mb-2">Predicted Pathogens</p>
              <div className="flex flex-wrap gap-2">
                {recommendation.predictedPathogens.map((pathogen) => (
                  <Badge key={pathogen} variant="secondary" className="font-mono text-xs">
                    {pathogen}
                  </Badge>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Primary Regimen */}
      <Card className="border-2 border-accent/30">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-accent" />
            Recommended Antibiotic Regimen
          </CardTitle>
          <CardDescription>First-line empiric therapy based on patient profile</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2">
            {recommendation.primaryRegimen.map((antibiotic) => (
              <AntibioticCard key={antibiotic.name} antibiotic={antibiotic} isPrimary />
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Alternative Regimen */}
      {recommendation.alternativeRegimen && recommendation.alternativeRegimen.length > 0 && (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-muted-foreground">
              <ArrowRight className="w-5 h-5" />
              Alternative Regimen
            </CardTitle>
            <CardDescription>Consider if primary contraindicated or intolerant</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2">
              {recommendation.alternativeRegimen.map((antibiotic) => (
                <AntibioticCard key={antibiotic.name} antibiotic={antibiotic} isPrimary={false} />
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Rationale */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2">
            <Info className="w-5 h-5 text-info" />
            Clinical Rationale
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2">
            {recommendation.rationale.map((point, index) => (
              <li key={index} className="flex items-start gap-2 text-sm">
                <CheckCircle2 className="w-4 h-4 mt-0.5 text-success shrink-0" />
                <span>{point}</span>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>

      {/* De-escalation & Guidelines */}
      <div className="grid md:grid-cols-2 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-sm">
              <RefreshCw className="w-4 h-4" />
              De-escalation Plan
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">{recommendation.deescalationNotes}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-sm">
              <Shield className="w-4 h-4" />
              Guideline Compliance
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">{recommendation.guidelineCompliance}</p>
          </CardContent>
        </Card>
      </div>

      {/* Actions */}
      <div className="flex flex-wrap gap-4 pt-4 border-t">
        <Button variant="outline" onClick={onReset}>
          <RefreshCw className="w-4 h-4 mr-2" />
          New Assessment
        </Button>
        <Button variant="outline">
          <FileText className="w-4 h-4 mr-2" />
          Export to EMR
        </Button>
      </div>
    </div>
  );
}
