import { supabase, CadastroInicial } from '@/lib/supabase';
import { FormData } from '@/types/form';
import { v4 as uuidv4 } from 'uuid';

// Mapeamento dos valores do formulário para os valores do banco
const mapEstadoCivil = (estadoCivil: string): string => {
  // Os valores no banco estão em maiúsculas, então não precisamos mapear
  return estadoCivil;
};

const mapSexo = (sexo: string): string => {
  const mapping: { [key: string]: string } = {
    'MASCULINO': 'MASCULINO',
    'FEMININO': 'FEMININO',
    'PREFIRO_NAO_DECLARAR': 'PREFIRO NÃO DECLARAR'
  };
  return mapping[sexo] || sexo;
};

export const saveFormData = async (formData: FormData): Promise<{ success: boolean; error?: string }> => {
  try {
    // Converter os dados do formulário para o formato da tabela
    const cadastroData: CadastroInicial = {
      uuid_usuario: uuidv4(),
      timestamp_cadastro: new Date().toISOString(),
      nome_completo: formData.nomeCompleto,
      cpf: formData.cpf.replace(/\D/g, ''), // Remove formatação
      telefone: formData.telefone.replace(/\D/g, ''), // Remove formatação (parênteses, espaços, hífen)
      cep: formData.cep.replace(/\D/g, ''), // Remove formatação
      logradouro: formData.logradouro,
      numero: formData.numero,
      complemento: formData.complemento || null,
      bairro: formData.bairro,
      localidade: formData.localidade,
      estado: formData.estado,
      estado_civil: mapEstadoCivil(formData.estadoCivil),
      qtd_filhos: formData.possuiFilhos === 'sim' ? (formData.quantidadeFilhos || 0) : 0,
      sexo: mapSexo(formData.sexo),
    };

    console.log('Dados que serão enviados para o Supabase:', cadastroData);

    const { data, error } = await supabase
      .from('cadastro_inicial')
      .insert([cadastroData])
      .select();

    if (error) {
      console.error('Erro do Supabase:', error);
      
      // Tratar erros específicos com mensagens mais amigáveis
      if (error.code === '23505' && error.message.includes('cadastro_inicial_cpf_key')) {
        return { 
          success: false, 
          error: 'Este CPF já foi cadastrado anteriormente. Cada CPF pode ser registrado apenas uma vez.' 
        };
      }
      
      // Outros erros específicos podem ser adicionados aqui
      if (error.code === '23502') {
        return { 
          success: false, 
          error: 'Alguns campos obrigatórios não foram preenchidos corretamente.' 
        };
      }
      
      return { success: false, error: error.message };
    }

    console.log('Dados salvos com sucesso:', data);
    return { success: true };
    
  } catch (error) {
    console.error('Erro ao salvar dados:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Erro desconhecido'
    };
  }
};

// Função para verificar se CPF já existe no banco
export const checkCpfExists = async (cpf: string): Promise<{ exists: boolean; error?: string }> => {
  try {
    const cleanCpf = cpf.replace(/\D/g, '');
    
    const { data, error } = await supabase
      .from('cadastro_inicial')
      .select('cpf')
      .eq('cpf', cleanCpf)
      .limit(1);

    if (error) {
      console.error('Erro ao verificar CPF:', error);
      return { exists: false, error: error.message };
    }

    return { exists: data && data.length > 0 };
    
  } catch (error) {
    console.error('Erro ao verificar CPF:', error);
    return { 
      exists: false, 
      error: error instanceof Error ? error.message : 'Erro desconhecido'
    };
  }
};
