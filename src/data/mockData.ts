import { ProductItem, AiAgentFeature, TestimonialData, PortfolioProject } from '../types';

export const PRODUCTS_LIST: ProductItem[] = [
  {
    id: 'erp',
    title: 'Sistema ERP',
    category: 'Gestão Central',
    shortDesc: 'Emissão ilimitada de NFs, controle de fluxo de pedidos, relatórios financeiros e conexão com +30 marketplaces.',
    fullDesc: 'Elimine o trabalho manual e erros de digitação. Nosso ERP automatiza desde a entrada de mercadorias via XML até a geração do DRE gerencial, garantindo conformidade fiscal e total visibilidade financeira.',
    badge: 'Gestão Inteligente',
    iconName: 'FileText',
    mockupType: 'erp',
    highlights: [
      'Emissão automática de NFe, NFCe e NFSe em segundos',
      'DRE e relatórios financeiros em tempo real',
      'Sincronização instantânea com +30 marketplaces',
      'Controle rigoroso de estoque multi-depósito'
    ]
  },
  {
    id: 'hub',
    title: 'Hub de Integração',
    category: 'Vendas Multicanal',
    shortDesc: 'Gerencie múltiplos canais de venda em um só painel: anúncios, produtos em massa e etiquetas automáticas.',
    fullDesc: 'Conecte suas lojas do Mercado Livre, Shopee, Amazon, Magalu, Tiendanube e Nuvemshop. Publique produtos em massa com precificação inteligente ajustada por canal.',
    badge: 'Automação Multicanal',
    iconName: 'Layers',
    mockupType: 'hub',
    highlights: [
      'Publicação e atualização em massa de anúncios',
      'Impressão unificada de etiquetas de envio',
      'Sincronização de estoque em tempo real para evitar furo',
      'Mapeamento de categorias e atributos por marketplace'
    ]
  },
  {
    id: 'pdv',
    title: 'Sistema PDV',
    category: 'Loja Física & Balcão',
    shortDesc: 'Frente de caixa ultrarrápida, operação com suporte offline, estoque sincronizado com a web e controle de comissões.',
    fullDesc: 'Transforme seu balcão de vendas em um ponto de alto desempenho. Compatível com leitor de código de barras, impressoras térmicas e TEF para recebimentos via cartão e Pix.',
    badge: 'Frente de Caixa',
    iconName: 'Store',
    mockupType: 'pdv',
    highlights: [
      'Operação contínua mesmo sem conexão com a internet',
      'Fechamento de caixa cego e sangria simplificada',
      'Cálculo e divisão de comissão de vendedores em tempo real',
      'Sincronização imediata entre estoque físico e e-commerce'
    ]
  },
  {
    id: 'bank',
    title: 'Conta Digital',
    category: 'Finanças Integradas',
    shortDesc: 'Pix sem taxas veladas, pagamentos em lote de salários/fornecedores, cálculo de GNRE e conciliação automática.',
    fullDesc: 'Sua gestão financeira e bancária na mesma plataforma. Esqueça arquivos CNAB complexos: receba de clientes e pague fornecedores diretamente do ERP com total transparência.',
    badge: '100% Integrada ao ERP',
    iconName: 'Wallet',
    mockupType: 'bank',
    highlights: [
      'Recebimentos via Pix com liquidação imediata',
      'Emissão e pagamento automatizado de guias GNRE',
      'Pagamentos de boletos e salários em lote',
      'Conciliação bancária inteligente sem necessidade de importação manual'
    ]
  },
  {
    id: 'shipping',
    title: 'Envios',
    category: 'Logística & Frete',
    shortDesc: 'Tabela de fretes reduzida, coletas diárias sem quantidade mínima e rastreamento automatizado em tempo real.',
    fullDesc: 'Reduza em até 40% seus custos com frete. Integrado com as principais transportadoras e Correios, gerando cotação instantânea no checkout e notificações no WhatsApp do cliente.',
    badge: 'Frete Mais Barato',
    iconName: 'Truck',
    mockupType: 'shipping',
    highlights: [
      'Coletas inclusas na sua empresa sem cota mínima de envio',
      'Rastreamento inteligente enviado por WhatsApp para o cliente',
      'Comparador de frete dinâmico na hora da venda',
      'Gestão simples de devoluções e logística reversa'
    ]
  }
];

export const AI_AGENTS_FEATURES: AiAgentFeature[] = [
  {
    id: 'create-agents',
    title: 'Criar agentes personalizados',
    description: 'Configure robôs virtuais especializados em vendas, atendimento ao cliente ou suporte técnico com o tom de voz da sua marca.',
    iconName: 'Bot',
    badge: 'Sem Código',
    examplePrompt: 'Crie um agente de vendas para atender clientes no WhatsApp interessados em autopeças.',
    sampleResponse: '🤖 Agente "Atendente Opera Parts" criado! Ele já conhece seu catálogo de 1.400 itens, preços e estoque atual.'
  },
  {
    id: 'chat-data',
    title: 'Conversar com dados',
    description: 'Pergunte em português claro sobre seu faturamento, produto mais vendido, margem de lucro ou previsão de caixa.',
    iconName: 'MessageSquare',
    badge: 'Insights em Tempo Real',
    examplePrompt: 'Qual foi nosso produto com maior margem de lucro essa semana e quanto faturamos?',
    sampleResponse: '📊 Esta semana o produto com maior margem foi "Kit Amortecedor Dianteiro" (42% de margem). Faturamento total: R$ 48.920,00.'
  },
  {
    id: 'automate-routines',
    title: 'Automatizar rotinas',
    description: 'Deixe que a IA emita notas fiscais pós-venda, envie lembretes de cobrança via Pix e faça a conciliação bancária diária.',
    iconName: 'Zap',
    badge: 'Zero Tarefas Manuais',
    examplePrompt: 'Automatize a emissão de NF e envio de comprovante assim que a compra for aprovada no Mercado Livre.',
    sampleResponse: '⚡ Rotina ativa: NFs serão geradas automaticamente em menos de 3s e o boleto/Pix enviado direto ao comprador.'
  },
  {
    id: 'delegate-tasks',
    title: 'Delegar tarefas complexas',
    description: 'A IA otimiza títulos de anúncios, cria descrições persuasivas e reajusta preços com base no custo das mercadorias.',
    iconName: 'CheckCircle2',
    badge: 'Alta Produtividade',
    examplePrompt: 'Otimize a descrição e o título de 50 produtos com estoque parado para vender mais rápido na Shopee.',
    sampleResponse: '✨ Descrições otimizadas para SEO e palavras-chave populares geradas para os 50 produtos selecionados!'
  }
];

export const TESTIMONIAL_DATA: TestimonialData = {
  quote: "Com o Opera Digital, conseguimos unificar a operação das nossas 4 lojas físicas com o e-commerce no Mercado Livre e Shopee. Economizamos mais de 25 horas semanais de digitação manual de notas fiscais e dobramos nosso volume de expedição.",
  author: "Diego Costa",
  role: "Fundador e Diretor de Operações",
  company: "Tudo para Moto (São Paulo/SP)",
  metrics: "+300% em vendas sem aumentar a equipe",
  avatarUrl: "https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=80&w=250",
  tags: ["4 Lojas Físicas", "E-commerce Multicanal", "12.000 NFs/mês"]
};

export const STATS_DATA = [
  { value: '+63 mil', label: 'Empreendedores ativos', detail: 'em todo o Brasil' },
  { value: '+170 mil', label: 'Vendas processadas/hora', detail: 'com 99.99% de uptime' },
  { value: '+194 M', label: 'Notas Fiscais geradas', detail: 'sem erros ou rejeições' },
  { value: 'R$ 4,2 Bi', label: 'Transacionados na Conta Digital', detail: 'com taxa zero no Pix' }
];

export const INITIAL_PORTFOLIO_PROJECTS: PortfolioProject[] = [];

