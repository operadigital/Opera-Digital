import express from 'express';
import path from 'path';
import fs from 'fs';
import { GoogleGenAI, Type } from '@google/genai';
import dotenv from 'dotenv';

dotenv.config();

const STORE_PATH = path.resolve(process.cwd(), 'data_store.json');

interface WhatsAppAutomationTrigger {
  id: string;
  keyword: string;
  response: string;
  action?: 'send_menu' | 'send_quote_form' | 'human_transfer' | 'send_catalog' | 'none';
}

interface WhatsAppAutomationConfig {
  enabled: boolean;
  welcomeMessage: string;
  awayMessage: string;
  workingHours: {
    start: string;
    end: string;
    days: string[];
  };
  triggers: WhatsAppAutomationTrigger[];
  webhookConfig?: {
    verifyToken: string;
    apiToken?: string;
    phoneNumberId?: string;
  };
}

interface StoreData {
  projects: any[];
  leads: any[];
  settings?: {
    whatsappNumber?: string;
    whatsappAutomation?: WhatsAppAutomationConfig;
  };
}

const DEFAULT_WHATSAPP_AUTOMATION: WhatsAppAutomationConfig = {
  enabled: true,
  welcomeMessage: 'Olá! Seja bem-vindo à Opera Digital. Como posso te ajudar com o crescimento digital da sua empresa hoje?',
  awayMessage: 'Nosso horário de atendimento é de Segunda a Sexta, das 08h às 18h. Deixe sua mensagem que responderemos logo no início do expediente!',
  workingHours: {
    start: '08:00',
    end: '18:00',
    days: ['seg', 'ter', 'qua', 'qui', 'sex']
  },
  triggers: [
    {
      id: 'trig-1',
      keyword: 'orçamento',
      response: 'Com certeza! Para criarmos uma proposta ideal para sua empresa, você pode clicar no botão de Orçamento em nosso site ou nos contar brevemente o seu segmento.',
      action: 'send_quote_form'
    },
    {
      id: 'trig-2',
      keyword: 'serviços',
      response: 'Oferecemos Criação de Websites Profissionais, E-commerces, Portais e Automação do WhatsApp Web com robôs e Agentes Virtuais de IA.',
      action: 'send_menu'
    },
    {
      id: 'trig-3',
      keyword: 'horário',
      response: 'Nosso expediente comercial funciona de Segunda a Sexta-feira, das 08:00 às 18:00 (horário de Brasília). Nosso robô responde 24 horas por dia!',
      action: 'none'
    },
    {
      id: 'trig-4',
      keyword: 'humano',
      response: 'Entendido! Estou notificando a equipe da Opera Digital para um especialista assumir este atendimento diretamente com você em instantes.',
      action: 'human_transfer'
    }
  ],
  webhookConfig: {
    verifyToken: 'opera_digital_meta_token_2026',
    apiToken: '',
    phoneNumberId: ''
  }
};

const DEFAULT_PROJECTS = [
  {
    id: 'personalizze-store',
    title: 'Personalizze Store',
    clientName: 'Personalizze Store',
    category: 'E-commerce & Portais',
    description: 'E-commerce moderno e de alta conversão para produtos e presentes personalizados. Conta com design 100% responsivo, catálogo interativo, checkout otimizado e integração com WhatsApp Web.',
    resultMetric: 'Loja Virtual de Alta Conversão',
    resultLink: 'https://personalizze.store/',
    imageUrl: 'https://i.ibb.co/6cGqNQZ3/aea34f64-4935-4dd1-b252-3a08f72e0f90.png',
    tags: ['E-commerce', 'Presentes Personalizados', 'Design Responsivo', 'WhatsApp Web', 'Loja Virtual'],
    completedDate: '2026'
  }
];

function loadStore(): StoreData {
  try {
    if (fs.existsSync(STORE_PATH)) {
      const raw = fs.readFileSync(STORE_PATH, 'utf-8');
      const parsed = JSON.parse(raw);
      const loadedProjects = Array.isArray(parsed?.projects) ? parsed.projects : [];
      const projects = loadedProjects.length > 0 ? loadedProjects : DEFAULT_PROJECTS;
      const settings = parsed?.settings || {};
      if (!settings.whatsappNumber) settings.whatsappNumber = '5551992379969';
      if (!settings.whatsappAutomation) settings.whatsappAutomation = DEFAULT_WHATSAPP_AUTOMATION;

      return {
        projects,
        leads: Array.isArray(parsed?.leads) ? parsed.leads : [],
        settings
      };
    }
  } catch (e) {
    console.error('Error reading store file:', e);
  }
  return { 
    projects: DEFAULT_PROJECTS, 
    leads: [], 
    settings: { 
      whatsappNumber: '5551992379969',
      whatsappAutomation: DEFAULT_WHATSAPP_AUTOMATION
    } 
  };
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
    const formattedLeads = (store.leads || []).map((l) => ({
      ...l,
      stage: l.stage || l.status || 'novo',
      priority: l.priority || 'media',
      estimatedValue: l.estimatedValue || (l.projectType?.includes('E-commerce') ? 12000 : l.projectType?.includes('Automação') ? 8500 : 5000),
      notes: l.notes || [],
      activities: l.activities || [],
      source: l.source || 'Formulário Site'
    }));
    res.json(formattedLeads);
  });

  app.post('/api/leads', (req, res) => {
    const lead = req.body;
    if (!lead || !lead.id) {
      res.status(400).json({ error: 'Dados do lead inválidos.' });
      return;
    }
    const formatted = {
      ...lead,
      stage: lead.stage || lead.status || 'novo',
      priority: lead.priority || 'media',
      estimatedValue: lead.estimatedValue || 5000,
      createdAt: lead.createdAt || new Date().toISOString(),
      notes: lead.notes || [],
      activities: lead.activities || [
        {
          id: `act-${Date.now()}`,
          type: 'system',
          description: 'Lead cadastrado no sistema CRM',
          createdAt: new Date().toISOString()
        }
      ],
      source: lead.source || 'Formulário Site'
    };

    const idx = store.leads.findIndex((l) => String(l.id) === String(lead.id));
    if (idx >= 0) {
      store.leads[idx] = { ...store.leads[idx], ...formatted };
    } else {
      store.leads.unshift(formatted);
    }
    saveStore(store);
    res.json({ success: true, leads: store.leads });
  });

  app.patch('/api/leads/:id', (req, res) => {
    const { id } = req.params;
    const updates = req.body || {};
    const idx = store.leads.findIndex((l) => String(l.id) === String(id));
    if (idx < 0) {
      res.status(404).json({ error: 'Lead não encontrado.' });
      return;
    }

    const currentLead = store.leads[idx];
    const oldStage = currentLead.stage || currentLead.status || 'novo';
    const newStage = updates.stage || oldStage;

    const activities = [...(currentLead.activities || [])];
    if (newStage !== oldStage) {
      const stageNames: Record<string, string> = {
        novo: 'Novo Lead',
        qualificacao: 'Em Qualificação',
        proposta: 'Proposta Enviada',
        negociacao: 'Em Negociação',
        ganho: 'Fechado / Ganho',
        perdido: 'Perdido'
      };
      activities.unshift({
        id: `act-${Date.now()}`,
        type: 'stage_change',
        description: `Estágio alterado de "${stageNames[oldStage] || oldStage}" para "${stageNames[newStage] || newStage}"`,
        createdAt: new Date().toISOString(),
        author: updates.author || 'Administrador'
      });
    }

    const updatedLead = {
      ...currentLead,
      ...updates,
      stage: newStage,
      status: newStage,
      activities,
      lastContactDate: updates.lastContactDate || new Date().toISOString()
    };

    store.leads[idx] = updatedLead;
    saveStore(store);
    res.json({ success: true, lead: updatedLead, leads: store.leads });
  });

  app.post('/api/leads/:id/notes', (req, res) => {
    const { id } = req.params;
    const { text, author } = req.body || {};
    if (!text || !text.trim()) {
      res.status(400).json({ error: 'Texto da nota é obrigatório.' });
      return;
    }

    const idx = store.leads.findIndex((l) => String(l.id) === String(id));
    if (idx < 0) {
      res.status(404).json({ error: 'Lead não encontrado.' });
      return;
    }

    const lead = store.leads[idx];
    const newNote = {
      id: `note-${Date.now()}`,
      text: text.trim(),
      author: author || 'Equipe Opera Digital',
      createdAt: new Date().toISOString()
    };

    const notes = [newNote, ...(lead.notes || [])];
    const activities = [
      {
        id: `act-${Date.now()}`,
        type: 'note' as const,
        description: `Nova anotação registrada: "${text.trim().substring(0, 60)}${text.trim().length > 60 ? '...' : ''}"`,
        createdAt: new Date().toISOString(),
        author: author || 'Equipe Opera Digital'
      },
      ...(lead.activities || [])
    ];

    store.leads[idx] = { ...lead, notes, activities, lastContactDate: new Date().toISOString() };
    saveStore(store);
    res.json({ success: true, lead: store.leads[idx], note: newNote });
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

  // API Routes: Settings (WhatsApp Number, Automation, etc.)
  app.get('/api/settings', (req, res) => {
    res.json({
      whatsappNumber: store.settings?.whatsappNumber || '5551992379969',
      whatsappAutomation: store.settings?.whatsappAutomation || DEFAULT_WHATSAPP_AUTOMATION
    });
  });

  app.post('/api/settings', (req, res) => {
    const { whatsappNumber, whatsappAutomation } = req.body || {};
    if (!store.settings) store.settings = {};
    if (whatsappNumber && typeof whatsappNumber === 'string') {
      const cleaned = whatsappNumber.replace(/\D/g, '');
      if (cleaned.length >= 10) {
        store.settings.whatsappNumber = cleaned;
      }
    }
    if (whatsappAutomation && typeof whatsappAutomation === 'object') {
      store.settings.whatsappAutomation = whatsappAutomation;
    }
    saveStore(store);
    res.json({
      success: true,
      whatsappNumber: store.settings?.whatsappNumber || '5551992379969',
      whatsappAutomation: store.settings?.whatsappAutomation || DEFAULT_WHATSAPP_AUTOMATION
    });
  });

  // API Routes: WhatsApp Automation specific
  app.get('/api/whatsapp/automation', (req, res) => {
    res.json(store.settings?.whatsappAutomation || DEFAULT_WHATSAPP_AUTOMATION);
  });

  app.post('/api/whatsapp/automation', (req, res) => {
    const config = req.body;
    if (!store.settings) store.settings = {};
    store.settings.whatsappAutomation = config;
    saveStore(store);
    res.json({ success: true, whatsappAutomation: store.settings.whatsappAutomation });
  });

  // API Route: WhatsApp Auto-Reply Simulator/Engine
  app.post('/api/whatsapp/auto-reply', (req, res) => {
    const { message, clientName } = req.body || {};
    const autoConfig = store.settings?.whatsappAutomation || DEFAULT_WHATSAPP_AUTOMATION;

    if (!autoConfig.enabled) {
      res.json({
        enabled: false,
        reply: 'O robô de atendimento está desativado no momento.'
      });
      return;
    }

    const text = (message || '').toLowerCase().trim();
    let matchedTrigger = autoConfig.triggers.find((t) => {
      const kw = t.keyword.toLowerCase().trim();
      return text.includes(kw);
    });

    if (matchedTrigger) {
      res.json({
        enabled: true,
        matched: true,
        keywordMatched: matchedTrigger.keyword,
        reply: matchedTrigger.response,
        action: matchedTrigger.action || 'none'
      });
    } else if (text === '' || text.includes('oi') || text.includes('ola') || text.includes('olá') || text.includes('bom dia') || text.includes('boa tarde') || text.includes('boa noite')) {
      res.json({
        enabled: true,
        matched: true,
        keywordMatched: 'saudacao',
        reply: autoConfig.welcomeMessage,
        action: 'send_menu'
      });
    } else {
      res.json({
        enabled: true,
        matched: false,
        reply: `Agradecemos sua mensagem! Para atendimento imediato, selecione uma das opções:\n1️⃣ Orçamento de Site / E-commerce\n2️⃣ Nossos Serviços & Soluções\n3️⃣ Horário de Atendimento\n4️⃣ Falar com um Especialista Humano`,
        action: 'send_menu'
      });
    }
  });

  // Meta WhatsApp Business Cloud API Webhook Integration Endpoint
  app.get('/api/whatsapp/webhook', (req, res) => {
    const mode = req.query['hub.mode'];
    const token = req.query['hub.verify_token'];
    const challenge = req.query['hub.challenge'];

    const verifyToken = store.settings?.whatsappAutomation?.webhookConfig?.verifyToken || 'opera_digital_meta_token_2026';

    if (mode === 'subscribe' && token === verifyToken) {
      console.log('WhatsApp Webhook verified successfully!');
      res.status(200).send(challenge);
    } else {
      res.sendStatus(403);
    }
  });

  app.post('/api/whatsapp/webhook', (req, res) => {
    const body = req.body;
    if (body.object === 'whatsapp_business_account') {
      console.log('Received WhatsApp Webhook event:', JSON.stringify(body, null, 2));
      // Auto-register incoming webhook message as a lead
      try {
        const entry = body.entry?.[0];
        const changes = entry?.changes?.[0];
        const value = changes?.value;
        const messages = value?.messages;
        if (messages && messages[0]) {
          const msg = messages[0];
          const fromPhone = msg.from;
          const msgText = msg.text?.body || 'Mensagem via WhatsApp Webhook';
          const newLead = {
            id: 'wa-' + Date.now(),
            fullName: `Contato WhatsApp (${fromPhone})`,
            companyName: 'Lead WhatsApp',
            email: `${fromPhone}@whatsapp.user`,
            phone: fromPhone,
            segment: 'WhatsApp Automation',
            projectType: 'Automação WhatsApp',
            projectDescription: msgText,
            createdAt: new Date().toISOString(),
            status: 'novo',
            whatsappOptIn: true
          };
          store.leads.unshift(newLead);
          saveStore(store);
        }
      } catch (err) {
        console.error('Error parsing WhatsApp webhook payload:', err);
      }
      res.status(200).send('EVENT_RECEIVED');
    } else {
      res.sendStatus(404);
    }
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
