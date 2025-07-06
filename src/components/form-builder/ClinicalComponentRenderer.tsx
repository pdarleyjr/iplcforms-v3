import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import type { FormComponent } from '@/lib/api-form-builder';

interface ClinicalComponentRendererProps {
  component: FormComponent;
  onUpdate: (updates: Partial<FormComponent>) => void;
  isEditing?: boolean;
}

export const ClinicalComponentRenderer: React.FC<ClinicalComponentRendererProps> = ({ 
  component, 
  onUpdate, 
  isEditing = false 
}) => {
  // Clinical Scale Component Renderer
  const renderClinicalScale = () => {
    const { scaleType = 'severity', min = 1, max = 7, labels = [] } = component.props || {};
    const defaultLabels = ['Normal', 'Mild', 'Mild-Moderate', 'Moderate', 'Moderate-Severe', 'Severe', 'Profound'];
    const scaleLabels = labels.length > 0 ? labels : defaultLabels.slice(0, max - min + 1);

    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">{component.label}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="grid grid-cols-7 gap-2">
              {Array.from({ length: max - min + 1 }, (_, i) => {
                const value = min + i;
                const label = scaleLabels[i] || `Level ${value}`;
                return (
                  <div key={value} className="text-center">
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full h-12 flex flex-col p-1"
                    >
                      <span className="font-bold text-lg">{value}</span>
                    </Button>
                    <Label className="text-xs mt-1 block">{label}</Label>
                  </div>
                );
              })}
            </div>
            <div className="flex justify-between text-sm text-muted-foreground">
              <span>Less Severe</span>
              <span>More Severe</span>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  };

  // Assistance Level Component Renderer
  const renderAssistanceLevel = () => {
    const { levels = [] } = component.props || {};
    const assistanceLevels = levels.length > 0 ? levels : [
      'Independent',
      'Modified Independent',
      'Supervision',
      'Minimal Assist',
      'Moderate Assist',
      'Maximal Assist',
      'Total Assist'
    ];

    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">{component.label}</CardTitle>
        </CardHeader>
        <CardContent>
          <RadioGroup className="space-y-3">
            {assistanceLevels.map((level: string, index: number) => (
              <div key={index} className="flex items-center space-x-2">
                <RadioGroupItem value={level} id={`${component.id}-${index}`} />
                <Label htmlFor={`${component.id}-${index}`} className="text-sm">
                  {level}
                </Label>
              </div>
            ))}
          </RadioGroup>
        </CardContent>
      </Card>
    );
  };

  // Demographics Component Renderer
  const renderDemographics = () => {
    const { fields = [], includeEmergencyContact = true, includeInsurance = true } = component.props || {};
    const demographicFields = fields.length > 0 ? fields : [
      'First Name', 'Last Name', 'Date of Birth', 'Gender', 'Address', 'Phone', 'Email'
    ];

    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">{component.label}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {demographicFields.map((field: string, index: number) => (
                <div key={index} className="space-y-2">
                  <Label className="text-sm font-medium">{field}</Label>
                  {field === 'Date of Birth' ? (
                    <Input type="date" className="w-full" />
                  ) : field === 'Gender' ? (
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select gender" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="male">Male</SelectItem>
                        <SelectItem value="female">Female</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                        <SelectItem value="prefer-not-to-say">Prefer not to say</SelectItem>
                      </SelectContent>
                    </Select>
                  ) : field === 'Address' ? (
                    <Textarea placeholder="Enter address" className="min-h-[80px]" />
                  ) : (
                    <Input placeholder={`Enter ${field.toLowerCase()}`} />
                  )}
                </div>
              ))}
            </div>

            {includeEmergencyContact && (
              <div className="mt-6 p-4 border rounded-lg">
                <h4 className="font-medium mb-3">Emergency Contact</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label className="text-sm">Contact Name</Label>
                    <Input placeholder="Enter contact name" />
                  </div>
                  <div>
                    <Label className="text-sm">Relationship</Label>
                    <Input placeholder="Enter relationship" />
                  </div>
                  <div>
                    <Label className="text-sm">Phone Number</Label>
                    <Input placeholder="Enter phone number" />
                  </div>
                </div>
              </div>
            )}

            {includeInsurance && (
              <div className="mt-6 p-4 border rounded-lg">
                <h4 className="font-medium mb-3">Insurance Information</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label className="text-sm">Insurance Provider</Label>
                    <Input placeholder="Enter insurance provider" />
                  </div>
                  <div>
                    <Label className="text-sm">Policy Number</Label>
                    <Input placeholder="Enter policy number" />
                  </div>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    );
  };

  // Standardized Test Component Renderer
  const renderStandardizedTest = () => {
    const { 
      testName = 'Assessment Tool',
      includeRawScore = true, 
      includeStandardScore = true, 
      includePercentile = true, 
      includeAgeEquivalent = true 
    } = component.props || {};

    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">{component.label}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <Label className="text-sm font-medium">Test Name</Label>
              <Input value={testName} placeholder="Enter test name" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {includeRawScore && (
                <div>
                  <Label className="text-sm">Raw Score</Label>
                  <Input type="number" placeholder="Enter raw score" />
                </div>
              )}

              {includeStandardScore && (
                <div>
                  <Label className="text-sm">Standard Score</Label>
                  <Input type="number" placeholder="Enter standard score" />
                </div>
              )}

              {includePercentile && (
                <div>
                  <Label className="text-sm">Percentile Rank</Label>
                  <Input type="number" placeholder="Enter percentile" min="1" max="99" />
                </div>
              )}

              {includeAgeEquivalent && (
                <div>
                  <Label className="text-sm">Age Equivalent</Label>
                  <Input placeholder="e.g., 5;6 (years;months)" />
                </div>
              )}
            </div>

            <div>
              <Label className="text-sm">Performance Level</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Select performance level" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="well-above-average">Well Above Average</SelectItem>
                  <SelectItem value="above-average">Above Average</SelectItem>
                  <SelectItem value="average">Average</SelectItem>
                  <SelectItem value="below-average">Below Average</SelectItem>
                  <SelectItem value="well-below-average">Well Below Average</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label className="text-sm">Clinical Interpretation</Label>
              <Textarea 
                placeholder="Enter clinical interpretation and recommendations"
                className="min-h-[100px]"
              />
            </div>
          </div>
        </CardContent>
      </Card>
    );
  };

  // Oral-Motor Component Renderer
  const renderOralMotor = () => {
    const { structures = [], functions = [], includeReflexes = true } = component.props || {};
    const oralStructures = structures.length > 0 ? structures : [
      'Lips', 'Tongue', 'Teeth', 'Hard Palate', 'Soft Palate', 'Jaw', 'Cheeks'
    ];
    const oralFunctions = functions.length > 0 ? functions : [
      'Lip Closure', 'Tongue Elevation', 'Tongue Lateralization', 'Jaw Stability', 'Swallowing'
    ];

    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">{component.label}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div>
              <h4 className="font-medium mb-3">Oral Structures</h4>
              <div className="space-y-3">
                {oralStructures.map((structure: string, index: number) => (
                  <div key={index} className="flex items-center justify-between p-3 border rounded">
                    <Label className="text-sm">{structure}</Label>
                    <Select>
                      <SelectTrigger className="w-40">
                        <SelectValue placeholder="Select" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="normal">Normal</SelectItem>
                        <SelectItem value="mild">Mild Deviation</SelectItem>
                        <SelectItem value="moderate">Moderate Deviation</SelectItem>
                        <SelectItem value="severe">Severe Deviation</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h4 className="font-medium mb-3">Oral Functions</h4>
              <div className="space-y-3">
                {oralFunctions.map((func: string, index: number) => (
                  <div key={index} className="flex items-center justify-between p-3 border rounded">
                    <Label className="text-sm">{func}</Label>
                    <Select>
                      <SelectTrigger className="w-40">
                        <SelectValue placeholder="Select" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="normal">Normal</SelectItem>
                        <SelectItem value="mild">Mild Impairment</SelectItem>
                        <SelectItem value="moderate">Moderate Impairment</SelectItem>
                        <SelectItem value="severe">Severe Impairment</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                ))}
              </div>
            </div>

            {includeReflexes && (
              <div>
                <h4 className="font-medium mb-3">Oral Reflexes</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {['Gag Reflex', 'Bite Reflex', 'Rooting Reflex', 'Sucking Reflex'].map((reflex, index) => (
                    <div key={index} className="flex items-center space-x-2">
                      <Checkbox id={`reflex-${index}`} />
                      <Label htmlFor={`reflex-${index}`} className="text-sm">{reflex} Present</Label>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div>
              <Label className="text-sm">Clinical Observations</Label>
              <Textarea 
                placeholder="Enter detailed oral-motor observations and recommendations"
                className="min-h-[100px]"
              />
            </div>
          </div>
        </CardContent>
      </Card>
    );
  };

  // Language Sample Component Renderer
  const renderLanguageSample = () => {
    const { sampleType = 'spontaneous', duration = 15, analysisType = [], includeTranscript = true } = component.props || {};
    const analysisTypes = analysisType.length > 0 ? analysisType : [
      'MLU (Mean Length of Utterance)', 'Vocabulary Analysis', 'Grammar Analysis', 'Pragmatic Analysis'
    ];

    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">{component.label}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label className="text-sm">Sample Type</Label>
                <Select value={sampleType}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="spontaneous">Spontaneous</SelectItem>
                    <SelectItem value="narrative">Narrative</SelectItem>
                    <SelectItem value="conversational">Conversational</SelectItem>
                    <SelectItem value="structured">Structured</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label className="text-sm">Duration (minutes)</Label>
                <Input type="number" value={duration} min="5" max="60" />
              </div>
            </div>

            {includeTranscript && (
              <div>
                <Label className="text-sm">Language Sample Transcript</Label>
                <Textarea 
                  placeholder="Enter the language sample transcript here..."
                  className="min-h-[200px] font-mono text-sm"
                />
              </div>
            )}

            <div>
              <Label className="text-sm font-medium">Analysis Components</Label>
              <div className="mt-2 space-y-2">
                {analysisTypes.map((analysis: string, index: number) => (
                  <div key={index} className="flex items-center space-x-2">
                    <Checkbox id={`analysis-${index}`} />
                    <Label htmlFor={`analysis-${index}`} className="text-sm">{analysis}</Label>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  };

  // Sensory Processing Component Renderer
  const renderSensoryProcessing = () => {
    const { systems = [], responsePatterns = [], includeADLImpact = true } = component.props || {};
    const sensorySystem = systems.length > 0 ? systems : [
      'Visual', 'Auditory', 'Tactile', 'Vestibular', 'Proprioceptive', 'Gustatory', 'Olfactory'
    ];
    const patterns = responsePatterns.length > 0 ? responsePatterns : [
      'Hyporesponsive', 'Hyperresponsive', 'Sensory Seeking', 'Sensory Avoiding'
    ];

    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">{component.label}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div>
              <h4 className="font-medium mb-3">Sensory Systems</h4>
              <div className="space-y-3">
                {sensorySystem.map((system: string, index: number) => (
                  <div key={index} className="p-3 border rounded">
                    <Label className="text-sm font-medium">{system}</Label>
                    <div className="mt-2 grid grid-cols-2 md:grid-cols-4 gap-2">
                      {patterns.map((pattern: string, pIndex: number) => (
                        <div key={pIndex} className="flex items-center space-x-1">
                          <Checkbox id={`${system}-${pIndex}`} />
                          <Label htmlFor={`${system}-${pIndex}`} className="text-xs">{pattern}</Label>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {includeADLImpact && (
              <div>
                <Label className="text-sm font-medium">Impact on Activities of Daily Living</Label>
                <div className="mt-2 space-y-2">
                  {['Self-Care', 'Play/Leisure', 'Social Participation', 'Academic Performance'].map((area, index) => (
                    <div key={index} className="flex items-center justify-between p-2 border rounded">
                      <Label className="text-sm">{area}</Label>
                      <Select>
                        <SelectTrigger className="w-32">
                          <SelectValue placeholder="Impact" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="none">No Impact</SelectItem>
                          <SelectItem value="mild">Mild Impact</SelectItem>
                          <SelectItem value="moderate">Moderate Impact</SelectItem>
                          <SelectItem value="severe">Severe Impact</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div>
              <Label className="text-sm">Sensory Processing Summary</Label>
              <Textarea 
                placeholder="Summarize sensory processing patterns and recommendations"
                className="min-h-[100px]"
              />
            </div>
          </div>
        </CardContent>
      </Card>
    );
  };

  // Goals Planning Component Renderer
  const renderGoalsPlanning = () => {
    const { goalType = 'SMART', timeframe = 'quarterly', includeBaseline = true } = component.props || {};

    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">{component.label}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label className="text-sm">Goal Type</Label>
                <Select value={goalType}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="SMART">SMART Goals</SelectItem>
                    <SelectItem value="functional">Functional Goals</SelectItem>
                    <SelectItem value="developmental">Developmental Goals</SelectItem>
                    <SelectItem value="academic">Academic Goals</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label className="text-sm">Timeframe</Label>
                <Select value={timeframe}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="monthly">Monthly</SelectItem>
                    <SelectItem value="quarterly">Quarterly</SelectItem>
                    <SelectItem value="semester">Semester</SelectItem>
                    <SelectItem value="annual">Annual</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {includeBaseline && (
              <div>
                <Label className="text-sm">Baseline Performance</Label>
                <Textarea 
                  placeholder="Describe current baseline performance level"
                  className="min-h-[80px]"
                />
              </div>
            )}

            <div>
              <Label className="text-sm">Long-term Goal</Label>
              <Textarea 
                placeholder="Enter the long-term functional goal"
                className="min-h-[80px]"
              />
            </div>

            <div>
              <Label className="text-sm">Short-term Objectives</Label>
              <div className="space-y-2">
                {[1, 2, 3].map((num) => (
                  <div key={num}>
                    <Label className="text-xs text-muted-foreground">Objective {num}</Label>
                    <Textarea 
                      placeholder={`Enter short-term objective ${num}`}
                      className="min-h-[60px]"
                    />
                  </div>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label className="text-sm">Success Criteria</Label>
                <Textarea 
                  placeholder="Define measurable success criteria"
                  className="min-h-[80px]"
                />
              </div>

              <div>
                <Label className="text-sm">Progress Monitoring Method</Label>
                <Textarea 
                  placeholder="Describe how progress will be monitored"
                  className="min-h-[80px]"
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  };

  // Clinical Signature Component Renderer
  const renderClinicalSignature = () => {
    const { 
      signatureType = 'digital', 
      includeDate = true, 
      includeCredentials = true 
    } = component.props || {};

    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">{component.label}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <Label className="text-sm">Clinician Name</Label>
              <Input placeholder="Enter clinician name" />
            </div>

            {includeCredentials && (
              <div>
                <Label className="text-sm">Professional Credentials</Label>
                <Input placeholder="e.g., M.S., CCC-SLP" />
              </div>
            )}

            <div>
              <Label className="text-sm">License Number</Label>
              <Input placeholder="Enter license number" />
            </div>

            {includeDate && (
              <div>
                <Label className="text-sm">Date</Label>
                <Input type="date" />
              </div>
            )}

            <div>
              <Label className="text-sm">Digital Signature</Label>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                <p className="text-sm text-muted-foreground">Click to add digital signature</p>
                <Button variant="outline" className="mt-2">
                  Add Signature
                </Button>
              </div>
            </div>

            <div className="text-xs text-muted-foreground">
              <p>By signing above, I certify that this evaluation was completed by me and represents my professional clinical judgment.</p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  };

  // CPT Code Component Renderer
  const renderCPTCode = () => {
    const { 
      cptCodes = [], 
      includeBilling = true, 
      includeJustification = true 
    } = component.props || {};

    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">{component.label}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <Label className="text-sm">CPT Code</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Select CPT code" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="92521">92521 - Laryngeal Function Studies</SelectItem>
                  <SelectItem value="92522">92522 - Acoustic Reflex Testing</SelectItem>
                  <SelectItem value="92523">92523 - Speech Sound Production Assessment</SelectItem>
                  <SelectItem value="92524">92524 - Behavioral Assessment of Hearing</SelectItem>
                  <SelectItem value="96105">96105 - Assessment of Aphasia</SelectItem>
                  <SelectItem value="96110">96110 - Developmental Screening</SelectItem>
                  <SelectItem value="96116">96116 - Neurobehavioral Status Exam</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {includeBilling && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label className="text-sm">Units</Label>
                  <Input type="number" placeholder="1" min="1" />
                </div>
                <div>
                  <Label className="text-sm">Duration (minutes)</Label>
                  <Input type="number" placeholder="60" />
                </div>
                <div>
                  <Label className="text-sm">Fee</Label>
                  <Input placeholder="$0.00" />
                </div>
              </div>
            )}

            {includeJustification && (
              <div>
                <Label className="text-sm">Clinical Justification</Label>
                <Textarea 
                  placeholder="Provide clinical justification for the selected CPT code and services rendered"
                  className="min-h-[100px]"
                />
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    );
  };

  // Main component render method
  const renderComponent = () => {
    switch (component.type) {
      case 'clinical_scale':
        return renderClinicalScale();
      case 'assistance_level':
        return renderAssistanceLevel();
      case 'demographics':
        return renderDemographics();
      case 'standardized_test':
        return renderStandardizedTest();
      case 'oral_motor':
        return renderOralMotor();
      case 'language_sample':
        return renderLanguageSample();
      case 'sensory_processing':
        return renderSensoryProcessing();
      case 'goals_planning':
        return renderGoalsPlanning();
      case 'clinical_signature':
        return renderClinicalSignature();
      case 'cpt_code':
        return renderCPTCode();
      default:
        return (
          <Card>
            <CardHeader>
              <CardTitle>{component.label}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Clinical component type "{component.type}" not yet implemented.
              </p>
            </CardContent>
          </Card>
        );
    }
  };

  return (
    <div className="clinical-component-renderer">
      {renderComponent()}
    </div>
  );
};