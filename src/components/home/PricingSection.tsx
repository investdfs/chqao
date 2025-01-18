"use client";

import { Pricing } from "@/components/blocks/pricing";

const demoPlans = [
  {
    name: "STARTER",
    price: "249",
    yearlyPrice: "199",
    period: "por mês",
    features: [
      "Até 10 projetos",
      "Análise básica",
      "Suporte em 48 horas",
      "Acesso limitado à API",
      "Suporte da comunidade",
    ],
    description: "Perfeito para indivíduos e pequenos projetos",
    buttonText: "Começar Teste Grátis",
    href: "/sign-up",
    isPopular: false,
  },
  {
    name: "PROFESSIONAL",
    price: "499",
    yearlyPrice: "399",
    period: "por mês",
    features: [
      "Projetos ilimitados",
      "Análise avançada",
      "Suporte em 24 horas",
      "Acesso completo à API",
      "Suporte prioritário",
      "Colaboração em equipe",
      "Integrações personalizadas",
    ],
    description: "Ideal para equipes e negócios em crescimento",
    buttonText: "Começar Agora",
    href: "/sign-up",
    isPopular: true,
  },
  {
    name: "ENTERPRISE",
    price: "1499",
    yearlyPrice: "1199",
    period: "por mês",
    features: [
      "Tudo do Professional",
      "Soluções personalizadas",
      "Gerente de conta dedicado",
      "Suporte em 1 hora",
      "Autenticação SSO",
      "Segurança avançada",
      "Contratos personalizados",
      "Acordo de SLA",
    ],
    description: "Para grandes organizações com necessidades específicas",
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
        description="Escolha o plano que funciona para você\nTodos os planos incluem acesso à nossa plataforma, ferramentas de geração de leads e suporte dedicado."
      />
    </div>
  );
}