// Validation utilities for the form

export const validateCPF = (cpf: string): boolean => {
  // Remove all non-digits
  const cleanCPF = cpf.replace(/\D/g, '');
  
  // Check if it has 11 digits and isn't a sequence of repeated numbers
  if (cleanCPF.length !== 11 || /^(\d)\1{10}$/.test(cleanCPF)) {
    return false;
  }

  // Calculate first check digit
  let sum = 0;
  for (let i = 0; i < 9; i++) {
    sum += parseInt(cleanCPF[i]) * (10 - i);
  }
  let firstDigit = 11 - (sum % 11);
  if (firstDigit >= 10) firstDigit = 0;

  // Calculate second check digit
  sum = 0;
  for (let i = 0; i < 10; i++) {
    sum += parseInt(cleanCPF[i]) * (11 - i);
  }
  let secondDigit = 11 - (sum % 11);
  if (secondDigit >= 10) secondDigit = 0;

  // Verify both check digits
  return firstDigit === parseInt(cleanCPF[9]) && secondDigit === parseInt(cleanCPF[10]);
};

export const validateCEP = (cep: string): boolean => {
  const cleanCEP = cep.replace(/\D/g, '');
  return cleanCEP.length === 8;
};

export const formatCPF = (value: string): string => {
  const cleanValue = value.replace(/\D/g, '');
  return cleanValue
    .substring(0, 11)
    .replace(/(\d{3})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d{1,2})$/, '$1-$2');
};

export const formatCEP = (value: string): string => {
  const cleanValue = value.replace(/\D/g, '');
  return cleanValue
    .substring(0, 8)
    .replace(/(\d{5})(\d)/, '$1-$2');
};

export const validateName = (name: string): boolean => {
  return name.trim().length >= 2;
};

export const validateTelefone = (telefone: string): boolean => {
  const cleanTelefone = telefone.replace(/\D/g, '');
  // Aceita telefones com 10 (fixo) ou 11 (celular) dígitos
  return cleanTelefone.length === 10 || cleanTelefone.length === 11;
};

export const formatTelefone = (value: string): string => {
  const cleanValue = value.replace(/\D/g, '');
  
  if (cleanValue.length <= 10) {
    // Formato para telefone fixo: (11) 1234-5678
    return cleanValue
      .substring(0, 10)
      .replace(/(\d{2})(\d)/, '($1) $2')
      .replace(/(\d{4})(\d)/, '$1-$2');
  } else {
    // Formato para celular: (11) 91234-5678
    return cleanValue
      .substring(0, 11)
      .replace(/(\d{2})(\d)/, '($1) $2')
      .replace(/(\d{5})(\d)/, '$1-$2');
  }
};