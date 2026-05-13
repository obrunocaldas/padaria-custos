'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { Ingrediente, Receita, ReceitaIngrediente, Unidade } from '@/types';
import { custoRef, custoTotalReceita, formatBRL, toBase } from '@/lib/calculos';

const UNIDADES: Unidade[] = ['g', 'kg', 'ml', 'l', 'un', 'dz'];

export default function Receitas() {
  const [receitas, setReceitas]   = useState<Receita[]>([]);
  const [ings, setIngs]           = useState<Ingrediente[]>([]);
  const [loading, setLoading]     = useState(true);
  const [editando, setEditando]   = useState<Receita | null>(null);
  const [saving, setSaving]       = useState(false);

  // Form nova receita
  const [nomeRec, setNomeRec]       = useState('');
  const [rendimento, setRendimento] = useState('');

  // Form novo ingrediente na receita
  const [ingSel, setIngSel]   = useState('');
  const [ingQtd, setIngQtd]   = useState('');
  const [ingUnit, setIngUnit] = useState<Unidade>('g');

  useEffect(() => {
    fetchTudo();
  }, []);

  async function fetchTudo() {
    setLoading(true);
    const [{ data: rData }, { data: iData }] = await Promise.all([
      supabase
        .from('receitas')
        .select('*, receita_ingredientes(*, ingrediente:ingredientes(*))')
        .order('nome'),
      supabase.from('ingredientes').select('*').order('nome'),
    ]);
    setReceitas(rData ?? []);
    setIngs(iData ?? []);
    setLoading(false);
  }

  async function criarReceita() {
    if (!nomeRec.trim() || !rendimento) return alert('Preencha nome e rendimento.');
    const r = parseInt(rendimento);
    if (isNaN(r) || r < 1) return alert('Rendimento inválido.');

    setSaving(true);
    const { data, error } = await supabase
      .from('receitas')
      .insert({ nome: nomeRec.trim(), rendimento: r })
      .select()
      .single();

    if (error || !data) { alert('Erro ao criar receita.'); setSaving(false); return; }
    setNomeRec(''); setRendimento('');
    setEditando({ ...data, receita_ingredientes: [] });
    await fetchTudo();
    setSaving(false);
  }

  async function addIngredienteReceita() {
    if (!editando) return;
    if (!ingSel || !ingQtd) return alert('Selecione o ingrediente e a quantidade.');
    const q = parseFloat(ingQtd);
    if (isNaN(q) || q <= 0) return alert('Quantidade inválida.');

    // Verificar compatibilidade de unidade
    const ing = ings.find(i => i.id === ingSel);
    if (ing) {
      const rb = toBase(q, ingUnit).base;
      const ib = toBase(ing.qtd, ing.unidade).base;
      if (rb !== ib) {
        alert(`Atenção: unidade incompatível!\n"${ing.nome}" está cadastrado em ${ing.unidade} (base: ${ib}), mas você está usando ${ingUnit} (base: ${rb}).\nEscolha uma unidade compatível.`);
        return;
      }
    }

    setSaving(true);
    // Verificar se já existe
    const existing = editando.receita_ingredientes?.find(r => r.ingrediente_id === ingSel);
    if (existing) {
      await supabase.from('receita_ingredientes').update({ qtd: q, unidade: ingUnit }).eq('id', existing.id);
    } else {
      await supabase.from('receita_ingredientes').insert({
        receita_id: editando.id,
        ingrediente_id: ingSel,
        qtd: q,
        unidade: ingUnit,
      });
    }
    setIngQtd('');
    await refreshEditando(editando.id);
    setSaving(false);
  }

  async function refreshEditando(id: string) {
    const { data } = await supabase
      .from('receitas')
      .select('*, receita_ingredientes(*, ingrediente:ingredientes(*))')
      .eq('id', id)
      .single();
    if (data) setEditando(data);
    await fetchTudo();
  }

  async function remIngReceita(refId: string) {
    if (!editando) return;
    await supabase.from('receita_ingredientes').delete().eq('id', refId);
    await refreshEditando(editando.id);
  }

  async function removerReceita(id: string) {
    if (!confirm('Remover esta receita?')) return;
    await supabase.from('receitas').delete().eq('id', id);
    if (editando?.id === id) setEditando(null);
    await fetchTudo();
  }

  const refs = editando?.receita_ingredientes ?? [];
  const totalAtual = custoTotalReceita(
    refs.map(r => ({ ...r, ingrediente_id: r.ingrediente_id })),
    ings
  );

  return (
    <div>
      {/* Criar receita */}
      <div className="card mb-6">
        <h2 className="font-semibold text-stone-800 mb-4">Nova receita</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="sm:col-span-2">
            <label className="label">Nome do produto</label>
            <input className="input" placeholder="ex: Pão francês" value={nomeRec} onChange={e => setNomeRec(e.target.value)} />
          </div>
          <div>
            <label className="label">Rendimento (unidades)</label>
            <input className="input" type="number" min="1" placeholder="ex: 20" value={rendimento} onChange={e => setRendimento(e.target.value)} />
          </div>
        </div>
        <button className="btn-primary mt-4" onClick={criarReceita} disabled={saving}>
          + Criar receita
        </button>
      </div>

      {/* Editor de receita */}
      {editando && (
        <div className="card mb-6 border-2 border-stone-900">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h3 className="font-semibold text-stone-800">{editando.nome}</h3>
              <p className="text-xs text-stone-500">Rendimento: {editando.rendimento} unidade(s)</p>
            </div>
            <button className="btn-secondary text-xs" onClick={() => setEditando(null)}>Fechar</button>
          </div>

          {/* Adicionar ingrediente */}
          <p className="text-xs font-semibold text-stone-500 uppercase tracking-wide mb-2">Adicionar ingrediente</p>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-4">
            <div className="sm:col-span-2">
              <label className="label">Ingrediente</label>
              <select className="input" value={ingSel} onChange={e => setIngSel(e.target.value)}>
                <option value="">Selecione...</option>
                {ings.map(i => <option key={i.id} value={i.id}>{i.nome}</option>)}
              </select>
            </div>
            <div>
              <label className="label">Quantidade</label>
              <input className="input" type="number" min="0" step="0.001" placeholder="0" value={ingQtd} onChange={e => setIngQtd(e.target.value)} />
            </div>
            <div>
              <label className="label">Unidade</label>
              <select className="input" value={ingUnit} onChange={e => setIngUnit(e.target.value as Unidade)}>
                {UNIDADES.map(u => <option key={u} value={u}>{u}</option>)}
              </select>
            </div>
          </div>
          <button className="btn-primary mb-4" onClick={addIngredienteReceita} disabled={saving}>
            + Adicionar
          </button>

          {/* Ingredientes da receita */}
          {refs.length > 0 && (
            <div className="border-t border-stone-100 pt-4 mb-4">
              {refs.map(ref => {
                const ing = ings.find(i => i.id === ref.ingrediente_id);
                if (!ing) return null;
                const c = custoRef(ref, ings);
                return (
                  <div key={ref.id} className="flex items-center justify-between py-2 border-b border-stone-50 last:border-0 text-sm">
                    <span className="font-medium">{ing.nome}</span>
                    <span className="text-stone-500 text-xs">{ref.qtd} {ref.unidade}</span>
                    <span className="badge-green">{formatBRL(c, 4)}</span>
                    <button className="btn-danger text-xs py-1 px-2" onClick={() => remIngReceita(ref.id)}>✕</button>
                  </div>
                );
              })}
            </div>
          )}

          {/* Custo total */}
          <div className="flex items-baseline gap-4 pt-2 border-t border-stone-200">
            <span className="text-sm text-stone-500">Custo total da receita</span>
            <span className="text-2xl font-semibold">{formatBRL(totalAtual)}</span>
            <span className="text-sm text-stone-500">
              → {formatBRL(editando.rendimento > 0 ? totalAtual / editando.rendimento : 0)} por unidade
            </span>
          </div>
        </div>
      )}

      {/* Lista de receitas salvas */}
      {loading ? (
        <p className="text-center text-stone-400 py-8">Carregando...</p>
      ) : receitas.length === 0 ? (
        <p className="text-center text-stone-400 py-8">Nenhuma receita cadastrada ainda.</p>
      ) : (
        <div>
          <p className="text-xs font-semibold text-stone-500 uppercase tracking-wide mb-3">Receitas salvas</p>
          <div className="space-y-3">
            {receitas.map(rec => {
              const refs = rec.receita_ingredientes ?? [];
              const total = custoTotalReceita(refs, ings);
              const porUn = rec.rendimento > 0 ? total / rec.rendimento : 0;
              return (
                <div key={rec.id} className="card flex items-center justify-between flex-wrap gap-3">
                  <div>
                    <p className="font-medium">{rec.nome}</p>
                    <p className="text-xs text-stone-500 mt-0.5">
                      Rendimento: {rec.rendimento} un. &nbsp;|&nbsp;
                      Total: <strong>{formatBRL(total)}</strong> &nbsp;|&nbsp;
                      Por unidade: <strong>{formatBRL(porUn)}</strong>
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <button className="btn-secondary text-xs" onClick={() => setEditando({ ...rec })}>✏ Editar</button>
                    <button className="btn-danger text-xs" onClick={() => removerReceita(rec.id)}>🗑</button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
