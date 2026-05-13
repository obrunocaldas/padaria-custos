'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { Ingrediente, Receita } from '@/types';
import { custoTotalReceita, formatBRL } from '@/lib/calculos';

export default function Resumo() {
  const [receitas, setReceitas] = useState<Receita[]>([]);
  const [ings, setIngs] = useState<Ingrediente[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetch() {
      const [{ data: rData }, { data: iData }] = await Promise.all([
        supabase.from('receitas').select('*, receita_ingredientes(*, ingrediente:ingredientes(*))').order('nome'),
        supabase.from('ingredientes').select('*'),
      ]);
      setReceitas(rData ?? []);
      setIngs(iData ?? []);
      setLoading(false);
    }
    fetch();
  }, []);

  if (loading) return <p className="text-center text-stone-400 py-8">Carregando...</p>;
  if (receitas.length === 0) return <p className="text-center text-stone-400 py-8">Nenhuma receita cadastrada ainda.</p>;

  const dados = receitas.map(rec => {
    const total = custoTotalReceita(rec.receita_ingredientes ?? [], ings);
    return { ...rec, custoReal: total, custoUn: total / rec.rendimento };
  }).sort((a, b) => b.custoReal - a.custoReal);

  const maisCaro = dados[0];
  const maisBarato = dados[dados.length - 1];

  return (
    <div>
      {/* Métricas */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
        <div className="card bg-stone-100">
          <p className="text-xs text-stone-500 mb-1">Receitas</p>
          <p className="text-2xl font-semibold">{receitas.length}</p>
        </div>
        <div className="card bg-stone-100">
          <p className="text-xs text-stone-500 mb-1">Ingredientes</p>
          <p className="text-2xl font-semibold">{ings.length}</p>
        </div>
        <div className="card bg-stone-100">
          <p className="text-xs text-stone-500 mb-1">Mais caro</p>
          <p className="text-sm font-semibold truncate">{maisCaro.nome}</p>
        </div>
        <div className="card bg-stone-100">
          <p className="text-xs text-stone-500 mb-1">Mais barato</p>
          <p className="text-sm font-semibold truncate">{maisBarato.nome}</p>
        </div>
      </div>

      {/* Tabela comparativa */}
      <div className="card overflow-x-auto">
        <h2 className="font-semibold text-stone-800 mb-4">Comparativo de custos</h2>
        <table className="w-full text-sm">
          <thead>
            <tr className="text-xs text-stone-500 border-b border-stone-100">
              <th className="text-left py-2 px-2 font-medium">Produto</th>
              <th className="text-left py-2 px-2 font-medium">Rendimento</th>
              <th className="text-left py-2 px-2 font-medium">Custo total</th>
              <th className="text-left py-2 px-2 font-medium">Por unidade</th>
              <th className="text-left py-2 px-2 font-medium">Itens</th>
            </tr>
          </thead>
          <tbody>
            {dados.map(rec => (
              <tr key={rec.id} className="border-b border-stone-50 last:border-0">
                <td className="py-3 px-2 font-medium">{rec.nome}</td>
                <td className="py-3 px-2 text-stone-600">{rec.rendimento} un.</td>
                <td className="py-3 px-2">
                  <span className="badge-amber">{formatBRL(rec.custoReal)}</span>
                </td>
                <td className="py-3 px-2">
                  <span className="badge-green">{formatBRL(rec.custoUn)}</span>
                </td>
                <td className="py-3 px-2 text-stone-600">{rec.receita_ingredientes?.length ?? 0}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
