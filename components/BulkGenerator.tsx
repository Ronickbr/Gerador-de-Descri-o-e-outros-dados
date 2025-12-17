import React, { useState, useRef } from 'react';
import * as XLSX from 'xlsx';
import { BulkUploadItem, GeneratedContent } from '../types';
import { generateProductData } from '../services/geminiService';

const DownloadIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
    <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5M16.5 12 12 16.5m0 0L7.5 12m4.5 4.5V3" />
  </svg>
);

const UploadIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8">
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 16.5V9.75m0 0 3 3.75m-3-3.75-3 3.75M12 9.75V1.5m-9 21h18a2.25 2.25 0 0 0 2.25-2.25V5.507c0-1.108-.806-2.057-1.907-2.185a48.208 48.208 0 0 0-1.926-.098 48.208 48.208 0 0 0-.964.08 4.49 4.49 0 0 0-3.328 3.328 2.25 2.25 0 0 1-2.25 2.25H9.75a2.25 2.25 0 0 1-2.25-2.25v-1.14c0-.621.504-1.125 1.125-1.125h.75c.621 0 1.125-.504 1.125-1.125V3a2.25 2.25 0 0 0-2.25-2.25h-5.25A2.25 2.25 0 0 0 3 2.25v16.5A2.25 2.25 0 0 0 5.25 21Z" />
  </svg>
);

export const BulkGenerator: React.FC = () => {
  const [items, setItems] = useState<BulkUploadItem[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Helper to normalize keys (remove accents, lowercase) for mapping
  const normalizeKey = (key: string) => 
    key.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").trim();

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      // Use arrayBuffer which is more reliable in modern browsers
      const buffer = await file.arrayBuffer();
      const workbook = XLSX.read(buffer, { type: 'array' });
      
      const sheetName = workbook.SheetNames[0];
      const sheet = workbook.Sheets[sheetName];
      const jsonData = XLSX.utils.sheet_to_json(sheet);

      if (jsonData.length === 0) {
        alert("A planilha parece estar vazia.");
        return;
      }

      // Map spreadsheet columns to our structure
      const mappedItems: BulkUploadItem[] = jsonData.map((row: any, index: number) => {
        const rowKeys = Object.keys(row);
        
        // Helper to find key safely with multiple aliases
        const getValue = (targets: string[]) => {
            const foundKey = rowKeys.find(key => {
                const normalizedRowKey = normalizeKey(key);
                return targets.some(t => normalizedRowKey.includes(normalizeKey(t)));
            });
            return foundKey ? row[foundKey] : '';
        };

        // Updated mapping to strictly follow requested columns while keeping fallbacks
        const productName = getValue(['nome', 'nome do produto', 'produto', 'product', 'name']);

        if (!productName) return null;

        return {
          id: `item-${Date.now()}-${index}`,
          productName: String(productName),
          manufacturer: String(getValue(['marca', 'fabricante', 'brand', 'manufacturer']) || ''),
          category: String(getValue(['categoria', 'category']) || ''),
          subcategory: String(getValue(['subcategoria', 'subcategory']) || ''),
          photo1: String(getValue(['url_imagem1', 'url imagem 1', 'foto1', 'image1']) || ''),
          photo2: String(getValue(['url_imagem2', 'url imagem 2', 'foto2', 'image2']) || ''),
          status: 'PENDING',
          originalData: row // Save the full row to preserve other columns
        };
      }).filter((item): item is BulkUploadItem => item !== null);

      if (mappedItems.length === 0) {
        alert("Nenhum produto válido encontrado. Verifique se a coluna 'Nome' ou 'Product' existe.");
        return;
      }

      setItems(mappedItems);
    } catch (error) {
      console.error("Erro ao ler arquivo:", error);
      alert("Erro ao processar o arquivo. Certifique-se de que é um Excel (.xlsx) ou CSV válido.");
    } finally {
      // Reset input to allow re-uploading the same file
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const downloadTemplate = () => {
    // Template exactly matching user request
    const ws = XLSX.utils.json_to_sheet([
      { 
        "Nome": "iPhone 15 Pro", 
        "Marca": "Apple", 
        "Categoria": "Celulares", 
        "description": "", // Column D intention
        "Subcategoria": "Smartphones",
        "URL_imagem1": "https://exemplo.com/foto1.jpg", 
        "URL_imagem2": "https://exemplo.com/foto2.jpg",
        "extra_col": "",
        "specifications": "", // Column I intention
        "seo_title": "",      // Column J intention
        "seo_description": "", // Column K intention
        "seo_keywords": ""     // Column L intention
      }
    ]);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Template");
    XLSX.writeFile(wb, "template_produtos.xlsx");
  };

  const processQueue = async () => {
    setIsProcessing(true);
    
    // Create a copy to update state efficiently
    const queue = [...items];

    // Rate Limiting Constants
    const BASE_DELAY = 4000; // 4 seconds between requests (~15 RPM safety margin)
    const MAX_RETRIES = 3;

    for (let i = 0; i < queue.length; i++) {
      if (queue[i].status === 'COMPLETED') continue;

      let retries = 0;
      let success = false;

      while (!success && retries <= MAX_RETRIES) {
          // Update status to processing (or retry count)
          const retryMsg = retries > 0 ? ` (Tentativa ${retries+1})` : '';
          setItems(prev => prev.map((item, idx) => idx === i ? { ...item, status: 'PROCESSING', error: retryMsg ? `Retentando...${retryMsg}` : undefined } : item));

          try {
            const item = queue[i];
            const result = await generateProductData(
                item.productName, 
                item.manufacturer, 
                item.category, 
                item.subcategory
            );

            // Update with success
            setItems(prev => prev.map((item, idx) => idx === i ? { ...item, status: 'COMPLETED', result, error: undefined } : item));
            success = true;
            
            // Standard delay between successful requests
            await new Promise(resolve => setTimeout(resolve, BASE_DELAY));

          } catch (err: any) {
            const errorMessage = String(err.message || JSON.stringify(err));
            
            // Check for Rate Limit errors (429 or Quota)
            const isRateLimit = errorMessage.includes('429') || 
                                errorMessage.toLowerCase().includes('quota') || 
                                errorMessage.includes('RESOURCE_EXHAUSTED');

            if (isRateLimit && retries < MAX_RETRIES) {
                retries++;
                // Exponential backoff: 10s, 20s, 40s
                const backoffTime = 10000 * Math.pow(2, retries - 1);
                
                // Update UI to inform user about the wait
                setItems(prev => prev.map((item, idx) => idx === i ? { ...item, status: 'PROCESSING', error: `Quota cheia. Aguardando ${backoffTime/1000}s...` } : item));
                
                console.warn(`Rate limit hit for item ${i}. Pausing for ${backoffTime}ms`);
                await new Promise(resolve => setTimeout(resolve, backoffTime));
            } else {
                // Permanent failure or max retries reached
                const finalError = isRateLimit ? 'Erro: Limite de quota excedido (Tente novamente mais tarde)' : errorMessage;
                setItems(prev => prev.map((item, idx) => idx === i ? { ...item, status: 'ERROR', error: finalError } : item));
                break; // Exit retry loop, move to next item
            }
          }
      }
    }
    setIsProcessing(false);
  };

  const exportResults = () => {
    const exportData = items.map(item => {
      // Start with original spreadsheet data to preserve all columns
      const row = item.originalData ? { ...item.originalData } : {};

      // Fill specific columns as requested
      // D = description (Marketing)
      row['description'] = item.result?.marketing || "";
      
      // I = specifications (HTML Specs)
      row['specifications'] = item.result?.specs || "";
      
      // J = seo_title
      row['seo_title'] = item.result?.seo?.title || "";
      
      // K = seo_description
      row['seo_description'] = item.result?.seo?.description || "";
      
      // L = seo_keywords
      row['seo_keywords'] = item.result?.seo?.keywords?.join(", ") || "";

      // Ensure Status column exists or updates
      row['Status_Processamento'] = item.status;
      
      // Optional: Add AI sources/images as extra columns if they don't map to specific letters
      if (item.result?.images?.length) {
         row['AI_Imagens'] = item.result.images.join(", ");
      }
      if (item.result?.sources?.length) {
         row['AI_Fontes'] = item.result.sources.map(s => s.uri).join(", ");
      }

      return row;
    });

    const ws = XLSX.utils.json_to_sheet(exportData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Produtos Processados");
    XLSX.writeFile(wb, "produtos_completos_ai.xlsx");
  };

  const completedCount = items.filter(i => i.status === 'COMPLETED').length;
  const progress = items.length > 0 ? (completedCount / items.length) * 100 : 0;

  return (
    <div className="space-y-8 animate-fade-in-up">
      <div className="bg-white rounded-3xl shadow-xl shadow-brand-900/5 border border-slate-100 p-6 sm:p-10">
        
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
            <div>
                <h2 className="text-2xl font-display font-bold text-slate-800">Geração em Massa</h2>
                <p className="text-slate-500 text-sm mt-1">Carregue sua planilha. As colunas <strong>description</strong>, <strong>specifications</strong>, <strong>seo_title</strong>, <strong>seo_description</strong> e <strong>seo_keywords</strong> serão preenchidas.</p>
            </div>
            <button 
                onClick={downloadTemplate}
                className="text-sm font-medium text-brand-600 hover:text-brand-700 underline flex items-center gap-1"
            >
                <DownloadIcon /> Baixar Modelo
            </button>
        </div>

        {/* Upload Area */}
        <div className="border-2 border-dashed border-slate-200 rounded-2xl p-8 text-center bg-slate-50/50 hover:bg-slate-50 transition-colors">
            <input 
                type="file" 
                accept=".xlsx, .csv" 
                onChange={handleFileUpload} 
                className="hidden" 
                id="fileUpload"
                ref={fileInputRef}
            />
            <label htmlFor="fileUpload" className="cursor-pointer flex flex-col items-center justify-center gap-3 w-full h-full">
                <div className="p-3 bg-white rounded-full shadow-sm text-brand-500">
                    <UploadIcon />
                </div>
                <div>
                    <span className="font-bold text-brand-600">Clique para enviar</span>
                    <span className="text-slate-500"> ou arraste sua planilha</span>
                </div>
                <p className="text-xs text-slate-400">Suporta .xlsx e .csv</p>
            </label>
        </div>

        {items.length > 0 && (
            <div className="mt-8 space-y-6">
                
                {/* Controls */}
                <div className="flex items-center justify-between bg-slate-50 p-4 rounded-xl border border-slate-100">
                    <div className="flex flex-col">
                        <span className="text-sm font-bold text-slate-700">{items.length} produtos encontrados</span>
                        <span className="text-xs text-slate-500">{completedCount} processados</span>
                    </div>
                    <div className="flex gap-3">
                        <button
                            onClick={processQueue}
                            disabled={isProcessing || completedCount === items.length}
                            className="px-4 py-2 bg-brand-600 text-white rounded-lg font-bold text-sm shadow-lg shadow-brand-500/20 hover:bg-brand-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                        >
                            {isProcessing ? 'Processando...' : 'Iniciar Geração'}
                        </button>
                        <button
                            onClick={exportResults}
                            disabled={completedCount === 0}
                            className="px-4 py-2 bg-emerald-500 text-white rounded-lg font-bold text-sm shadow-lg shadow-emerald-500/20 hover:bg-emerald-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center gap-2"
                        >
                            <DownloadIcon /> Exportar Excel
                        </button>
                    </div>
                </div>

                {/* Progress Bar */}
                {items.length > 0 && (
                    <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden">
                        <div 
                            className="bg-brand-500 h-2.5 rounded-full transition-all duration-500 ease-out" 
                            style={{ width: `${progress}%` }}
                        ></div>
                    </div>
                )}

                {/* Preview List (Limited to 5 items to save space, or scrollable) */}
                <div className="border border-slate-200 rounded-xl overflow-hidden">
                    <div className="max-h-96 overflow-y-auto">
                        <table className="w-full text-sm text-left">
                            <thead className="bg-slate-50 text-slate-500 font-bold uppercase text-xs sticky top-0">
                                <tr>
                                    <th className="px-4 py-3">Produto</th>
                                    <th className="px-4 py-3">Marca</th>
                                    <th className="px-4 py-3">Status</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {items.map((item) => (
                                    <tr key={item.id} className="bg-white hover:bg-slate-50/50">
                                        <td className="px-4 py-3 font-medium text-slate-700">{item.productName}</td>
                                        <td className="px-4 py-3 text-slate-500">{item.manufacturer}</td>
                                        <td className="px-4 py-3">
                                            {item.status === 'PENDING' && <span className="text-slate-400 bg-slate-100 px-2 py-1 rounded text-xs font-bold">Pendente</span>}
                                            {item.status === 'PROCESSING' && (
                                                <div className="flex flex-col">
                                                    <span className="text-brand-600 bg-brand-50 px-2 py-1 rounded text-xs font-bold animate-pulse">Gerando...</span>
                                                    {item.error && <span className="text-[10px] text-brand-600 mt-1">{item.error}</span>}
                                                </div>
                                            )}
                                            {item.status === 'COMPLETED' && <span className="text-emerald-600 bg-emerald-50 px-2 py-1 rounded text-xs font-bold">Concluído</span>}
                                            {item.status === 'ERROR' && (
                                                <div className="flex flex-col">
                                                    <span className="text-red-600 bg-red-50 px-2 py-1 rounded text-xs font-bold">Erro</span>
                                                    <span className="text-[10px] text-red-500 mt-1 max-w-[200px] truncate" title={item.error}>{item.error}</span>
                                                </div>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

            </div>
        )}
      </div>
    </div>
  );
};