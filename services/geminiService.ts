import { GoogleGenAI } from "@google/genai";
import { GeneratedContent, Source } from "../types";

const apiKey = process.env.API_KEY;

// Initialize the client
const ai = new GoogleGenAI({ apiKey: apiKey });

export const generateProductData = async (
  productName: string,
  manufacturer: string
): Promise<GeneratedContent> => {
  const modelId = "gemini-2.5-flash"; // Using Flash for speed and Search tool support

  const prompt = `
  Atue como um especialista sênior em Marketing de Produto e SEO Técnico.
  
  Pesquise na web informações reais e atualizadas sobre o produto: "${productName}" do fabricante "${manufacturer}".
  
  Você deve gerar uma resposta estruturada contendo exatamente três seções separadas por delimitadores específicos.
  Não use Markdown para os delimitadores, use apenas o texto plano conforme solicitado abaixo.

  Estrutura da resposta:

  ===MARKETING===
  Escreva uma descrição de produto focada em vendas e conversão.
  IMPORTANTE: O texto DEVE ser formatado em HTML (sem as tags <html> ou <body>).
  - Use <h3> para subtítulos atraentes.
  - Use <p> para parágrafos envolventes.
  - Use <ul> e <li> para listar benefícios ou diferenciais.
  - Use <strong> para destacar palavras-chave importantes.
  
  O tom deve ser persuasivo (copywriting), destacando benefícios e dores que o produto resolve.

  ===SPECS===
  Liste as especificações técnicas cruciais encontradas na pesquisa (ex: dimensões, peso, material, processador, potência, conectividade, etc.).
  Retorne APENAS uma lista separada por quebras de linha. Exemplo:
  Processador: XYZ
  Memória: 8GB
  Peso: 200g

  ===SEO===
  Gere os metadados para uma página de e-commerce deste produto.
  Formato esperado:
  Title: [Meta Title otimizado, máx 60 caracteres]
  Description: [Meta Description otimizada com CTA, máx 160 caracteres]
  Keywords: [Lista de 10 palavras-chave de cauda longa separadas por vírgula]

  Certifique-se de que os dados técnicos sejam precisos e baseados na pesquisa realizada.
  `;

  try {
    const response = await ai.models.generateContent({
      model: modelId,
      contents: prompt,
      config: {
        tools: [{ googleSearch: {} }], // Enable Google Search Grounding
        temperature: 0.7,
      },
    });

    const text = response.text || "";
    
    // Extract Grounding Metadata (Sources)
    const sources: Source[] = [];
    const chunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks;
    if (chunks) {
      chunks.forEach((chunk: any) => {
        if (chunk.web) {
          sources.push({
            title: chunk.web.title || "Fonte da Web",
            uri: chunk.web.uri,
          });
        }
      });
    }

    // Parse the structured text response
    const marketingMatch = text.match(/===MARKETING===([\s\S]*?)===SPECS===/);
    const specsMatch = text.match(/===SPECS===([\s\S]*?)===SEO===/);
    const seoMatch = text.match(/===SEO===([\s\S]*?)$/);

    const marketing = marketingMatch ? marketingMatch[1].trim() : "Descrição não gerada.";
    
    const specsRaw = specsMatch ? specsMatch[1].trim() : "";
    const specs = specsRaw.split('\n').filter(line => line.trim().length > 0).map(line => line.replace(/^-\s*/, '').trim());

    const seoRaw = seoMatch ? seoMatch[1].trim() : "";
    
    // Simple extraction for SEO fields
    const titleMatch = seoRaw.match(/Title:\s*(.*)/i);
    const descMatch = seoRaw.match(/Description:\s*(.*)/i);
    const keywordsMatch = seoRaw.match(/Keywords:\s*(.*)/i);

    const seo = {
      title: titleMatch ? titleMatch[1].trim() : "",
      description: descMatch ? descMatch[1].trim() : "",
      keywords: keywordsMatch ? keywordsMatch[1].trim().split(',').map(k => k.trim()) : [],
    };

    return {
      marketing,
      specs,
      seo,
      sources,
    };

  } catch (error) {
    console.error("Error generating content:", error);
    throw new Error("Falha ao gerar dados do produto. Verifique sua chave de API ou tente novamente.");
  }
};