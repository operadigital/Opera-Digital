import React, { useState, useMemo } from 'react';
import { 
  Users, DollarSign, TrendingUp, Filter, Search, Plus, 
  MessageSquare, Mail, Phone, Calendar, ArrowRight, ArrowLeft,
  CheckCircle2, XCircle, Clock, ChevronRight, Tag, User, Building2,
  FileText, Send, Download, RefreshCw, AlertCircle, Edit3, Trash2,
  BarChart2, Shield, MoreVertical, LayoutGrid, List
} from 'lucide-react';
import { CrmLead, CrmStage, LeadPriority, LeadNote, LeadActivity } from '../types';
import { getStoredWhatsAppNumber } from '../utils/whatsapp';

interface CrmSystemProps {
  leads: CrmLead[];
  onUpdateLead: (updatedLead: CrmLead) => void;
  onDeleteLead: (leadId: string) => void;
  onCreateLead: (newLead: Partial<CrmLead>) => void;
  onAddNote: (leadId: string, noteText: string) => void;
}

export const STAGES: { id: CrmStage; name: string; color: string; bgColor: string; borderColor: string; headerBg: string }[] = [
  { id: 'novo', name: 'Novo Lead', color: 'text-blue-400', bgColor: 'bg-blue-500/10', borderColor: 'border-blue-500/30', headerBg: 'bg-blue-950/40' },
  { id: 'qualificacao', name: 'Em Qualificação', color: 'text-purple-400', bgColor: 'bg-purple-500/10', borderColor: 'border-purple-500/30', headerBg: 'bg-purple-950/40' },
  { id: 'proposta', name: 'Proposta Enviada', color: 'text-amber-400', bgColor: 'bg-amber-500/10', borderColor: 'border-amber-500/30', headerBg: 'bg-amber-950/40' },
  { id: 'negociacao', name: 'Em Negociação', color: 'text-indigo-400', bgColor: 'bg-indigo-500/10', borderColor: 'border-indigo-500/30', headerBg: 'bg-indigo-950/40' },
  { id: 'ganho', name: 'Fechado (Ganho)', color: 'text-emerald-400', bgColor: 'bg-emerald-500/10', borderColor: 'border-emerald-500/30', headerBg: 'bg-emerald-950/40' },
  { id: 'perdido', name: 'Perdido', color: 'text-red-400', bgColor: 'bg-red-500/10', borderColor: 'border-red-500/30', headerBg: 'bg-red-950/40' }
];

export const PRIORITIES: Record<LeadPriority, { label: string; class: string }> = {
  urgente: { label: 'Urgente', class: 'bg-red-500/20 text-red-300 border-red-500/40' },
  alta: { label: 'Alta', class: 'bg-amber-500/20 text-amber-300 border-amber-500/40' },
  media: { label: 'Média', class: 'bg-blue-500/20 text-blue-300 border-blue-500/40' },
  baixa: { label: 'Baixa', class: 'bg-slate-700 text-slate-300 border-slate-600' }
};

export const CrmSystem: React.FC<CrmSystemProps> = ({
  leads,
  onUpdateLead,
  onDeleteLead,
  onCreateLead,
  onAddNote
}) => {
  const [viewMode, setViewMode] = useState<'kanban' | 'table'>('kanban');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStageFilter, setSelectedStageFilter] = useState<string>('all');
  const [selectedPriorityFilter, setSelectedPriorityFilter] = useState<string>('all');
  const [selectedSourceFilter, setSelectedSourceFilter] = useState<string>('all');
  
  // Selected Lead for Detailed View
  const [activeLead, setActiveLead] = useState<CrmLead | null>(null);
  
  // Create Modal State
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [newLeadForm, setNewLeadForm] = useState({
    fullName: '',
    companyName: '',
    email: '',
    phone: '',
    segment: 'Tecnologia / Software',
    projectType: 'Criação de Site Profissional',
    estimatedValue: 5000,
    priority: 'media' as LeadPriority,
    stage: 'novo' as CrmStage,
    source: 'Cadastro Manual',
    projectDescription: ''
  });

  // Note Input State
  const [noteInput, setNoteInput] = useState('');

  // Format currency helper
  const formatCurrency = (val?: number) => {
    return (val || 0).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  };

  // Filtered Leads
  const filteredLeads = useMemo(() => {
    return leads.filter((lead) => {
      const query = searchQuery.toLowerCase().trim();
      const matchesSearch = !query || 
        lead.fullName.toLowerCase().includes(query) ||
        (lead.companyName && lead.companyName.toLowerCase().includes(query)) ||
        lead.email.toLowerCase().includes(query) ||
        lead.phone.includes(query) ||
        (lead.projectType && lead.projectType.toLowerCase().includes(query));

      const leadStage = lead.stage || lead.status || 'novo';
      const matchesStage = selectedStageFilter === 'all' || leadStage === selectedStageFilter;
      const matchesPriority = selectedPriorityFilter === 'all' || (lead.priority || 'media') === selectedPriorityFilter;
      const matchesSource = selectedSourceFilter === 'all' || (lead.source || 'Formulário Site') === selectedSourceFilter;

      return matchesSearch && matchesStage && matchesPriority && matchesSource;
    });
  }, [leads, searchQuery, selectedStageFilter, selectedPriorityFilter, selectedSourceFilter]);

  // KPIs
  const stats = useMemo(() => {
    const totalCount = leads.length;
    const totalPipelineValue = leads
      .filter((l) => (l.stage || l.status) !== 'perdido')
      .reduce((acc, curr) => acc + (curr.estimatedValue || 5000), 0);
    
    const wonCount = leads.filter((l) => (l.stage || l.status) === 'ganho').length;
    const wonValue = leads
      .filter((l) => (l.stage || l.status) === 'ganho')
      .reduce((acc, curr) => acc + (curr.estimatedValue || 5000), 0);

    const conversionRate = totalCount > 0 ? ((wonCount / totalCount) * 100).toFixed(1) : '0';

    return { totalCount, totalPipelineValue, wonCount, wonValue, conversionRate };
  }, [leads]);

  // Stage change handler
  const handleStageChange = (lead: CrmLead, newStage: CrmStage) => {
    const updated = { ...lead, stage: newStage, status: newStage };
    onUpdateLead(updated);
    if (activeLead && activeLead.id === lead.id) {
      setActiveLead(updated);
    }
  };

  // Submit New Note
  const handleAddNoteSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeLead || !noteInput.trim()) return;
    onAddNote(activeLead.id, noteInput.trim());
    setNoteInput('');
  };

  // Submit New Lead
  const handleCreateLeadSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newLeadForm.fullName || !newLeadForm.phone) return;
    onCreateLead({
      ...newLeadForm,
      id: `lead-manual-${Date.now()}`,
      createdAt: new Date().toISOString()
    });
    setCreateModalOpen(false);
    setNewLeadForm({
      fullName: '',
      companyName: '',
      email: '',
      phone: '',
      segment: 'Tecnologia / Software',
      projectType: 'Criação de Site Profissional',
      estimatedValue: 5000,
      priority: 'media',
      stage: 'novo',
      source: 'Cadastro Manual',
      projectDescription: ''
    });
  };

  // Export CSV
  const handleExportCSV = () => {
    const headers = ['ID', 'Nome', 'Empresa', 'E-mail', 'Telefone', 'Estágio', 'Prioridade', 'Valor Estimado (R$)', 'Origem', 'Data de Criação'];
    const rows = filteredLeads.map((l) => [
      l.id,
      `"${l.fullName}"`,
      `"${l.companyName || ''}"`,
      `"${l.email}"`,
      `"${l.phone}"`,
      l.stage || l.status || 'novo',
      l.priority || 'media',
      l.estimatedValue || 5000,
      `"${l.source || ''}"`,
      l.createdAt
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `opera_digital_crm_leads_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const storedPhone = getStoredWhatsAppNumber();

  return (
    <div className="space-y-6">
      
      {/* 1. HEADER & KPIS PIPELINE SUMMARY */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-slate-950 border border-slate-800 p-5 rounded-2xl shadow-xl flex items-center justify-between">
          <div>
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Total de Leads CRM</span>
            <div className="text-2xl font-black text-white mt-1 font-mono">{stats.totalCount}</div>
            <span className="text-[10px] text-slate-500">Cadastros e Oportunidades</span>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-blue-500/10 border border-blue-500/30 text-blue-400 flex items-center justify-center shrink-0">
            <Users className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-slate-950 border border-slate-800 p-5 rounded-2xl shadow-xl flex items-center justify-between">
          <div>
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Pipeline em Negociação</span>
            <div className="text-2xl font-black text-amber-400 mt-1 font-mono">{formatCurrency(stats.totalPipelineValue)}</div>
            <span className="text-[10px] text-slate-500">Valor Estimado das Oportunidades</span>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-400 flex items-center justify-center shrink-0">
            <DollarSign className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-slate-950 border border-slate-800 p-5 rounded-2xl shadow-xl flex items-center justify-between">
          <div>
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Vendas Fechadas (Ganho)</span>
            <div className="text-2xl font-black text-emerald-400 mt-1 font-mono">{formatCurrency(stats.wonValue)}</div>
            <span className="text-[10px] text-emerald-500/80 font-bold">{stats.wonCount} contratos fechados</span>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 flex items-center justify-center shrink-0">
            <CheckCircle2 className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-slate-950 border border-slate-800 p-5 rounded-2xl shadow-xl flex items-center justify-between">
          <div>
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Taxa de Conversão</span>
            <div className="text-2xl font-black text-indigo-400 mt-1 font-mono">{stats.conversionRate}%</div>
            <span className="text-[10px] text-slate-500">Leads Convertidos / Total</span>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 border border-indigo-500/30 text-indigo-400 flex items-center justify-center shrink-0">
            <TrendingUp className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* 2. CONTROLS BAR: SEARCH, FILTERS, ACTIONS & VIEW TOGGLE */}
      <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 shadow-xl space-y-4">
        <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4">
          
          {/* Search Input */}
          <div className="relative flex-1 min-w-[240px]">
            <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-3.5" />
            <input
              type="text"
              placeholder="Buscar por cliente, empresa, telefone, e-mail..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-900 border border-slate-800 text-white text-xs pl-10 pr-4 py-2.5 rounded-xl focus:outline-none focus:border-emerald-500"
            />
          </div>

          {/* Action Buttons & View Mode Toggle */}
          <div className="flex items-center gap-2 flex-wrap">
            {/* View Mode Toggle */}
            <div className="bg-slate-900 border border-slate-800 p-1 rounded-xl flex items-center gap-1">
              <button
                type="button"
                onClick={() => setViewMode('kanban')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                  viewMode === 'kanban'
                    ? 'bg-emerald-600 text-white shadow-md'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <LayoutGrid className="w-3.5 h-3.5" />
                <span>Kanban</span>
              </button>
              <button
                type="button"
                onClick={() => setViewMode('table')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                  viewMode === 'table'
                    ? 'bg-emerald-600 text-white shadow-md'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <List className="w-3.5 h-3.5" />
                <span>Tabela</span>
              </button>
            </div>

            {/* CSV Export */}
            <button
              type="button"
              onClick={handleExportCSV}
              className="bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800 hover:border-slate-700 px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5"
            >
              <Download className="w-3.5 h-3.5 text-emerald-400" />
              <span>Exportar</span>
            </button>

            {/* Create Lead Button */}
            <button
              type="button"
              onClick={() => setCreateModalOpen(true)}
              className="bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-xs px-4 py-2 rounded-xl shadow-lg shadow-emerald-950/60 transition-all flex items-center gap-1.5"
            >
              <Plus className="w-4 h-4" />
              <span>Novo Lead</span>
            </button>
          </div>
        </div>

        {/* Filter Dropdowns */}
        <div className="flex items-center gap-3 flex-wrap pt-2 border-t border-slate-800/80 text-xs">
          <div className="flex items-center gap-1.5 text-slate-400 font-bold shrink-0">
            <Filter className="w-3.5 h-3.5 text-emerald-400" />
            <span>Filtros:</span>
          </div>

          {/* Stage Filter */}
          <select
            value={selectedStageFilter}
            onChange={(e) => setSelectedStageFilter(e.target.value)}
            className="bg-slate-900 border border-slate-800 text-slate-200 text-xs p-2 rounded-xl focus:outline-none"
          >
            <option value="all">Todos os Estágios</option>
            {STAGES.map((s) => (
              <option key={s.id} value={s.id}>{s.name}</option>
            ))}
          </select>

          {/* Priority Filter */}
          <select
            value={selectedPriorityFilter}
            onChange={(e) => setSelectedPriorityFilter(e.target.value)}
            className="bg-slate-900 border border-slate-800 text-slate-200 text-xs p-2 rounded-xl focus:outline-none"
          >
            <option value="all">Todas as Prioridades</option>
            <option value="urgente">Urgente</option>
            <option value="alta">Alta</option>
            <option value="media">Média</option>
            <option value="baixa">Baixa</option>
          </select>

          {/* Source Filter */}
          <select
            value={selectedSourceFilter}
            onChange={(e) => setSelectedSourceFilter(e.target.value)}
            className="bg-slate-900 border border-slate-800 text-slate-200 text-xs p-2 rounded-xl focus:outline-none"
          >
            <option value="all">Todas as Origens</option>
            <option value="Formulário Site">Formulário Site</option>
            <option value="WhatsApp Bot">WhatsApp Bot</option>
            <option value="Cadastro Manual">Cadastro Manual</option>
          </select>

          {(selectedStageFilter !== 'all' || selectedPriorityFilter !== 'all' || selectedSourceFilter !== 'all' || searchQuery) && (
            <button
              type="button"
              onClick={() => {
                setSelectedStageFilter('all');
                setSelectedPriorityFilter('all');
                setSelectedSourceFilter('all');
                setSearchQuery('');
              }}
              className="text-xs text-emerald-400 hover:underline font-bold ml-auto"
            >
              Limpar Filtros
            </button>
          )}
        </div>
      </div>

      {/* 3. VIEW 1: KANBAN PIPELINE BOARD */}
      {viewMode === 'kanban' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 overflow-x-auto pb-4">
          {STAGES.map((stage) => {
            const stageLeads = filteredLeads.filter(
              (l) => (l.stage || l.status || 'novo') === stage.id
            );
            const stageTotalValue = stageLeads.reduce((acc, curr) => acc + (curr.estimatedValue || 5000), 0);

            return (
              <div 
                key={stage.id} 
                className="bg-slate-950/80 border border-slate-800/80 rounded-2xl flex flex-col min-w-[280px] min-h-[500px] shadow-2xl"
              >
                {/* Column Header */}
                <div className={`p-3.5 border-b border-slate-800 rounded-t-2xl flex items-center justify-between ${stage.headerBg}`}>
                  <div>
                    <h3 className={`text-xs font-black uppercase tracking-wider ${stage.color} flex items-center gap-1.5`}>
                      <span>{stage.name}</span>
                    </h3>
                    <div className="text-[11px] font-mono font-bold text-slate-400 mt-0.5">
                      {formatCurrency(stageTotalValue)}
                    </div>
                  </div>
                  <span className={`px-2 py-0.5 rounded-full text-[11px] font-extrabold border ${stage.bgColor} ${stage.color} ${stage.borderColor}`}>
                    {stageLeads.length}
                  </span>
                </div>

                {/* Cards List */}
                <div className="p-2.5 space-y-3 flex-1 overflow-y-auto max-h-[650px]">
                  {stageLeads.length === 0 ? (
                    <div className="h-32 border border-dashed border-slate-800 rounded-xl flex items-center justify-center text-slate-600 text-xs text-center p-4">
                      Nenhum lead neste estágio
                    </div>
                  ) : (
                    stageLeads.map((lead) => {
                      const priority = PRIORITIES[lead.priority || 'media'];
                      const cleanPhone = lead.phone.replace(/\D/g, '');

                      return (
                        <div
                          key={lead.id}
                          className="bg-slate-900/90 hover:bg-slate-900 border border-slate-800 hover:border-slate-700 p-3.5 rounded-xl transition-all shadow-md group relative space-y-3"
                        >
                          {/* Priority & Value Header */}
                          <div className="flex items-center justify-between gap-2">
                            <span className={`text-[9px] font-extrabold uppercase px-2 py-0.5 rounded-md border ${priority.class}`}>
                              {priority.label}
                            </span>
                            <span className="text-xs font-black font-mono text-emerald-400">
                              {formatCurrency(lead.estimatedValue)}
                            </span>
                          </div>

                          {/* Client & Project Info */}
                          <div>
                            <h4 
                              onClick={() => setActiveLead(lead)}
                              className="text-xs font-bold text-white hover:text-emerald-400 cursor-pointer transition-colors line-clamp-1"
                            >
                              {lead.fullName}
                            </h4>
                            {lead.companyName && (
                              <p className="text-[11px] text-slate-400 flex items-center gap-1 mt-0.5">
                                <Building2 className="w-3 h-3 text-slate-500 shrink-0" />
                                <span className="truncate">{lead.companyName}</span>
                              </p>
                            )}
                            <p className="text-[10px] text-slate-500 mt-1 line-clamp-1">
                              {lead.projectType || 'Projeto Web'}
                            </p>
                          </div>

                          {/* Lead Source Badge */}
                          <div className="flex items-center justify-between text-[10px] text-slate-500 pt-1 border-t border-slate-800/80">
                            <span>{lead.source || 'Site'}</span>
                            <span>{new Date(lead.createdAt).toLocaleDateString('pt-BR')}</span>
                          </div>

                          {/* Action Buttons */}
                          <div className="flex items-center justify-between gap-1 pt-1">
                            {/* WhatsApp Direct Chat */}
                            <a
                              href={`https://wa.me/${cleanPhone}?text=${encodeURIComponent(`Olá ${lead.fullName}! Aqui é da Opera Digital referente ao seu interesse em ${lead.projectType || 'nossos serviços'}. Podemos conversar?`)}`}
                              target="_blank"
                              rel="noreferrer"
                              className="p-1.5 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 transition-colors"
                              title="Conversar via WhatsApp"
                            >
                              <MessageSquare className="w-3.5 h-3.5 fill-current" />
                            </a>

                            {/* Details Drawer */}
                            <button
                              type="button"
                              onClick={() => setActiveLead(lead)}
                              className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-[10px] font-bold px-2.5 transition-colors flex items-center gap-1"
                            >
                              <FileText className="w-3 h-3 text-emerald-400" />
                              <span>Detalhes</span>
                            </button>

                            {/* Move Stage Quick Menu */}
                            <div className="flex items-center gap-0.5">
                              {stage.id !== 'novo' && (
                                <button
                                  type="button"
                                  onClick={() => {
                                    const currentIndex = STAGES.findIndex((s) => s.id === stage.id);
                                    if (currentIndex > 0) {
                                      handleStageChange(lead, STAGES[currentIndex - 1].id);
                                    }
                                  }}
                                  className="p-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white"
                                  title="Mover para Estágio Anterior"
                                >
                                  <ArrowLeft className="w-3 h-3" />
                                </button>
                              )}

                              {stage.id !== 'perdido' && stage.id !== 'ganho' && (
                                <button
                                  type="button"
                                  onClick={() => {
                                    const currentIndex = STAGES.findIndex((s) => s.id === stage.id);
                                    if (currentIndex < STAGES.length - 2) {
                                      handleStageChange(lead, STAGES[currentIndex + 1].id);
                                    }
                                  }}
                                  className="p-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white"
                                  title="Avançar Estágio"
                                >
                                  <ArrowRight className="w-3 h-3 text-emerald-400" />
                                </button>
                              )}
                            </div>
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* 4. VIEW 2: TABLE VIEW */}
      {viewMode === 'table' && (
        <div className="bg-slate-950 rounded-2xl border border-slate-800 overflow-hidden shadow-2xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-900 border-b border-slate-800 text-slate-400 font-bold uppercase text-[10px] tracking-wider">
                <tr>
                  <th className="p-4">Cliente / Empresa</th>
                  <th className="p-4">Contato</th>
                  <th className="p-4">Projeto / Ramo</th>
                  <th className="p-4">Estágio do Funil</th>
                  <th className="p-4">Prioridade</th>
                  <th className="p-4">Valor (R$)</th>
                  <th className="p-4 text-right">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {filteredLeads.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="p-8 text-center text-slate-500">
                      Nenhum lead encontrado com os filtros selecionados.
                    </td>
                  </tr>
                ) : (
                  filteredLeads.map((lead) => {
                    const stageObj = STAGES.find((s) => s.id === (lead.stage || lead.status || 'novo')) || STAGES[0];
                    const priorityObj = PRIORITIES[lead.priority || 'media'];
                    const cleanPhone = lead.phone.replace(/\D/g, '');

                    return (
                      <tr key={lead.id} className="hover:bg-slate-900/60 transition-colors">
                        <td className="p-4">
                          <div 
                            onClick={() => setActiveLead(lead)}
                            className="font-bold text-white hover:text-emerald-400 cursor-pointer"
                          >
                            {lead.fullName}
                          </div>
                          {lead.companyName && (
                            <div className="text-[11px] text-slate-400 font-medium">
                              {lead.companyName}
                            </div>
                          )}
                        </td>

                        <td className="p-4 space-y-0.5">
                          <div className="font-mono text-emerald-400 flex items-center gap-1">
                            <Phone className="w-3 h-3 text-slate-500" />
                            <span>{lead.phone}</span>
                          </div>
                          <div className="text-slate-400 flex items-center gap-1 text-[11px]">
                            <Mail className="w-3 h-3 text-slate-500" />
                            <span>{lead.email}</span>
                          </div>
                        </td>

                        <td className="p-4">
                          <div className="text-slate-200 font-medium">{lead.projectType || 'Projeto Web'}</div>
                          <div className="text-[10px] text-slate-500">{lead.segment || 'Geral'}</div>
                        </td>

                        <td className="p-4">
                          <select
                            value={lead.stage || lead.status || 'novo'}
                            onChange={(e) => handleStageChange(lead, e.target.value as CrmStage)}
                            className={`px-2.5 py-1 rounded-lg text-xs font-bold border ${stageObj.bgColor} ${stageObj.color} ${stageObj.borderColor} bg-slate-950 focus:outline-none`}
                          >
                            {STAGES.map((s) => (
                              <option key={s.id} value={s.id} className="bg-slate-900 text-white">
                                {s.name}
                              </option>
                            ))}
                          </select>
                        </td>

                        <td className="p-4">
                          <span className={`px-2 py-0.5 rounded-md text-[10px] font-extrabold uppercase border ${priorityObj.class}`}>
                            {priorityObj.label}
                          </span>
                        </td>

                        <td className="p-4 font-mono font-bold text-emerald-400">
                          {formatCurrency(lead.estimatedValue)}
                        </td>

                        <td className="p-4 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <a
                              href={`https://wa.me/${cleanPhone}?text=${encodeURIComponent(`Olá ${lead.fullName}! Aqui é da Opera Digital...`)}`}
                              target="_blank"
                              rel="noreferrer"
                              className="p-1.5 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                              title="WhatsApp"
                            >
                              <MessageSquare className="w-3.5 h-3.5 fill-current" />
                            </a>

                            <button
                              type="button"
                              onClick={() => setActiveLead(lead)}
                              className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300"
                              title="Ver Detalhes"
                            >
                              <FileText className="w-3.5 h-3.5 text-emerald-400" />
                            </button>

                            <button
                              type="button"
                              onClick={() => onDeleteLead(lead.id)}
                              className="p-1.5 rounded-lg bg-slate-800 hover:bg-red-900/40 text-slate-500 hover:text-red-400"
                              title="Excluir Lead"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 5. LEAD DETAIL DRAWER / MODAL */}
      {activeLead && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-slate-950 border border-slate-800 rounded-3xl max-w-3xl w-full max-h-[90vh] overflow-y-auto shadow-2xl flex flex-col">
            
            {/* Modal Header */}
            <div className="p-6 border-b border-slate-800 flex items-center justify-between bg-slate-900/80 sticky top-0 z-10">
              <div className="space-y-1">
                <div className="flex items-center gap-3">
                  <h3 className="text-xl font-extrabold text-white">{activeLead.fullName}</h3>
                  <span className={`px-2.5 py-0.5 rounded-md text-xs font-extrabold border ${PRIORITIES[activeLead.priority || 'media'].class}`}>
                    {PRIORITIES[activeLead.priority || 'media'].label}
                  </span>
                </div>
                {activeLead.companyName && (
                  <p className="text-xs text-slate-400 flex items-center gap-1.5">
                    <Building2 className="w-3.5 h-3.5 text-emerald-400" />
                    <span>{activeLead.companyName}</span>
                  </p>
                )}
              </div>

              <div className="flex items-center gap-2">
                <a
                  href={`https://wa.me/${activeLead.phone.replace(/\D/g, '')}?text=${encodeURIComponent(`Olá ${activeLead.fullName}! Aqui é da Opera Digital...`)}`}
                  target="_blank"
                  rel="noreferrer"
                  className="bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold px-3.5 py-2 rounded-xl transition-colors flex items-center gap-1.5"
                >
                  <MessageSquare className="w-3.5 h-3.5 fill-current" />
                  <span>Abrir WhatsApp</span>
                </a>

                <button
                  type="button"
                  onClick={() => setActiveLead(null)}
                  className="p-2 text-slate-400 hover:text-white rounded-xl bg-slate-800/80"
                >
                  <XCircle className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-6 flex-1">
              
              {/* Stage Stepper / Transition */}
              <div className="bg-slate-900/60 p-4 rounded-2xl border border-slate-800 space-y-3">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
                  Estágio Atual do Funil
                </span>
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
                  {STAGES.map((s) => {
                    const isCurrent = (activeLead.stage || activeLead.status) === s.id;
                    return (
                      <button
                        key={s.id}
                        type="button"
                        onClick={() => handleStageChange(activeLead, s.id)}
                        className={`p-2.5 rounded-xl text-xs font-bold text-center border transition-all ${
                          isCurrent
                            ? `${s.bgColor} ${s.color} ${s.borderColor} shadow-lg ring-1 ring-emerald-500/50`
                            : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
                        }`}
                      >
                        {s.name}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Deal Values & Details Fields */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-slate-900/40 p-4 rounded-2xl border border-slate-800 space-y-3">
                  <h4 className="text-xs font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-1.5">
                    <User className="w-4 h-4" />
                    <span>Dados do Cliente & Contato</span>
                  </h4>

                  <div className="space-y-2 text-xs">
                    <div>
                      <span className="text-slate-500">E-mail:</span>
                      <div className="text-slate-200 font-medium">{activeLead.email}</div>
                    </div>

                    <div>
                      <span className="text-slate-500">Telefone / WhatsApp:</span>
                      <div className="text-emerald-400 font-mono font-bold">{activeLead.phone}</div>
                    </div>

                    {activeLead.cnpj && (
                      <div>
                        <span className="text-slate-500">CNPJ:</span>
                        <div className="text-slate-300 font-mono">{activeLead.cnpj}</div>
                      </div>
                    )}

                    <div>
                      <span className="text-slate-500">Segmento do Negócio:</span>
                      <div className="text-slate-300">{activeLead.segment || 'Não informado'}</div>
                    </div>
                  </div>
                </div>

                <div className="bg-slate-900/40 p-4 rounded-2xl border border-slate-800 space-y-3">
                  <h4 className="text-xs font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-1.5">
                    <DollarSign className="w-4 h-4" />
                    <span>Dados do Negócio CRM</span>
                  </h4>

                  <div className="space-y-3 text-xs">
                    <div>
                      <label className="text-slate-500 block mb-1">Valor Estimado do Projeto (R$):</label>
                      <input
                        type="number"
                        value={activeLead.estimatedValue || 5000}
                        onChange={(e) => {
                          const val = parseFloat(e.target.value) || 0;
                          const updated = { ...activeLead, estimatedValue: val };
                          onUpdateLead(updated);
                          setActiveLead(updated);
                        }}
                        className="bg-slate-950 border border-slate-800 text-emerald-400 font-mono font-extrabold text-sm p-2 rounded-xl w-full focus:outline-none focus:border-emerald-500"
                      />
                    </div>

                    <div>
                      <label className="text-slate-500 block mb-1">Prioridade do Atendimento:</label>
                      <select
                        value={activeLead.priority || 'media'}
                        onChange={(e) => {
                          const prio = e.target.value as LeadPriority;
                          const updated = { ...activeLead, priority: prio };
                          onUpdateLead(updated);
                          setActiveLead(updated);
                        }}
                        className="bg-slate-950 border border-slate-800 text-slate-200 text-xs p-2 rounded-xl w-full focus:outline-none"
                      >
                        <option value="urgente">Urgente</option>
                        <option value="alta">Alta</option>
                        <option value="media">Média</option>
                        <option value="baixa">Baixa</option>
                      </select>
                    </div>

                    <div>
                      <span className="text-slate-500">Origem do Cadastro:</span>
                      <div className="text-slate-300">{activeLead.source || 'Formulário do Site'}</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Project Description */}
              {activeLead.projectDescription && (
                <div className="bg-slate-900/40 p-4 rounded-2xl border border-slate-800 space-y-1">
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Descrição do Projeto:</span>
                  <p className="text-xs text-slate-300 leading-relaxed pt-1">
                    {activeLead.projectDescription}
                  </p>
                </div>
              )}

              {/* Internal Notes & Comments Section */}
              <div className="bg-slate-900/60 p-4 rounded-2xl border border-slate-800 space-y-4">
                <h4 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
                  <FileText className="w-4 h-4 text-emerald-400" />
                  <span>Anotações Internas da Equipe ({activeLead.notes?.length || 0})</span>
                </h4>

                {/* Add Note Form */}
                <form onSubmit={handleAddNoteSubmit} className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Adicionar anotação sobre reunião, ligação ou orçamento..."
                    value={noteInput}
                    onChange={(e) => setNoteInput(e.target.value)}
                    className="flex-1 bg-slate-950 border border-slate-800 text-white text-xs px-3.5 py-2.5 rounded-xl focus:outline-none focus:border-emerald-500"
                  />
                  <button
                    type="submit"
                    disabled={!noteInput.trim()}
                    className="bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white text-xs font-bold px-4 py-2.5 rounded-xl transition-all flex items-center gap-1 shrink-0"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Salvar Nota</span>
                  </button>
                </form>

                {/* Notes List */}
                <div className="space-y-2 max-h-48 overflow-y-auto">
                  {!activeLead.notes || activeLead.notes.length === 0 ? (
                    <p className="text-xs text-slate-500 italic py-2">
                      Nenhuma anotação registrada ainda.
                    </p>
                  ) : (
                    activeLead.notes.map((note) => (
                      <div key={note.id} className="p-3 bg-slate-950 rounded-xl border border-slate-800 space-y-1">
                        <div className="flex items-center justify-between text-[10px] text-slate-400">
                          <span className="font-bold text-emerald-400">{note.author}</span>
                          <span>{new Date(note.createdAt).toLocaleString('pt-BR')}</span>
                        </div>
                        <p className="text-xs text-slate-200">{note.text}</p>
                      </div>
                    ))
                  )}
                </div>
              </div>

              {/* Activity Log Timeline */}
              <div className="bg-slate-900/60 p-4 rounded-2xl border border-slate-800 space-y-3">
                <h4 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
                  <Clock className="w-4 h-4 text-emerald-400" />
                  <span>Histórico de Atividades</span>
                </h4>

                <div className="space-y-2 max-h-40 overflow-y-auto">
                  {!activeLead.activities || activeLead.activities.length === 0 ? (
                    <p className="text-xs text-slate-500 italic">Cadastrado no CRM.</p>
                  ) : (
                    activeLead.activities.map((act) => (
                      <div key={act.id} className="flex items-center justify-between text-xs p-2 bg-slate-950 rounded-lg border border-slate-800/80">
                        <span className="text-slate-300">{act.description}</span>
                        <span className="text-[10px] text-slate-500 font-mono ml-2 shrink-0">
                          {new Date(act.createdAt).toLocaleString('pt-BR')}
                        </span>
                      </div>
                    ))
                  )}
                </div>
              </div>

            </div>

          </div>
        </div>
      )}

      {/* 6. CREATE LEAD MODAL */}
      {createModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-slate-950 border border-slate-800 rounded-3xl max-w-lg w-full p-6 space-y-6 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <Plus className="w-5 h-5 text-emerald-400" />
                <span>Cadastrar Novo Lead no CRM</span>
              </h3>
              <button
                type="button"
                onClick={() => setCreateModalOpen(false)}
                className="text-slate-400 hover:text-white"
              >
                <XCircle className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateLeadSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-300 font-bold mb-1">Nome Completo do Cliente *</label>
                <input
                  type="text"
                  required
                  placeholder="Ex: Carlos Silva"
                  value={newLeadForm.fullName}
                  onChange={(e) => setNewLeadForm({ ...newLeadForm, fullName: e.target.value })}
                  className="w-full bg-slate-900 border border-slate-800 text-white p-2.5 rounded-xl focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-bold mb-1">Nome da Empresa</label>
                  <input
                    type="text"
                    placeholder="Ex: Tech Solutions"
                    value={newLeadForm.companyName}
                    onChange={(e) => setNewLeadForm({ ...newLeadForm, companyName: e.target.value })}
                    className="w-full bg-slate-900 border border-slate-800 text-white p-2.5 rounded-xl focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-bold mb-1">Telefone / WhatsApp *</label>
                  <input
                    type="text"
                    required
                    placeholder="(51) 99999-8888"
                    value={newLeadForm.phone}
                    onChange={(e) => setNewLeadForm({ ...newLeadForm, phone: e.target.value })}
                    className="w-full bg-slate-900 border border-slate-800 text-white p-2.5 rounded-xl focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-bold mb-1">E-mail Comercial</label>
                <input
                  type="email"
                  placeholder="carlos@empresa.com.br"
                  value={newLeadForm.email}
                  onChange={(e) => setNewLeadForm({ ...newLeadForm, email: e.target.value })}
                  className="w-full bg-slate-900 border border-slate-800 text-white p-2.5 rounded-xl focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-bold mb-1">Tipo de Serviço</label>
                  <select
                    value={newLeadForm.projectType}
                    onChange={(e) => setNewLeadForm({ ...newLeadForm, projectType: e.target.value })}
                    className="w-full bg-slate-900 border border-slate-800 text-white p-2.5 rounded-xl focus:outline-none"
                  >
                    <option value="Criação de Site Profissional">Site Profissional</option>
                    <option value="E-commerce Completo">E-commerce Completo</option>
                    <option value="Automação do WhatsApp Web">Automação WhatsApp Web</option>
                    <option value="Agente de IA Personalizado">Agente de IA</option>
                    <option value="Portal Corporativo">Portal Corporativo</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-300 font-bold mb-1">Valor Estimado (R$)</label>
                  <input
                    type="number"
                    value={newLeadForm.estimatedValue}
                    onChange={(e) => setNewLeadForm({ ...newLeadForm, estimatedValue: parseFloat(e.target.value) || 0 })}
                    className="w-full bg-slate-900 border border-slate-800 text-emerald-400 font-mono font-bold p-2.5 rounded-xl focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-bold mb-1">Prioridade</label>
                  <select
                    value={newLeadForm.priority}
                    onChange={(e) => setNewLeadForm({ ...newLeadForm, priority: e.target.value as LeadPriority })}
                    className="w-full bg-slate-900 border border-slate-800 text-white p-2.5 rounded-xl focus:outline-none"
                  >
                    <option value="urgente">Urgente</option>
                    <option value="alta">Alta</option>
                    <option value="media">Média</option>
                    <option value="baixa">Baixa</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-300 font-bold mb-1">Estágio Inicial</label>
                  <select
                    value={newLeadForm.stage}
                    onChange={(e) => setNewLeadForm({ ...newLeadForm, stage: e.target.value as CrmStage })}
                    className="w-full bg-slate-900 border border-slate-800 text-white p-2.5 rounded-xl focus:outline-none"
                  >
                    {STAGES.map((s) => (
                      <option key={s.id} value={s.id}>{s.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="pt-2 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setCreateModalOpen(false)}
                  className="px-4 py-2 text-slate-400 hover:text-white"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold px-5 py-2.5 rounded-xl shadow-lg shadow-emerald-950/60 transition-all"
                >
                  Cadastrar Lead
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
