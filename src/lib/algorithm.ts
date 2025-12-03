import { PatientData, TherapyRecommendation, AntibioticRecommendation } from '@/types/patient';

export function calculateMDRORisk(data: PatientData): 'low' | 'moderate' | 'high' {
  let score = 0;
  
  if (data.riskFactors.hospitalizationLast90Days) score += 2;
  if (data.riskFactors.ivAntibioticsLast90Days) score += 2;
  if (data.riskFactors.longTermCareFacility) score += 2;
  if (data.comorbidities.priorMRSA) score += 3;
  if (data.comorbidities.priorPseudomonas) score += 3;
  if (data.comorbidities.immunosuppression) score += 1;
  if (data.riskFactors.mechanicalVentilation) score += 2;
  
  if (score >= 6) return 'high';
  if (score >= 3) return 'moderate';
  return 'low';
}

export function hasAllergyTo(allergies: PatientData['allergies'], drugClass: string): boolean {
  const drugClassMap: Record<string, string[]> = {
    'penicillin': ['penicillin', 'amoxicillin', 'ampicillin', 'piperacillin'],
    'cephalosporin': ['cephalexin', 'ceftriaxone', 'cefepime', 'ceftazidime'],
    'fluoroquinolone': ['levofloxacin', 'ciprofloxacin', 'moxifloxacin'],
    'macrolide': ['azithromycin', 'clarithromycin', 'erythromycin'],
    'carbapenem': ['meropenem', 'imipenem', 'ertapenem'],
    'vancomycin': ['vancomycin'],
    'aminoglycoside': ['gentamicin', 'tobramycin', 'amikacin'],
  };
  
  const drugs = drugClassMap[drugClass] || [drugClass];
  return allergies.some(a => drugs.some(d => a.drug.toLowerCase().includes(d)));
}

export function generateRecommendation(data: PatientData): TherapyRecommendation {
  const mdroRisk = calculateMDRORisk(data);
  const warnings: string[] = [];
  const rationale: string[] = [];
  let primaryRegimen: AntibioticRecommendation[] = [];
  let alternativeRegimen: AntibioticRecommendation[] = [];
  let predictedPathogens: string[] = ['Streptococcus pneumoniae', 'Haemophilus influenzae'];
  
  // Check QTc
  if (data.qtcProlonged) {
    warnings.push('⚠️ QTc prolongation detected. Avoiding fluoroquinolones and macrolides.');
  }
  
  // Add pathogens based on risk
  if (mdroRisk === 'high' || data.comorbidities.priorMRSA) {
    predictedPathogens.push('MRSA');
  }
  if (mdroRisk === 'high' || data.comorbidities.priorPseudomonas) {
    predictedPathogens.push('Pseudomonas aeruginosa');
  }
  if (data.comorbidities.copd) {
    predictedPathogens.push('Moraxella catarrhalis');
  }
  
  // Renal function assessment
  const severeRenalImpairment = data.labs.gfr < 30;
  const moderateRenalImpairment = data.labs.gfr < 60;
  
  if (severeRenalImpairment) {
    warnings.push('⚠️ Severe renal impairment (GFR <30). Dose adjustments applied.');
  }
  
  // Build regimen based on risk stratification
  if (mdroRisk === 'low' && !data.qtcProlonged) {
    rationale.push('Low MDRO risk - standard CAP coverage recommended');
    rationale.push('IDSA/ATS guideline-concordant therapy for non-severe CAP with sepsis');
    
    if (!hasAllergyTo(data.allergies, 'cephalosporin')) {
      primaryRegimen.push({
        name: 'Ceftriaxone',
        dose: '2g',
        frequency: 'q24h',
        route: 'IV',
        duration: '5-7 days',
      });
      
      if (!hasAllergyTo(data.allergies, 'macrolide')) {
        primaryRegimen.push({
          name: 'Azithromycin',
          dose: '500mg',
          frequency: 'q24h',
          route: 'IV',
          duration: '5 days',
        });
      } else if (!hasAllergyTo(data.allergies, 'fluoroquinolone')) {
        primaryRegimen.push({
          name: 'Levofloxacin',
          dose: moderateRenalImpairment ? '500mg' : '750mg',
          frequency: 'q24h',
          route: 'IV',
          duration: '5 days',
          renalAdjustment: moderateRenalImpairment ? 'Adjusted for GFR <60' : undefined,
        });
      }
    }
    
    // Alternative for penicillin/cephalosporin allergy
    if (!hasAllergyTo(data.allergies, 'fluoroquinolone') && !data.qtcProlonged) {
      alternativeRegimen = [{
        name: 'Levofloxacin',
        dose: moderateRenalImpairment ? '500mg' : '750mg',
        frequency: 'q24h',
        route: 'IV',
        duration: '5 days',
        renalAdjustment: moderateRenalImpairment ? 'Adjusted for GFR <60' : undefined,
      }];
    }
    
  } else if (mdroRisk === 'moderate') {
    rationale.push('Moderate MDRO risk - broadened coverage recommended');
    rationale.push('Consider dual therapy with anti-pseudomonal coverage');
    
    if (!hasAllergyTo(data.allergies, 'penicillin')) {
      primaryRegimen.push({
        name: 'Piperacillin-Tazobactam',
        dose: severeRenalImpairment ? '2.25g' : '4.5g',
        frequency: severeRenalImpairment ? 'q8h' : 'q6h',
        route: 'IV',
        duration: '7 days',
        renalAdjustment: severeRenalImpairment ? 'Adjusted for GFR <30' : undefined,
      });
    } else if (!hasAllergyTo(data.allergies, 'carbapenem')) {
      primaryRegimen.push({
        name: 'Meropenem',
        dose: severeRenalImpairment ? '500mg' : '1g',
        frequency: 'q8h',
        route: 'IV',
        duration: '7 days',
        renalAdjustment: severeRenalImpairment ? 'Adjusted for GFR <30' : undefined,
      });
    }
    
    // Add atypical coverage
    if (!data.qtcProlonged && !hasAllergyTo(data.allergies, 'macrolide')) {
      primaryRegimen.push({
        name: 'Azithromycin',
        dose: '500mg',
        frequency: 'q24h',
        route: 'IV',
        duration: '5 days',
      });
    }
    
  } else {
    // High MDRO risk
    rationale.push('High MDRO risk - empiric MRSA and Pseudomonas coverage recommended');
    rationale.push('Recommend early ID consultation and de-escalation when cultures available');
    
    // Anti-pseudomonal beta-lactam
    if (!hasAllergyTo(data.allergies, 'cephalosporin')) {
      primaryRegimen.push({
        name: 'Cefepime',
        dose: severeRenalImpairment ? '1g' : '2g',
        frequency: 'q8h',
        route: 'IV',
        duration: '7-10 days',
        renalAdjustment: severeRenalImpairment ? 'Adjusted for GFR <30' : undefined,
      });
    } else if (!hasAllergyTo(data.allergies, 'carbapenem')) {
      primaryRegimen.push({
        name: 'Meropenem',
        dose: severeRenalImpairment ? '500mg' : '1g',
        frequency: 'q8h',
        route: 'IV',
        duration: '7-10 days',
        renalAdjustment: severeRenalImpairment ? 'Adjusted for GFR <30' : undefined,
      });
    }
    
    // MRSA coverage
    if (!hasAllergyTo(data.allergies, 'vancomycin')) {
      primaryRegimen.push({
        name: 'Vancomycin',
        dose: '15-20 mg/kg',
        frequency: 'q8-12h',
        route: 'IV',
        duration: '7-10 days (based on cultures)',
        renalAdjustment: moderateRenalImpairment ? 'Monitor levels closely, adjust per pharmacy' : undefined,
      });
      rationale.push('Vancomycin added for MRSA coverage given high-risk features');
    } else {
      primaryRegimen.push({
        name: 'Linezolid',
        dose: '600mg',
        frequency: 'q12h',
        route: 'IV',
        duration: '7-10 days',
      });
      warnings.push('⚠️ Linezolid: Monitor for thrombocytopenia and serotonin syndrome');
    }
    
    // Atypical coverage
    if (!data.qtcProlonged && !hasAllergyTo(data.allergies, 'fluoroquinolone')) {
      primaryRegimen.push({
        name: 'Levofloxacin',
        dose: moderateRenalImpairment ? '500mg' : '750mg',
        frequency: 'q24h',
        route: 'IV',
        duration: '7 days',
        renalAdjustment: moderateRenalImpairment ? 'Adjusted for GFR <60' : undefined,
      });
    }
    
    warnings.push('⚠️ Broad-spectrum therapy initiated. Plan for de-escalation at 48-72h based on culture results.');
  }
  
  // Severity-based warnings
  if (data.sofa >= 6) {
    warnings.push('🔴 SOFA ≥6: High mortality risk. Consider ICU admission if not already.');
  }
  
  if (data.labs.lactate >= 4) {
    warnings.push('🔴 Lactate ≥4 mmol/L: Septic shock likely. Ensure fluid resuscitation and vasopressors as needed.');
  }
  
  // Hepatic considerations
  if (data.labs.alt > 120 || data.labs.ast > 120) {
    warnings.push('⚠️ Elevated liver enzymes detected. Monitor hepatotoxic medications.');
  }
  
  return {
    primaryRegimen,
    alternativeRegimen: alternativeRegimen.length > 0 ? alternativeRegimen : undefined,
    rationale,
    warnings,
    mdroRiskScore: mdroRisk,
    predictedPathogens,
    deescalationNotes: 'Review culture and sensitivity data at 48-72 hours. De-escalate to narrowest effective spectrum based on identified pathogen(s). If cultures negative and clinical improvement, consider shortening duration.',
    guidelineCompliance: 'Recommendation aligns with IDSA/ATS 2019 CAP Guidelines and Surviving Sepsis Campaign 2021 recommendations.',
  };
}
