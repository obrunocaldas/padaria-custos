'use client';

import { useState } from 'react';
import Ingredientes from '@/components/Ingredientes';
import Receitas from '@/components/Receitas';
import Resumo from '@/components/Resumo';

type Tab = 'ingredientes' | 'receitas' | 'resumo';

const tabs: { id: Tab; label: string; icon: string }[] = [
  { id: 'ingredientes', label: 'Ingredientes', icon: '🧂' },
  { id: 'receitas',    label: 'Receitas',      icon: '📋' },
  { id: 'resumo',      label: 'Resumo',        icon: '📊' },
];

export default function Home() {
  const [activeTab, setActiveTab] = useState<Tab>('ingredientes');

  return (
    <div>
      {/* Tabs */}
      <div className="flex gap-1 border-b border-stone-200 mb-6">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-4 py-2.5 text-sm font-medium border-b-2 transition-colors -mb-px ${
              activeTab === tab.id
                ? 'border-stone-900 text-stone-900'
                : 'border-transparent text-stone-500 hover:text-stone-700'
            }`}
          >
            <span>{tab.icon}</span>
            {tab.label}
          </button>
        ))}
      </div>

      {/* Conteúdo */}
      {activeTab === 'ingredientes' && <Ingredientes />}
      {activeTab === 'receitas'    && <Receitas />}
      {activeTab === 'resumo'      && <Resumo />}
    </div>
  );
}
