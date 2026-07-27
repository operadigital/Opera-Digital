import express from 'express';
import path from 'path';
import fs from 'fs';
import { GoogleGenAI, Type } from '@google/genai';
import dotenv from 'dotenv';

dotenv.config();

const STORE_PATH = path.resolve(process.cwd(), 'data_store.json');

interface StoreData {
  projects: any[];
  leads: any[];
}

function loadStore(): StoreData {
  try {
    if (fs.existsSync(STORE_PATH)) {
      const raw = fs.readFileSync(STORE_PATH, 'utf-8');
      const parsed = JSON.parse(raw);
      return {
        projects: Array.isArray(parsed?.projects) ? parsed.projects : [],
        leads: Array.isArray(parsed?.leads) ? parsed.leads : []
      };
    }
  } catch (e) {
    console.error('Error reading store file:', e);
  }
  return { projects: [], leads: [] };
}

function saveStore(data: StoreData) {
  try {
    fs.writeFileSync(STORE_PATH, JSON.stringify(data, null, 2), 'utf-8');
  } catch (e) {
    console.error('Error writing store file:', e);
  }
}

let store = loadStore();

function getDistPath(): string {
  if (typeof __dirname !== 'undefined') {
    const indexPathInDir = path.resolve(__dirname, 'index.html');
    if (fs.existsSync(indexPathInDir)) {
      return __dirname;
    }
    const indexPathInSubDir = path.resolve(__dirname, 'dist', 'index.html');
    if (fs.existsSync(indexPathInSubDir)) {
      return path.resolve(__dirname, 'dist');
    }
  }
  return path.resolve(process.cwd(), 'dist');
}

async function fetchWebsiteMetaData(targetUrl: string) {
  let title = '';
  let metaDescription = '';
  let ogImage = '';
  let bodySnippet = '';

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 6000);

    const response = await fetch(targetUrl, {
      signal: controller.signal,
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
        'Accept-Language': 'pt-BR,pt;q=0.9,en-US;q=0.8,en;q=0.7'
      }
    });
    clearTimeout(timeoutId);

    if (response.ok) {
      const html = await response.text();

      // Extract <title>
      const titleMatch = html.match(/<title[^>]*>([^<]+)<\/title>/i);
      if (titleMatch && titleMatch[1]) {
        title = titleMatch[1].trim();
      }

      // Extract meta description or og:description
      const ogDescMatch = html.match(/<meta[^>]*property=["']og:description["'][^>]*content=["']([^"']+)["']/i) ||
                          html.match(/<meta[^>]*content=["']([^"']+)["'][^>]*property=["']og:description["']/i) ||
                          html.match(/<meta[^>]*name=["']description["'][^>]*content=["']([^"']+)["']/i) ||
                          html.match(/<meta[^>]*content=["']([^"']+)["'][^>]*name=["']description["']/i);
      if (ogDescMatch && ogDescMatch[1]) {
        metaDescription = ogDescMatch[1].trim();
      }

      // Extract og:image
      const ogImgMatch = html.match(/<meta[^>]*property=["']og:image["'][^>]*content=["']([^"']+)["']/i) ||
                         html.match(/<meta[^>]*content=["']([^"']+)["'][^>]*property=["']og:image["']/i) ||
                         html.match(/<meta[^>]*name=["']twitter:image["'][^>]*content=["']([^"']+)["']/i);
      if (ogImgMatch && ogImgMatch[1]) {
        let img = ogImgMatch[1].trim();
        if (img.startsWith('//')) {
          img = 'https:' + img;
        } else if (img.startsWith('/')) {
          try {
            const origin = new URL(targetUrl).origin;
            img = origin + img;
          } catch (e) {
            // ignore URL parse error
          }
        }
        ogImage = img;
      }

      // Clean snippet of body text or headings
      const bodyClean = html
        .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, ' ')
        .replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, ' ')
        .replace(/<[^>]+>/g, ' ')
        .replace(/\s+/g, ' ')
        .trim();
      
      bodySnippet = bodyClean.substring(0, 1500);
    }
  } catch (e) {
    console.warn('Scraping warning for URL:', targetUrl, e);
  }

  return { title, metaDescription, ogImage, bodySnippet };
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // REST API Routes for Persistent Portfolio Projects
  app.get('/api/portfolio', (req, res) => {
    res.json(store.projects || []);
  });

  app.post('/api/portfolio', (req, res) => {
    const project = req.body;
    if (!project || !project.id) {
      res.status(400).json({ error: 'Dados do projeto inválidos.' });
      return;
    }
    const idx = store.projects.findIndex((p) => p.id === project.id);
    if (idx >= 0) {
      store.projects[idx] = project;
    } else {
      store.projects.unshift(project);
    }
    saveStore(store);
    res.json({ success: true, projects: store.projects });
  });

  app.post('/api/portfolio/sync', (req, res) => {
    const list = req.body;
    if (Array.isArray(list)) {
      store.projects = list;
      saveStore(store);
    }
    res.json({ success: true, projects: store.projects });
  });

  app.delete('/api/portfolio/:id', (req, res) => {
    const { id } = req.params;
    store.projects = store.projects.filter((p) => p.id !== id);
    saveStore(store);
    res.json({ success: true, projects: store.projects });
  });

  // REST API Routes for Persistent Leads & Registrations
  app.get('/api/leads', (req, res) => {
    res.json(store.leads || []);
  });

  app.post('/api/leads', (req, res) => {
    const lead = req.body;
    if (!lead || !lead.id) {
      res.status(400).json({ error: 'Dados do lead inválidos.' });
      return;
    }
    const idx = store.leads.findIndex((l) => String(l.id) === String(lead.id));
    if (idx >= 0) {
      store.leads[idx] = lead;
    } else {
      store.leads.unshift(lead);
    }
    saveStore(store);
    res.json({ success: true, leads: store.leads });
  });

  app.post('/api/leads/sync', (req, res) => {
    const list = req.body;
    if (Array.isArray(list)) {
      store.leads = list;
      saveStore(store);
    }
    res.json({ success: true, leads: store.leads });
  });

  app.delete('/api/leads/:id', (req, res) => {
    const { id } = req.params;
    store.leads = store.leads.filter((l) => String(l.id) !== String(id));
    saveStore(store);
    res.json({ success: true, leads: store.leads });
  });

  // API Route: AI Generation for Portfolio Projects
  app.post('/api/generate-project-info', async (req, res) => {
    try {
      const { url, clientName, category } = req.body || {};

      if (!url || typeof url !== 'string' || !url.trim()) {
        res.status(400).json({ error: 'URL do projeto é obrigatória.' });
        return;
      }

      let cleanUrl = url.trim();
      if (!cleanUrl.startsWith('http://') && !cleanUrl.startsWith('https://')) {
        cleanUrl = 'https://' + cleanUrl;
      }

      // 1. Scrape real metadata from the target website
      const scraped = await fetchWebsiteMetaData(cleanUrl);

      // Default screenshot URL if ogImage is missing
      const screenshotUrl = `https://api.microlink.io/?url=${encodeURIComponent(cleanUrl)}&screenshot=true&embed=screenshot.url`;
      const fallbackImage = scraped.ogImage || screenshotUrl;

      const domain = cleanUrl.replace(/^https?:\/\//, '').split('/')[0];
      const domainClean = domain.replace(/^www\./, '').split('.')[0];
      const defaultClientName = clientName || (scraped.title ? scraped.title.split('-')[0].split('|')[0].trim() : domainClean.toUpperCase());

      const apiKey = process.env.GEMINI_API_KEY;

      if (!apiKey || apiKey === 'MY_GEMINI_API_KEY') {
        // Smart fallback when API key is not configured
        res.json({
          title: scraped.title ? `Plataforma ${scraped.title}` : `Plataforma Digital ${defaultClientName}`,
          clientName: defaultClientName,
          category: category || 'E-commerce',
          description: scraped.metaDescription || `Solução web completa e personalizada desenvolvida para ${defaultClientName} com alta performance e integração.`,
          resultMetric: '+240% em Produtividade e Vendas',
          imageUrl: fallbackImage,
          tags: ['Opera Digital', 'Inovação', 'Web App']
        });
        return;
      }

      const ai = new GoogleGenAI({
        apiKey,
        httpOptions: {
          headers: {
            'User-Agent': 'aistudio-build',
          },
        },
      });

      const prompt = `Analise o conteúdo real extraído do site a seguir para criar uma publicação altamente precisa e alinhada para o portfólio da Opera Digital:

URL do site: ${cleanUrl}
${clientName ? `Nome pré-fornecido do cliente: ${clientName}` : ''}
${category ? `Categoria solicitada: ${category}` : ''}

DADOS REAIS EXTRAÍDOS DO SITE:
- Título real da página (<title>): ${scraped.title || 'Não identificado'}
- Descrição real da página (meta description): ${scraped.metaDescription || 'Não identificada'}
- Imagem OG encontrada no site: ${scraped.ogImage || 'Nenhuma'}
- Trecho do conteúdo real do site: ${scraped.bodySnippet || 'Nenhum'}

INSTRUÇÕES DE PREENCHIMENTO:
1. O Título (title) e o Nome do Cliente (clientName) devem refletir com precisão a marca/empresa real do site consultado.
2. A Descrição (description) deve descrever em detalhes o que a empresa do site faz e a solução desenvolvida.
3. A Categoria (category) deve corresponder exatamente ao ramo real do site (E-commerce, ERP & PDV, Automações & IA, ou Portais & Web Apps).
4. A Imagem (imageUrl) deve ser:
   - A imagem OG oficial do site (${scraped.ogImage}) se estiver presente e for válida; OU
   - A imagem de captura de tela direta do site: "${screenshotUrl}"; OU
   - Uma foto de altíssima qualidade do Unsplash estritamente temática e contextual para o ramo exato do site.`;

      const response = await Promise.race([
        ai.models.generateContent({
          model: 'gemini-2.5-flash',
          contents: prompt,
          config: {
            systemInstruction: `Você é o Diretor de Tecnologia e Marketing da Opera Digital. 
Sua função é gerar publicações do portfólio com total fidelidade ao site do cliente analisado.
Sua resposta DEVE ser estritamente em formato JSON estruturado seguindo o schema fornecido.`,
            responseMimeType: 'application/json',
            responseSchema: {
              type: Type.OBJECT,
              properties: {
                title: { type: Type.STRING, description: 'Título atrativo do projeto alinhado ao site real' },
                clientName: { type: Type.STRING, description: 'Nome exato da marca ou cliente do site' },
                category: { 
                  type: Type.STRING, 
                  description: 'Categoria exata: E-commerce | ERP & PDV | Automações & IA | Portais & Web Apps' 
                },
                description: { type: Type.STRING, description: 'Descrição rica e profissional baseada no site real' },
                resultMetric: { type: Type.STRING, description: 'Métrica de impacto real ou estimada (ex: +320% de vendas, Economia de 40h/mês)' },
                imageUrl: { type: Type.STRING, description: 'URL direta da imagem oficial, captura de tela do site ou Unsplash contextual' },
                tags: {
                  type: Type.ARRAY,
                  items: { type: Type.STRING },
                  description: 'Lista de 3 a 5 tags relacionadas ao site'
                }
              },
              required: ['title', 'clientName', 'category', 'description', 'resultMetric', 'imageUrl', 'tags']
            }
          }
        }),
        new Promise<never>((_, reject) =>
          setTimeout(() => reject(new Error('Timeout na consulta da IA Gemini')), 10000)
        )
      ]);

      const jsonText = response.text ? response.text.trim() : '';
      if (!jsonText) {
        throw new Error('Sem resposta do modelo Gemini.');
      }

      const generatedData = JSON.parse(jsonText);

      // Sanitize fallback for imageUrl if empty
      if (!generatedData.imageUrl) {
        generatedData.imageUrl = fallbackImage;
      }

      res.json(generatedData);

    } catch (err: any) {
      console.error('Erro na geração IA de projeto:', err);
      const urlStr = req.body?.url || 'https://projeto.com.br';
      let cleanUrl = urlStr.trim();
      if (!cleanUrl.startsWith('http://') && !cleanUrl.startsWith('https://')) {
        cleanUrl = 'https://' + cleanUrl;
      }
      const domain = cleanUrl.replace(/^https?:\/\//, '').split('/')[0];
      const inferredName = req.body?.clientName || domain.replace(/^www\./, '').split('.')[0].toUpperCase();

      res.json({
        title: `Plataforma Digital ${inferredName}`,
        clientName: inferredName,
        category: req.body?.category || 'E-commerce',
        description: `Ambiente digital personalizado desenvolvido para ${inferredName} com foco em inovação, resultados e escalabilidade.`,
        resultMetric: '+210% de Eficiência Operacional',
        imageUrl: `https://api.microlink.io/?url=${encodeURIComponent(cleanUrl)}&screenshot=true&embed=screenshot.url`,
        tags: ['Opera Digital', 'Sistemas', 'Web']
      });
    }
  });

  // Vite Middleware in Development / Static Serving in Production
  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = getDistPath();
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      const indexPath = path.resolve(distPath, 'index.html');
      res.sendFile(indexPath, (err) => {
        if (err && !res.headersSent) {
          res.status(500).send('Server Error');
        }
      });
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
