import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { FormData, ESTADO_CIVIL_OPTIONS, SEXO_OPTIONS } from '@/types/form';
import { validateCPF, validateCEP, formatCPF, formatCEP, validateName, validateTelefone, formatTelefone } from '@/lib/validations';
import { useToast } from '@/hooks/use-toast';
import { saveFormData, checkCpfExists } from '@/services/database';

export const SinglePageForm = () => {
  const { toast } = useToast();
  const [formData, setFormData] = useState<FormData>({
    nomeCompleto: '',
    cpf: '',
    telefone: '',
    cep: '',
    logradouro: '',
    numero: '',
    complemento: '',
    bairro: '',
    localidade: '',
    estado: '',
    estadoCivil: '',
    possuiFilhos: '',
    quantidadeFilhos: undefined,
    sexo: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoadingCep, setIsLoadingCep] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isCheckingCpf, setIsCheckingCpf] = useState(false);

  const buscarCEP = async (cep: string) => {
    const cepLimpo = cep.replace(/\D/g, '');
    
    if (cepLimpo.length !== 8) return;
    
    setIsLoadingCep(true);
    
    try {
      const response = await fetch(`https://viacep.com.br/ws/${cepLimpo}/json/`);
      const data = await response.json();
      
      if (!data.erro) {
        setFormData(prev => ({
          ...prev,
          logradouro: data.logradouro || '',
          bairro: data.bairro || '',
          localidade: data.localidade || '',
          estado: data.uf || '',
        }));
        
        toast({
          title: "CEP encontrado!",
          description: "Endereço preenchido automaticamente.",
        });
      } else {
        toast({
          title: "CEP não encontrado",
          description: "Verifique se o CEP está correto.",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Erro ao buscar CEP",
        description: "Tente novamente em alguns instantes.",
        variant: "destructive",
      });
    } finally {
      setIsLoadingCep(false);
    }
  };

  const verificarCpfExistente = async (cpf: string) => {
    if (!validateCPF(cpf)) return;
    
    setIsCheckingCpf(true);
    
    try {
      const result = await checkCpfExists(cpf);
      
      if (result.exists) {
        setErrors(prev => ({ ...prev, cpf: 'Este CPF já está cadastrado no sistema' }));
        toast({
          title: "CPF já cadastrado",
          description: "Este CPF já está registrado no sistema.",
          variant: "destructive",
        });
      } else {
        // Remove o erro de CPF se existir
        setErrors(prev => {
          const newErrors = { ...prev };
          if (newErrors.cpf === 'Este CPF já está cadastrado no sistema') {
            delete newErrors.cpf;
          }
          return newErrors;
        });
      }
    } catch (error) {
      console.error('Erro ao verificar CPF:', error);
    } finally {
      setIsCheckingCpf(false);
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!validateName(formData.nomeCompleto)) {
      newErrors.nomeCompleto = 'Nome completo é obrigatório';
    }

    if (!validateCPF(formData.cpf)) {
      newErrors.cpf = 'CPF inválido';
    }

    if (!validateTelefone(formData.telefone)) {
      newErrors.telefone = 'Telefone inválido (10 ou 11 dígitos)';
    }

    if (!validateCEP(formData.cep)) {
      newErrors.cep = 'CEP deve conter 8 dígitos';
    }

    if (!formData.logradouro.trim()) {
      newErrors.logradouro = 'Logradouro é obrigatório';
    }

    if (!formData.numero.trim()) {
      newErrors.numero = 'Número é obrigatório';
    }

    if (!formData.bairro.trim()) {
      newErrors.bairro = 'Bairro é obrigatório';
    }

    if (!formData.localidade.trim()) {
      newErrors.localidade = 'Cidade é obrigatória';
    }

    if (!formData.estado.trim()) {
      newErrors.estado = 'Estado é obrigatório';
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      toast({
        title: "Erro de validação",
        description: "Por favor, corrija os erros do formulário.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const result = await saveFormData(formData);
      
      if (result.success) {
        console.log('Dados salvos no Supabase com sucesso!');
        
        toast({
          title: "Informações enviadas com sucesso!",
          description: "Obrigado por participar da pesquisa UNIAGRO.",
        });

        // Limpar o formulário após sucesso
        setFormData({
          nomeCompleto: '',
          cpf: '',
          telefone: '',
          cep: '',
          logradouro: '',
          numero: '',
          complemento: '',
          bairro: '',
          localidade: '',
          estado: '',
          estadoCivil: '',
          possuiFilhos: '',
          quantidadeFilhos: undefined,
          sexo: '',
        });
      } else {
        console.error('Erro ao salvar no Supabase:', result.error);
        
        // Diferentes tipos de mensagens baseadas no erro
        let errorTitle = "Erro ao enviar dados";
        let errorDescription = result.error || "Tente novamente em alguns instantes.";
        
        if (result.error?.includes('CPF já foi cadastrado')) {
          errorTitle = "CPF já cadastrado";
          errorDescription = result.error;
        }
        
        toast({
          title: errorTitle,
          description: errorDescription,
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Erro inesperado:', error);
      
      toast({
        title: "Erro inesperado",
        description: "Ocorreu um erro. Tente novamente em alguns instantes.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const updateFormData = (field: keyof FormData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setErrors(prev => ({ ...prev, [field]: undefined }));
  };

  return (
    <div className="min-h-screen bg-green-50 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center mb-6">
            <img 
              src="/uniagro-logo.png" 
              alt="UNIAGRO Logo" 
              className="h-20 w-auto"
            />
          </div>
          <p className="text-lg text-gray-600 mb-4">Questionário de Pesquisa Agropecuária</p>
          <div className="w-32 h-1 bg-green-600 mx-auto rounded-full"></div>
        </div>

        {/* Form Container */}
        <div className="bg-white rounded-xl shadow-lg border border-green-200 overflow-hidden">
          <div className="bg-green-700 px-8 py-6">
            <h2 className="text-2xl font-semibold text-white text-center">Informações Pessoais</h2>
            <p className="text-green-100 text-center mt-2">
              Preencha os campos abaixo. Todos os dados são tratados com confidencialidade.
            </p>
          </div>
          
          <div className="p-10">
            <form onSubmit={handleSubmit} className="space-y-10">
              {/* Primeira linha - Nome Completo */}
              <div className="bg-gray-50 p-6 rounded-xl border border-gray-200 hover:border-green-300 transition-colors">
                <div className="space-y-4">
                  <Label htmlFor="nome" className="text-lg font-semibold text-gray-800">
                    Nome completo
                  </Label>
                  <Input
                    id="nome"
                    value={formData.nomeCompleto}
                    onChange={(e) => updateFormData('nomeCompleto', e.target.value)}
                    placeholder="Digite seu nome completo"
                    className="h-12 text-base border-gray-300 focus:border-green-500 focus:ring-green-500 bg-white"
                  />
                  {errors.nomeCompleto && (
                    <p className="text-red-600 text-sm flex items-center gap-2">
                      <span className="w-1 h-1 bg-red-600 rounded-full"></span>
                      {errors.nomeCompleto}
                    </p>
                  )}
                </div>
              </div>

              {/* Segunda linha - CPF e Telefone */}
              <div className="grid lg:grid-cols-2 gap-8">
                {/* CPF */}
                <div className="bg-gray-50 p-6 rounded-xl border border-gray-200 hover:border-green-300 transition-colors">
                  <div className="space-y-4">
                    <Label htmlFor="cpf" className="text-lg font-semibold text-gray-800">
                      CPF
                    </Label>
                    <Input
                      id="cpf"
                      value={formData.cpf}
                      onChange={(e) => updateFormData('cpf', formatCPF(e.target.value))}
                      onBlur={(e) => verificarCpfExistente(e.target.value)}
                      placeholder="000.000.000-00"
                      maxLength={14}
                      className="h-12 text-base border-gray-300 focus:border-green-500 focus:ring-green-500 bg-white"
                      disabled={isCheckingCpf}
                    />
                    {isCheckingCpf && (
                      <p className="text-blue-600 text-sm flex items-center gap-2">
                        <span className="w-1 h-1 bg-blue-600 rounded-full animate-pulse"></span>
                        Verificando CPF...
                      </p>
                    )}
                    {errors.cpf && (
                      <p className="text-red-600 text-sm flex items-center gap-2">
                        <span className="w-1 h-1 bg-red-600 rounded-full"></span>
                        {errors.cpf}
                      </p>
                    )}
                  </div>
                </div>

                {/* Telefone */}
                <div className="bg-gray-50 p-6 rounded-xl border border-gray-200 hover:border-green-300 transition-colors">
                  <div className="space-y-4">
                    <Label htmlFor="telefone" className="text-lg font-semibold text-gray-800">
                      Telefone
                    </Label>
                    <Input
                      id="telefone"
                      value={formData.telefone}
                      onChange={(e) => updateFormData('telefone', formatTelefone(e.target.value))}
                      placeholder="(11) 91234-5678"
                      maxLength={15}
                      className="h-12 text-base border-gray-300 focus:border-green-500 focus:ring-green-500 bg-white"
                    />
                    {errors.telefone && (
                      <p className="text-red-600 text-sm flex items-center gap-2">
                        <span className="w-1 h-1 bg-red-600 rounded-full"></span>
                        {errors.telefone}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* Terceira linha - Sexo e Estado Civil */}
              <div className="grid lg:grid-cols-2 gap-8">
                {/* Sexo */}
                <div className="bg-gray-50 p-6 rounded-xl border border-gray-200 hover:border-green-300 transition-colors">
                  <div className="space-y-4">
                    <Label htmlFor="sexo" className="text-lg font-semibold text-gray-800">
                      Sexo
                    </Label>
                    <Select value={formData.sexo} onValueChange={(value) => updateFormData('sexo', value)}>
                      <SelectTrigger className="h-12 text-base border-gray-300 focus:border-green-500 focus:ring-green-500 bg-white">
                        <SelectValue placeholder="Selecione seu sexo" />
                      </SelectTrigger>
                      <SelectContent>
                        {SEXO_OPTIONS.map((option) => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {errors.sexo && (
                      <p className="text-red-600 text-sm flex items-center gap-2">
                        <span className="w-1 h-1 bg-red-600 rounded-full"></span>
                        {errors.sexo}
                      </p>
                    )}
                  </div>
                </div>

                {/* Estado Civil */}
                <div className="bg-gray-50 p-6 rounded-xl border border-gray-200 hover:border-green-300 transition-colors">
                  <div className="space-y-4">
                    <Label htmlFor="estadoCivil" className="text-lg font-semibold text-gray-800">
                      Estado civil
                    </Label>
                    <Select value={formData.estadoCivil} onValueChange={(value) => updateFormData('estadoCivil', value)}>
                      <SelectTrigger className="h-12 text-base border-gray-300 focus:border-green-500 focus:ring-green-500 bg-white">
                        <SelectValue placeholder="Selecione seu estado civil" />
                      </SelectTrigger>
                      <SelectContent>
                        {ESTADO_CIVIL_OPTIONS.map((option) => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {errors.estadoCivil && (
                      <p className="text-red-600 text-sm flex items-center gap-2">
                        <span className="w-1 h-1 bg-red-600 rounded-full"></span>
                        {errors.estadoCivil}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* Quarta linha - Possui Filhos */}
              <div className="bg-gray-50 p-6 rounded-xl border border-gray-200 hover:border-green-300 transition-colors">
                <div className="space-y-4">
                  <Label htmlFor="possuiFilhos" className="text-lg font-semibold text-gray-800">
                    Possui filhos?
                  </Label>
                  <Select 
                    value={formData.possuiFilhos} 
                    onValueChange={(value) => {
                      updateFormData('possuiFilhos', value);
                      if (value === 'nao') {
                        updateFormData('quantidadeFilhos', undefined);
                      }
                    }}
                  >
                    <SelectTrigger className="h-12 text-base border-gray-300 focus:border-green-500 focus:ring-green-500 bg-white">
                      <SelectValue placeholder="Selecione uma opção" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="sim">Sim</SelectItem>
                      <SelectItem value="nao">Não</SelectItem>
                    </SelectContent>
                  </Select>
                  
                  {formData.possuiFilhos === 'sim' && (
                    <div className="mt-4 p-4 bg-white rounded-lg border border-green-200 animate-fade-in">
                      <Label htmlFor="quantidade" className="text-sm font-medium text-gray-700 block mb-2">
                        Quantos filhos?
                      </Label>
                      <Input
                        id="quantidade"
                        type="number"
                        min="1"
                        value={formData.quantidadeFilhos || ''}
                        onChange={(e) => updateFormData('quantidadeFilhos', parseInt(e.target.value) || undefined)}
                        className="w-32 h-10 border-gray-300 focus:border-green-500 focus:ring-green-500"
                        placeholder="0"
                      />
                    </div>
                  )}
                  
                  {errors.possuiFilhos && (
                    <p className="text-red-600 text-sm flex items-center gap-2">
                      <span className="w-1 h-1 bg-red-600 rounded-full"></span>
                      {errors.possuiFilhos}
                    </p>
                  )}
                  {errors.quantidadeFilhos && (
                    <p className="text-red-600 text-sm flex items-center gap-2">
                      <span className="w-1 h-1 bg-red-600 rounded-full"></span>
                      {errors.quantidadeFilhos}
                    </p>
                  )}
                </div>
              </div>

              {/* Quinta linha - Endereço completo */}
              <div className="bg-gray-50 p-6 rounded-xl border border-gray-200 hover:border-green-300 transition-colors">
                <div className="space-y-4">
                  <div className="mb-6">
                    <h3 className="text-lg font-semibold text-gray-800">Endereço</h3>
                  </div>

                  <div className="grid lg:grid-cols-3 gap-4">
                    {/* CEP */}
                    <div>
                      <Label htmlFor="cep" className="text-base font-medium text-gray-700 mb-2 block">
                        CEP
                      </Label>
                      <div className="relative">
                        <Input
                          id="cep"
                          value={formData.cep}
                          onChange={(e) => {
                            const newCep = formatCEP(e.target.value);
                            updateFormData('cep', newCep);
                            if (newCep.replace(/\D/g, '').length === 8) {
                              buscarCEP(newCep);
                            }
                          }}
                          placeholder="00000-000"
                          maxLength={9}
                          className="h-12 text-base border-gray-300 focus:border-green-500 focus:ring-green-500 bg-white pr-10"
                        />
                        {isLoadingCep && (
                          <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                            <div className="animate-spin rounded-full h-4 w-4 border-2 border-green-500 border-t-transparent"></div>
                          </div>
                        )}
                      </div>
                      {errors.cep && (
                        <p className="text-red-600 text-sm flex items-center gap-2 mt-1">
                          <span className="w-1 h-1 bg-red-600 rounded-full"></span>
                          {errors.cep}
                        </p>
                      )}
                    </div>

                    {/* Estado */}
                    <div>
                      <Label htmlFor="estado" className="text-base font-medium text-gray-700 mb-2 block">
                        Estado
                      </Label>
                      <Input
                        id="estado"
                        value={formData.estado}
                        readOnly
                        placeholder="UF"
                        className="h-12 text-base border-gray-300 bg-gray-100 text-gray-600 cursor-not-allowed"
                        maxLength={2}
                      />
                      {errors.estado && (
                        <p className="text-red-600 text-sm flex items-center gap-2 mt-1">
                          <span className="w-1 h-1 bg-red-600 rounded-full"></span>
                          {errors.estado}
                        </p>
                      )}
                    </div>

                    {/* Cidade */}
                    <div>
                      <Label htmlFor="localidade" className="text-base font-medium text-gray-700 mb-2 block">
                        Cidade
                      </Label>
                      <Input
                        id="localidade"
                        value={formData.localidade}
                        readOnly
                        placeholder="Nome da cidade"
                        className="h-12 text-base border-gray-300 bg-gray-100 text-gray-600 cursor-not-allowed"
                      />
                      {errors.localidade && (
                        <p className="text-red-600 text-sm flex items-center gap-2 mt-1">
                          <span className="w-1 h-1 bg-red-600 rounded-full"></span>
                          {errors.localidade}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="grid lg:grid-cols-3 gap-4">
                    {/* Logradouro */}
                    <div>
                      <Label htmlFor="logradouro" className="text-base font-medium text-gray-700 mb-2 block">
                        Logradouro
                      </Label>
                      <Input
                        id="logradouro"
                        value={formData.logradouro}
                        readOnly
                        placeholder="Rua, Avenida, etc."
                        className="h-12 text-base border-gray-300 bg-gray-100 text-gray-600 cursor-not-allowed"
                      />
                      {errors.logradouro && (
                        <p className="text-red-600 text-sm flex items-center gap-2 mt-1">
                          <span className="w-1 h-1 bg-red-600 rounded-full"></span>
                          {errors.logradouro}
                        </p>
                      )}
                    </div>

                    {/* Número */}
                    <div>
                      <Label htmlFor="numero" className="text-base font-medium text-gray-700 mb-2 block">
                        Número
                      </Label>
                      <Input
                        id="numero"
                        value={formData.numero}
                        onChange={(e) => updateFormData('numero', e.target.value)}
                        placeholder="123"
                        className="h-12 text-base border-gray-300 focus:border-green-500 focus:ring-green-500 bg-white"
                      />
                      {errors.numero && (
                        <p className="text-red-600 text-sm flex items-center gap-2 mt-1">
                          <span className="w-1 h-1 bg-red-600 rounded-full"></span>
                          {errors.numero}
                        </p>
                      )}
                    </div>

                    {/* Bairro */}
                    <div>
                      <Label htmlFor="bairro" className="text-base font-medium text-gray-700 mb-2 block">
                        Bairro
                      </Label>
                      <Input
                        id="bairro"
                        value={formData.bairro}
                        readOnly
                        placeholder="Nome do bairro"
                        className="h-12 text-base border-gray-300 bg-gray-100 text-gray-600 cursor-not-allowed"
                      />
                      {errors.bairro && (
                        <p className="text-red-600 text-sm flex items-center gap-2 mt-1">
                          <span className="w-1 h-1 bg-red-600 rounded-full"></span>
                          {errors.bairro}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Complemento */}
                  <div>
                    <Label htmlFor="complemento" className="text-base font-medium text-gray-700 mb-2 block">
                      Complemento (opcional)
                    </Label>
                    <Input
                      id="complemento"
                      value={formData.complemento}
                      onChange={(e) => updateFormData('complemento', e.target.value)}
                      placeholder="Apartamento, casa, etc."
                      className="h-12 text-base border-gray-300 focus:border-green-500 focus:ring-green-500 bg-white"
                    />
                  </div>
                </div>
              </div>

              {/* Submit Button */}
              <div className="pt-8 text-center border-t border-gray-200">
                <Button 
                  type="submit"
                  disabled={isSubmitting}
                  className="bg-green-600 hover:bg-green-700 disabled:bg-green-400 text-white text-lg px-12 py-4 h-auto font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 disabled:transform-none disabled:cursor-not-allowed"
                >
                  {isSubmitting ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent mr-3"></div>
                      Enviando...
                    </>
                  ) : (
                    <>✓ Confirmar e Enviar</>
                  )}
                </Button>
              </div>
            </form>
          </div>
        </div>

        {/* Footer Info */}
        <div className="text-center mt-8 text-sm text-gray-500">
          <p>© 2025 UNIAGRO - Todos os dados são protegidos e tratados com confidencialidade</p>
        </div>
      </div>
    </div>
  );
};