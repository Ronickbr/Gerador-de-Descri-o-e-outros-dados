import { GoogleGenAI } from "@google/genai";
import { GeneratedContent, Source } from "../types";

// Initialize the client
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const generateProductData = async (
  productName: string,
  manufacturer: string,
  category?: string,
  subcategory?: string
): Promise<GeneratedContent> => {
  const modelId = "gemini-2.5-flash"; // Using Flash for speed and Search tool support

  const contextInfo = `
  Produto: "${productName}"
  Fabricante: "${manufacturer}"
  ${category ? `Categoria: "${category}"` : ''}
  ${subcategory ? `Subcategoria: "${subcategory}"` : ''}
  `;

  const prompt = `
  Atue como um especialista sênior em Marketing de Produto e SEO Técnico.
  
  Pesquise na web informações reais e atualizadas sobre o seguinte item:
  ${contextInfo}
  
  Você deve gerar uma resposta estruturada contendo exatamente quatro seções separadas por delimitadores específicos.
  Não use Markdown para os delimitadores, use apenas o texto plano conforme solicitado abaixo.

  Estrutura da resposta:

  ===MARKETING===
  Escreva uma descrição de produto focada em vendas e conversão.
  IMPORTANTE: O texto DEVE ser formatado em HTML (sem as tags <html> ou <body>).
  - Use <h3> para subtítulos atraentes.
  - Use <p> para parágrafos envolventes.
  - Use <ul> e <li> para listar benefícios ou diferenciais.
  - Use <strong> para destacar palavras-chave importantes.
  
  O tom deve ser persuasivo (copywriting), destacando benefícios e dores que o produto resolve. Se a categoria for fornecida, use-a para contextualizar o uso.

  ===SPECS===
  Liste as especificações técnicas cruciais em formato de LISTA HTML (<ul>).
  IMPORTANTE: O texto DEVE ser formatado em HTML (sem as tags <html> ou <body>).
  - Use a tag <ul class="specs-list"> para a lista.
  - Use <li> para cada especificação.
  - Use <strong> para o nome da característica, seguido de dois pontos e o valor.
  
  Exemplo de formato esperado:
  <ul class="specs-list">
    <li><strong>Processador:</strong> Detalhe do processador</li>
    <li><strong>Peso:</strong> 200g</li>
  </ul>

  ===IMAGES===
  Pesquise e liste até 4 URLs diretas de imagens públicas deste produto (formatos JPG, PNG ou WEBP).
  Tente encontrar links de imagens de divulgação, reviews ou lojas.
  Retorne APENAS as URLs, uma por linha. Se não encontrar links diretos confiáveis, deixe em branco.

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

    // Parse the structured text response more robustly
    // Normalize delimiters in case of markdown bolding
    const cleanText = text.replace(/\*\*===(.*?)===\*\*/g, '===$1===');

    // Use lookaheads to capture content between delimiters without strict ordering dependency
    const marketingMatch = cleanText.match(/===MARKETING===([\s\S]*?)(?====SPECS===|===IMAGES===|===SEO===|$)/);
    const specsMatch = cleanText.match(/===SPECS===([\s\S]*?)(?====IMAGES===|===SEO===|===MARKETING===|$)/);
    const imagesMatch = cleanText.match(/===IMAGES===([\s\S]*?)(?====SEO===|===MARKETING===|===SPECS===|$)/);
    const seoMatch = cleanText.match(/===SEO===([\s\S]*?)(?====MARKETING===|===SPECS===|===IMAGES===|$)/);

    const marketing = marketingMatch ? marketingMatch[1].trim() : "Descrição não gerada.";
    
    // Specs is now treated as a raw HTML string block
    const specs = specsMatch ? specsMatch[1].trim() : "";

    const imagesRaw = imagesMatch ? imagesMatch[1].trim() : "";
    const images = imagesRaw.split('\n')
      .map(line => line.trim())
      .filter(line => line.length > 0 && line.startsWith('http'));

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
      images,
    };

  } catch (error: any) {
    console.error("Error generating content:", error);
    // Propagate the original error so we can catch 429s in the UI
    throw error;
  }
};