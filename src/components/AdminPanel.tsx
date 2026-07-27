import React, { useState, useEffect } from 'react';
import { 
  Building2, Plus, ExternalLink, Trash2, Edit3, Search, 
  Users, TrendingUp, Sparkles, LogOut, CheckCircle2, ArrowLeft,
  MessageSquare, Globe, Tag, RefreshCw, BarChart3, ShieldCheck, Mail, Phone
} from 'lucide-react';
import { INITIAL_PORTFOLIO_PROJECTS } from '../data/mockData';
import { PortfolioProject } from '../types';

interface AdminPanelProps {
  onLogout: () => void;
  onGoToSite: () => void;
}

export const AdminPanel: React.FC<AdminPanelProps> = ({ onLogout, onGoToSite }) => {
  const [activeTab, setActiveTab] = useState<'portfolio' | 'leads' | 'metrics'>('portfolio');

  // Portfolio State
  const [projects, setProjects] = useState<PortfolioProject[]>(() => {
    try {
      const saved = localStorage.getItem('opera_portfolio_projects');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          return parsed.filter((p: any) => !['proj-1', 'proj-2', 'proj-3', 'proj-4'].includes(p.id));
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

  // AI Generation State
  const [isGeneratingAi, setIsGeneratingAi] = useState(false);
  const [aiError, setAiError] = useState('');

  const handleGenerateAi = async () => {
    if (!resultLink.trim()) {
      setAiError('Digite a URL do trabalho (link) antes de gerar com IA.');
      return;
    }

    setIsGeneratingAi(true);
    setAiError('');

    try {
      let formattedLink = resultLink.trim();
      if (!formattedLink.startsWith('http://') && !formattedLink.startsWith('https://')) {
        formattedLink = 'https://' + formattedLink;
        setResultLink(formattedLink);
      }

      const res = await fetch('/api/generate-project-info', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          url: formattedLink,
          clientName: clientName.trim(),
          category,
        }),
      });

      if (!res.ok) {
        throw new Error('Erro no servidor ao consultar IA');
      }

      const data = await res.json();

      if (data.title) setTitle(data.title);
      if (data.clientName) setClientName(data.clientName);
      if (data.category) setCategory(data.category);
      if (data.description) setDescription(data.description);
      if (data.resultMetric) setResultMetric(data.resultMetric);
      if (data.imageUrl) setImageUrl(data.imageUrl);
      if (data.tags && Array.isArray(data.tags)) setTags(data.tags.join(', '));
    } catch (err) {
      console.error(err);
      setAiError('Ocorreu um erro ao gerar com IA. Você pode preencher os campos manualmente.');
    } finally {
      setIsGeneratingAi(false);
    }
  };

  // Save portfolio to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('opera_portfolio_projects', JSON.stringify(projects));
    } catch (e) {
      console.error(e);
    }
  }, [projects]);

  // Leads / Registrations state
  const [leads, setLeads] = useState<any[]>(() => {
    try {
      const saved = localStorage.getItem('opera_registered_leads');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error(e);
    }
    return [];
  });

  const handleDeleteLead = (id: number | string) => {
    const updated = leads.filter((l) => l.id !== id);
    setLeads(updated);
    try {
      localStorage.setItem('opera_registered_leads', JSON.stringify(updated));
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

    if (editingProject) {
      // Update existing
      const updated = projects.map(p => {
        if (p.id === editingProject.id) {
          return {
            ...p,
            title: title.trim(),
            clientName: clientName.trim(),
            category,
            description: description.trim() || p.description,
            resultMetric: resultMetric.trim() || p.resultMetric,
            resultLink: formattedLink,
            imageUrl: imageUrl.trim() || p.imageUrl,
            tags: tagList
          };
        }
        return p;
      });
      setProjects(updated);
    } else {
      // Create new
      const newProj: PortfolioProject = {
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
      setProjects([newProj, ...projects]);
    }

    setIsAddModalOpen(false);
  };

  const handleDelete = (p: PortfolioProject) => {
    setDeletingProject(p);
  };

  const confirmDelete = () => {
    if (!deletingProject) return;
    setProjects(projects.filter(p => p.id !== deletingProject.id));
    setDeletingProject(null);
  };

  const filteredProjects = projects.filter(p => {
    const q = searchQuery.toLowerCase().trim();
    return !q || p.title.toLowerCase().includes(q) || p.clientName.toLowerCase().includes(q) || p.category.toLowerCase().includes(q);
  });

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col font-sans">
      
      {/* Top Navigation Bar */}
      <header className="bg-slate-950 border-b border-slate-800 px-4 sm:px-8 py-4 sticky top-0 z-30">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          
          <div className="flex items-center gap-3">
            <img 
              src="https://i.ibb.co/SX9x8b4k/d943fc28-7ed1-4e07-a215-5630a4dea11d.jpg" 
              alt="Opera Digital Logo" 
              className="h-9 w-auto rounded-xl bg-white p-0.5"
              referrerPolicy="no-referrer"
            />
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-base text-white tracking-wide">Painel Administrativo</span>
                <span className="bg-blue-500/20 text-blue-400 border border-blue-500/30 text-[10px] font-black px-2 py-0.5 rounded-md uppercase">
                  Admin Master
                </span>
              </div>
              <p className="text-xs text-slate-400 font-mono">
                operadigital.link@gmail.com
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={onGoToSite}
              className="bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold px-4 py-2.5 rounded-xl border border-slate-700 transition-colors flex items-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Ver Site Público</span>
            </button>

            <button
              onClick={onLogout}
              className="bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/30 text-xs font-bold px-4 py-2.5 rounded-xl transition-colors flex items-center gap-2"
            >
              <LogOut className="w-4 h-4" />
              <span>Sair</span>
            </button>
          </div>

        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-8 py-8 space-y-8">
        
        {/* Navigation Tabs */}
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-800 pb-4">
          <div className="flex items-center gap-2 bg-slate-950 p-1.5 rounded-2xl border border-slate-800">
            <button
              onClick={() => setActiveTab('portfolio')}
              className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 transition-all ${
                activeTab === 'portfolio'
                  ? 'bg-[#0A4EE4] text-white shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Building2 className="w-4 h-4" />
              <span>Trabalhos Realizados ({projects.length})</span>
            </button>

            <button
              onClick={() => setActiveTab('leads')}
              className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 transition-all ${
                activeTab === 'leads'
                  ? 'bg-[#0A4EE4] text-white shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Users className="w-4 h-4" />
              <span>Clientes & Leads ({leads.length})</span>
            </button>

            <button
              onClick={() => setActiveTab('metrics')}
              className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 transition-all ${
                activeTab === 'metrics'
                  ? 'bg-[#0A4EE4] text-white shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <BarChart3 className="w-4 h-4" />
              <span>Métricas & Status</span>
            </button>
          </div>

          {activeTab === 'portfolio' && (
            <button
              onClick={handleOpenAddModal}
              className="bg-[#0A4EE4] hover:bg-blue-600 text-white font-bold text-xs sm:text-sm px-5 py-2.5 rounded-xl transition-all shadow-lg shadow-blue-900/30 flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              <span>Novo Trabalho / Projeto</span>
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
                      src={p.imageUrl} 
                      alt={p.title} 
                      className="w-24 h-24 rounded-xl object-cover border border-slate-800 shrink-0"
                      referrerPolicy="no-referrer"
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

                  {/* Result Link & Metric Banner */}
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

                    <div className="bg-blue-600/20 text-blue-300 font-bold px-3 py-1.5 rounded-lg border border-blue-500/30 text-center shrink-0">
                      {p.resultMetric}
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

        {/* TAB 2: LEADS AND REGISTRATIONS */}
        {activeTab === 'leads' && (
          <div className="bg-slate-950 rounded-2xl border border-slate-800 overflow-hidden shadow-xl">
            <div className="p-6 border-b border-slate-800 flex items-center justify-between">
              <div>
                <h3 className="font-bold text-white text-lg">Solicitações de Cadastro & Contatos</h3>
                <p className="text-xs text-slate-400 mt-1">
                  Leads registrados via formulário de contratação e demonstração.
                </p>
              </div>
              <span className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-xs font-bold px-3 py-1 rounded-full">
                {leads.length} {leads.length === 1 ? 'Registro' : 'Registros'}
              </span>
            </div>

            {leads.length === 0 ? (
              <div className="p-12 text-center">
                <Users className="w-12 h-12 text-slate-700 mx-auto mb-3" />
                <h4 className="text-white font-bold text-base">Nenhum contato registrado</h4>
                <p className="text-slate-400 text-xs mt-1 max-w-sm mx-auto">
                  Os cadastros e solicitações de demonstração realizados pelos clientes no site aparecerão aqui.
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs text-slate-300">
                  <thead className="bg-slate-900 text-slate-400 font-bold uppercase tracking-wider border-b border-slate-800">
                    <tr>
                      <th className="p-4">Cliente / Nome</th>
                      <th className="p-4">E-mail</th>
                      <th className="p-4">Telefone</th>
                      <th className="p-4">Módulo</th>
                      <th className="p-4">Segmento</th>
                      <th className="p-4">Data</th>
                      <th className="p-4">Status</th>
                      <th className="p-4 text-right">Ações</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60">
                    {leads.map((lead) => (
                      <tr key={lead.id} className="hover:bg-slate-900/50 transition-colors">
                        <td className="p-4 font-bold text-white">{lead.name}</td>
                        <td className="p-4 font-mono text-slate-400">{lead.email}</td>
                        <td className="p-4 font-mono">{lead.phone}</td>
                        <td className="p-4">
                          <span className="bg-blue-500/20 text-blue-300 px-2.5 py-1 rounded-md font-bold">
                            {lead.solution || 'Cadastro'}
                          </span>
                        </td>
                        <td className="p-4 text-slate-400">{lead.segment || '-'}</td>
                        <td className="p-4 text-slate-500">{lead.date}</td>
                        <td className="p-4">
                          <span className="bg-emerald-500/20 text-emerald-400 px-2 py-0.5 rounded text-[11px] font-bold">
                            {lead.status || 'Novo'}
                          </span>
                        </td>
                        <td className="p-4 text-right">
                          <div className="inline-flex items-center gap-2">
                            {lead.phone && lead.phone !== '-' && (
                              <a
                                href={`https://wa.me/55${lead.phone.replace(/\D/g, '')}?text=Olá%20${encodeURIComponent(lead.name)},%20sou%20da%20Opera%20Digital!`}
                                target="_blank"
                                rel="noreferrer"
                                className="inline-flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold px-3 py-1.5 rounded-lg transition-colors"
                              >
                                <MessageSquare className="w-3.5 h-3.5" />
                                <span>WhatsApp</span>
                              </a>
                            )}
                            <button
                              onClick={() => handleDeleteLead(lead.id)}
                              className="p-1.5 text-slate-400 hover:text-rose-400 hover:bg-rose-500/20 rounded-lg transition-colors"
                              title="Excluir Contato"
                            >
                              <Trash2 className="w-4 h-4 text-rose-400" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
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
              <div className="text-xs text-slate-400 uppercase font-bold">Trabalhos em Exibição</div>
              <div className="text-3xl font-black text-white">
                {projects.length} Projetos
              </div>
              <p className="text-xs text-slate-500 pt-2 border-t border-slate-800">
                Sincronizado instantaneamente no portfólio do site público.
              </p>
            </div>

            <div className="bg-slate-950 p-6 rounded-2xl border border-slate-800 space-y-2">
              <div className="text-xs text-slate-400 uppercase font-bold">Administrador Ativo</div>
              <div className="text-base font-bold text-blue-400 truncate">
                empwilliamtavares@gmail.com
              </div>
              <p className="text-xs text-slate-500 pt-2 border-t border-slate-800">
                Acesso total liberado para adição e edição de resultados.
              </p>
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
                    onChange={(e) => {
                      setResultLink(e.target.value);
                      if (aiError) setAiError('');
                    }}
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
                {aiError && (
                  <p className="text-xs text-rose-400 mt-1">{aiError}</p>
                )}
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
