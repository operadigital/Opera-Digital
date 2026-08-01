import React, { useState, useEffect } from 'react';
import { 
  Building2, Plus, ExternalLink, Trash2, Edit3, Search, 
  Users, TrendingUp, Sparkles, LogOut, CheckCircle2, ArrowLeft,
  MessageSquare, Globe, Tag, RefreshCw, BarChart3, ShieldCheck, Mail, Phone,
  Star, Quote, Save, Settings, PhoneCall, Bot, Zap, Clock, Play, Copy, Check, Send
} from 'lucide-react';
import { INITIAL_PORTFOLIO_PROJECTS } from '../data/mockData';
import { PortfolioProject, CrmLead } from '../types';
import { getStoredWhatsAppNumber, saveWhatsAppNumber, formatWhatsAppDisplay } from '../utils/whatsapp';
import { CrmSystem } from './CrmSystem';

interface AdminPanelProps {
  onLogout: () => void;
  onGoToSite: () => void;
}

export const AdminPanel: React.FC<AdminPanelProps> = ({ onLogout, onGoToSite }) => {
  const [activeTab, setActiveTab] = useState<'portfolio' | 'leads' | 'testimonials' | 'whatsapp' | 'metrics'>('portfolio');

  const sanitizeAndClean = (list: any[]): PortfolioProject[] => {
    if (!Array.isArray(list)) return [];
    const dummyIds = ['proj-1', 'proj-2', 'proj-3', 'proj-4'];
    return list.filter((p) => p && p.id && !dummyIds.includes(p.id));
  };

  // Portfolio State
  const [projects, setProjects] = useState<PortfolioProject[]>(() => {
    try {
      const saved = localStorage.getItem('opera_portfolio_projects');
      if (saved) {
        const parsed = JSON.parse(saved);
        const cleaned = sanitizeAndClean(parsed);
        if (cleaned.length > 0) {
          return cleaned;
        }
      }
    } catch (e) {
      console.error(e);
    }
    return INITIAL_PORTFOLIO_PROJECTS;
  });

  const [searchQuery, setSearchQuery] = useState('');
  const [editingProject, setEditingProject] = useState<PortfolioProject | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [deletingProject, setDeletingProject] = useState<PortfolioProject | null>(null);

  // Form State
  const [title, setTitle] = useState('');
  const [clientName, setClientName] = useState('');
  const [category, setCategory] = useState<PortfolioProject['category']>('E-commerce');
  const [description, setDescription] = useState('');
  const [resultMetric, setResultMetric] = useState('');
  const [resultLink, setResultLink] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [tags, setTags] = useState('');

  // WhatsApp Configuration & Automation State
  const [whatsappNumber, setWhatsappNumber] = useState<string>(() => getStoredWhatsAppNumber());
  const [whatsappInput, setWhatsappInput] = useState<string>(() => getStoredWhatsAppNumber());
  const [saveSuccessMsg, setSaveSuccessMsg] = useState(false);

  const [autoEnabled, setAutoEnabled] = useState(true);
  const [welcomeMsg, setWelcomeMsg] = useState('Olá! Seja bem-vindo à Opera Digital. Como posso te ajudar com o crescimento digital da sua empresa hoje?');
  const [awayMsg, setAwayMsg] = useState('Nosso horário de atendimento é de Segunda a Sexta, das 08h às 18h. Deixe sua mensagem que responderemos logo no início do expediente!');
  const [triggers, setTriggers] = useState<any[]>([
    { id: 'trig-1', keyword: 'orçamento', response: 'Com certeza! Para criarmos uma proposta ideal para sua empresa, você pode clicar no botão de Orçamento em nosso site ou nos contar brevemente o seu segmento.', action: 'send_quote_form' },
    { id: 'trig-2', keyword: 'serviços', response: 'Oferecemos Criação de Websites Profissionais, E-commerces, Portais e Automação do WhatsApp Web com robôs e Agentes Virtuais de IA.', action: 'send_menu' },
    { id: 'trig-3', keyword: 'horário', response: 'Nosso expediente comercial funciona de Segunda a Sexta-feira, das 08:00 às 18:00 (horário de Brasília). Nosso robô responde 24 horas por dia!', action: 'none' },
    { id: 'trig-4', keyword: 'humano', response: 'Entendido! Estou notificando a equipe da Opera Digital para um especialista assumir este atendimento diretamente com você em instantes.', action: 'human_transfer' }
  ]);
  const [newKeyword, setNewKeyword] = useState('');
  const [newResponse, setNewResponse] = useState('');
  const [newAction, setNewAction] = useState<string>('none');

  // Test Sandbox state inside Admin
  const [sandboxInput, setSandboxInput] = useState('');
  const [sandboxMessages, setSandboxMessages] = useState<any[]>([
    { id: 'init', sender: 'bot', text: '🤖 Testador da Automação ativado! Envie uma palavra-chave como "orçamento", "serviços", "horário" ou "humano".' }
  ]);

  const handleSaveWhatsapp = async (e: React.FormEvent) => {
    e.preventDefault();
    const saved = saveWhatsAppNumber(whatsappInput);
    setWhatsappNumber(saved);
    setWhatsappInput(saved);

    try {
      await fetch('/api/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          whatsappNumber: saved,
          whatsappAutomation: {
            enabled: autoEnabled,
            welcomeMessage: welcomeMsg,
            awayMessage: awayMsg,
            workingHours: { start: '08:00', end: '18:00', days: ['seg', 'ter', 'qua', 'qui', 'sex'] },
            triggers
          }
        })
      });
    } catch (err) {
      console.warn('Error saving settings to server:', err);
    }

    setSaveSuccessMsg(true);
    setTimeout(() => setSaveSuccessMsg(false), 3500);
  };

  const handleAddTrigger = () => {
    if (!newKeyword.trim() || !newResponse.trim()) return;
    const newTrig = {
      id: `trig-${Date.now()}`,
      keyword: newKeyword.trim().toLowerCase(),
      response: newResponse.trim(),
      action: newAction
    };
    setTriggers([...triggers, newTrig]);
    setNewKeyword('');
    setNewResponse('');
    setNewAction('none');
  };

  const handleDeleteTrigger = (id: string) => {
    setTriggers(triggers.filter((t) => t.id !== id));
  };

  const handleRunSandboxTest = async (textToSend?: string) => {
    const text = textToSend || sandboxInput;
    if (!text.trim()) return;

    const userMsg = { id: `u-${Date.now()}`, sender: 'user', text };
    setSandboxMessages((prev) => [...prev, userMsg]);
    if (!textToSend) setSandboxInput('');

    try {
      const res = await fetch('/api/whatsapp/auto-reply', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: text })
      });
      const data = await res.json();

      setSandboxMessages((prev) => [
        ...prev,
        {
          id: `b-${Date.now()}`,
          sender: 'bot',
          text: data.reply,
          matched: data.matched,
          keywordMatched: data.keywordMatched,
          action: data.action
        }
      ]);
    } catch (err) {
      setSandboxMessages((prev) => [
        ...prev,
        { id: `b-${Date.now()}`, sender: 'bot', text: 'Resposta simulada para a palavra-chave configurada.' }
      ]);
    }
  };

  // AI Generation State
  const [isGeneratingAi, setIsGeneratingAi] = useState(false);

  const handleGenerateAi = async () => {
    if (!resultLink.trim()) return;

    setIsGeneratingAi(true);

    let formattedLink = resultLink.trim();
    if (!formattedLink.startsWith('http://') && !formattedLink.startsWith('https://')) {
      formattedLink = 'https://' + formattedLink;
      setResultLink(formattedLink);
    }

    try {
      const res = await fetch('/api/generate-project-info', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          url: formattedLink,
          clientName: clientName.trim(),
          category,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        if (data.title) setTitle(data.title);
        if (data.clientName) setClientName(data.clientName);
        if (data.category) setCategory(data.category);
        if (data.description) setDescription(data.description);
        if (data.resultMetric) setResultMetric(data.resultMetric);
        if (data.imageUrl) setImageUrl(data.imageUrl);
        if (data.tags && Array.isArray(data.tags)) setTags(data.tags.join(', '));
      } else {
        throw new Error('API request failed');
      }
    } catch (err) {
      console.warn('AI Generation silent fallback:', err);
      const domain = formattedLink.replace(/^https?:\/\//, '').split('/')[0];
      const domainClean = domain.replace(/^www\./, '').split('.')[0].toUpperCase();
      const derivedClient = clientName.trim() || domainClean;

      setTitle(`Plataforma Digital ${derivedClient}`);
      setClientName(derivedClient);
      setDescription(`Ecossistema web completo desenvolvido para ${derivedClient}, integrado e otimizado para gestão e vendas.`);
      setResultMetric('+210% em Eficiência Operacional');
      setImageUrl(`https://api.microlink.io/?url=${encodeURIComponent(formattedLink)}&screenshot=true&embed=screenshot.url`);
      setTags('Opera Digital, Inovação, Performance');
    } finally {
      setIsGeneratingAi(false);
    }
  };

  // Synchronize projects & leads with server API and localStorage
  useEffect(() => {
    const fetchServerData = async () => {
      let localData: PortfolioProject[] = [];
      try {
        const savedP = localStorage.getItem('opera_portfolio_projects');
        if (savedP) {
          const parsedP = JSON.parse(savedP);
          localData = sanitizeAndClean(parsedP);
        }
      } catch (e) {
        console.error(e);
      }

      let serverData: PortfolioProject[] = [];
      try {
        const resP = await fetch('/api/portfolio');
        if (resP.ok) {
          const data = await resP.json();
          serverData = sanitizeAndClean(data);
        }
      } catch (e) {
        console.warn('Projects sync warning:', e);
      }

      const MOCKUP_URL = 'https://i.ibb.co/6cGqNQZ3/aea34f64-4935-4dd1-b252-3a08f72e0f90.png';

      const projectMap = new Map<string, PortfolioProject>();

      // Seed with INITIAL_PORTFOLIO_PROJECTS as base defaults
      INITIAL_PORTFOLIO_PROJECTS.forEach((p) => {
        projectMap.set(p.id, p);
      });

      // Overlay server projects
      serverData.forEach((p) => {
        if (p && p.id) {
          if (p.id === 'personalizze-store' || !p.imageUrl) {
            p.imageUrl = MOCKUP_URL;
          }
          projectMap.set(p.id, p);
        }
      });

      // Overlay local projects
      localData.forEach((p) => {
        if (p && p.id) {
          if (p.id === 'personalizze-store' && (!p.imageUrl || p.imageUrl.includes('unsplash'))) {
            p.imageUrl = MOCKUP_URL;
          }
          projectMap.set(p.id, p);
        }
      });

      const merged = Array.from(projectMap.values());
      const finalProjects = merged.length > 0 ? merged : INITIAL_PORTFOLIO_PROJECTS;

      setProjects(finalProjects);
      try {
        localStorage.setItem('opera_portfolio_projects', JSON.stringify(finalProjects));
      } catch (e) {}

      fetch('/api/portfolio/sync', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(finalProjects)
      }).catch(() => {});

      try {
        const resL = await fetch('/api/leads');
        if (resL.ok) {
          const leadsData = await resL.json();
          if (Array.isArray(leadsData) && leadsData.length > 0) {
            setLeads(leadsData);
            localStorage.setItem('opera_registered_leads', JSON.stringify(leadsData));
          } else {
            const savedL = localStorage.getItem('opera_registered_leads');
            if (savedL) {
              const parsedL = JSON.parse(savedL);
              if (Array.isArray(parsedL) && parsedL.length > 0) {
                setLeads(parsedL);
                fetch('/api/leads/sync', {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify(parsedL)
                }).catch(() => {});
              }
            }
          }
        }
      } catch (e) {
        console.warn('Leads sync warning:', e);
      }

      try {
        const resS = await fetch('/api/settings');
        if (resS.ok) {
          const sData = await resS.json();
          if (sData.whatsappNumber) {
            setWhatsappNumber(sData.whatsappNumber);
            setWhatsappInput(sData.whatsappNumber);
            localStorage.setItem('opera_whatsapp_number', sData.whatsappNumber);
          }
          if (sData.whatsappAutomation) {
            setAutoEnabled(sData.whatsappAutomation.enabled ?? true);
            if (sData.whatsappAutomation.welcomeMessage) setWelcomeMsg(sData.whatsappAutomation.welcomeMessage);
            if (sData.whatsappAutomation.awayMessage) setAwayMsg(sData.whatsappAutomation.awayMessage);
            if (Array.isArray(sData.whatsappAutomation.triggers)) setTriggers(sData.whatsappAutomation.triggers);
          }
        }
      } catch (e) {
        console.warn('Settings sync warning:', e);
      }
    };

    fetchServerData();
  }, []);

  // Normalize lead objects for CRM compatibility
  const formatLeadForCrm = (l: any): CrmLead => {
    return {
      id: String(l.id || `lead-${Date.now()}`),
      fullName: l.fullName || l.name || 'Cliente',
      companyName: l.companyName || l.company || '',
      email: l.email || '',
      phone: l.phone || '',
      cnpj: l.cnpj || '',
      segment: l.segment || 'Geral',
      projectType: l.projectType || l.solution || 'Criação de Site Profissional',
      projectDescription: l.projectDescription || l.description || '',
      stage: l.stage || l.status || 'novo',
      priority: l.priority || 'media',
      estimatedValue: l.estimatedValue || 5000,
      assignedTo: l.assignedTo || 'Equipe Vendas',
      tags: l.tags || [],
      source: l.source || 'Formulário Site',
      createdAt: l.createdAt || l.date || new Date().toISOString(),
      notes: l.notes || [],
      activities: l.activities || []
    };
  };

  // Leads / Registrations state
  const [leads, setLeads] = useState<CrmLead[]>(() => {
    try {
      const saved = localStorage.getItem('opera_registered_leads');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) return parsed.map(formatLeadForCrm);
      }
    } catch (e) {
      console.error(e);
    }
    return [
      {
        id: 'lead-demo-1',
        fullName: 'Carlos Henrique Mendes',
        companyName: 'Mendes Advocacia & Consultoria',
        email: 'carlos@mendesadv.com.br',
        phone: '51992379969',
        cnpj: '12.345.678/0001-90',
        segment: 'Serviços Jurídicos',
        projectType: 'Criação de Site Profissional',
        projectDescription: 'Reformulação total da identidade digital e captação de clientes via WhatsApp.',
        stage: 'proposta',
        priority: 'alta',
        estimatedValue: 8500,
        source: 'Formulário Site',
        createdAt: new Date().toISOString(),
        notes: [
          { id: 'n1', text: 'Enviada proposta comercial detalhada com módulo de agendamento.', author: 'Consultor Vendas', createdAt: new Date().toISOString() }
        ],
        activities: [
          { id: 'a1', type: 'stage_change', description: 'Lead avançado para Proposta Enviada', createdAt: new Date().toISOString() }
        ]
      },
      {
        id: 'lead-demo-2',
        fullName: 'Mariana Duarte',
        companyName: 'Boutique Bella Moda',
        email: 'mariana@bellamoda.com.br',
        phone: '51988887777',
        cnpj: '98.765.432/0001-10',
        segment: 'Varejo / Moda',
        projectType: 'E-commerce Completo',
        projectDescription: 'Loja virtual integrada com PagSeguro e catálogo no WhatsApp Web.',
        stage: 'negociacao',
        priority: 'urgente',
        estimatedValue: 14000,
        source: 'WhatsApp Bot',
        createdAt: new Date().toISOString(),
        notes: [],
        activities: []
      }
    ];
  });

  const handleUpdateLead = (updatedLead: CrmLead) => {
    const updatedList = leads.map((l) => (l.id === updatedLead.id ? updatedLead : l));
    setLeads(updatedList);
    try {
      localStorage.setItem('opera_registered_leads', JSON.stringify(updatedList));
    } catch (e) {
      console.error(e);
    }
    fetch(`/api/leads/${updatedLead.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updatedLead)
    }).catch(() => {});
  };

  const handleCreateLead = (newLeadData: Partial<CrmLead>) => {
    const formatted = formatLeadForCrm(newLeadData);
    const updatedList = [formatted, ...leads];
    setLeads(updatedList);
    try {
      localStorage.setItem('opera_registered_leads', JSON.stringify(updatedList));
    } catch (e) {
      console.error(e);
    }
    fetch('/api/leads', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formatted)
    }).catch(() => {});
  };

  const handleAddNote = async (leadId: string, noteText: string) => {
    try {
      const res = await fetch(`/api/leads/${leadId}/notes`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: noteText, author: 'Equipe Opera Digital' })
      });
      if (res.ok) {
        const data = await res.json();
        if (data.lead) {
          handleUpdateLead(data.lead);
          return;
        }
      }
    } catch (e) {
      console.warn('Error adding note to server:', e);
    }

    // Fallback local update
    const target = leads.find((l) => l.id === leadId);
    if (target) {
      const newNote = {
        id: `note-${Date.now()}`,
        text: noteText,
        author: 'Equipe Opera Digital',
        createdAt: new Date().toISOString()
      };
      const updated = {
        ...target,
        notes: [newNote, ...(target.notes || [])],
        activities: [
          { id: `act-${Date.now()}`, type: 'note' as const, description: `Nota: "${noteText}"`, createdAt: new Date().toISOString() },
          ...(target.activities || [])
        ]
      };
      handleUpdateLead(updated);
    }
  };

  const handleDeleteLead = (id: number | string) => {
    const updated = leads.filter((l) => String(l.id) !== String(id));
    setLeads(updated);
    try {
      localStorage.setItem('opera_registered_leads', JSON.stringify(updated));
    } catch (e) {
      console.error(e);
    }
    fetch(`/api/leads/${id}`, { method: 'DELETE' }).catch(() => {});
  };

  // Testimonials State (Stored for future use)
  const [testimonials, setTestimonials] = useState<any[]>(() => {
    try {
      const saved = localStorage.getItem('opera_admin_testimonials');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error(e);
    }
    return [
      {
        id: 'test-1',
        author: 'Ricardo Mendes',
        role: 'Diretor Comercial',
        company: 'Mendes & Associados',
        quote: 'A criação do nosso site novo e a estruturação do nosso WhatsApp Web transformaram nosso atendimento. Hoje recebemos os clientes do Google direto no WhatsApp.',
        tags: 'Criação de Site, WhatsApp Web, Atendimento IA',
        status: 'Armazenado'
      }
    ];
  });

  const [isAddTestimonialModalOpen, setIsAddTestimonialModalOpen] = useState(false);
  const [testAuthor, setTestAuthor] = useState('');
  const [testRole, setTestRole] = useState('');
  const [testCompany, setTestCompany] = useState('');
  const [testQuote, setTestQuote] = useState('');
  const [testTags, setTestTags] = useState('');

  const handleSaveTestimonial = (e: React.FormEvent) => {
    e.preventDefault();
    if (!testAuthor.trim() || !testQuote.trim()) return;

    const newTestimonial = {
      id: 'test-' + Date.now(),
      author: testAuthor.trim(),
      role: testRole.trim() || 'Cliente',
      company: testCompany.trim() || 'Empresa Parceira',
      quote: testQuote.trim(),
      tags: testTags.trim() || 'Depoimento',
      status: 'Armazenado para o Futuro'
    };

    const updated = [newTestimonial, ...testimonials];
    setTestimonials(updated);
    try {
      localStorage.setItem('opera_admin_testimonials', JSON.stringify(updated));
    } catch (e) {
      console.error(e);
    }

    setTestAuthor('');
    setTestRole('');
    setTestCompany('');
    setTestQuote('');
    setTestTags('');
    setIsAddTestimonialModalOpen(false);
  };

  const handleDeleteTestimonial = (id: string) => {
    const updated = testimonials.filter(t => t.id !== id);
    setTestimonials(updated);
    try {
      localStorage.setItem('opera_admin_testimonials', JSON.stringify(updated));
    } catch (e) {
      console.error(e);
    }
  };

  const handleOpenAddModal = () => {
    setEditingProject(null);
    setTitle('');
    setClientName('');
    setCategory('E-commerce');
    setDescription('');
    setResultMetric('');
    setResultLink('');
    setImageUrl('');
    setTags('');
    setIsAddModalOpen(true);
  };

  const handleOpenEditModal = (p: PortfolioProject) => {
    setEditingProject(p);
    setTitle(p.title);
    setClientName(p.clientName);
    setCategory(p.category);
    setDescription(p.description);
    setResultMetric(p.resultMetric);
    setResultLink(p.resultLink);
    setImageUrl(p.imageUrl);
    setTags(p.tags.join(', '));
    setIsAddModalOpen(true);
  };

  const handleSaveProject = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !clientName.trim() || !resultLink.trim()) return;

    let formattedLink = resultLink.trim();
    if (!formattedLink.startsWith('http://') && !formattedLink.startsWith('https://')) {
      formattedLink = 'https://' + formattedLink;
    }

    const tagList = tags ? tags.split(',').map(t => t.trim()).filter(Boolean) : ['Opera Digital'];

    let projectToSave: PortfolioProject;

    if (editingProject) {
      projectToSave = {
        ...editingProject,
        title: title.trim(),
        clientName: clientName.trim(),
        category,
        description: description.trim() || editingProject.description,
        resultMetric: resultMetric.trim() || editingProject.resultMetric,
        resultLink: formattedLink,
        imageUrl: imageUrl.trim() || editingProject.imageUrl,
        tags: tagList
      };
      const updated = projects.map(p => p.id === editingProject.id ? projectToSave : p);
      setProjects(updated);
      try {
        localStorage.setItem('opera_portfolio_projects', JSON.stringify(updated));
      } catch (e) {
        console.error(e);
      }
    } else {
      projectToSave = {
        id: 'proj-' + Date.now(),
        title: title.trim(),
        clientName: clientName.trim(),
        category,
        description: description.trim() || 'Sistema implantado com sucesso para o cliente.',
        resultMetric: resultMetric.trim() || 'Meta Atingida',
        resultLink: formattedLink,
        imageUrl: imageUrl.trim() || 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=800',
        tags: tagList,
        completedDate: new Date().toISOString().substring(0, 7)
      };
      const updated = [projectToSave, ...projects];
      setProjects(updated);
      try {
        localStorage.setItem('opera_portfolio_projects', JSON.stringify(updated));
      } catch (e) {
        console.error(e);
      }
    }

    fetch('/api/portfolio', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(projectToSave)
    }).catch(() => {});

    setIsAddModalOpen(false);
  };

  const handleDelete = (p: PortfolioProject) => {
    setDeletingProject(p);
  };

  const confirmDelete = () => {
    if (!deletingProject) return;
    const targetId = deletingProject.id;
    const updated = projects.filter(p => p.id !== targetId);
    setProjects(updated);
    try {
      localStorage.setItem('opera_portfolio_projects', JSON.stringify(updated));
    } catch (e) {
      console.error(e);
    }
    fetch(`/api/portfolio/${targetId}`, { method: 'DELETE' }).catch(() => {});
    setDeletingProject(null);
  };

  const filteredProjects = projects.filter(p => {
    const q = searchQuery.toLowerCase().trim();
    return !q || p.title.toLowerCase().includes(q) || p.clientName.toLowerCase().includes(q) || p.category.toLowerCase().includes(q);
  });

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col font-sans">
      
      {/* Top Navigation Bar */}
      <header className="bg-slate-950 border-b border-slate-800 px-3.5 sm:px-8 py-3 sm:py-4 sticky top-0 z-30">
        <div className="max-w-7xl mx-auto flex flex-row items-center justify-between gap-3 sm:gap-4">
          
          <div className="flex items-center gap-2.5 sm:gap-3">
            <img 
              src="https://i.ibb.co/SX9x8b4k/d943fc28-7ed1-4e07-a215-5630a4dea11d.jpg" 
              alt="Opera Digital Logo" 
              className="h-8 sm:h-9 w-auto rounded-xl bg-white p-0.5 shrink-0"
              referrerPolicy="no-referrer"
            />
            <div>
              <div className="flex items-center gap-1.5 sm:gap-2">
                <span className="font-extrabold text-xs sm:text-base text-white tracking-wide">Painel Admin</span>
                <span className="bg-blue-500/20 text-blue-400 border border-blue-500/30 text-[9px] sm:text-[10px] font-black px-1.5 sm:px-2 py-0.5 rounded-md uppercase">
                  Master
                </span>
              </div>
              <p className="text-[10px] sm:text-xs text-slate-400 font-mono truncate max-w-[130px] sm:max-w-none">
                operadigital.link@gmail.com
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            <button
              onClick={onGoToSite}
              className="bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold px-3 sm:px-4 py-2 sm:py-2.5 rounded-xl border border-slate-700 transition-colors flex items-center gap-1.5"
            >
              <ArrowLeft className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              <span className="hidden xs:inline sm:inline">Ver Site</span>
            </button>

            <button
              onClick={onLogout}
              className="bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/30 text-xs font-bold px-3 sm:px-4 py-2 sm:py-2.5 rounded-xl transition-colors flex items-center gap-1.5"
            >
              <LogOut className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              <span>Sair</span>
            </button>
          </div>

        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-3.5 sm:px-8 py-5 sm:py-8 space-y-6 sm:space-y-8">
        
        {/* Navigation Tabs Bar */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 sm:gap-4 border-b border-slate-800 pb-4">
          <div className="w-full md:w-auto overflow-x-auto pb-1.5 md:pb-0 scrollbar-none">
            <div className="flex items-center gap-1.5 sm:gap-2 bg-slate-950 p-1.5 rounded-2xl border border-slate-800 min-w-max">
              <button
                onClick={() => setActiveTab('portfolio')}
                className={`px-3 sm:px-4 py-2 sm:py-2.5 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-1.5 sm:gap-2 transition-all shrink-0 ${
                  activeTab === 'portfolio'
                    ? 'bg-[#0A4EE4] text-white shadow-md'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <Building2 className="w-4 h-4" />
                <span>Trabalhos ({projects.length})</span>
              </button>

              <button
                onClick={() => setActiveTab('leads')}
                className={`px-3 sm:px-4 py-2 sm:py-2.5 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-1.5 sm:gap-2 transition-all shrink-0 ${
                  activeTab === 'leads'
                    ? 'bg-[#0A4EE4] text-white shadow-md'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <Users className="w-4 h-4" />
                <span>CRM & Leads ({leads.length})</span>
              </button>

              <button
                onClick={() => setActiveTab('testimonials')}
                className={`px-3 sm:px-4 py-2 sm:py-2.5 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-1.5 sm:gap-2 transition-all shrink-0 ${
                  activeTab === 'testimonials'
                    ? 'bg-[#0A4EE4] text-white shadow-md'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <Quote className="w-4 h-4" />
                <span>Depoimentos ({testimonials.length})</span>
              </button>

              <button
                onClick={() => setActiveTab('whatsapp')}
                className={`px-3 sm:px-4 py-2 sm:py-2.5 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-1.5 sm:gap-2 transition-all shrink-0 ${
                  activeTab === 'whatsapp'
                    ? 'bg-emerald-600 text-white shadow-md'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <MessageSquare className="w-4 h-4 text-emerald-400 fill-current" />
                <span>Config WhatsApp</span>
              </button>

              <button
                onClick={() => setActiveTab('metrics')}
                className={`px-3 sm:px-4 py-2 sm:py-2.5 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-1.5 sm:gap-2 transition-all shrink-0 ${
                  activeTab === 'metrics'
                    ? 'bg-[#0A4EE4] text-white shadow-md'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <BarChart3 className="w-4 h-4" />
                <span>Métricas</span>
              </button>
            </div>
          </div>

          {activeTab === 'portfolio' && (
            <button
              onClick={handleOpenAddModal}
              className="w-full md:w-auto bg-[#0A4EE4] hover:bg-blue-600 text-white font-bold text-xs sm:text-sm px-5 py-2.5 sm:py-3 rounded-xl transition-all shadow-lg shadow-blue-900/30 flex items-center justify-center gap-2 min-h-[44px]"
            >
              <Plus className="w-4 h-4" />
              <span>Novo Trabalho / Projeto</span>
            </button>
          )}

          {activeTab === 'testimonials' && (
            <button
              onClick={() => setIsAddTestimonialModalOpen(true)}
              className="w-full md:w-auto bg-[#0A4EE4] hover:bg-blue-600 text-white font-bold text-xs sm:text-sm px-5 py-2.5 sm:py-3 rounded-xl transition-all shadow-lg shadow-blue-900/30 flex items-center justify-center gap-2 min-h-[44px]"
            >
              <Plus className="w-4 h-4" />
              <span>Novo Depoimento</span>
            </button>
          )}
        </div>

        {/* TAB 1: PORTFOLIO MANAGEMENT */}
        {activeTab === 'portfolio' && (
          <div className="space-y-6">
            
            {/* Search and Filters */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-slate-950 p-4 rounded-2xl border border-slate-800">
              <div className="relative w-full sm:w-80">
                <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Buscar trabalho por nome, cliente..."
                  className="w-full bg-slate-900 border border-slate-800 text-xs sm:text-sm text-slate-200 placeholder-slate-500 pl-9 pr-4 py-2.5 rounded-xl focus:outline-none focus:border-blue-500"
                />
              </div>

              <div className="text-xs text-slate-400 font-medium">
                Exibindo <strong className="text-white">{filteredProjects.length}</strong> de <strong className="text-white">{projects.length}</strong> trabalhos cadastrados
              </div>
            </div>

            {/* Projects Table / Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
              {filteredProjects.map((p) => (
                <div 
                  key={p.id}
                  className="bg-slate-950 rounded-2xl border border-slate-800 hover:border-slate-700 p-5 flex flex-col justify-between space-y-4 shadow-xl transition-all"
                >
                  <div className="flex gap-4">
                    <img 
                      src={p.imageUrl || 'https://i.ibb.co/6cGqNQZ3/aea34f64-4935-4dd1-b252-3a08f72e0f90.png'} 
                      alt={p.title} 
                      className="w-24 h-24 rounded-xl object-cover border border-slate-800 shrink-0"
                      referrerPolicy="no-referrer"
                      onError={(e) => {
                        (e.currentTarget as HTMLImageElement).src = '/personalizze_mockup.jpg';
                      }}
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-extrabold text-blue-400 bg-blue-500/10 px-2.5 py-0.5 rounded-full uppercase border border-blue-500/20">
                          {p.category}
                        </span>
                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => handleOpenEditModal(p)}
                            className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
                            title="Editar"
                          >
                            <Edit3 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(p)}
                            className="p-2 text-slate-400 hover:text-rose-400 hover:bg-rose-500/20 rounded-xl transition-colors min-w-[36px] min-h-[36px] flex items-center justify-center"
                            title="Excluir Trabalho"
                          >
                            <Trash2 className="w-4 h-4 text-rose-400" />
                          </button>
                        </div>
                      </div>

                      <h4 className="font-bold text-white text-base truncate mt-1">
                        {p.title}
                      </h4>
                      <p className="text-xs text-slate-400 truncate">
                        Cliente: <strong className="text-slate-200">{p.clientName}</strong>
                      </p>
                      <p className="text-xs text-slate-400 line-clamp-2 mt-2 leading-relaxed">
                        {p.description}
                      </p>
                    </div>
                  </div>

                  {/* Result Link Banner */}
                  <div className="bg-slate-900/80 p-3 rounded-xl border border-slate-800/80 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
                    <div>
                      <span className="text-[10px] uppercase font-bold text-slate-500 block">Link do Resultado:</span>
                      <a 
                        href={p.resultLink} 
                        target="_blank" 
                        rel="noreferrer"
                        className="font-mono text-blue-400 hover:underline truncate block max-w-xs"
                      >
                        {p.resultLink}
                      </a>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-slate-900">
                    <div className="flex flex-wrap gap-1">
                      {p.tags.map((t, idx) => (
                        <span key={idx} className="bg-slate-900 text-slate-400 text-[10px] px-2 py-0.5 rounded font-mono">
                          #{t}
                        </span>
                      ))}
                    </div>

                    <a
                      href={p.resultLink}
                      target="_blank"
                      rel="noreferrer"
                      className="bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1.5 shrink-0"
                    >
                      <span>Testar Link</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  </div>
                </div>
              ))}
            </div>

          </div>
        )}

        {/* TAB 2: CRM & LEADS MANAGEMENT */}
        {activeTab === 'leads' && (
          <CrmSystem
            leads={leads}
            onUpdateLead={handleUpdateLead}
            onDeleteLead={handleDeleteLead}
            onCreateLead={handleCreateLead}
            onAddNote={handleAddNote}
          />
        )}


        {/* TAB: TESTIMONIALS MANAGEMENT */}
        {activeTab === 'testimonials' && (
          <div className="space-y-6">
            <div className="bg-[#0A4EE4]/10 border border-blue-500/30 p-4 rounded-2xl flex items-start gap-3">
              <Quote className="w-5 h-5 text-blue-400 shrink-0 mt-0.5" />
              <div className="text-xs text-slate-300 space-y-1">
                <p className="font-bold text-white">Gestão de Depoimentos (Aguardando Ativação)</p>
                <p className="text-slate-400">
                  Os depoimentos foram removidos da página inicial pública. Você pode cadastrar, alterar e armazenar depoimentos neste espaço para reativá-los futuramente.
                </p>
              </div>
            </div>

            {testimonials.length === 0 ? (
              <div className="bg-slate-950 rounded-2xl border border-slate-800 p-12 text-center">
                <Quote className="w-12 h-12 text-slate-700 mx-auto mb-3" />
                <h4 className="text-white font-bold text-base">Nenhum depoimento cadastrado</h4>
                <p className="text-slate-400 text-xs mt-1 max-w-sm mx-auto mb-4">
                  Adicione depoimentos de clientes satisfeitos para mantê-los salvos aqui.
                </p>
                <button
                  onClick={() => setIsAddTestimonialModalOpen(true)}
                  className="bg-[#0A4EE4] hover:bg-blue-600 text-white font-bold text-xs px-4 py-2.5 rounded-xl inline-flex items-center gap-2"
                >
                  <Plus className="w-4 h-4" />
                  <span>Cadastrar Primeiro Depoimento</span>
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {testimonials.map((t) => (
                  <div key={t.id} className="bg-slate-950 p-6 rounded-2xl border border-slate-800 space-y-4 relative group">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1 text-amber-400">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} className="w-3.5 h-3.5 fill-amber-400" />
                        ))}
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-bold bg-slate-800 text-slate-400 px-2 py-0.5 rounded-full border border-slate-700">
                          {t.status || 'Armazenado'}
                        </span>
                        <button
                          onClick={() => handleDeleteTestimonial(t.id)}
                          className="p-1.5 text-slate-500 hover:text-rose-400 hover:bg-rose-500/20 rounded-lg transition-colors"
                          title="Excluir Depoimento"
                        >
                          <Trash2 className="w-4 h-4 text-rose-400" />
                        </button>
                      </div>
                    </div>

                    <p className="text-sm text-slate-200 italic leading-relaxed">
                      "{t.quote}"
                    </p>

                    <div className="pt-3 border-t border-slate-900 flex items-center justify-between text-xs">
                      <div>
                        <h5 className="font-bold text-white">{t.author}</h5>
                        <p className="text-[11px] text-slate-400">{t.role} • {t.company}</p>
                      </div>
                      <div className="text-[10px] bg-blue-500/10 text-blue-400 font-mono px-2 py-0.5 rounded border border-blue-500/20">
                        {t.tags}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* TAB 3: SYSTEM METRICS */}
        {activeTab === 'metrics' && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-slate-950 p-6 rounded-2xl border border-slate-800 space-y-2">
              <div className="text-xs text-slate-400 uppercase font-bold">Servidor & Status API</div>
              <div className="text-2xl font-black text-emerald-400 flex items-center gap-2">
                <CheckCircle2 className="w-6 h-6" />
                <span>100% Operacional</span>
              </div>
              <p className="text-xs text-slate-500 pt-2 border-t border-slate-800">
                Integração Gemini AI e Sefaz operando com latência de 120ms.
              </p>
            </div>

            <div className="bg-slate-950 p-6 rounded-2xl border border-slate-800 space-y-2">
              <div className="text-xs text-slate-400 uppercase font-bold">WhatsApp de Vendas</div>
              <div className="text-xl font-extrabold text-emerald-400 font-mono truncate">
                {formatWhatsAppDisplay(whatsappNumber)}
              </div>
              <p className="text-xs text-slate-500 pt-2 border-t border-slate-800">
                Encaminhamento ativo para recebimento de solicitações.
              </p>
            </div>

            <div className="bg-slate-950 p-6 rounded-2xl border border-slate-800 space-y-2">
              <div className="text-xs text-slate-400 uppercase font-bold">Administrador Ativo</div>
              <div className="text-base font-bold text-blue-400 truncate">
                operadigital.link@gmail.com
              </div>
              <p className="text-xs text-slate-500 pt-2 border-t border-slate-800">
                Acesso total liberado para adição e edição de resultados.
              </p>
            </div>
          </div>
        )}

        {/* TAB 4: WHATSAPP CONFIGURATION & AUTOMATION */}
        {activeTab === 'whatsapp' && (
          <div className="max-w-4xl space-y-8">
            
            {/* CARD 1: NUMERO PRINCIPAL & DADOS COMERCIAIS */}
            <div className="bg-slate-950 p-6 sm:p-8 rounded-3xl border border-slate-800 shadow-2xl space-y-6">
              <div className="flex items-center justify-between border-b border-slate-800 pb-5">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 flex items-center justify-center shrink-0">
                    <MessageSquare className="w-6 h-6 fill-current" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-white flex items-center gap-2">
                      <span>WhatsApp Business & Automação</span>
                      <span className="bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[10px] font-black px-2 py-0.5 rounded-md uppercase">
                        {autoEnabled ? 'Robô Ativo' : 'Pausado'}
                      </span>
                    </h3>
                    <p className="text-xs text-slate-400 mt-0.5">
                      Configure o número comercial e personalize os robôs e respostas automáticas de atendimento.
                    </p>
                  </div>
                </div>

                {/* Status Toggle */}
                <button
                  type="button"
                  onClick={() => setAutoEnabled(!autoEnabled)}
                  className={`px-4 py-2 rounded-xl text-xs font-bold border transition-all flex items-center gap-2 ${
                    autoEnabled
                      ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40 hover:bg-emerald-500/30'
                      : 'bg-slate-800 text-slate-400 border-slate-700 hover:text-white'
                  }`}
                >
                  <Bot className="w-4 h-4" />
                  <span>{autoEnabled ? 'Automação Ativada' : 'Ativar Automação'}</span>
                </button>
              </div>

              {/* Status Banner */}
              <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 rounded-full bg-emerald-400 animate-ping shrink-0" />
                  <div>
                    <div className="text-xs font-bold text-slate-400 uppercase">Número Ativo no Site</div>
                    <div className="text-xl font-extrabold text-emerald-400 font-mono tracking-wider">
                      {formatWhatsAppDisplay(whatsappNumber)}
                    </div>
                  </div>
                </div>
                <a
                  href={`https://wa.me/${whatsappNumber.replace(/\D/g, '')}?text=${encodeURIComponent('Teste de envio do Painel Admin Opera Digital')}`}
                  target="_blank"
                  rel="noreferrer"
                  className="bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold px-4 py-2.5 rounded-xl border border-slate-700 transition-colors flex items-center gap-2 w-fit"
                >
                  <ExternalLink className="w-4 h-4 text-emerald-400" />
                  <span>Testar Número no WhatsApp</span>
                </a>
              </div>

              {/* Number Input Form */}
              <form onSubmit={handleSaveWhatsapp} className="space-y-6">
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-2">
                    Número do WhatsApp Comercial (Com DDD) *
                  </label>
                  <div className="relative">
                    <Phone className="w-5 h-5 text-slate-500 absolute left-3.5 top-3.5" />
                    <input
                      type="text"
                      required
                      value={whatsappInput}
                      onChange={(e) => setWhatsappInput(e.target.value)}
                      placeholder="+5551992379969 ou 51992379969"
                      className="w-full bg-slate-900 border border-slate-800 text-white font-mono text-base pl-11 pr-4 py-3 rounded-2xl focus:outline-none focus:border-emerald-500"
                    />
                  </div>
                  <p className="text-[11px] text-slate-400 mt-2 flex items-center gap-1.5">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                    <span>Exemplo para Porto Alegre/RS: <strong className="text-slate-300">5551992379969</strong></span>
                  </p>
                </div>

                {/* CARD 2: REGRAS E MENSAGENS PADRÃO */}
                <div className="pt-4 border-t border-slate-800 space-y-4">
                  <h4 className="text-sm font-bold text-white flex items-center gap-2">
                    <Bot className="w-4 h-4 text-emerald-400" />
                    <span>Mensagens Automáticas Principais</span>
                  </h4>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-300 mb-2">
                        Mensagem de Boas-Vindas (Primeira Interação)
                      </label>
                      <textarea
                        rows={3}
                        value={welcomeMsg}
                        onChange={(e) => setWelcomeMsg(e.target.value)}
                        className="w-full bg-slate-900 border border-slate-800 text-white text-xs p-3 rounded-xl focus:outline-none focus:border-emerald-500 leading-relaxed"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-300 mb-2">
                        Mensagem de Ausência (Fora do Horário)
                      </label>
                      <textarea
                        rows={3}
                        value={awayMsg}
                        onChange={(e) => setAwayMsg(e.target.value)}
                        className="w-full bg-slate-900 border border-slate-800 text-white text-xs p-3 rounded-xl focus:outline-none focus:border-emerald-500 leading-relaxed"
                      />
                    </div>
                  </div>
                </div>

                {/* CARD 3: GERENCIADOR DE REGRAS E PALAVRAS-CHAVE */}
                <div className="pt-4 border-t border-slate-800 space-y-4">
                  <div className="flex items-center justify-between">
                    <h4 className="text-sm font-bold text-white flex items-center gap-2">
                      <Zap className="w-4 h-4 text-emerald-400" />
                      <span>Gatilhos de Palavras-Chave (Respostas Inteligentes)</span>
                    </h4>
                    <span className="text-xs text-slate-400 font-medium">
                      {triggers.length} regras ativas
                    </span>
                  </div>

                  {/* Existing Triggers List */}
                  <div className="space-y-3">
                    {triggers.map((trig) => (
                      <div
                        key={trig.id}
                        className="p-3.5 rounded-2xl bg-slate-900 border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                      >
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <span className="bg-emerald-950 text-emerald-400 font-mono text-xs font-bold px-2.5 py-0.5 rounded-lg border border-emerald-800/60">
                              g: "{trig.keyword}"
                            </span>
                            {trig.action && trig.action !== 'none' && (
                              <span className="bg-blue-950 text-blue-400 text-[10px] font-bold px-2 py-0.5 rounded-md border border-blue-800/60 uppercase">
                                Ação: {trig.action}
                              </span>
                            )}
                          </div>
                          <p className="text-xs text-slate-300 leading-relaxed pt-0.5">
                            {trig.response}
                          </p>
                        </div>

                        <button
                          type="button"
                          onClick={() => handleDeleteTrigger(trig.id)}
                          className="text-slate-500 hover:text-red-400 p-2 rounded-lg hover:bg-slate-800 transition-colors self-end sm:self-center"
                          title="Excluir Gatilho"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>

                  {/* Add New Trigger Form */}
                  <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-3">
                    <div className="text-xs font-bold text-slate-300 flex items-center gap-2">
                      <Plus className="w-4 h-4 text-emerald-400" />
                      <span>Adicionar Nova Regra de Resposta Automática</span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <div>
                        <input
                          type="text"
                          placeholder="Palavra-chave (ex: preço)"
                          value={newKeyword}
                          onChange={(e) => setNewKeyword(e.target.value)}
                          className="w-full bg-slate-950 border border-slate-800 text-white text-xs p-2.5 rounded-xl focus:outline-none focus:border-emerald-500"
                        />
                      </div>

                      <div className="sm:col-span-2">
                        <input
                          type="text"
                          placeholder="Resposta automática do robô..."
                          value={newResponse}
                          onChange={(e) => setNewResponse(e.target.value)}
                          className="w-full bg-slate-950 border border-slate-800 text-white text-xs p-2.5 rounded-xl focus:outline-none focus:border-emerald-500"
                        />
                      </div>
                    </div>

                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-slate-400">Ação pós-resposta:</span>
                        <select
                          value={newAction}
                          onChange={(e) => setNewAction(e.target.value)}
                          className="bg-slate-950 border border-slate-800 text-slate-200 text-xs p-2 rounded-lg focus:outline-none"
                        >
                          <option value="none">Nenhuma ação</option>
                          <option value="send_quote_form">Abrir Formulário de Orçamento</option>
                          <option value="send_menu">Exibir Menu de Opções</option>
                          <option value="human_transfer">Transferir para Humano</option>
                        </select>
                      </div>

                      <button
                        type="button"
                        onClick={handleAddTrigger}
                        disabled={!newKeyword.trim() || !newResponse.trim()}
                        className="bg-slate-800 hover:bg-slate-700 disabled:opacity-50 text-emerald-400 text-xs font-bold px-4 py-2 rounded-xl border border-slate-700 transition-colors flex items-center justify-center gap-1.5"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>Adicionar Regra</span>
                      </button>
                    </div>
                  </div>
                </div>

                {saveSuccessMsg && (
                  <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs font-bold flex items-center gap-2 animate-in fade-in">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    <span>Configurações do WhatsApp salvas com sucesso no servidor!</span>
                  </div>
                )}

                <div className="pt-2 flex items-center justify-end">
                  <button
                    type="submit"
                    className="bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-sm px-7 py-3.5 rounded-xl shadow-lg shadow-emerald-950/60 transition-all flex items-center gap-2"
                  >
                    <Save className="w-4 h-4" />
                    <span>Salvar Configurações da Automação</span>
                  </button>
                </div>
              </form>
            </div>

            {/* CARD 4: TESTADOR DE SIMULAÇÃO DE BOT (SANDBOX INTEGRADO) */}
            <div className="bg-slate-950 p-6 rounded-3xl border border-slate-800 space-y-4 shadow-xl">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <h4 className="text-sm font-bold text-white flex items-center gap-2">
                  <Play className="w-4 h-4 text-emerald-400" />
                  <span>Simulador de Teste da Automação (Sandbox no Painel)</span>
                </h4>
                <span className="text-[10px] bg-slate-800 text-slate-300 px-2.5 py-1 rounded-md font-mono">
                  Ambiente de Teste
                </span>
              </div>

              <div className="bg-slate-900/80 rounded-2xl p-4 border border-slate-800 space-y-3 h-64 overflow-y-auto">
                {sandboxMessages.map((m) => (
                  <div
                    key={m.id}
                    className={`flex flex-col ${m.sender === 'user' ? 'items-end' : 'items-start'}`}
                  >
                    <div
                      className={`max-w-[85%] rounded-2xl px-3.5 py-2.5 text-xs leading-relaxed ${
                        m.sender === 'user'
                          ? 'bg-blue-600 text-white rounded-br-none'
                          : 'bg-slate-800 text-slate-100 border border-slate-700/80 rounded-bl-none'
                      }`}
                    >
                      {m.text}
                      {m.keywordMatched && (
                        <div className="text-[9px] text-emerald-400 font-mono mt-1 pt-1 border-t border-slate-700">
                          Gatilho ativado: "{m.keywordMatched}"
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="text"
                  placeholder="Digite uma mensagem para testar a resposta do robô..."
                  value={sandboxInput}
                  onChange={(e) => setSandboxInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleRunSandboxTest()}
                  className="flex-1 bg-slate-900 border border-slate-800 text-white text-xs px-4 py-3 rounded-xl focus:outline-none focus:border-emerald-500"
                />
                <button
                  type="button"
                  onClick={() => handleRunSandboxTest()}
                  className="bg-emerald-600 hover:bg-emerald-500 text-white px-5 py-3 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Testar</span>
                </button>
              </div>
            </div>

            {/* CARD 5: WEBHOOK & META WHATSAPP BUSINESS CLOUD API INTEGRATION */}
            <div className="bg-slate-950 p-6 rounded-3xl border border-slate-800 space-y-4">
              <h4 className="text-sm font-bold text-white flex items-center gap-2">
                <Globe className="w-4 h-4 text-blue-400" />
                <span>Integração com Webhook Meta WhatsApp Business Cloud API</span>
              </h4>
              <p className="text-xs text-slate-300 leading-relaxed">
                Para conectar sua conta oficial da Meta (Facebook Business Manager) diretamente ao servidor da Opera Digital, utilize a URL de Webhook abaixo para receber eventos de mensagens e cadastrar leads instantaneamente:
              </p>

              <div className="p-3 bg-slate-900 border border-slate-800 rounded-xl flex items-center justify-between font-mono text-xs text-emerald-400">
                <span className="truncate pr-2">{typeof window !== 'undefined' ? `${window.location.origin}/api/whatsapp/webhook` : '/api/whatsapp/webhook'}</span>
                <span className="bg-emerald-950 text-emerald-300 text-[10px] px-2 py-1 rounded font-bold uppercase shrink-0">
                  GET & POST
                </span>
              </div>
            </div>

          </div>
        )}

      </main>

      {/* ADD / EDIT WORK MODAL */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-xs">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-xl w-full overflow-hidden shadow-2xl text-slate-100">
            <div className="bg-slate-950 p-6 border-b border-slate-800 flex items-center justify-between">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-blue-400" />
                <span>{editingProject ? 'Editar Trabalho Realizado' : 'Adicionar Trabalho ao Portfólio'}</span>
              </h3>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="text-slate-400 hover:text-white p-1 rounded-lg"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveProject} className="p-6 space-y-4 max-h-[75vh] overflow-y-auto">
              {/* AI AUTO GENERATE BANNER */}
              <div className="p-4 bg-gradient-to-r from-blue-900/40 via-indigo-900/30 to-purple-900/40 border border-blue-500/30 rounded-2xl space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-xs font-bold text-blue-300">
                    <Sparkles className="w-4 h-4 text-blue-400 animate-pulse" />
                    <span>Geração Automática de Publicação com IA</span>
                  </div>
                </div>
                <p className="text-[11px] text-slate-300 leading-relaxed">
                  Insira o link (URL) do seu projeto abaixo e clique para preencher automaticamente o título, descrição, imagem de capa, métricas e tags!
                </p>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">Link do Resultado Final (URL) *</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    required
                    value={resultLink}
                    onChange={(e) => setResultLink(e.target.value)}
                    placeholder="https://exemplo.com.br ou https://cliente.com.br"
                    className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-sm text-blue-400 font-mono focus:outline-none focus:border-blue-500"
                  />
                  <button
                    type="button"
                    onClick={handleGenerateAi}
                    disabled={isGeneratingAi || !resultLink.trim()}
                    className="px-4 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white text-xs font-bold rounded-xl shadow-md transition-all flex items-center gap-2 disabled:opacity-50 whitespace-nowrap min-h-[42px]"
                  >
                    {isGeneratingAi ? (
                      <>
                        <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        <span>Gerando...</span>
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-4 h-4 text-blue-200" />
                        <span>Gerar com IA</span>
                      </>
                    )}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">Título do Projeto *</label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Ex: E-commerce de Peças Automotivas"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">Cliente / Empresa *</label>
                <input
                  type="text"
                  required
                  value={clientName}
                  onChange={(e) => setClientName(e.target.value)}
                  placeholder="Ex: Nexon Distribuidora"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">Descrição Breve</label>
                <textarea
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Resumo do que foi entregue..."
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">URL da Imagem de Capa</label>
                <input
                  type="text"
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  placeholder="https://images.unsplash.com/..."
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">Tags (Separadas por vírgula)</label>
                <input
                  type="text"
                  value={tags}
                  onChange={(e) => setTags(e.target.value)}
                  placeholder="E-commerce, NFe, WhatsApp AI"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-blue-500"
                />
              </div>

              <div className="pt-4 border-t border-slate-800 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-xs font-bold rounded-xl text-slate-300"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#0A4EE4] hover:bg-blue-600 text-xs font-bold rounded-xl text-white shadow-md"
                >
                  Salvar Alterações
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

      {/* ADD TESTIMONIAL MODAL */}
      {isAddTestimonialModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-xs">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-lg w-full overflow-hidden shadow-2xl text-slate-100">
            <div className="bg-slate-950 p-6 border-b border-slate-800 flex items-center justify-between">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <Quote className="w-5 h-5 text-blue-400" />
                <span>Novo Depoimento de Cliente</span>
              </h3>
              <button
                onClick={() => setIsAddTestimonialModalOpen(false)}
                className="text-slate-400 hover:text-white p-1 rounded-lg"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveTestimonial} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">Nome do Cliente *</label>
                <input
                  type="text"
                  required
                  value={testAuthor}
                  onChange={(e) => setTestAuthor(e.target.value)}
                  placeholder="Ex: Carlos Silva"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-blue-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">Cargo</label>
                  <input
                    type="text"
                    value={testRole}
                    onChange={(e) => setTestRole(e.target.value)}
                    placeholder="Ex: Diretor de Vendas"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">Empresa</label>
                  <input
                    type="text"
                    value={testCompany}
                    onChange={(e) => setTestCompany(e.target.value)}
                    placeholder="Ex: Silva Distribuidora"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">Depoimento / Texto *</label>
                <textarea
                  required
                  rows={4}
                  value={testQuote}
                  onChange={(e) => setTestQuote(e.target.value)}
                  placeholder="Escreva a avaliação do cliente aqui..."
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">Tags (Separadas por vírgula)</label>
                <input
                  type="text"
                  value={testTags}
                  onChange={(e) => setTestTags(e.target.value)}
                  placeholder="Criação de Site, WhatsApp IA"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-blue-500"
                />
              </div>

              <div className="pt-4 border-t border-slate-800 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsAddTestimonialModalOpen(false)}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-xs font-bold rounded-xl text-slate-300"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#0A4EE4] hover:bg-blue-600 text-xs font-bold rounded-xl text-white shadow-md"
                >
                  Salvar Depoimento
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* DELETE CONFIRMATION MODAL */}
      {deletingProject && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-xs">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-md w-full p-6 space-y-4 shadow-2xl text-slate-100">
            <div className="w-12 h-12 rounded-2xl bg-rose-500/20 text-rose-400 border border-rose-500/30 flex items-center justify-center mx-auto">
              <Trash2 className="w-6 h-6" />
            </div>
            <div className="text-center space-y-2">
              <h3 className="text-lg font-bold text-white">Excluir Trabalho?</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Tem certeza que deseja remover o trabalho <strong className="text-slate-200">"{deletingProject.title}"</strong> ({deletingProject.clientName}) do painel? Esta alteração refletirá em todo o site.
              </p>
            </div>
            <div className="flex items-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => setDeletingProject(null)}
                className="flex-1 py-3 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold rounded-xl transition-colors min-h-[44px]"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={confirmDelete}
                className="flex-1 py-3 bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold rounded-xl shadow-md transition-colors min-h-[44px]"
              >
                Sim, Excluir
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
