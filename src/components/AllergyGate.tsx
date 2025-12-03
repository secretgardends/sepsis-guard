import { useState } from 'react';
import { AlertTriangle, Plus, Trash2, ShieldCheck, ShieldAlert } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Allergy } from '@/types/patient';

interface AllergyGateProps {
  allergies: Allergy[];
  onAllergiesChange: (allergies: Allergy[]) => void;
  onVerified: () => void;
}

const commonAllergies = [
  'Penicillin',
  'Amoxicillin',
  'Cephalexin',
  'Ceftriaxone',
  'Azithromycin',
  'Levofloxacin',
  'Ciprofloxacin',
  'Vancomycin',
  'Sulfa/Trimethoprim',
  'Doxycycline',
];

export function AllergyGate({ allergies, onAllergiesChange, onVerified }: AllergyGateProps) {
  const [newAllergy, setNewAllergy] = useState('');
  const [reactionType, setReactionType] = useState<Allergy['reactionType']>('unknown');
  const [severity, setSeverity] = useState<Allergy['severity']>('moderate');

  const addAllergy = () => {
    if (newAllergy.trim()) {
      onAllergiesChange([
        ...allergies,
        { drug: newAllergy.trim(), reactionType, severity },
      ]);
      setNewAllergy('');
      setReactionType('unknown');
      setSeverity('moderate');
    }
  };

  const removeAllergy = (index: number) => {
    onAllergiesChange(allergies.filter((_, i) => i !== index));
  };

  return (
    <Card className="border-2 border-warning/30 bg-warning/5 animate-fade-in">
      <CardHeader className="pb-4">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-warning/20 rounded-xl">
            <AlertTriangle className="w-8 h-8 text-warning" />
          </div>
          <div>
            <CardTitle className="text-xl">Allergy Verification Required</CardTitle>
            <CardDescription className="text-base mt-1">
              Patient allergy status must be verified before generating therapy recommendations
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Add new allergy */}
        <div className="space-y-4 p-4 bg-card rounded-lg border">
          <Label className="text-base font-semibold">Add Drug Allergy</Label>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
            <div className="md:col-span-1">
              <Label className="text-sm text-muted-foreground">Drug Name</Label>
              <Input
                value={newAllergy}
                onChange={(e) => setNewAllergy(e.target.value)}
                placeholder="Enter drug name..."
                className="input-medical mt-1"
                list="common-allergies"
              />
              <datalist id="common-allergies">
                {commonAllergies.map((drug) => (
                  <option key={drug} value={drug} />
                ))}
              </datalist>
            </div>
            <div>
              <Label className="text-sm text-muted-foreground">Reaction Type</Label>
              <Select value={reactionType} onValueChange={(v) => setReactionType(v as Allergy['reactionType'])}>
                <SelectTrigger className="input-medical mt-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="anaphylaxis">Anaphylaxis</SelectItem>
                  <SelectItem value="rash">Rash/Hives</SelectItem>
                  <SelectItem value="gi_upset">GI Upset</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                  <SelectItem value="unknown">Unknown</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label className="text-sm text-muted-foreground">Severity</Label>
              <Select value={severity} onValueChange={(v) => setSeverity(v as Allergy['severity'])}>
                <SelectTrigger className="input-medical mt-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="mild">Mild</SelectItem>
                  <SelectItem value="moderate">Moderate</SelectItem>
                  <SelectItem value="severe">Severe</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-end">
              <Button onClick={addAllergy} disabled={!newAllergy.trim()} className="btn-medical w-full">
                <Plus className="w-4 h-4 mr-2" />
                Add
              </Button>
            </div>
          </div>
        </div>

        {/* Current allergies list */}
        {allergies.length > 0 && (
          <div className="space-y-2">
            <Label className="text-base font-semibold flex items-center gap-2">
              <ShieldAlert className="w-5 h-5 text-critical" />
              Documented Allergies ({allergies.length})
            </Label>
            <div className="space-y-2">
              {allergies.map((allergy, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-3 bg-critical/10 border border-critical/20 rounded-lg"
                >
                  <div className="flex items-center gap-4">
                    <span className="font-semibold text-critical">{allergy.drug}</span>
                    <span className="text-sm text-muted-foreground capitalize">
                      {allergy.reactionType.replace('_', ' ')}
                    </span>
                    <span
                      className={`text-xs px-2 py-1 rounded-full ${
                        allergy.severity === 'severe'
                          ? 'bg-critical/20 text-critical'
                          : allergy.severity === 'moderate'
                          ? 'bg-warning/20 text-warning'
                          : 'bg-muted text-muted-foreground'
                      }`}
                    >
                      {allergy.severity}
                    </span>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removeAllergy(index)}
                    className="text-muted-foreground hover:text-critical"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Verification button */}
        <div className="pt-4 border-t">
          <Button
            onClick={onVerified}
            size="lg"
            className="w-full btn-accent text-lg py-6"
          >
            <ShieldCheck className="w-5 h-5 mr-2" />
            {allergies.length === 0
              ? 'Confirm: No Known Drug Allergies (NKDA)'
              : `Verify ${allergies.length} Allergy Record${allergies.length > 1 ? 's' : ''} & Continue`}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
