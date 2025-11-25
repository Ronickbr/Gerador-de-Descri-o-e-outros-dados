import React, { useState } from 'react';

interface ResultCardProps {
  title: string;
  icon: React.ReactNode;
  children: React.ReactNode;
  className?: string;
  contentToCopy?: string;
  accentColor?: string;
}

export const ResultCard: React.FC<ResultCardProps> = ({ 
  title, 
  icon, 
  children, 
  className = "", 
  contentToCopy,
  accentColor = "bg-brand-500"
}) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    if (contentToCopy) {
      navigator.clipboard.writeText(contentToCopy);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className={`bg-white rounded-2xl shadow-lg shadow-slate-200/50 border border-slate-100 overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all duration-300 ${className}`}>
      {/* Colored Top Border/Accent */}
      <div className={`h-1.5 w-full ${accentColor}`}></div>
      
      <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between gap-4 bg-gradient-to-r from-slate-50/50 to-white">
        <div className="flex items-center gap-3">
          <div className={`text-slate-500 bg-white p-2 rounded-lg border border-slate-100 shadow-sm`}>
            {icon}
          </div>
          <h3 className="font-display font-bold text-slate-800 text-lg">{title}</h3>
        </div>
        
        {contentToCopy && (
          <button
            onClick={handleCopy}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wide transition-all duration-200 ${
              copied 
                ? "bg-emerald-100 text-emerald-700 border border-emerald-200" 
                : "bg-white text-slate-500 border border-slate-200 hover:border-brand-300 hover:text-brand-600 hover:shadow-sm"
            }`}
            title="Copiar para área de transferência"
          >
            {copied ? (
              <>
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
                  <path fillRule="evenodd" d="M16.704 4.153a.75.75 0 0 1 .143 1.052l-8 10.5a.75.75 0 0 1-1.127.075l-4.5-4.5a.75.75 0 0 1 1.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 0 1 1.05-.143Z" clipRule="evenodd" />
                </svg>
                <span>Copiado!</span>
              </>
            ) : (
              <>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.666 3.888A2.25 2.25 0 0 0 13.5 2.25h-3c-1.03 0-1.9.693-2.166 1.638m7.332 0c.055.194.084.4.084.612v0a.75.75 0 0 1-.75.75H9a.75.75 0 0 1-.75-.75v0c0-.212.03-.418.084-.612m7.332 0c.646.049 1.288.11 1.927.184 1.1.128 1.907 1.077 1.907 2.185V19.5a2.25 2.25 0 0 1-2.25 2.25H6.75A2.25 2.25 0 0 1 4.5 19.5V6.257c0-1.108.806-2.057 1.907-2.185a48.208 48.208 0 0 1 1.927-.184" />
                </svg>
                <span>Copiar</span>
              </>
            )}
          </button>
        )}
      </div>
      <div className="p-6">
        {children}
      </div>
    </div>
  );
};