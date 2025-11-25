import React, { useState } from 'react';

interface SeoDisplayProps {
  title: string;
  description: string;
  keywords: string[];
}

const CopyButton = ({ text }: { text: string }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <button
      onClick={handleCopy}
      className={`ml-2 p-1.5 rounded-md transition-all ${
        copied
          ? 'bg-emerald-100 text-emerald-700'
          : 'bg-slate-100 text-slate-500 hover:bg-brand-100 hover:text-brand-600'
      }`}
      title="Copiar texto"
    >
      {copied ? (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-3.5 h-3.5">
          <path fillRule="evenodd" d="M16.704 4.153a.75.75 0 0 1 .143 1.052l-8 10.5a.75.75 0 0 1-1.127.075l-4.5-4.5a.75.75 0 0 1 1.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 0 1 1.05-.143Z" clipRule="evenodd" />
        </svg>
      ) : (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-3.5 h-3.5">
          <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 17.25v3.375c0 .621-.504 1.125-1.125 1.125h-9.75a1.125 1.125 0 0 1-1.125-1.125V7.875c0-.621.504-1.125 1.125-1.125H6.75a9.06 9.06 0 0 1 1.5.124m7.5 10.376h3.375c.621 0 1.125-.504 1.125-1.125V11.25c0-4.46-3.243-8.161-7.5-8.876a9.06 9.06 0 0 0-1.5-.124H9.375c-.621 0-1.125.504-1.125 1.125v3.5m7.5 10.375H9.375a1.125 1.125 0 0 1-1.125-1.125v-9.25m12 6.625v-1.875a3.375 3.375 0 0 0-3.375-3.375h-1.5" />
        </svg>
      )}
    </button>
  );
};

export const SeoDisplay: React.FC<SeoDisplayProps> = ({ title, description, keywords }) => {
  return (
    <div className="space-y-6">
      {/* Title Tag */}
      <div className="group">
        <div className="flex justify-between items-center mb-1.5">
          <div className="flex items-center">
            <span className="w-1 h-4 bg-brand-500 rounded-full mr-2"></span>
            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Meta Title</label>
            <CopyButton text={title} />
          </div>
          <span className={`text-xs font-medium ${title.length > 60 ? 'text-amber-500' : 'text-slate-400'}`}>
            {title.length} / 60
          </span>
        </div>
        <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 text-sm font-medium leading-relaxed break-words hover:border-brand-300 transition-colors">
          {title}
        </div>
      </div>

      {/* Description Tag */}
      <div className="group">
        <div className="flex justify-between items-center mb-1.5">
          <div className="flex items-center">
            <span className="w-1 h-4 bg-purple-500 rounded-full mr-2"></span>
            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Meta Description</label>
            <CopyButton text={description} />
          </div>
          <span className={`text-xs font-medium ${description.length > 160 ? 'text-amber-500' : 'text-slate-400'}`}>
            {description.length} / 160
          </span>
        </div>
        <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg text-slate-600 text-sm leading-relaxed hover:border-brand-300 transition-colors">
          {description}
        </div>
      </div>

      {/* Keywords */}
      <div>
        <div className="flex items-center mb-2.5">
           <span className="w-1 h-4 bg-emerald-500 rounded-full mr-2"></span>
           <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block">Palavras-Chave</label>
           <CopyButton text={keywords.join(', ')} />
        </div>
        <div className="flex flex-wrap gap-2">
          {keywords.map((keyword, idx) => (
            <span 
              key={idx} 
              className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-white text-slate-700 border border-slate-200 shadow-sm hover:border-emerald-300 hover:text-emerald-700 transition-colors cursor-default"
            >
              {keyword}
            </span>
          ))}
        </div>
      </div>
      
      {/* Preview Snippet */}
      <div className="mt-8 pt-6 border-t border-slate-100">
        <label className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4 block">Visualização no Google</label>
        
        {/* Google SERP Card */}
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow cursor-pointer">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-7 h-7 rounded-full bg-slate-100 flex items-center justify-center border border-slate-200">
               <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4 text-slate-400">
                <path fillRule="evenodd" d="M7.5 6a4.5 4.5 0 1 1 9 0 4.5 4.5 0 0 1-9 0ZM3.751 20.105a8.25 8.25 0 0 1 16.498 0 .75.75 0 0 1-.437.695A18.683 18.683 0 0 1 12 22.5c-2.786 0-5.433-.608-7.812-1.7a.75.75 0 0 1-.437-.695Z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="flex flex-col leading-tight">
              <span className="text-sm font-medium text-slate-800">Seu Site</span>
              <span className="text-xs text-slate-500">https://seusite.com.br › produto</span>
            </div>
            <div className="ml-auto">
               <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4 text-slate-400">
                <path d="M10 3a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3ZM10 8.5a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3ZM11.5 15.5a1.5 1.5 0 1 0-3 0 1.5 1.5 0 0 0 3 0Z" />
              </svg>
            </div>
          </div>
          <h3 className="text-xl text-[#1a0dab] font-normal hover:underline truncate leading-snug">
            {title || "Título do Produto | Exemplo de Loja"}
          </h3>
          <p className="text-sm text-[#4d5156] mt-1 leading-normal line-clamp-2">
            {description || "Esta é uma prévia de como a descrição do seu produto aparecerá nos resultados de pesquisa do Google. Otimize para aumentar o CTR."}
          </p>
        </div>
      </div>
    </div>
  );
};