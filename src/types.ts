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


