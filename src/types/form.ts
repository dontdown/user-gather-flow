export interface FormData {
  nomeCompleto: string;
  cpf: string;
  telefone: string;
  cep: string;
  logradouro: string;
  numero: string;
  complemento: string;
  bairro: string;
  localidade: string;
  estado: string;
  estadoCivil: 'SOLTEIRO' | 'CASADO' | 'DIVORCIADO' | 'VIUVO' | 'UNIAO_ESTAVEL' | '';
  possuiFilhos: 'sim' | 'nao' | '';
  quantidadeFilhos?: number;
  sexo: 'MASCULINO' | 'FEMININO' | 'PREFIRO_NAO_DECLARAR' | '';
}

export const ESTADO_CIVIL_OPTIONS = [
  { value: 'SOLTEIRO', label: 'Solteiro(a)' },
  { value: 'CASADO', label: 'Casado(a)' },
  { value: 'DIVORCIADO', label: 'Divorciado(a)' },
  { value: 'VIUVO', label: 'Viúvo(a)' },
  { value: 'UNIAO_ESTAVEL', label: 'União Estável' },
] as const;

export const SEXO_OPTIONS = [
  { value: 'MASCULINO', label: 'Masculino' },
  { value: 'FEMININO', label: 'Feminino' },
  { value: 'PREFIRO_NAO_DECLARAR', label: 'Prefiro não declarar' },
] as const;