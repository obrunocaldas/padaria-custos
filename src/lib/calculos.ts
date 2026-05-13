import { Ingrediente, ReceitaIngrediente, Unidade } from '@/types';

export function toBase(qtd: number, unit: Unidade): { val: number; base: string } {
  if (unit === 'g')  return { val: qtd / 1000, base: 'kg' };
  if (unit === 'ml') return { val: qtd / 1000, base: 'l' };
  if (unit === 'dz') return { val: qtd * 12,   base: 'un' };
  return { val: qtd, base: unit };
}

export function precoBase(ing: Ingrediente): number {
  const b = toBase(ing.qtd, ing.unidade);
  return b.val > 0 ? ing.preco / b.val : 0;
}

export function custoRef(ref: ReceitaIngrediente, ings: Ingrediente[]): number {
  const ing = ings.find(i => i.id === ref.ingrediente_id);
  if (!ing) return 0;
  const rb = toBase(ref.qtd, ref.unidade);
  const ib = toBase(ing.qtd, ing.unidade);
  if (rb.base !== ib.base) return 0;
  return precoBase(ing) * rb.val;
}

export function custoTotalReceita(
  refs: ReceitaIngrediente[],
  ings: Ingrediente[]
): number {
  return refs.reduce((s, r) => s + custoRef(r, ings), 0);
}

export function formatBRL(value: number, decimals = 2): string {
  return value.toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });
}
