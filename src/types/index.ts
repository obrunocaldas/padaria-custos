export type Unidade = 'kg' | 'g' | 'l' | 'ml' | 'un' | 'dz';

export interface Ingrediente {
  id: string;
  nome: string;
  preco: number;
  qtd: number;
  unidade: Unidade;
  created_at?: string;
}

export interface ReceitaIngrediente {
  id: string;
  receita_id: string;
  ingrediente_id: string;
  qtd: number;
  unidade: Unidade;
  ingrediente?: Ingrediente;
}

export interface Receita {
  id: string;
  nome: string;
  rendimento: number;
  created_at?: string;
  receita_ingredientes?: ReceitaIngrediente[];
}
