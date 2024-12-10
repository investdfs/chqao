import { BookOpen, Brain, Target, Trophy, Users, CheckCircle } from "lucide-react";

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

export const Features = () => {
  return (
    <section className="py-20 bg-gray-50">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl sm:text-4xl font-bold text-center text-gray-900 mb-16">
          Por que escolher o CHQAO?
        </h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="bg-white rounded-lg p-8 shadow-md hover:shadow-lg transition-shadow"
            >
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-6">
                <feature.icon className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-4 text-gray-900">{feature.title}</h3>
              <p className="text-gray-600 leading-relaxed">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};