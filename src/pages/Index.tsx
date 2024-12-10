import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import { ArrowRight, BookOpen, Brain, Target, Trophy, Users, Sparkles, CheckCircle } from "lucide-react";

const Index = () => {
  const navigate = useNavigate();
  const isPreview = window.location.hostname.includes('preview');

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#9b87f5] via-[#D6BCFA] to-white">
      {isPreview && (
        <nav className="bg-white/80 backdrop-blur-md shadow-sm py-4 sticky top-0 z-50">
          <div className="container mx-auto px-4">
            <NavigationMenu>
              <NavigationMenuList className="flex-wrap justify-center">
                <NavigationMenuItem>
                  <NavigationMenuTrigger>Páginas</NavigationMenuTrigger>
                  <NavigationMenuContent>
                    <div className="grid gap-3 p-4 min-w-[200px]">
                      <NavigationMenuLink 
                        className="cursor-pointer block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                        onClick={() => navigate("/")}
                      >
                        Início
                      </NavigationMenuLink>
                      <NavigationMenuLink 
                        className="cursor-pointer block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                        onClick={() => navigate("/login")}
                      >
                        Login
                      </NavigationMenuLink>
                      <NavigationMenuLink 
                        className="cursor-pointer block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                        onClick={() => navigate("/register")}
                      >
                        Registro
                      </NavigationMenuLink>
                    </div>
                  </NavigationMenuContent>
                </NavigationMenuItem>
              </NavigationMenuList>
            </NavigationMenu>
          </div>
        </nav>
      )}

      <section className="relative py-20 sm:py-32 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-radial from-[#9b87f5]/30 to-transparent opacity-50" />
        <div className="container mx-auto px-4 relative">
          <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-24">
            <div className="lg:w-1/2 space-y-8 animate-fade-in">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/90 text-[#7E69AB] shadow-lg animate-pulse">
                <Sparkles className="w-4 h-4" />
                <span className="text-sm font-medium">Plataforma Inovadora de Estudos</span>
              </div>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white leading-tight">
                Prepare-se para o <span className="text-[#1A1F2C] animate-pulse">Sucesso</span> no CHQAO
              </h1>
              <p className="text-lg sm:text-xl text-white/90 leading-relaxed">
                Domine o conteúdo através de questões personalizadas e feedback instantâneo. 
                Uma plataforma desenvolvida especialmente para seu sucesso.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                <Button
                  onClick={() => navigate("/register")}
                  className="group relative overflow-hidden px-8 py-6 text-lg shadow-xl hover:shadow-2xl transition-all duration-300 bg-[#1A1F2C] hover:bg-[#2A2F3C] text-white"
                >
                  <span className="relative z-10 flex items-center gap-2">
                    Comece Agora
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </span>
                </Button>
                <Button
                  onClick={() => navigate("/login")}
                  variant="outline"
                  className="px-8 py-6 text-lg border-2 border-white text-white hover:bg-white/20 transition-colors duration-300"
                >
                  Já tenho conta
                </Button>
              </div>
            </div>
            <div className="lg:w-1/2 relative">
              <div className="relative w-full aspect-square max-w-lg mx-auto">
                <div className="absolute inset-0 bg-gradient-conic from-[#9b87f5]/30 via-[#D6BCFA] to-transparent animate-spin-slow rounded-full blur-3xl" />
                <img
                  src="/placeholder.svg"
                  alt="Estudante praticando questões"
                  className="relative z-10 w-full h-full object-cover rounded-2xl shadow-2xl transform hover:scale-105 transition-transform duration-300"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 bg-gradient-to-b from-white to-[#F1F0FB]">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl sm:text-4xl font-bold text-center text-[#1A1F2C] mb-16">
            Por que escolher o CHQAO?
          </h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className="group bg-white/90 backdrop-blur rounded-xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 animate-fade-in hover:translate-y-[-4px] border border-[#D6BCFA]/20"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="w-12 h-12 bg-[#F1F0FB] rounded-lg flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                  <feature.icon className="w-6 h-6 text-[#7E69AB]" />
                </div>
                <h3 className="text-xl font-semibold mb-4 text-[#1A1F2C]">{feature.title}</h3>
                <p className="text-[#8E9196] leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div
                key={index}
                className="bg-gradient-to-br from-[#F1F0FB] to-white rounded-xl p-8 text-center transform hover:-translate-y-1 transition-all duration-300 animate-fade-in shadow-lg hover:shadow-xl border border-[#D6BCFA]/20"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="text-3xl sm:text-4xl font-bold text-[#7E69AB] mb-2 animate-float">
                  {stat.value}
                </div>
                <div className="text-[#8E9196] font-medium">{stat.label}</div>
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
  {
    icon: CheckCircle,
    title: "Resultados Comprovados",
    description: "Nossa metodologia já ajudou milhares de estudantes a alcançarem seus objetivos.",
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