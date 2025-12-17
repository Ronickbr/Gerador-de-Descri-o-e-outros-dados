import React, { useState } from 'react';

interface ImageGalleryProps {
  images: string[];
  productName: string;
}

export const ImageGallery: React.FC<ImageGalleryProps> = ({ images, productName }) => {
  if (!images || images.length === 0) return null;

  return (
    <div className="mb-8 animate-fade-in-up">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wider flex items-center gap-2">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
            <path fillRule="evenodd" d="M1 5.25A2.25 2.25 0 0 1 3.25 3h13.5A2.25 2.25 0 0 1 19 5.25v9.5A2.25 2.25 0 0 1 16.75 17H3.25A2.25 2.25 0 0 1 1 14.75v-9.5Zm1.5 5.81v3.69c0 .414.336.75.75.75h13.5a.75.75 0 0 0 .75-.75v-2.69l-2.22-2.219a.75.75 0 0 0-1.06 0l-1.91 1.909.47.47a.75.75 0 1 1-1.06 1.06L6.53 8.091a.75.75 0 0 0-1.06 0l-2.97 2.97ZM12 7a1 1 0 1 1-2 0 1 1 0 0 1 2 0Z" clipRule="evenodd" />
          </svg>
          Galeria de Imagens e Links
        </h3>
        <span className="text-xs font-medium text-slate-400 bg-slate-100 px-2 py-1 rounded-md">
          {images.length} imagens encontradas
        </span>
      </div>
      
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {images.map((url, idx) => (
          <ImageCard key={idx} url={url} productName={productName} index={idx} />
        ))}
      </div>
    </div>
  );
};

interface ImageCardProps {
  url: string;
  productName: string;
  index: number;
}

const ImageCard: React.FC<ImageCardProps> = ({ url, productName, index }) => {
  const [error, setError] = useState(false);
  
  // Extract domain for display
  let domain = "Link Externo";
  try {
    domain = new URL(url).hostname.replace('www.', '');
  } catch (e) {}

  return (
    <div className="group relative flex flex-col bg-white rounded-xl overflow-hidden border border-slate-200 shadow-sm hover:shadow-md transition-all h-full">
      <div className="relative aspect-square bg-slate-100 overflow-hidden w-full flex items-center justify-center">
        {!error ? (
          <img
            src={url}
            alt={`${productName} - Imagem ${index + 1}`}
            className="w-full h-full object-contain p-2 mix-blend-multiply transition-transform duration-500 group-hover:scale-110"
            onError={() => setError(true)}
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center p-4 text-center bg-slate-50">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8 text-slate-300 mb-2">
              <path strokeLinecap="round" strokeLinejoin="round" d="m2.25 15.75 5.159-5.159a2.25 2.25 0 0 1 3.182 0l5.159 5.159m-1.5-1.5 1.409-1.409a2.25 2.25 0 0 1 3.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 0 0 1.5-1.5V6a1.5 1.5 0 0 0-1.5-1.5H3.75A1.5 1.5 0 0 0 2.25 6v12a1.5 1.5 0 0 0 1.5 1.5Zm10.5-11.25h.008v.008h-.008V8.25Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z" />
            </svg>
            <span className="text-[10px] text-slate-400 font-medium leading-tight">Visualização indisponível</span>
          </div>
        )}
      </div>
      
      {/* Footer with Link */}
      <div className="p-3 border-t border-slate-100 bg-slate-50/50 mt-auto">
        <a 
          href={url} 
          target="_blank" 
          rel="noopener noreferrer"
          className="flex items-center justify-center gap-1.5 w-full text-xs font-bold text-brand-600 hover:text-brand-700 hover:underline transition-colors"
          title={url}
        >
          <span>Abrir Original</span>
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-3 h-3">
            <path fillRule="evenodd" d="M4.25 5.5a.75.75 0 0 0-.75.75v8.5c0 .414.336.75.75.75h8.5a.75.75 0 0 0 .75-.75v-4a.75.75 0 0 1 1.5 0v4A2.25 2.25 0 0 1 12.75 17h-8.5A2.25 2.25 0 0 1 2 14.75v-8.5A2.25 2.25 0 0 1 4.25 4h5a.75.75 0 0 1 0 1.5h-5Z" clipRule="evenodd" />
            <path fillRule="evenodd" d="M6.194 12.753a.75.75 0 0 0 1.06.053L16.5 4.44v2.81a.75.75 0 0 0 1.5 0v-4.5a.75.75 0 0 0-.75-.75h-4.5a.75.75 0 0 0 0 1.5h2.553l-9.056 8.194a.75.75 0 0 0-.053 1.06Z" clipRule="evenodd" />
          </svg>
        </a>
        <div className="text-[10px] text-slate-400 text-center mt-1 truncate px-1" title={domain}>
          {domain}
        </div>
      </div>
    </div>
  );
};