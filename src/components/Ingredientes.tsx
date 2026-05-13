'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { Ingrediente, Unidade } from '@/types';
import { precoBase, toBase, formatBRL } from '@/lib/calculos';

const UNIDADES: Unidade[] = ['kg', 'g', 'l', 'ml', 'un', 'dz'];

export default function Ingredientes() {
  const [ings, setIngs]       = useState<Ingrediente[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving]   = useState(false);

  const [nome, setNome]       = useState('');
  const [preco, setPreco]     = useState('');
  const [qtd, setQtd]         = useState('');
  const [unidade, setUnidade] = useState<Unidade>('kg');

  useEffect(() => { fetchIngs(); }, []);

  async function fetchIngs() {
    setLoading(true);
    const { data } = await supabase
      .from('ingredientes')
      .select('*')
      .order('nome');
    setIngs(data ?? []);
    setLoading(false);
  }

  async function addIngrediente() {
    if (!nome.trim() || !preco || !qtd) return alert('Preencha todos os campos.');
    const p = parseFloat(preco);
    const q = parseFloat(qtd);
    if (isNaN(p) || p < 0 || isNaN(q) || q <= 0) return alert('Valores inválidos.');

    setSaving(true);
    const { error } = await supabase.from('ingredientes').insert({
      nome: nome.trim(), preco: p, qtd: q, unidade,
    });
    if (error) { alert('Erro ao salvar: ' + error.message); }
    else { setNome(''); setPreco(''); setQtd(''); await fetchIngs(); }
    setSaving(false);
  }

  async function removerIngrediente(id: string) {
    if (!confirm('Remover este ingrediente?')) return;
    const { error } = await supabase.from('ingredientes').delete().eq('id', id);
    if (error) alert('Erro ao remover. Verifique se não está em uso em alguma receita.');
    else await fetchIngs();
  }

  return (
    <div>
      {/* Formulário */}
      <div className="card mb-6">
        <h2 className="font-semibold text-stone-800 mb-4">Adicionar ingrediente</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3">
          <div>
            <label className="label">Nome</label>
            <input className="input" placeholder="ex: Farinha de trigo" value={nome} onChange={e => setNome(e.target.value)} />
          </div>
          <div>
            <label className="label">Preço pago (R$)</label>
            <input className="input" type="number" min="0" step="0.01" placeholder="0,00" value={preco} onChange={e => setPreco(e.target.value)} />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-3 mb-4">
          <div>
            <label className="label">Quantidade</label>
            <input className="input" type="number" min="0" step="0.001" placeholder="1" value={qtd} onChange={e => setQtd(e.target.value)} />
          </div>
          <div>
            <label className="label">Unidade</label>
            <select className="input" value={unidade} onChange={e => setUnidade(e.target.value as Unidade)}>
              {UNIDADES.map(u => <option key={u} value={u}>{u}</option>)}
            </select>
          </div>
        </div>
        <button className="btn-primary" onClick={addIngrediente} disabled={saving}>
          {saving ? 'Salvando...' : '+ Adicionar'}
        </button>
      </div>

      {/* Lista */}
      {loading ? (
        <p className="text-center text-stone-400 py-8">Carregando...</p>
      ) : ings.length === 0 ? (
        <p className="text-center text-stone-400 py-8">Nenhum ingrediente cadastrado ainda.</p>
      ) : (
        <div className="card overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-xs text-stone-500 border-b border-stone-100">
                <th className="text-left py-2 px-2 font-medium">Ingrediente</th>
                <th className="text-left py-2 px-2 font-medium">Preço pago</th>
                <th className="text-left py-2 px-2 font-medium">Quantidade</th>
                <th className="text-left py-2 px-2 font-medium">Custo unitário</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {ings.map(ing => {
                const pb = precoBase(ing);
                const base = toBase(ing.qtd, ing.unidade).base;
                const label = base === 'kg' ? 'kg' : base === 'l' ? 'litro' : base;
                return (
                  <tr key={ing.id} className="border-b border-stone-50 last:border-0">
                    <td className="py-3 px-2 font-medium">{ing.nome}</td>
                    <td className="py-3 px-2 text-stone-600">{formatBRL(ing.preco)}</td>
                    <td className="py-3 px-2 text-stone-600">{ing.qtd} {ing.unidade}</td>
                    <td className="py-3 px-2">
                      <span className="badge-green">{formatBRL(pb, 4)}/{label}</span>
                    </td>
                    <td className="py-3 px-2">
                      <button className="btn-danger text-xs py-1" onClick={() => removerIngrediente(ing.id)}>
                        🗑
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
