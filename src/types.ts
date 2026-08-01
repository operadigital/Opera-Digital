export interface ServiceItem {
  id: string;
  title: string;
  category: string;
  shortDesc: string;
  fullDesc: string;
  badge?: string;
  iconName: string;
  highlights: string[];
}

export interface AiAgentFeature {
  id: string;
  title: string;
  description: string;
  iconName: string;
  badge: string;
  examplePrompt: string;
  sampleResponse: string;
}

export interface RegistrationFormData {
  fullName: string;
  preferredName: string;
  email: string;
  phone: string;
  cnpj: string;
  password: string;
  emailOptIn: boolean;
  whatsappOptIn: boolean;
  termsAccepted: boolean;
}

export interface PortfolioProject {
  id: string;
  title: string;
  clientName: string;
  category: string;
  description: string;
  resultMetric?: string;
  resultLink: string;
  imageUrl: string;
  tags: string[];
  completedDate: string;
}

export type CrmStage = 'novo' | 'qualificacao' | 'proposta' | 'negociacao' | 'ganho' | 'perdido';
export type LeadPriority = 'baixa' | 'media' | 'alta' | 'urgente';

export interface LeadNote {
  id: string;
  text: string;
  author: string;
  createdAt: string;
}

export interface LeadActivity {
  id: string;
  type: 'whatsapp' | 'email' | 'call' | 'stage_change' | 'note' | 'system';
  description: string;
  createdAt: string;
  author?: string;
}

export interface CrmLead {
  id: string;
  fullName: string;
  companyName?: string;
  email: string;
  phone: string;
  cnpj?: string;
  segment?: string;
  projectType?: string;
  projectDescription?: string;
  status?: string; // legacy or mapped to stage
  stage: CrmStage;
  priority: LeadPriority;
  estimatedValue?: number;
  assignedTo?: string;
  tags?: string[];
  source?: string; // 'Formulário Site', 'WhatsApp Bot', 'Manual', etc.
  createdAt: string;
  lastContactDate?: string;
  notes?: LeadNote[];
  activities?: LeadActivity[];
  whatsappOptIn?: boolean;
  chatMessages?: WhatsAppChatMessage[];
}

export interface WhatsAppChatMessage {
  id: string;
  sender: 'client' | 'agent' | 'bot';
  text: string;
  timestamp: string;
  status?: 'sent' | 'delivered' | 'read';
  mediaUrl?: string;
  mediaType?: 'image' | 'document' | 'audio';
}

export interface WhatsAppConversation {
  id: string;
  leadId: string;
  clientName: string;
  clientPhone: string;
  companyName?: string;
  avatarUrl?: string;
  unreadCount: number;
  lastMessage: string;
  lastMessageTime: string;
  status: 'em_atendimento' | 'aguardando' | 'finalizado';
  messages: WhatsAppChatMessage[];
}


