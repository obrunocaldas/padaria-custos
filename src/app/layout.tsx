import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Padaria — Gestão de Custos',
  description: 'Controle o custo de ingredientes e receitas da sua padaria artesanal',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <body className={inter.className}>
        <header className="border-b border-stone-200 bg-#006eb2">
          <div className="max-w-4xl mx-auto px-4 py-4 flex items-center gap-3">
            <img src="https://drive.google.com/file/d/1hsPP090_UivJ3sYQChi8EF5AXNPXcu7K/view?usp=share_link" alt="Logo" className="w-10 h-10" />
            <div>
              <h1 className="font-semibold text-stone-900 leading-tight">Gestão de Custos</h1>
              <p className="text-xs text-stone-500">Padaria Artesanal</p>
            </div>
          </div>
        </header>
        <main className="max-w-4xl mx-auto px-4 py-6">{children}</main>
      </body>
    </html>
  );
}
