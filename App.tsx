
import React, { useState, useEffect } from 'react';
import { generateProductData, getApiKey } from './services/geminiService';
import { GeneratedContent, LoadingState, ProductFormData } from './types';
import { ResultCard } from './components/ResultCard';
import { SeoDisplay } from './components/SeoDisplay';
import { SourceList } from './components/SourceList';
import { ImageGallery } from './components/ImageGallery';
import { BulkGenerator } from './components/BulkGenerator';

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

const UserIcon = () => (
   <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
      <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
   </svg>
);

const TableCellsIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
    <path strokeLinecap="round" strokeLinejoin="round" d="M3.375 19.5h17.25m-17.25 0a1.125 1.125 0 0 1-1.125-1.125M3.375 19.5h7.5c.621 0 1.125-.504 1.125-1.125m-9.75 0V5.625m0 12.75v-1.5c0-.621.504-1.125 1.125-1.125m18.375 2.625V5.625m0 12.75c0 .621-.504 1.125-1.125 1.125m1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125m0 3.75h-7.5A1.125 1.125 0 0 1 12 18.375m9.75-12.75c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125m19.5 0v1.5c0 .621-.504 1.125-1.125 1.125M2.25 5.625v1.5c0 .621.504 1.125 1.125 1.125m0 0h17.25m-17.25 0h7.5c.621 0 1.125.504 1.125 1.125M3.375 8.25c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125m17.25-3.75h-7.5c-.621 0-1.125.504-1.125 1.125m8.625-1.125c.621 0 1.125.504 1.125 1.125v1.5c0 .621-.504 1.125-1.125 1.125m-17.25 0h7.5m-7.5 0c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125M12 10.875v-1.5m0 1.5c0 .621-.504 1.125-1.125 1.125M12 10.875c0 .621.504 1.125 1.125 1.125m-2.25 0c.621 0 1.125.504 1.125 1.125M13.125 12h7.5m-7.5 0c-.621 0-1.125.504-1.125 1.125M20.625 12c.621 0 1.125.504 1.125 1.125v1.5c0 .621-.504 1.125-1.125 1.125m-17.25 0h7.5M12 14.625v-1.5m0 1.5c0 .621-.504 1.125-1.125 1.125M12 14.625c0 .621.504 1.125 1.125 1.125m-2.25 0c.621 0 1.125.504 1.125 1.125m0 1.5v-1.5m0 1.5c0 .621.504 1.125 1.125 1.125M12 18.375v-1.5m0 1.5c0 .621-.504 1.125-1.125 1.125" />
  </svg>
);

const CogIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.324.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 0 1 1.37.49l1.296 2.247a1.125 1.125 0 0 1-.26 1.431l-1.003.827c-.293.24-.438.613-.431.992a6.759 6.759 0 0 1 0 .255c-.007.378.138.75.43.99l1.005.828c.424.35.534.954.26 1.43l-1.298 2.247a1.125 1.125 0 0 1-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.57 6.57 0 0 1-.22.128c-.331.183-.581.495-.644.869l-.213 1.28c-.09.543-.56.941-1.11.941h-2.594c-.55 0-1.02-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 0 1-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 0 1-1.369-.49l-1.297-2.247a1.125 1.125 0 0 1 .26-1.431l1.004-.827c.292-.24.437-.613.43-.992a6.932 6.932 0 0 1 0-.255c.007-.378-.138-.75-.43-.99l-1.004-.828a1.125 1.125 0 0 1-.26-1.43l1.297-2.247a1.125 1.125 0 0 1 1.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.087.22-.128.332-.183.582-.495.644-.869l.214-1.281Z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
    </svg>
);

const KeyIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 5.25a3 3 0 0 1 3 3m3 0a6 6 0 0 1-7.029 5.912c-.563-.097-1.159.026-1.563.43L10.5 17.25H8.25v2.25H6v2.25H2.25v-2.818c0-.597.237-1.17.659-1.591l6.499-6.499c.404-.404.527-1 .43-1.563A6 6 0 1 1 21.75 8.25Z" />
    </svg>
);


// Settings Modal Component
const ApiKeyModal = ({ 
    isOpen, 
    onClose, 
    initialKey 
}: { 
    isOpen: boolean; 
    onClose: (key: string) => void;
    initialKey: string;
}) => {
    const [key, setKey] = useState(initialKey);
    
    useEffect(() => {
        setKey(initialKey);
    }, [initialKey, isOpen]);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-fade-in-up">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6">
                <div className="flex items-center gap-3 mb-4 text-brand-600">
                    <div className="p-2 bg-brand-50 rounded-lg">
                        <KeyIcon />
                    </div>
                    <h3 className="text-xl font-bold text-slate-800">Configurar API Key</h3>
                </div>
                
                <p className="text-sm text-slate-500 mb-6 leading-relaxed">
                    Para usar o ProductGenius, você precisa de uma chave de API do Google Gemini. 
                    Seu uso é gratuito dentro dos limites do plano gratuito.
                </p>

                <div className="space-y-3 mb-6">
                    <label className="block text-sm font-bold text-slate-700">Sua Chave API (Gemini)</label>
                    <input 
                        type="password" 
                        value={key}
                        onChange={(e) => setKey(e.target.value)}
                        placeholder="Ex: AIzaSy..."
                        className="w-full p-3 rounded-lg border border-slate-300 focus:border-brand-500 focus:ring-4 focus:ring-brand-500/10 outline-none transition-all font-mono text-sm"
                    />
                    <a 
                        href="https://aistudio.google.com/app/apikey" 
                        target="_blank" 
                        rel="noreferrer"
                        className="text-xs text-brand-600 hover:text-brand-800 underline flex items-center gap-1"
                    >
                        Obter chave no Google AI Studio &rarr;
                    </a>
                </div>

                <div className="flex justify-end gap-3">
                    <button 
                        onClick={() => onClose(key)}
                        className="px-5 py-2.5 bg-brand-600 text-white rounded-xl font-bold text-sm hover:bg-brand-700 transition-colors shadow-lg shadow-brand-500/20"
                    >
                        Salvar e Continuar
                    </button>
                </div>
            </div>
        </div>
    );
};

export default function App() {
  const [activeTab, setActiveTab] = useState<'single' | 'bulk'>('single');
  
  // Single Mode State
  const [formData, setFormData] = useState<ProductFormData>({ productName: '', manufacturer: '' });
  const [loadingState, setLoadingState] = useState<LoadingState>(LoadingState.IDLE);
  const [result, setResult] = useState<GeneratedContent | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Settings State
  const [showSettings, setShowSettings] = useState(false);
  const [apiKey, setApiKey] = useState('');

  // Check for API Key on load
  useEffect(() => {
    const currentKey = getApiKey();
    if (currentKey) {
        setApiKey(currentKey);
    } else {
        // If no key found anywhere, show settings automatically
        setShowSettings(true);
    }
  }, []);

  const handleSaveKey = (newKey: string) => {
    if (newKey) {
        localStorage.setItem('gemini_api_key', newKey);
        setApiKey(newKey);
        setShowSettings(false);
    } else {
        alert("Por favor, insira uma chave válida.");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.productName || !formData.manufacturer) return;
    
    // Double check key before submitting
    if (!getApiKey()) {
        setShowSettings(true);
        return;
    }

    setLoadingState(LoadingState.LOADING);
    setError(null);
    setResult(null);

    try {
      const data = await generateProductData(formData.productName, formData.manufacturer);
      setResult(data);
      setLoadingState(LoadingState.SUCCESS);
    } catch (err: any) {
      const errMsg = err.message || 'Ocorreu um erro inesperado.';
      
      if (errMsg === 'API_KEY_MISSING') {
          setError('Chave de API não configurada. Por favor, clique no ícone de engrenagem para configurar.');
          setShowSettings(true);
      } else {
          setError(errMsg);
      }
      setLoadingState(LoadingState.ERROR);
    }
  };

  return (
    <div className="min-h-screen pb-20 selection:bg-brand-100 selection:text-brand-900">
      
      <ApiKeyModal 
        isOpen={showSettings} 
        onClose={handleSaveKey} 
        initialKey={apiKey}
      />

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
          
          <button 
            onClick={() => setShowSettings(true)}
            className="p-2 text-slate-400 hover:text-brand-600 hover:bg-brand-50 rounded-lg transition-all"
            title="Configurar API Key"
          >
            <CogIcon />
          </button>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-28">
        
        {/* Hero Section */}
        <div className="text-center mb-10 max-w-3xl mx-auto">
          <h2 className="text-4xl sm:text-5xl font-display font-extrabold text-slate-900 tracking-tight leading-tight mb-4">
            Crie conteúdo de produto <br/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-600 to-purple-600">em segundos</span>
          </h2>
          <p className="text-lg text-slate-600 leading-relaxed">
            Gere descrições de marketing persuasivas, especificações técnicas precisas e SEO otimizado com a potência do Google Gemini.
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="flex justify-center mb-8">
           <div className="bg-slate-100 p-1 rounded-xl flex gap-1">
              <button 
                onClick={() => setActiveTab('single')}
                className={`flex items-center gap-2 px-6 py-2.5 rounded-lg text-sm font-bold transition-all ${activeTab === 'single' ? 'bg-white text-brand-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
              >
                <UserIcon />
                Individual
              </button>
              <button 
                onClick={() => setActiveTab('bulk')}
                className={`flex items-center gap-2 px-6 py-2.5 rounded-lg text-sm font-bold transition-all ${activeTab === 'bulk' ? 'bg-white text-brand-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
              >
                <TableCellsIcon />
                Massa (Excel)
              </button>
           </div>
        </div>

        {/* --- BULK MODE --- */}
        {activeTab === 'bulk' ? (
          <BulkGenerator />
        ) : (
          /* --- SINGLE MODE --- */
          <>
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
                    
                    {/* Image Gallery (New) */}
                    <ImageGallery images={result.images} productName={formData.productName} />

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

                    {/* Specs Section - NOW HTML */}
                    <ResultCard 
                      title="Especificações Técnicas" 
                      icon={<CpuChipIcon />}
                      contentToCopy={result.specs}
                      accentColor="bg-purple-500"
                    >
                       <div 
                         className="prose prose-slate max-w-none prose-table:w-full prose-table:border-collapse prose-td:border prose-td:border-slate-100 prose-td:p-3 prose-td:text-slate-600 prose-th:border prose-th:border-slate-100 prose-th:p-3 prose-th:bg-slate-50 prose-th:text-slate-700 prose-th:font-semibold prose-th:text-left prose-tr:hover:bg-slate-50/50 transition-colors"
                         dangerouslySetInnerHTML={{ __html: result.specs }}
                       />
                       {!result.specs && <p className="text-slate-500 italic text-center py-4">Nenhuma especificação técnica encontrada nas fontes.</p>}
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
          </>
        )}
      </main>
    </div>
  );
}
