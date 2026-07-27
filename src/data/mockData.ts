import { ServiceItem, AiAgentFeature, PortfolioProject } from '../types';

export const SERVICES_LIST: ServiceItem[] = [
  {
    id: 'criacao-de-sites',
    title: 'Criação de Sites Profissionais',
    category: 'Presença Digital & Alta Performance',
    shortDesc: 'Desenvolvimento de websites modernos, Landing Pages de alta conversão, e-commerces e portais corporativos sob medida.',
    fullDesc: 'Construímos sites rápidos, 100% responsivos para dispositivos móveis, otimizados para os motores de busca (SEO) e desenhados focando na máxima conversão dos seus visitantes em clientes reais.',
    badge: 'Design Exclusivo',
    iconName: 'Globe',
    highlights: [
      'Layouts modernos e personalizados com a identidade visual da sua marca',
      'Otimização completa para SEO para seu site se destacar no Google',
      'Páginas ultra-rápidas e 100% adaptadas para celulares e computadores',
      'Integração direta com o WhatsApp Web para captação imediata de contatos'
    ]
  },
  {
    id: 'estruturacao-whatsapp',
    title: 'Estruturação do WhatsApp Web',
    category: 'Automação & Atendimento Inteligente',
    shortDesc: 'Transforme o seu WhatsApp em uma máquina de vendas com atendentes virtuais, agentes de IA e fluxos automatizados.',
    fullDesc: 'Estruturamos todo o ecossistema do seu WhatsApp Web: desde robôs de triagem e agentes virtuais de IA até mensagens automáticas de boas-vindas, acompanhamento de propostas e direcionamento para sua equipe.',
    badge: 'Vendas Automatizadas',
    iconName: 'MessageSquare',
    highlights: [
      'Atendimento automatizado 24 horas por dia, 7 dias por semana',
      'Agentes virtuais com IA preparados com todas as informações do seu negócio',
      'Funil de vendas direto no chat com respostas e botões de ação rápidos',
      'Multi-atendentes na mesma conta de WhatsApp Web com distribuição inteligente'
    ]
  }
];

export const AI_AGENTS_FEATURES: AiAgentFeature[] = [
  {
    id: 'whatsapp-vendas',
    title: 'Agentes de IA no WhatsApp',
    description: 'Configure robôs virtuais inteligentes no seu WhatsApp Web para apresentar produtos, responder dúvidas frequentes e qualificar clientes.',
    iconName: 'Bot',
    badge: 'WhatsApp Web',
    examplePrompt: 'Crie um atendente de vendas para tirar dúvidas de clientes sobre nossos serviços de desenvolvimento de sites.',
    sampleResponse: '🤖 Agente WhatsApp ativado! Ele responderá os clientes instantaneamente com informações completas e direcionará os interessados.'
  },
  {
    id: 'captura-leads',
    title: 'Integração Site + WhatsApp',
    description: 'Converta os visitantes do seu site em conversas diretas no WhatsApp Web com formulários e botões de clique rápido inteligentes.',
    iconName: 'Zap',
    badge: 'Lead Direto',
    examplePrompt: 'Como conectar os formulários do meu site novo para enviar a notificação no WhatsApp?',
    sampleResponse: '⚡ Integração pronta: cada novo lead preenchido no site iniciará automaticamente uma conversa no seu WhatsApp Web!'
  },
  {
    id: 'respostas-rapidas',
    title: 'Respostas e Funis Automáticos',
    description: 'Automatize sequências de atendimento, triagem inicial e acompanhamento de propostas sem deixar nenhum cliente esperando.',
    iconName: 'MessageSquare',
    badge: 'Zero Espera',
    examplePrompt: 'Monte um fluxo de boas-vindas e triagem para novos clientes que entrarem em contato pelo WhatsApp.',
    sampleResponse: '✨ Fluxo de triagem estruturado! O cliente é saudado, escolhe o assunto e recebe atendimento ágil.'
  }
];

export const VALUE_PILLARS = [
  { title: 'Sites 100% Personalizados', description: 'Desenvolvimento focado na conversão de visitantes em clientes' },
  { title: 'WhatsApp Web Automatizado', description: 'Agilidade de atendimento 24/7 com inteligência artificial' },
  { title: 'Design & SEO de Elite', description: 'Páginas velozes e posicionadas para atrair novas oportunidades' },
  { title: 'Suporte & Acompanhamento', description: 'Atendimento próximo para manter suas soluções sempre atualizadas' }
];

export const INITIAL_PORTFOLIO_PROJECTS: PortfolioProject[] = [];


