export interface ProductItem {
  id: string;
  title: string;
  category: string;
  shortDesc: string;
  fullDesc: string;
  badge?: string;
  iconName: string;
  highlights: string[];
  mockupType: 'erp' | 'hub' | 'pdv' | 'bank' | 'shipping';
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

export interface TestimonialData {
  quote: string;
  author: string;
  role: string;
  company: string;
  metrics: string;
  avatarUrl: string;
  tags: string[];
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
  category: 'E-commerce' | 'ERP & PDV' | 'Automações & IA' | 'Portais & Web Apps';
  description: string;
  resultMetric: string;
  resultLink: string;
  imageUrl: string;
  tags: string[];
  completedDate: string;
}

