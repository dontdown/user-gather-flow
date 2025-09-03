import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { FormData, ESTADO_CIVIL_OPTIONS, SEXO_OPTIONS } from '@/types/form';
import { validateCPF, validateCEP, formatCPF, formatCEP, validateName } from '@/lib/validations';
import { Check } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export const SinglePageForm = () => {
  const { toast } = useToast();
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

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!validateName(formData.nomeCompleto)) {
      newErrors.nomeCompleto = 'Nome completo é obrigatório';
    }

    if (!validateCPF(formData.cpf)) {
      newErrors.cpf = 'CPF inválido';
    }

    if (!validateCEP(formData.cep)) {
      newErrors.cep = 'CEP deve conter 8 dígitos';
    }

    if (!formData.estadoCivil) {
      newErrors.estadoCivil = 'Selecione uma opção';
    }

    if (!formData.possuiFilhos) {
      newErrors.possuiFilhos = 'Selecione uma opção';
    }

    if (formData.possuiFilhos === 'sim' && (!formData.quantidadeFilhos || formData.quantidadeFilhos < 1)) {
      newErrors.quantidadeFilhos = 'Informe a quantidade de filhos';
    }

    if (!formData.sexo) {
      newErrors.sexo = 'Selecione uma opção';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateForm()) {
      const finalData = {
        ...formData,
        quantidadeFilhos: formData.possuiFilhos === 'sim' ? formData.quantidadeFilhos : undefined,
      };
      
      console.log('Dados coletados:', JSON.stringify(finalData, null, 2));
      
      toast({
        title: "Informações enviadas com sucesso!",
        description: "Obrigado por preencher o formulário.",
      });
    }
  };

  const updateFormData = (field: keyof FormData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setErrors(prev => ({ ...prev, [field]: undefined }));
  };

  return (
    <div className="min-h-screen bg-background py-8 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="bg-card shadow-card rounded-2xl p-8 border border-border/50 animate-fade-in">
          <h1 className="text-3xl font-bold text-center text-foreground mb-8">
            Formulário de Cadastro
          </h1>
          
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Nome Completo */}
            <div className="space-y-2">
              <Label htmlFor="nome" className="text-lg font-semibold">
                Qual seu nome completo?
              </Label>
              <Input
                id="nome"
                value={formData.nomeCompleto}
                onChange={(e) => updateFormData('nomeCompleto', e.target.value)}
                placeholder="Digite seu nome completo"
                className="text-base"
              />
              {errors.nomeCompleto && (
                <p className="text-destructive text-sm">{errors.nomeCompleto}</p>
              )}
            </div>

            {/* CPF */}
            <div className="space-y-2">
              <Label htmlFor="cpf" className="text-lg font-semibold">
                Qual seu CPF?
              </Label>
              <Input
                id="cpf"
                value={formData.cpf}
                onChange={(e) => updateFormData('cpf', formatCPF(e.target.value))}
                placeholder="000.000.000-00"
                maxLength={14}
                className="text-base"
              />
              {errors.cpf && (
                <p className="text-destructive text-sm">{errors.cpf}</p>
              )}
            </div>

            {/* CEP */}
            <div className="space-y-2">
              <Label htmlFor="cep" className="text-lg font-semibold">
                Qual seu CEP?
              </Label>
              <Input
                id="cep"
                value={formData.cep}
                onChange={(e) => updateFormData('cep', formatCEP(e.target.value))}
                placeholder="00000-000"
                maxLength={9}
                className="text-base"
              />
              {errors.cep && (
                <p className="text-destructive text-sm">{errors.cep}</p>
              )}
            </div>

            {/* Estado Civil */}
            <div className="space-y-4">
              <Label className="text-lg font-semibold">
                Sobre o seu estado civil atual:
              </Label>
              <RadioGroup
                value={formData.estadoCivil}
                onValueChange={(value) => updateFormData('estadoCivil', value)}
                className="space-y-3"
              >
                {ESTADO_CIVIL_OPTIONS.map((option) => (
                  <div key={option.value} className="flex items-center space-x-3">
                    <RadioGroupItem value={option.value} id={option.value} />
                    <Label htmlFor={option.value} className="cursor-pointer text-base">
                      {option.label}
                    </Label>
                  </div>
                ))}
              </RadioGroup>
              {errors.estadoCivil && (
                <p className="text-destructive text-sm">{errors.estadoCivil}</p>
              )}
            </div>

            {/* Filhos */}
            <div className="space-y-4">
              <Label className="text-lg font-semibold">
                Você possui filhos?
              </Label>
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
                <div className="flex items-center space-x-3">
                  <RadioGroupItem value="sim" id="sim" />
                  <Label htmlFor="sim" className="cursor-pointer text-base">Sim</Label>
                </div>
                <div className="flex items-center space-x-3">
                  <RadioGroupItem value="nao" id="nao" />
                  <Label htmlFor="nao" className="cursor-pointer text-base">Não</Label>
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

            {/* Sexo */}
            <div className="space-y-4">
              <Label className="text-lg font-semibold">
                Com qual sexo você se identifica?
              </Label>
              <RadioGroup
                value={formData.sexo}
                onValueChange={(value) => updateFormData('sexo', value)}
                className="space-y-3"
              >
                {SEXO_OPTIONS.map((option) => (
                  <div key={option.value} className="flex items-center space-x-3">
                    <RadioGroupItem value={option.value} id={option.value} />
                    <Label htmlFor={option.value} className="cursor-pointer text-base">
                      {option.label}
                    </Label>
                  </div>
                ))}
              </RadioGroup>
              {errors.sexo && (
                <p className="text-destructive text-sm">{errors.sexo}</p>
              )}
            </div>

            {/* Submit Button */}
            <div className="pt-6">
              <Button 
                type="submit"
                className="w-full bg-success hover:bg-success/90 text-success-foreground text-lg py-6"
              >
                <Check className="w-5 h-5 mr-2" />
                Confirmar e Enviar
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};