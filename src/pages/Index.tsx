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
import { ArrowRight, BookOpen, Brain, Target, Trophy, Users } from "lucide-react";

const Index = () => {
  const navigate = useNavigate();
  const isPreview = window.location.hostname.includes('preview');

  return (
    <div className="min-h-screen bg-gradient-to-b from-primary-light via-white to-white">
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
        <div className="container mx-auto px-4">
          <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-24">
            <div className="lg:w-1/2 space-y-8 animate-fade-in">
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-primary-dark leading-tight">
                Prepare-se para o <span className="text-primary">Sucesso</span> no CHQAO
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
                  <span className="relative z-10 flex items-center gap-2">
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
              <div className="relative w-full aspect-square max-w-lg mx-auto animate-fade-in" style={{ animationDelay: "0.2s" }}>
                <img
                  src="/placeholder.svg"
                  alt="Estudante praticando questões"
                  className="w-full h-full object-cover rounded-2xl shadow-2xl transform hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-tr from-primary/20 to-transparent" />
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 bg-gradient-to-b from-white to-primary-light">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl sm:text-4xl font-bold text-center text-primary-dark mb-16">
            Por que escolher o CHQAO?
          </h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className="group bg-white/80 backdrop-blur rounded-xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 animate-fade-in"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="w-12 h-12 bg-primary-light rounded-lg flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                  <feature.icon className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-4 text-primary-dark">{feature.title}</h3>
                <p className="text-gray-600 leading-relaxed">{feature.description}</p>
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
                className="bg-primary-light rounded-xl p-8 text-center transform hover:-translate-y-1 transition-all duration-300 animate-fade-in"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="text-3xl sm:text-4xl font-bold text-primary mb-2">
                  {stat.value}
                </div>
                <div className="text-gray-600 font-medium">{stat.label}</div>
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