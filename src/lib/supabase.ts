import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://ycmclhodbxgujrdsrijs.supabase.co'
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InljbWNsaG9kYnhndWpyZHNyaWpzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTY4NDk4NzAsImV4cCI6MjA3MjQyNTg3MH0.sSdnRA0JweUhtnRmJu_ek15QjI4t3BMHFUCSDTwj24E'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Interface para corresponder à estrutura da tabela "cadastro_inicial"
export interface CadastroInicial {
  id_linha?: number;
  uuid_usuario?: string;
  timestamp_cadastro?: string;
  nome_completo: string;
  cpf: string;
  telefone: string;
  cep: string;
  logradouro: string;
  numero: string; // Nova coluna que será adicionada
  complemento?: string;
  bairro: string;
  localidade: string;
  estado: string;
  estado_civil: string;
  qtd_filhos: number; // Campo obrigatório no banco
  sexo: string;
}
