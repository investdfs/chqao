import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import {
  ArrowRight,
  BookOpen,
  Brain,
  Target,
  Trophy,
  Users,
  Sparkles,
} from "lucide-react";

const Index = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-primary-light/5">
      <section className="relative py-20 sm:py-32">
        <div className="container mx-auto px-4 relative">
          <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-24">
            <div className="lg:w-1/2 space-y-8 animate-fade-in">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary animate-pulse">
                <Sparkles className="w-4 h-4" />
                <span className="text-sm font-medium">Plataforma Inovadora de Estudos</span>
              </div>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight">
                Prepare-se para o <span className="text-primary animate-pulse">Sucesso</span> no CHQAO
              </h1>
              <p className="text-lg sm:text-xl text-gray-700 leading-relaxed">
                Domine o conteúdo através de questões personalizadas e feedback instantâneo. 
                Uma plataforma desenvolvida especialmente para seu sucesso.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                <Button
                  onClick={() => navigate("/register")}
                  className="group relative overflow-hidden px-8 py-6 text-lg shadow-lg hover:shadow-xl transition-all duration-300 bg-primary hover:bg-primary-hover"
                >
                  <span className="relative z-10 flex items-center gap-2 text-white">
                    Comece Agora
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </span>
                </Button>
                <Button
                  onClick={() => navigate("/login")}
                  variant="outline"
                  className="px-8 py-6 text-lg border-2 hover:bg-primary-light transition-colors duration-300"
                >
                  Já tenho conta
                </Button>
              </div>
            </div>
            <div className="lg:w-1/2 relative">
              <div className="relative w-full aspect-[4/3] max-w-xl mx-auto">
                <div className="absolute inset-0 bg-gradient-conic from-primary/30 via-primary-light to-transparent animate-spin-slow rounded-full blur-3xl" />
                <img
                  src="https://wp.novaenergiamg.com.br/wp-content/uploads/2025/01/whisk_storyboard2bd719a2e81c47df9d3e5e971e9634.png"
                  alt="Emblema Militar CHQAO"
                  className="relative z-10 w-full h-full object-contain p-8 rounded-2xl shadow-2xl transform hover:scale-105 transition-transform duration-300"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="relative py-20 bg-white/80 backdrop-blur-sm">
        <div className="container mx-auto px-4 relative">
          <h2 className="text-3xl sm:text-4xl font-bold text-center text-gray-900 mb-16">
            Por que escolher o CHQAO?
          </h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className="group bg-white rounded-xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 animate-fade-in hover:translate-y-[-4px] border border-gray-100"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="w-12 h-12 bg-primary-light rounded-lg flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                  <feature.icon className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-4 text-gray-900">{feature.title}</h3>
                <p className="text-gray-700 leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 bg-gradient-to-br from-gray-50 to-white">
        <div className="container mx-auto px-4">
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div
                key={index}
                className="bg-white rounded-xl p-8 text-center transform hover:-translate-y-1 transition-all duration-300 animate-fade-in shadow-lg hover:shadow-xl border border-gray-100"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="text-3xl sm:text-4xl font-bold text-primary mb-2 animate-float">
                  {stat.value}
                </div>
                <div className="text-gray-700 font-medium">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

const features = [
  {
    icon: BookOpen,
    title: "Questões Comentadas",
    description: "Todas as questões possuem explicações detalhadas elaboradas por especialistas para maximizar seu aprendizado.",
  },
  {
    icon: Brain,
    title: "Aprendizado Inteligente",
    description: "Sistema que identifica seus pontos fracos e adapta o conteúdo para otimizar seus estudos.",
  },
  {
    icon: Target,
    title: "Estudo Direcionado",
    description: "Pratique com questões específicas para suas necessidades e objetivos de estudo.",
  },
  {
    icon: Trophy,
    title: "Acompanhe seu Progresso",
    description: "Visualize seu desempenho em tempo real e identifique áreas para melhorar.",
  },
  {
    icon: Users,
    title: "Comunidade Engajada",
    description: "Faça parte de uma comunidade de estudantes comprometidos com o sucesso.",
  },
];

const stats = [
  {
    value: "10.000+",
    label: "Questões Disponíveis",
  },
  {
    value: "50.000+",
    label: "Alunos Cadastrados",
  },
  {
    value: "95%",
    label: "Taxa de Aprovação",
  },
  {
    value: "24/7",
    label: "Suporte Disponível",
  },
];

export default Index;
