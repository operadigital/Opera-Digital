import React, { useState, useEffect } from 'react';
import { 
  ExternalLink, Plus, Search, Filter, Sparkles, Globe, 
  CheckCircle2, ArrowRight, X, Copy, Check, Eye, Trash2, 
  Building2, TrendingUp, Laptop, Layers, Share2
} from 'lucide-react';
import { INITIAL_PORTFOLIO_PROJECTS } from '../data/mockData';
import { PortfolioProject } from '../types';

export const PortfolioSection: React.FC = () => {
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
      console.error('Error reading projects from localStorage', e);
    }
    return INITIAL_PORTFOLIO_PROJECTS;
  });

  const [selectedCategory, setSelectedCategory] = useState<string>('Todos');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedProject, setSelectedProject] = useState<PortfolioProject | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState<boolean>(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [deletingProject, setDeletingProject] = useState<PortfolioProject | null>(null);

  // New Project Form State
  const [newTitle, setNewTitle] = useState('');
  const [newClient, setNewClient] = useState('');
  const [newCategory, setNewCategory] = useState<PortfolioProject['category']>('E-commerce');
  const [newDesc, setNewDesc] = useState('');
  const [newMetric, setNewMetric] = useState('');
  const [newLink, setNewLink] = useState('');
  const [newImageUrl, setNewImageUrl] = useState('');
  const [newTags, setNewTags] = useState('');

  // AI Auto-Fill State
  const [isGeneratingAi, setIsGeneratingAi] = useState(false);

  const handleGenerateAi = async () => {
    if (!newLink.trim()) return;

    setIsGeneratingAi(true);

    let formattedLink = newLink.trim();
    if (!formattedLink.startsWith('http://') && !formattedLink.startsWith('https://')) {
      formattedLink = 'https://' + formattedLink;
      setNewLink(formattedLink);
    }

    try {
      const res = await fetch('/api/generate-project-info', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          url: formattedLink,
          clientName: newClient.trim(),
          category: newCategory,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        if (data.title) setNewTitle(data.title);
        if (data.clientName) setNewClient(data.clientName);
        if (data.category) setNewCategory(data.category);
        if (data.description) setNewDesc(data.description);
        if (data.resultMetric) setNewMetric(data.resultMetric);
        if (data.imageUrl) setNewImageUrl(data.imageUrl);
        if (data.tags && Array.isArray(data.tags)) setNewTags(data.tags.join(', '));
      } else {
        throw new Error('API request failed');
      }
    } catch (err) {
      console.warn('AI Generation silent fallback:', err);
      const domain = formattedLink.replace(/^https?:\/\//, '').split('/')[0];
      const domainClean = domain.replace(/^www\./, '').split('.')[0].toUpperCase();
      const derivedClient = newClient.trim() || domainClean;

      setNewTitle(`Site/Projeto ${derivedClient}`);
      setNewClient(derivedClient);
      setNewDesc(`Desenvolvimento web e estruturação digital exclusiva para ${derivedClient}.`);
      setNewMetric('Site Otimizado e Responsivo');
      setNewImageUrl(`https://api.microlink.io/?url=${encodeURIComponent(formattedLink)}&screenshot=true&embed=screenshot.url`);
      setNewTags('Opera Digital, Site, WhatsApp');
    } finally {
      setIsGeneratingAi(false);
    }
  };

  // Fetch projects from server API on mount & sync with localStorage
  useEffect(() => {
    const fetchServerProjects = async () => {
      try {
        const res = await fetch('/api/portfolio');
        if (res.ok) {
          const serverData = await res.json();
          if (Array.isArray(serverData) && serverData.length > 0) {
            setProjects(serverData);
            localStorage.setItem('opera_portfolio_projects', JSON.stringify(serverData));
            return;
          }
        }
      } catch (e) {
        console.warn('Could not fetch server projects:', e);
      }

      // If server projects empty or unavailable, sync local storage to server
      try {
        const saved = localStorage.getItem('opera_portfolio_projects');
        if (saved) {
          const parsed = JSON.parse(saved);
          if (Array.isArray(parsed) && parsed.length > 0) {
            setProjects(parsed);
            fetch('/api/portfolio/sync', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(parsed)
            }).catch(() => {});
          }
        }
      } catch (e) {
        console.error(e);
      }
    };

    fetchServerProjects();
  }, []);

  // Save to localStorage & server when projects change
  const saveProjectsState = (updated: PortfolioProject[]) => {
    setProjects(updated);
    try {
      localStorage.setItem('opera_portfolio_projects', JSON.stringify(updated));
    } catch (e) {
      console.error(e);
    }
  };

  const categories = ['Todos', 'Criação de Sites', 'WhatsApp Web', 'Landing Pages', 'E-commerce & Portais'];

  const filteredProjects = projects.filter((p) => {
    const matchesCategory = selectedCategory === 'Todos' || p.category === selectedCategory;
    const q = searchQuery.toLowerCase().trim();
    const matchesQuery = 
      !q || 
      p.title.toLowerCase().includes(q) || 
      p.clientName.toLowerCase().includes(q) || 
      p.description.toLowerCase().includes(q) || 
      p.tags.some(t => t.toLowerCase().includes(q));
    return matchesCategory && matchesQuery;
  });

  const fallbackCopyTextToClipboard = (text: string) => {
    try {
      const textArea = document.createElement('textarea');
      textArea.value = text;
      textArea.style.position = 'fixed';
      textArea.style.left = '-999999px';
      textArea.style.top = '-999999px';
      document.body.appendChild(textArea);
      textArea.focus();
      textArea.select();
      document.execCommand('copy');
      textArea.remove();
    } catch (err) {
      console.warn('Fallback copy failed:', err);
    }
  };

  const handleCopyLink = (e: React.MouseEvent, link: string, id: string) => {
    e.stopPropagation();
    try {
      if (navigator.clipboard && typeof navigator.clipboard.writeText === 'function') {
        navigator.clipboard.writeText(link)
          .then(() => {
            setCopiedId(id);
            setTimeout(() => setCopiedId(null), 2000);
          })
          .catch(() => {
            fallbackCopyTextToClipboard(link);
            setCopiedId(id);
            setTimeout(() => setCopiedId(null), 2000);
          });
      } else {
        fallbackCopyTextToClipboard(link);
        setCopiedId(id);
        setTimeout(() => setCopiedId(null), 2000);
      }
    } catch (err) {
      fallbackCopyTextToClipboard(link);
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 2000);
    }
  };

  const handleOpenLiveLink = (link: string) => {
    try {
      let url = link;
      if (!url.startsWith('http://') && !url.startsWith('https://')) {
        url = 'https://' + url;
      }
      window.open(url, '_blank', 'noopener,noreferrer');
    } catch (err) {
      console.warn('Failed to open link:', err);
    }
  };

  const handleAddProject = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newClient.trim() || !newLink.trim()) return;

    let formattedLink = newLink.trim();
    if (!formattedLink.startsWith('http://') && !formattedLink.startsWith('https://')) {
      formattedLink = 'https://' + formattedLink;
    }

    const defaultImages = [
      'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1556742049-0a670f4a4591?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&q=80&w=800'
    ];

    const projectToAdd: PortfolioProject = {
      id: 'proj-' + Date.now(),
      title: newTitle.trim(),
      clientName: newClient.trim(),
      category: newCategory,
      description: newDesc.trim() || 'Projeto customizado desenvolvido e implantado com sucesso.',
      resultMetric: newMetric.trim() || 'Resultado Alcançado',
      resultLink: formattedLink,
      imageUrl: newImageUrl.trim() || defaultImages[Math.floor(Math.random() * defaultImages.length)],
      tags: newTags ? newTags.split(',').map(t => t.trim()).filter(Boolean) : ['Customizado', 'Opera Digital'],
      completedDate: new Date().toISOString().substring(0, 7)
    };

    const updatedList = [projectToAdd, ...projects];
    saveProjectsState(updatedList);
    fetch('/api/portfolio', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(projectToAdd)
    }).catch(() => {});

    setIsAddModalOpen(false);

    // Reset Form
    setNewTitle('');
    setNewClient('');
    setNewCategory('E-commerce');
    setNewDesc('');
    setNewMetric('');
    setNewLink('');
    setNewImageUrl('');
    setNewTags('');
  };

  const handleDeleteProject = (e: React.MouseEvent, project: PortfolioProject) => {
    e.stopPropagation();
    setDeletingProject(project);
  };

  const confirmDelete = () => {
    if (!deletingProject) return;
    const targetId = deletingProject.id;
    const updatedList = projects.filter(p => p.id !== targetId);
    saveProjectsState(updatedList);
    fetch(`/api/portfolio/${targetId}`, { method: 'DELETE' }).catch(() => {});

    if (selectedProject?.id === targetId) {
      setSelectedProject(null);
    }
    setDeletingProject(null);
  };

  return (
    <section id="trabalhos" className="py-20 bg-gradient-to-b from-black via-slate-950 to-slate-900 text-slate-100 border-t border-slate-800/80 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8">
          <div>
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-950/80 border border-blue-800/60 text-blue-400 text-xs font-bold mb-3 shadow-sm">
              <Sparkles className="w-4 h-4 text-blue-400" />
              <span>Trabalhos Realizados & Portfólio</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight uppercase">
              VEJA NOSSOS DESENVOLVIMENTOS REALIZADOS
            </h2>
            <p className="text-sm sm:text-base text-slate-300 mt-2 max-w-2xl">
              Confira os sistemas, e-commerces e automações implantados. Clique em qualquer trabalho para ver o resultado final ao vivo.
            </p>
          </div>
        </div>

        {/* Projects Grid */}
        {filteredProjects.length === 0 ? (
          <div className="bg-slate-900/90 rounded-2xl border border-slate-800 p-12 text-center max-w-md mx-auto my-8">
            <Building2 className="w-12 h-12 text-slate-500 mx-auto mb-3" />
            <h3 className="font-bold text-slate-200 text-base">Nenhum trabalho cadastrado</h3>
            <p className="text-xs text-slate-400 mt-1">
              Os trabalhos cadastrados no Painel do Administrador serão exibidos aqui em tempo real.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6 sm:gap-8">
            {filteredProjects.map((project) => (
              <div
                key={project.id}
                onClick={() => setSelectedProject(project)}
                className="bg-slate-900/90 rounded-2xl border border-slate-800 shadow-xl hover:shadow-2xl hover:border-blue-500/50 transition-all duration-300 overflow-hidden flex flex-col group cursor-pointer"
              >
                {/* Project Image Header with Overlay */}
                <div className="relative h-48 sm:h-56 w-full overflow-hidden bg-slate-950">
                  <img
                    src={project.imageUrl}
                    alt={project.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/30 to-transparent" />

                  {/* Category & Metric Badges */}
                  <div className="absolute top-3 left-3 right-3 flex items-center justify-between">
                    <span className="bg-slate-900/90 border border-slate-700/80 backdrop-blur-md text-blue-400 text-[11px] font-extrabold px-3 py-1 rounded-full shadow-md">
                      {project.category}
                    </span>

                    <button
                      onClick={(e) => handleDeleteProject(e, project)}
                      className="opacity-100 sm:opacity-0 sm:group-hover:opacity-100 bg-rose-600 hover:bg-rose-700 text-white p-2 rounded-xl transition-all shadow-md z-10 flex items-center justify-center min-h-[36px] min-w-[36px]"
                      title="Excluir trabalho"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Title & Client inside Image Gradient */}
                  <div className="absolute bottom-3 left-4 right-4 text-white">
                    <div className="text-[11px] font-medium text-blue-300 uppercase tracking-wider">
                      Cliente: {project.clientName}
                    </div>
                    <h3 className="text-lg font-extrabold leading-snug line-clamp-1 group-hover:text-blue-400 transition-colors">
                      {project.title}
                    </h3>
                  </div>
                </div>

                {/* Card Body */}
                <div className="p-5 sm:p-6 flex-1 flex flex-col justify-between space-y-4">
                  <p className="text-xs sm:text-sm text-slate-300 line-clamp-2 leading-relaxed">
                    {project.description}
                  </p>

                  {/* Tags & Action Buttons */}
                  <div className="pt-2 border-t border-slate-800 flex items-center justify-between gap-3">
                    <div className="flex flex-wrap gap-1.5 max-w-[60%]">
                      {project.tags.map((tag, idx) => (
                        <span
                          key={idx}
                          className="bg-slate-800/80 text-slate-300 border border-slate-700/60 text-[10px] font-bold px-2 py-0.5 rounded-md"
                        >
                          #{tag}
                        </span>
                      ))}
                    </div>

                    {/* View Result Actions */}
                    <div className="flex items-center gap-2">
                      <button
                        onClick={(e) => handleCopyLink(e, project.resultLink, project.id)}
                        className="p-2 text-slate-400 hover:text-blue-400 hover:bg-slate-800 rounded-lg transition-colors border border-transparent hover:border-slate-700"
                        title="Copiar link direto"
                      >
                        {copiedId === project.id ? (
                          <Check className="w-4 h-4 text-emerald-400" />
                        ) : (
                          <Copy className="w-4 h-4" />
                        )}
                      </button>

                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleOpenLiveLink(project.resultLink);
                        }}
                        className="bg-[#0A4EE4] hover:bg-blue-600 text-white text-xs font-bold px-3.5 py-2 rounded-xl transition-all flex items-center gap-1.5 shadow-md"
                      >
                        <span>Ver Resultado</span>
                        <ExternalLink className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

      </div>

      {/* LIVE RESULT DETAILS & PREVIEW MODAL */}
      {selectedProject && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div 
            className="bg-white rounded-3xl max-w-3xl w-full border border-slate-200 shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200 max-h-[90vh] flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Browser Header Bar Mockup */}
            <div className="bg-slate-900 px-4 py-3 text-white flex items-center justify-between border-b border-slate-800">
              <div className="flex items-center gap-2">
                <div className="flex gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-rose-500" />
                  <div className="w-3 h-3 rounded-full bg-amber-500" />
                  <div className="w-3 h-3 rounded-full bg-emerald-500" />
                </div>
                <div className="hidden sm:flex items-center gap-2 bg-slate-800 text-slate-300 text-xs px-3 py-1 rounded-lg ml-3 max-w-xs font-mono truncate">
                  <Globe className="w-3.5 h-3.5 text-blue-400 shrink-0" />
                  <span className="truncate">{selectedProject.resultLink}</span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleOpenLiveLink(selectedProject.resultLink)}
                  className="bg-[#0A4EE4] hover:bg-blue-600 text-white text-xs font-bold px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1.5"
                >
                  <span>Abrir em Nova Aba</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </button>

                <button
                  onClick={() => setSelectedProject(null)}
                  className="p-1.5 text-slate-400 hover:text-white rounded-lg transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Modal Body Scrollable */}
            <div className="p-6 sm:p-8 overflow-y-auto space-y-6">
              
              {/* Project Title & Category */}
              <div>
                <div className="flex items-center gap-2 text-xs font-bold text-[#0A4EE4] uppercase tracking-wider mb-1">
                  <span>{selectedProject.category}</span>
                  <span>•</span>
                  <span>Cliente: {selectedProject.clientName}</span>
                </div>
                <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
                  {selectedProject.title}
                </h3>
              </div>

              {/* Preview Image Banner */}
              <div className="relative rounded-2xl overflow-hidden border border-slate-200 h-64 sm:h-80 bg-slate-100">
                <img
                  src={selectedProject.imageUrl}
                  alt={selectedProject.title}
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-slate-900/30 flex items-center justify-center">
                  <button
                    onClick={() => handleOpenLiveLink(selectedProject.resultLink)}
                    className="bg-white/95 hover:bg-white text-[#0A4EE4] font-extrabold text-sm px-6 py-3.5 rounded-2xl shadow-xl transition-transform hover:scale-105 flex items-center gap-2"
                  >
                    <Eye className="w-5 h-5 text-[#0A4EE4]" />
                    <span>Acessar Resultado Final On-line</span>
                  </button>
                </div>
              </div>

              {/* Copy URL Bar */}
              <div className="flex justify-end">
                <button
                  onClick={(e) => handleCopyLink(e, selectedProject.resultLink, selectedProject.id)}
                  className="bg-slate-50 hover:bg-slate-100 text-slate-700 font-bold text-xs px-4 py-2.5 rounded-xl border border-slate-200 flex items-center gap-2 transition-colors"
                >
                  {copiedId === selectedProject.id ? (
                    <>
                      <Check className="w-4 h-4 text-emerald-600" />
                      <span>Link Copiado!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4" />
                      <span>Copiar URL do Projeto</span>
                    </>
                  )}
                </button>
              </div>

              {/* Description */}
              <div>
                <h4 className="font-bold text-slate-900 text-sm mb-2">Sobre este trabalho:</h4>
                <p className="text-slate-600 text-sm leading-relaxed">
                  {selectedProject.description}
                </p>
              </div>

              {/* Tags */}
              <div>
                <h4 className="font-bold text-slate-900 text-xs mb-2 uppercase tracking-wider text-slate-400">
                  Tecnologias & Soluções Aplicadas:
                </h4>
                <div className="flex flex-wrap gap-2">
                  {selectedProject.tags.map((t, idx) => (
                    <span
                      key={idx}
                      className="bg-slate-100 text-slate-700 font-semibold text-xs px-3 py-1.5 rounded-lg border border-slate-200"
                    >
                      #{t}
                    </span>
                  ))}
                </div>
              </div>

            </div>

            {/* Modal Footer */}
            <div className="bg-slate-50 p-4 px-6 border-t border-slate-200 flex items-center justify-between">
              <span className="text-xs text-slate-500">
                Link do resultado: <strong className="font-mono text-slate-800">{selectedProject.resultLink}</strong>
              </span>

              <button
                onClick={() => setSelectedProject(null)}
                className="bg-slate-200 hover:bg-slate-300 text-slate-800 font-bold text-xs px-4 py-2.5 rounded-xl transition-colors"
              >
                Fechar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ADD NEW PROJECT MODAL */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div 
            className="bg-white rounded-3xl max-w-xl w-full border border-slate-200 shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="bg-slate-900 text-white p-6 flex items-center justify-between">
              <div>
                <h3 className="text-xl font-extrabold flex items-center gap-2">
                  <Plus className="w-5 h-5 text-blue-400" />
                  <span>Cadastrar Novo Trabalho Realizado</span>
                </h3>
                <p className="text-xs text-slate-400 mt-1">
                  Adicione um novo projeto com o link do resultado final para exibir no seu portfólio.
                </p>
              </div>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="p-2 text-slate-400 hover:text-white rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddProject} className="p-6 space-y-4 max-h-[75vh] overflow-y-auto">
              
              {/* AI AUTO GENERATE BANNER */}
              <div className="p-4 bg-gradient-to-r from-blue-50 via-indigo-50 to-purple-50 border border-blue-100 rounded-2xl space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-xs font-bold text-blue-900">
                    <Sparkles className="w-4 h-4 text-blue-600 animate-pulse" />
                    <span>Geração Automática de Publicação com IA</span>
                  </div>
                </div>
                <p className="text-[11px] text-slate-600 leading-relaxed">
                  Insira o link (URL) do seu projeto abaixo e clique em <strong>Gerar com IA</strong> para criar título, descrição, imagem e tags automaticamente!
                </p>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-800 mb-1">
                  Link do Resultado Final (URL) *
                </label>
                <div className="flex gap-2">
                  <input
                    type="url"
                    required
                    value={newLink}
                    onChange={(e) => setNewLink(e.target.value)}
                    placeholder="https://seusite.com.br ou https://cliente.com.br"
                    className="flex-1 px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-[#0A4EE4] font-mono"
                  />
                  <button
                    type="button"
                    onClick={handleGenerateAi}
                    disabled={isGeneratingAi || !newLink.trim()}
                    className="px-4 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white text-xs font-bold rounded-xl shadow-xs transition-all flex items-center gap-2 disabled:opacity-50 whitespace-nowrap min-h-[42px]"
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
                <label className="block text-xs font-bold text-slate-800 mb-1">
                  Título do Projeto *
                </label>
                <input
                  type="text"
                  required
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="Ex: E-commerce de Peças Automotivas"
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-[#0A4EE4]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-800 mb-1">
                    Nome do Cliente / Empresa *
                  </label>
                  <input
                    type="text"
                    required
                    value={newClient}
                    onChange={(e) => setNewClient(e.target.value)}
                    placeholder="Ex: Nexon Distribuidora"
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-[#0A4EE4]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-800 mb-1">
                    Categoria *
                  </label>
                  <select
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value as any)}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-[#0A4EE4]"
                  >
                    <option value="E-commerce">E-commerce</option>
                    <option value="ERP & PDV">ERP & PDV</option>
                    <option value="Automações & IA">Automações & IA</option>
                    <option value="Portais & Web Apps">Portais & Web Apps</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-800 mb-1">
                  Descrição do Projeto
                </label>
                <textarea
                  rows={3}
                  value={newDesc}
                  onChange={(e) => setNewDesc(e.target.value)}
                  placeholder="Descreva resumidamente o que foi desenvolvido e os benefícios gerados..."
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-[#0A4EE4]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-800 mb-1">
                  URL da Imagem da Capa (Opcional)
                </label>
                <input
                  type="text"
                  value={newImageUrl}
                  onChange={(e) => setNewImageUrl(e.target.value)}
                  placeholder="https://images.unsplash.com/photo-..."
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-[#0A4EE4]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-800 mb-1">
                  Tags (Separadas por vírgula)
                </label>
                <input
                  type="text"
                  value={newTags}
                  onChange={(e) => setNewTags(e.target.value)}
                  placeholder="Ex: E-commerce, NFe, Pix"
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-[#0A4EE4]"
                />
              </div>

              <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-[#0A4EE4] hover:bg-blue-700 text-white text-xs font-bold rounded-xl shadow-md transition-all"
                >
                  Salvar Trabalho no Portfólio
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

      {/* DELETE CONFIRMATION MODAL */}
      {deletingProject && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 space-y-4 shadow-2xl border border-slate-100 text-slate-800">
            <div className="w-12 h-12 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center mx-auto">
              <Trash2 className="w-6 h-6" />
            </div>
            <div className="text-center space-y-2">
              <h3 className="text-lg font-bold text-slate-900">Excluir Trabalho?</h3>
              <p className="text-xs text-slate-500">
                Tem certeza que deseja remover o trabalho <strong className="text-slate-800">"{deletingProject.title}"</strong> ({deletingProject.clientName}) do seu portfólio? Esta ação é imediata.
              </p>
            </div>
            <div className="flex items-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => setDeletingProject(null)}
                className="flex-1 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl transition-colors min-h-[44px]"
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

    </section>
  );
};
