"use client";

import { Pricing } from "@/components/blocks/pricing";

const demoPlans = [
  {
    name: "STARTER",
    price: "20",
    yearlyPrice: "150",
    period: "por mês",
    features: [
      "Acesso a questões básicas",
      "Estatísticas de desempenho",
      "Suporte via email",
      "Banco de questões limitado",
      "Feedback básico de respostas",
    ],
    description: "Ideal para começar seus estudos",
    buttonText: "Começar Teste Grátis",
    href: "/sign-up",
    isPopular: false,
  },
  {
    name: "PROFESSIONAL",
    price: "50",
    yearlyPrice: "170",
    period: "por mês",
    features: [
      "Acesso completo ao banco de questões",
      "Análise detalhada de desempenho",
      "Suporte prioritário",
      "Questões de concursos anteriores",
      "Feedback detalhado de respostas",
      "Recomendações personalizadas",
      "Trilha de estudos guiada",
    ],
    description: "Perfeito para estudantes dedicados",
    buttonText: "Começar Agora",
    href: "/sign-up",
    isPopular: true,
  },
  {
    name: "ENTERPRISE",
    price: "70",
    yearlyPrice: "190",
    period: "por mês",
    features: [
      "Tudo do Professional",
      "Mentoria personalizada",
      "Suporte 24/7",
      "Análise avançada de progresso",
      "Conteúdo exclusivo",
      "Simulados personalizados",
      "Grupo de estudos VIP",
      "Material complementar",
    ],
    description: "Para máximo desempenho nos estudos",
    buttonText: "Falar com Vendas",
    href: "/contact",
    isPopular: false,
  },
];

export function PricingSection() {
  return (
    <div className="py-12">
      <Pricing 
        plans={demoPlans}
        title="Preços Simples e Transparentes"
        description="Escolha o plano que funciona para você\nTodos os planos incluem acesso à nossa plataforma, ferramentas de estudo e suporte dedicado."
      />
    </div>
  );
}