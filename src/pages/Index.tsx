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

const Index = () => {
  const navigate = useNavigate();
  const isPreview = window.location.hostname.includes('preview');

  return (
    <div className="min-h-screen">
      {isPreview && (
        <nav className="bg-white shadow-sm py-4">
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
                      <NavigationMenuLink 
                        className="cursor-pointer block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                        onClick={() => navigate("/student-dashboard")}
                      >
                        Dashboard do Aluno
                      </NavigationMenuLink>
                      <NavigationMenuLink 
                        className="cursor-pointer block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                        onClick={() => navigate("/admin-dashboard")}
                      >
                        Dashboard do Admin
                      </NavigationMenuLink>
                    </div>
                  </NavigationMenuContent>
                </NavigationMenuItem>
              </NavigationMenuList>
            </NavigationMenu>
          </div>
        </nav>
      )}

      <section className="bg-gradient-to-b from-primary-light to-white py-12 sm:py-20">
        <div className="container mx-auto px-4">
          <div className="flex flex-col lg:flex-row items-center gap-8 lg:gap-12">
            <div className="lg:w-1/2 animate-fade-in text-center lg:text-left">
              <h1 className="text-3xl sm:text-4xl lg:text-6xl font-bold text-primary-dark mb-4 sm:mb-6">
                CHQAO - Estude Praticando
              </h1>
              <p className="text-base sm:text-lg text-gray-700 mb-6 sm:mb-8">
                A melhor plataforma para praticar questões e se preparar para suas provas.
                Milhares de questões comentadas para você estudar no seu ritmo.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <Button
                  onClick={() => navigate("/register")}
                  className="w-full sm:w-auto btn-primary"
                >
                  Começar Agora - É Grátis!
                </Button>
                <Button
                  onClick={() => navigate("/login")}
                  variant="outline"
                  className="w-full sm:w-auto btn-secondary"
                >
                  Já tenho conta
                </Button>
              </div>
            </div>
            <div className="lg:w-1/2">
              <img
                src="/placeholder.svg"
                alt="Estudante praticando questões"
                className="w-full h-auto rounded-lg shadow-lg animate-fade-in"
              />
            </div>
          </div>
        </div>
      </section>

      <section className="py-12 sm:py-20">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl sm:text-3xl font-bold text-center mb-8 sm:mb-12">
            Por que escolher o CHQAO?
          </h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className="card hover:shadow-md transition-shadow animate-fade-in p-6"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="text-primary mb-4 text-3xl sm:text-4xl">{feature.icon}</div>
                <h3 className="text-lg sm:text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-gray-600 text-sm sm:text-base">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-primary-light py-12 sm:py-20">
        <div className="container mx-auto px-4">
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {stats.map((stat, index) => (
              <div
                key={index}
                className="animate-fade-in text-center"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="text-3xl sm:text-4xl font-bold text-primary mb-2">
                  {stat.value}
                </div>
                <div className="text-gray-600 text-sm sm:text-base">{stat.label}</div>
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
    icon: "📚",
    title: "Questões Comentadas",
    description: "Todas as questões possuem explicações detalhadas para maximizar seu aprendizado.",
  },
  {
    icon: "📊",
    title: "Acompanhe seu Progresso",
    description: "Estatísticas detalhadas sobre seu desempenho em cada área de conhecimento.",
  },
  {
    icon: "🎯",
    title: "Estude com Foco",
    description: "Sistema inteligente que identifica seus pontos fracos e sugere questões personalizadas.",
  },
];

const stats = [
  {
    value: "10,000+",
    label: "Questões Disponíveis",
  },
  {
    value: "50,000+",
    label: "Alunos Cadastrados",
  },
  {
    value: "95%",
    label: "Taxa de Aprovação",
  },
];

export default Index;
