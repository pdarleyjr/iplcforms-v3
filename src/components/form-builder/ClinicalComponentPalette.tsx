// Clinical Component Palette for SLP/OT Form Builder - IPLC Forms v3
// Specialized clinical evaluation components for speech-language pathology and occupational therapy

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Type, 
  FileText, 
  ChevronDown, 
  CheckSquare, 
  Circle, 
  Calendar, 
  Hash, 
  BarChart3,
  Stethoscope,
  Brain,
  Users,
  ClipboardList,
  Target,
  FileSignature,
  Scale,
  Activity,
  Heart,
  Eye,
  Ear,
  Hand,
  MessageSquare,
  Timer,
  Calculator,
  Award,
  Shield
} from 'lucide-react';

interface ClinicalComponentItem {
  id: string;
  type: 'demographics' | 'medical_history' | 'functional_assessment' | 'sensory_motor' | 
        'standardized_test' | 'clinical_scale' | 'assistance_level' | 'goals_planning' | 
        'clinical_signature' | 'cpt_code' | 'oral_motor' | 'language_sample' | 
        'adl_assessment' | 'sensory_processing' | 'motor_skills' | 'cognitive_assessment' |
        'social_communication' | 'feeding_swallowing' | 'voice_fluency' | 'hearing_screening';
  label: string;
  icon: React.ReactNode;
  description: string;
  category: 'Demographics' | 'Medical' | 'Assessment' | 'Testing' | 'Clinical' | 'Documentation';
  clinicalDiscipline: 'SLP' | 'OT' | 'Both';
}

const clinicalComponents: ClinicalComponentItem[] = [
  // Demographics Section
  {
    id: 'demographics',
    type: 'demographics',
    label: 'Client Demographics',
    icon: <Users className="h-4 w-4" />,
    description: 'Comprehensive client information form',
    category: 'Demographics',
    clinicalDiscipline: 'Both'
  },
  
  // Medical History Section
  {
    id: 'medical_history',
    type: 'medical_history',
    label: 'Medical History',
    icon: <Stethoscope className="h-4 w-4" />,
    description: 'Medical background and relevant conditions',
    category: 'Medical',
    clinicalDiscipline: 'Both'
  },
  
  // SLP-Specific Components
  {
    id: 'oral_motor',
    type: 'oral_motor',
    label: 'Oral-Motor Examination',
    icon: <MessageSquare className="h-4 w-4" />,
    description: 'Comprehensive oral-motor structure and function assessment',
    category: 'Assessment',
    clinicalDiscipline: 'SLP'
  },
  {
    id: 'language_sample',
    type: 'language_sample',
    label: 'Language Sample Analysis',
    icon: <Brain className="h-4 w-4" />,
    description: 'Structured language sampling and analysis tools',
    category: 'Assessment',
    clinicalDiscipline: 'SLP'
  },
  {
    id: 'voice_fluency',
    type: 'voice_fluency',
    label: 'Voice & Fluency Assessment',
    icon: <Activity className="h-4 w-4" />,
    description: 'Voice quality, pitch, loudness, and fluency evaluation',
    category: 'Assessment',
    clinicalDiscipline: 'SLP'
  },
  {
    id: 'feeding_swallowing',
    type: 'feeding_swallowing',
    label: 'Feeding & Swallowing',
    icon: <Heart className="h-4 w-4" />,
    description: 'Dysphagia and feeding assessment protocols',
    category: 'Assessment',
    clinicalDiscipline: 'SLP'
  },
  {
    id: 'hearing_screening',
    type: 'hearing_screening',
    label: 'Hearing Screening',
    icon: <Ear className="h-4 w-4" />,
    description: 'Basic hearing screening and audiological considerations',
    category: 'Assessment',
    clinicalDiscipline: 'SLP'
  },
  {
    id: 'social_communication',
    type: 'social_communication',
    label: 'Social Communication',
    icon: <Users className="h-4 w-4" />,
    description: 'Pragmatic language and social interaction assessment',
    category: 'Assessment',
    clinicalDiscipline: 'SLP'
  },
  
  // OT-Specific Components
  {
    id: 'sensory_processing',
    type: 'sensory_processing',
    label: 'Sensory Processing',
    icon: <Eye className="h-4 w-4" />,
    description: 'Sensory integration and processing evaluation',
    category: 'Assessment',
    clinicalDiscipline: 'OT'
  },
  {
    id: 'motor_skills',
    type: 'motor_skills',
    label: 'Motor Skills Assessment',
    icon: <Hand className="h-4 w-4" />,
    description: 'Fine and gross motor skills evaluation',
    category: 'Assessment',
    clinicalDiscipline: 'OT'
  },
  {
    id: 'adl_assessment',
    type: 'adl_assessment',
    label: 'ADL Assessment',
    icon: <ClipboardList className="h-4 w-4" />,
    description: 'Activities of daily living evaluation',
    category: 'Assessment',
    clinicalDiscipline: 'OT'
  },
  {
    id: 'sensory_motor',
    type: 'sensory_motor',
    label: 'Sensory-Motor Integration',
    icon: <Activity className="h-4 w-4" />,
    description: 'Integrated sensory and motor function assessment',
    category: 'Assessment',
    clinicalDiscipline: 'OT'
  },
  
  // Shared Assessment Components
  {
    id: 'cognitive_assessment',
    type: 'cognitive_assessment',
    label: 'Cognitive Assessment',
    icon: <Brain className="h-4 w-4" />,
    description: 'Cognitive function and processing evaluation',
    category: 'Assessment',
    clinicalDiscipline: 'Both'
  },
  {
    id: 'functional_assessment',
    type: 'functional_assessment',
    label: 'Functional Assessment',
    icon: <Target className="h-4 w-4" />,
    description: 'Functional skills and independence evaluation',
    category: 'Assessment',
    clinicalDiscipline: 'Both'
  },
  
  // Standardized Testing Components
  {
    id: 'standardized_test',
    type: 'standardized_test',
    label: 'Standardized Test',
    icon: <Award className="h-4 w-4" />,
    description: 'Standardized assessment with norm calculations',
    category: 'Testing',
    clinicalDiscipline: 'Both'
  },
  
  // Clinical Scales and Measurements
  {
    id: 'clinical_scale',
    type: 'clinical_scale',
    label: 'Clinical Rating Scale',
    icon: <BarChart3 className="h-4 w-4" />,
    description: 'Professional clinical rating scales (1-7, severity levels)',
    category: 'Clinical',
    clinicalDiscipline: 'Both'
  },
  {
    id: 'assistance_level',
    type: 'assistance_level',
    label: 'Level of Assistance',
    icon: <Scale className="h-4 w-4" />,
    description: 'Independence vs assistance level indicators',
    category: 'Clinical',
    clinicalDiscipline: 'Both'
  },
  
  // Goals and Intervention Planning
  {
    id: 'goals_planning',
    type: 'goals_planning',
    label: 'Goals & Intervention Planning',
    icon: <Target className="h-4 w-4" />,
    description: 'SMART goals and treatment planning framework',
    category: 'Clinical',
    clinicalDiscipline: 'Both'
  },
  
  // Documentation and Compliance
  {
    id: 'clinical_signature',
    type: 'clinical_signature',
    label: 'Clinical Signature',
    icon: <FileSignature className="h-4 w-4" />,
    description: 'Digital signature with credentials and date',
    category: 'Documentation',
    clinicalDiscipline: 'Both'
  },
  {
    id: 'cpt_code',
    type: 'cpt_code',
    label: 'CPT Billing Code',
    icon: <Calculator className="h-4 w-4" />,
    description: 'Clinical procedure coding for billing',
    category: 'Documentation',
    clinicalDiscipline: 'Both'
  }
];

const categoryColors = {
  'Demographics': 'bg-blue-100 text-blue-800',
  'Medical': 'bg-red-100 text-red-800',
  'Assessment': 'bg-green-100 text-green-800',
  'Testing': 'bg-purple-100 text-purple-800',
  'Clinical': 'bg-orange-100 text-orange-800',
  'Documentation': 'bg-gray-100 text-gray-800'
};

const disciplineColors = {
  'SLP': 'bg-cyan-100 text-cyan-800',
  'OT': 'bg-emerald-100 text-emerald-800',
  'Both': 'bg-indigo-100 text-indigo-800'
};

interface ClinicalComponentPaletteProps {
  className?: string;
  onComponentDrag?: (component: any) => void;
  selectedDiscipline?: 'SLP' | 'OT' | 'Both';
}

export const ClinicalComponentPalette: React.FC<ClinicalComponentPaletteProps> = ({ 
  className = '', 
  onComponentDrag,
  selectedDiscipline = 'Both'
}) => {
  const handleDragStart = (e: React.DragEvent, item: ClinicalComponentItem) => {
    const component = {
      type: item.type,
      label: item.label,
      id: `${item.type}_${Date.now()}`,
      clinicalType: item.type,
      clinicalDiscipline: item.clinicalDiscipline,
      props: {
        required: false,
        description: '',
        clinicalContext: item.description,
        ...getDefaultPropsForType(item.type)
      }
    };
    
    if (onComponentDrag) {
      onComponentDrag(component);
    }
    
    e.dataTransfer.setData('application/json', JSON.stringify(component));
    e.dataTransfer.effectAllowed = 'copy';
  };

  const getDefaultPropsForType = (type: string) => {
    switch (type) {
      case 'demographics':
        return {
          fields: ['name', 'dob', 'age', 'gender', 'guardian', 'referral_source', 'diagnosis'],
          includeEmergencyContact: true,
          includeInsurance: true
        };
      case 'medical_history':
        return {
          sections: ['birth_history', 'developmental_milestones', 'medical_conditions', 'medications', 'surgeries', 'allergies'],
          includeRiskFactors: true
        };
      case 'clinical_scale':
        return {
          scaleType: 'severity',
          min: 1,
          max: 7,
          labels: ['Normal', 'Mild', 'Mild-Moderate', 'Moderate', 'Moderate-Severe', 'Severe', 'Profound']
        };
      case 'assistance_level':
        return {
          levels: ['Independent', 'Modified Independent', 'Supervision', 'Minimal Assist', 'Moderate Assist', 'Maximal Assist', 'Total Assist'],
          includePrompting: true
        };
      case 'standardized_test':
        return {
          includeRawScore: true,
          includeStandardScore: true,
          includePercentile: true,
          includeAgeEquivalent: true,
          normDatabase: 'standard'
        };
      case 'goals_planning':
        return {
          goalType: 'SMART',
          timeframe: 'quarterly',
          includeBaseline: true,
          includeTargetCriteria: true,
          includeStrategies: true
        };
      case 'oral_motor':
        return {
          structures: ['lips', 'tongue', 'jaw', 'palate', 'teeth', 'pharynx'],
          functions: ['strength', 'tone', 'coordination', 'symmetry', 'range_of_motion'],
          includeReflexes: true
        };
      case 'language_sample':
        return {
          sampleType: 'spontaneous',
          duration: 15,
          analysisType: ['MLU', 'vocabulary_diversity', 'grammatical_complexity'],
          includeTranscript: true
        };
      case 'sensory_processing':
        return {
          systems: ['visual', 'auditory', 'tactile', 'vestibular', 'proprioceptive', 'olfactory', 'gustatory'],
          responsePatterns: ['seeking', 'avoiding', 'sensitivity', 'registration'],
          includeADLImpact: true
        };
      case 'cpt_code':
        return {
          codeType: 'therapy',
          includeUnits: true,
          includeModifiers: true,
          requireJustification: true
        };
      default:
        return {};
    }
  };

  // Filter components based on selected discipline
  const filteredComponents = clinicalComponents.filter(item => 
    selectedDiscipline === 'Both' || 
    item.clinicalDiscipline === selectedDiscipline || 
    item.clinicalDiscipline === 'Both'
  );

  const groupedComponents = filteredComponents.reduce((acc, item) => {
    if (!acc[item.category]) {
      acc[item.category] = [];
    }
    acc[item.category].push(item);
    return acc;
  }, {} as Record<string, ClinicalComponentItem[]>);

  return (
    <div className={`w-80 bg-white border-r border-gray-200 h-full overflow-y-auto ${className}`}>
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center gap-2 mb-2">
          <Shield className="h-5 w-5 text-blue-600" />
          <h3 className="text-lg font-semibold text-gray-900">Clinical Components</h3>
        </div>
        <p className="text-sm text-gray-600">Specialized SLP/OT evaluation tools</p>
        <div className="flex gap-1 mt-2">
          <Badge variant="secondary" className={disciplineColors[selectedDiscipline]}>
            {selectedDiscipline === 'Both' ? 'All Disciplines' : selectedDiscipline}
          </Badge>
          <Badge variant="outline" className="text-xs">
            {filteredComponents.length} components
          </Badge>
        </div>
      </div>
      
      <div className="p-4 space-y-6">
        {Object.entries(groupedComponents).map(([category, items]) => (
          <div key={category}>
            <div className="flex items-center gap-2 mb-3">
              <h4 className="text-sm font-medium text-gray-700">{category}</h4>
              <Badge variant="secondary" className={`text-xs ${categoryColors[category as keyof typeof categoryColors]}`}>
                {items.length}
              </Badge>
            </div>
            
            <div className="space-y-2">
              {items.map((item) => (
                <Card
                  key={item.id}
                  className="cursor-move hover:shadow-md transition-shadow duration-200 border-2 border-transparent hover:border-blue-200"
                  draggable
                  onDragStart={(e) => handleDragStart(e, item)}
                >
                  <CardContent className="p-3">
                    <div className="flex items-start gap-3">
                      <div className="flex-shrink-0 p-2 bg-blue-50 rounded-md">
                        {item.icon}
                      </div>
                      <div className="flex-grow min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <h5 className="text-sm font-medium text-gray-900 truncate">
                            {item.label}
                          </h5>
                          <Badge variant="outline" className={`text-xs ${disciplineColors[item.clinicalDiscipline]}`}>
                            {item.clinicalDiscipline}
                          </Badge>
                        </div>
                        <p className="text-xs text-gray-600">
                          {item.description}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        ))}
      </div>
      
      <div className="p-4 border-t border-gray-200 bg-blue-50">
        <div className="text-xs text-gray-600">
          <p className="font-medium mb-2 flex items-center gap-1">
            <Shield className="h-3 w-3" />
            Clinical Guidelines:
          </p>
          <ul className="space-y-1">
            <li>• Components follow ASHA/AOTA standards</li>
            <li>• HIPAA-compliant data collection</li>
            <li>• Evidence-based assessment tools</li>
            <li>• Standardized scoring protocols</li>
          </ul>
        </div>
      </div>
    </div>
  );
};