import React, { useState } from 'react';
import { generateProductData } from './services/geminiService';
import { GeneratedContent, LoadingState, ProductFormData } from './types';
import { ResultCard } from './components/ResultCard';
import { SeoDisplay } from './components/SeoDisplay';
import { SourceList } from './components/SourceList';

// Icons
const SparklesIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
    <path fillRule="evenodd" d="M9 4.5a.75.75 0 0 1 .721.544l.813 2.846a3.75 3.75 0 0 0 2.576 2.576l2.846.813a.75.75 0 0 1 0 1.442l-2.846.813a3.75 3.75 0 0 0-2.576 2.576l-.813 2.846a.75.75 0 0 1-1.442 0l-.813-2.846a3.75 3.75 0 0 0-2.576-2.576l-2.846-.813a.75.75 0 0 1 0-1.442l2.846-.813a3.75 3.75 0 0 0 2.576-2.576l.813-2.846A.75.75 0 0 1 9 4.5ZM1.5 9.75a.75.75 0 0 1 .164-.543 1.5 1.5 0 0 0 0-2.164 6 6 0 0 1 .543-.164.75.75 0 0 1 .986.986 6 6 0 0 1-1.15 1.15.75.75 0 0 1-.543-.265Zm16.5 0a.75.75 0 0 1 .543.265 6 6 0 0 1-1.15-1.15.75.75 0 0 1 .986-.986 6 6 0 0 1 .543.164.75.75 0 0 1-1.165 1.165ZM3.75 21a.75.75 0 0 1-.543.265 6 6 0 0 1-1.15-1.15.75.75 0 0 1 .986-.986 6 6 0 0 1 .543.164.75.75 0 0 1 .164.986Zm16.5 0a.75.75 0 0 1 .164-.986 6 6 0 0 1 .543-.164.75.75 0 0 1 .986.986 6 6 0 0 1-1.15 1.15.75.75 0 0 1-.543-.265Z" clipRule="evenodd" />
  </svg>
);

const ChartBarIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
    <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 0 1 3 19.875v-6.75ZM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V8.625ZM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V4.125Z" />
  </svg>
);

const ClipboardIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 0 0 2.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 0 0-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 0 0 .75-.75 2.25 2.25 0 0 0-.1-.664m-5.8 0A2.251 2.251 0 0 1 13.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25ZM6.75 12h.008v.008H6.75V12Zm0 3h.008v.008H6.75V15Zm0 3h.008v.008H6.75V18Z" />
  </svg>
);

const CpuChipIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
    <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 3v1.5M4.5 8.25H3m18 0h-1.5M4.5 12H3m18 0h-1.5m-1.5 3.75h1.5m-1.5-7.5h1.5m-1.5-3.75h1.5M12 3v1.5m0 15v1.5m3.75-18v1.5m0 15v1.5m-9-1.5v1.5m0-15v1.5M3 15.75h1.5m1.5 3.75H4.5m15 0h-1.5" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M6 6h12v12H6z" />
  </svg>
);

export default function App() {
  const [formData, setFormData] = useState<ProductFormData>({ productName: '', manufacturer: '' });
  const [loadingState, setLoadingState] = useState<LoadingState>(LoadingState.IDLE);
  const [result, setResult] = useState<GeneratedContent | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.productName || !formData.manufacturer) return;

    setLoadingState(LoadingState.LOADING);
    setError(null);
    setResult(null);

    try {
      const data = await generateProductData(formData.productName, formData.manufacturer);
      setResult(data);
      setLoadingState(LoadingState.SUCCESS);
    } catch (err: any) {
      setError(err.message || 'Ocorreu um erro inesperado.');
      setLoadingState(LoadingState.ERROR);
    }
  };

  return (
    <div className="min-h-screen pb-20 selection:bg-brand-100 selection:text-brand-900">
      {/* Glass Header */}
      <header className="fixed w-full top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-200/60 shadow-sm">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2 group cursor-pointer" onClick={() => window.location.reload()}>
            <div className="bg-brand-600 p-2 rounded-xl text-white shadow-lg shadow-brand-500/20 group-hover:scale-105 transition-transform duration-300">
              <SparklesIcon />
            </div>
            <h1 className="text-xl font-display font-bold text-slate-800 tracking-tight">
              ProductGenius <span className="text-brand-600">AI</span>
            </h1>
          </div>
          <div className="hidden sm:flex items-center gap-2 px-3 py-1 rounded-full bg-slate-100 border border-slate-200">
            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
            <span className="text-xs font-medium text-slate-600">Gemini 2.5 Flash Online</span>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-28">
        
        {/* Hero Section */}
        <div className="text-center mb-12 max-w-3xl mx-auto">
          <h2 className="text-4xl sm:text-5xl font-display font-extrabold text-slate-900 tracking-tight leading-tight mb-4">
            Crie conteúdo de produto <br/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-600 to-purple-600">em segundos</span>
          </h2>
          <p className="text-lg text-slate-600 leading-relaxed">
            Gere descrições de marketing persuasivas, especificações técnicas precisas e SEO otimizado com a potência do Google Gemini.
          </p>
        </div>

        {/* Form Card */}
        <div className="bg-white rounded-3xl shadow-xl shadow-brand-900/5 border border-slate-100 p-6 sm:p-10 mb-12 transition-all hover:shadow-2xl hover:shadow-brand-900/10">
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-8 items-end">
            <div className="space-y-2 group">
              <label htmlFor="product" className="block text-sm font-semibold text-slate-700 ml-1 group-focus-within:text-brand-600 transition-colors">
                Nome do Produto
              </label>
              <input
                id="product"
                type="text"
                value={formData.productName}
                onChange={(e) => setFormData(prev => ({ ...prev, productName: e.target.value }))}
                placeholder="Ex: iPhone 15 Pro Max"
                className="block w-full rounded-xl border-slate-200 bg-slate-50/50 p-4 font-medium text-slate-800 placeholder-slate-400 focus:border-brand-500 focus:bg-white focus:ring-4 focus:ring-brand-500/10 transition-all outline-none"
                required
              />
            </div>
            <div className="space-y-2 group">
              <label htmlFor="manufacturer" className="block text-sm font-semibold text-slate-700 ml-1 group-focus-within:text-brand-600 transition-colors">
                Fabricante / Marca
              </label>
              <input
                id="manufacturer"
                type="text"
                value={formData.manufacturer}
                onChange={(e) => setFormData(prev => ({ ...prev, manufacturer: e.target.value }))}
                placeholder="Ex: Apple"
                className="block w-full rounded-xl border-slate-200 bg-slate-50/50 p-4 font-medium text-slate-800 placeholder-slate-400 focus:border-brand-500 focus:bg-white focus:ring-4 focus:ring-brand-500/10 transition-all outline-none"
                required
              />
            </div>
            <div className="md:col-span-2 mt-2">
              <button
                type="submit"
                disabled={loadingState === LoadingState.LOADING}
                className="w-full flex justify-center py-4 px-6 rounded-xl shadow-lg shadow-brand-500/20 text-base font-bold text-white bg-gradient-to-r from-brand-600 to-brand-500 hover:to-brand-600 hover:scale-[1.01] active:scale-[0.98] focus:outline-none focus:ring-4 focus:ring-brand-500/30 disabled:opacity-70 disabled:cursor-not-allowed disabled:shadow-none disabled:hover:scale-100 transition-all duration-200"
              >
                {loadingState === LoadingState.LOADING ? (
                  <span className="flex items-center gap-3">
                    <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Pesquisando dados reais...
                  </span>
                ) : (
                  <span className="flex items-center gap-2">
                    <SparklesIcon />
                    Gerar Conteúdo
                  </span>
                )}
              </button>
            </div>
          </form>
        </div>

        {/* Error Message */}
        {loadingState === LoadingState.ERROR && (
          <div className="rounded-2xl bg-red-50 p-6 border border-red-100 mb-8 animate-fade-in-up">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-6 w-6 text-red-500" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-4">
                <h3 className="text-base font-bold text-red-800">Erro na geração</h3>
                <div className="mt-1 text-sm text-red-700">
                  <p>{error}</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Results */}
        {loadingState === LoadingState.SUCCESS && result && (
          <div className="animate-fade-in-up">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              
              {/* Main Content Column (Left) */}
              <div className="lg:col-span-8 space-y-8">
                
                {/* Marketing Section */}
                <ResultCard 
                  title="Descrição de Marketing" 
                  icon={<ChartBarIcon />}
                  contentToCopy={result.marketing}
                  accentColor="bg-brand-500"
                >
                  <div 
                    className="prose prose-slate prose-headings:font-display prose-headings:font-bold prose-headings:text-slate-800 prose-p:text-slate-600 prose-li:text-slate-600 prose-strong:text-brand-700 prose-strong:font-bold prose-ul:marker:text-brand-500 max-w-none"
                    dangerouslySetInnerHTML={{ __html: result.marketing }}
                  />
                </ResultCard>

                {/* Specs Section */}
                <ResultCard 
                  title="Especificações Técnicas" 
                  icon={<CpuChipIcon />}
                  contentToCopy={result.specs.join('\n')}
                  accentColor="bg-purple-500"
                >
                   <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                     {result.specs.map((spec, idx) => (
                       <div key={idx} className="flex items-start gap-3 p-4 bg-slate-50 rounded-xl border border-slate-100 hover:border-brand-200 hover:bg-white hover:shadow-md transition-all duration-200">
                         <div className="mt-1.5 w-2 h-2 rounded-full bg-purple-500 shrink-0 shadow-[0_0_8px_rgba(168,85,247,0.5)]"></div>
                         <span className="text-sm text-slate-700 font-medium leading-relaxed">{spec}</span>
                       </div>
                     ))}
                   </div>
                   {result.specs.length === 0 && <p className="text-slate-500 italic text-center py-4">Nenhuma especificação técnica encontrada nas fontes.</p>}
                </ResultCard>

                <SourceList sources={result.sources} />

              </div>

              {/* Sidebar Column (Right) */}
              <div className="lg:col-span-4 space-y-6">
                 <ResultCard 
                    title="SEO Metadata" 
                    icon={<ClipboardIcon />} 
                    className="lg:sticky lg:top-24"
                    accentColor="bg-emerald-500"
                 >
                    <SeoDisplay 
                      title={result.seo.title}
                      description={result.seo.description}
                      keywords={result.seo.keywords}
                    />
                 </ResultCard>
              </div>

            </div>
          </div>
        )}
      </main>
    </div>
  );
}