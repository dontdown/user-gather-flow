import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { ProgressBar } from './ProgressBar';
import { FormStep } from './FormStep';
import { FormData, ESTADO_CIVIL_OPTIONS, SEXO_OPTIONS } from '@/types/form';
import { validateCPF, validateCEP, formatCPF, formatCEP, validateName } from '@/lib/validations';
import { ChevronRight, ChevronLeft, Check } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const TOTAL_STEPS = 7;

export const MultiStepForm = () => {
  const { toast } = useToast();
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<FormData>({
    nomeCompleto: '',
    cpf: '',
    cep: '',
    estadoCivil: '',
    possuiFilhos: '',
    quantidadeFilhos: undefined,
    sexo: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateStep = (step: number): boolean => {
    const newErrors: Record<string, string> = {};

    switch (step) {
      case 1:
        if (!validateName(formData.nomeCompleto)) {
          newErrors.nomeCompleto = 'Nome completo é obrigatório';
        }
        break;
      case 2:
        if (!validateCPF(formData.cpf)) {
          newErrors.cpf = 'CPF inválido';
        }
        break;
      case 3:
        if (!validateCEP(formData.cep)) {
          newErrors.cep = 'CEP deve conter 8 dígitos';
        }
        break;
      case 4:
        if (!formData.estadoCivil) {
          newErrors.estadoCivil = 'Selecione uma opção';
        }
        break;
      case 5:
        if (!formData.possuiFilhos) {
          newErrors.possuiFilhos = 'Selecione uma opção';
        }
        if (formData.possuiFilhos === 'sim' && (!formData.quantidadeFilhos || formData.quantidadeFilhos < 1)) {
          newErrors.quantidadeFilhos = 'Informe a quantidade de filhos';
        }
        break;
      case 6:
        if (!formData.sexo) {
          newErrors.sexo = 'Selecione uma opção';
        }
        break;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(prev => Math.min(prev + 1, TOTAL_STEPS));
    }
  };

  const handlePrevious = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
  };

  const handleSubmit = () => {
    const finalData = {
      ...formData,
      quantidadeFilhos: formData.possuiFilhos === 'sim' ? formData.quantidadeFilhos : undefined,
    };
    
    console.log('Dados coletados:', JSON.stringify(finalData, null, 2));
    
    toast({
      title: "Informações enviadas com sucesso!",
      description: "Obrigado por preencher o formulário.",
    });
  };

  const updateFormData = (field: keyof FormData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setErrors(prev => ({ ...prev, [field]: undefined }));
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <FormStep title="Qual seu nome completo?">
            <div className="space-y-4">
              <div>
                <Label htmlFor="nome" className="text-sm font-medium">Nome completo</Label>
                <Input
                  id="nome"
                  value={formData.nomeCompleto}
                  onChange={(e) => updateFormData('nomeCompleto', e.target.value)}
                  className="mt-2"
                  placeholder="Digite seu nome completo"
                />
                {errors.nomeCompleto && (
                  <p className="text-destructive text-sm mt-1">{errors.nomeCompleto}</p>
                )}
              </div>
            </div>
          </FormStep>
        );

      case 2:
        return (
          <FormStep title="Qual seu CPF?">
            <div className="space-y-4">
              <div>
                <Label htmlFor="cpf" className="text-sm font-medium">CPF</Label>
                <Input
                  id="cpf"
                  value={formData.cpf}
                  onChange={(e) => updateFormData('cpf', formatCPF(e.target.value))}
                  className="mt-2"
                  placeholder="000.000.000-00"
                  maxLength={14}
                />
                {errors.cpf && (
                  <p className="text-destructive text-sm mt-1">{errors.cpf}</p>
                )}
              </div>
            </div>
          </FormStep>
        );

      case 3:
        return (
          <FormStep title="Qual seu CEP?">
            <div className="space-y-4">
              <div>
                <Label htmlFor="cep" className="text-sm font-medium">CEP</Label>
                <Input
                  id="cep"
                  value={formData.cep}
                  onChange={(e) => updateFormData('cep', formatCEP(e.target.value))}
                  className="mt-2"
                  placeholder="00000-000"
                  maxLength={9}
                />
                {errors.cep && (
                  <p className="text-destructive text-sm mt-1">{errors.cep}</p>
                )}
              </div>
            </div>
          </FormStep>
        );

      case 4:
        return (
          <FormStep title="Sobre o seu estado civil atual:">
            <div className="space-y-4">
              <RadioGroup
                value={formData.estadoCivil}
                onValueChange={(value) => updateFormData('estadoCivil', value)}
                className="space-y-3"
              >
                {ESTADO_CIVIL_OPTIONS.map((option) => (
                  <div key={option.value} className="flex items-center space-x-2">
                    <RadioGroupItem value={option.value} id={option.value} />
                    <Label htmlFor={option.value} className="cursor-pointer">
                      {option.label}
                    </Label>
                  </div>
                ))}
              </RadioGroup>
              {errors.estadoCivil && (
                <p className="text-destructive text-sm">{errors.estadoCivil}</p>
              )}
            </div>
          </FormStep>
        );

      case 5:
        return (
          <FormStep title="Você possui filhos?">
            <div className="space-y-4">
              <RadioGroup
                value={formData.possuiFilhos}
                onValueChange={(value) => {
                  updateFormData('possuiFilhos', value);
                  if (value === 'nao') {
                    updateFormData('quantidadeFilhos', undefined);
                  }
                }}
                className="space-y-3"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="sim" id="sim" />
                  <Label htmlFor="sim" className="cursor-pointer">Sim</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="nao" id="nao" />
                  <Label htmlFor="nao" className="cursor-pointer">Não</Label>
                </div>
              </RadioGroup>
              
              {formData.possuiFilhos === 'sim' && (
                <div className="mt-4 animate-fade-in">
                  <Label htmlFor="quantidade" className="text-sm font-medium">
                    Quantos filhos?
                  </Label>
                  <Input
                    id="quantidade"
                    type="number"
                    min="1"
                    value={formData.quantidadeFilhos || ''}
                    onChange={(e) => updateFormData('quantidadeFilhos', parseInt(e.target.value) || undefined)}
                    className="mt-2 w-24"
                    placeholder="0"
                  />
                </div>
              )}
              
              {errors.possuiFilhos && (
                <p className="text-destructive text-sm">{errors.possuiFilhos}</p>
              )}
              {errors.quantidadeFilhos && (
                <p className="text-destructive text-sm">{errors.quantidadeFilhos}</p>
              )}
            </div>
          </FormStep>
        );

      case 6:
        return (
          <FormStep title="Com qual sexo você se identifica?">
            <div className="space-y-4">
              <RadioGroup
                value={formData.sexo}
                onValueChange={(value) => updateFormData('sexo', value)}
                className="space-y-3"
              >
                {SEXO_OPTIONS.map((option) => (
                  <div key={option.value} className="flex items-center space-x-2">
                    <RadioGroupItem value={option.value} id={option.value} />
                    <Label htmlFor={option.value} className="cursor-pointer">
                      {option.label}
                    </Label>
                  </div>
                ))}
              </RadioGroup>
              {errors.sexo && (
                <p className="text-destructive text-sm">{errors.sexo}</p>
              )}
            </div>
          </FormStep>
        );

      case 7:
        return (
          <FormStep title="Estas informações estão corretas?">
            <div className="space-y-4">
              <div className="bg-muted rounded-lg p-4 space-y-3 text-sm">
                <div><strong>Nome:</strong> {formData.nomeCompleto}</div>
                <div><strong>CPF:</strong> {formData.cpf}</div>
                <div><strong>CEP:</strong> {formData.cep}</div>
                <div><strong>Estado Civil:</strong> {ESTADO_CIVIL_OPTIONS.find(opt => opt.value === formData.estadoCivil)?.label}</div>
                <div><strong>Possui Filhos:</strong> {formData.possuiFilhos === 'sim' ? `Sim (${formData.quantidadeFilhos})` : 'Não'}</div>
                <div><strong>Sexo:</strong> {SEXO_OPTIONS.find(opt => opt.value === formData.sexo)?.label}</div>
              </div>
              <Button 
                onClick={handleSubmit}
                className="w-full bg-success hover:bg-success/90 text-success-foreground"
              >
                <Check className="w-4 h-4 mr-2" />
                Confirmar e Enviar
              </Button>
            </div>
          </FormStep>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-background py-8 px-4">
      <div className="max-w-2xl mx-auto">
        <ProgressBar currentStep={currentStep} totalSteps={TOTAL_STEPS} />
        
        {renderStep()}
        
        {currentStep < TOTAL_STEPS && (
          <div className="flex justify-between mt-8 max-w-md mx-auto">
            <Button
              variant="outline"
              onClick={handlePrevious}
              disabled={currentStep === 1}
              className="flex items-center"
            >
              <ChevronLeft className="w-4 h-4 mr-2" />
              Anterior
            </Button>
            
            <Button
              onClick={handleNext}
              className="flex items-center bg-primary hover:bg-primary-hover"
            >
              Próximo
              <ChevronRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
        )}
        
        {currentStep === TOTAL_STEPS && (
          <div className="flex justify-center mt-8">
            <Button
              variant="outline"
              onClick={handlePrevious}
              className="flex items-center"
            >
              <ChevronLeft className="w-4 h-4 mr-2" />
              Voltar
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};