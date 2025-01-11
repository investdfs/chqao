import { motion } from "framer-motion";
import { Brain, Target, BookOpen, BarChart3, Timer, Star } from "lucide-react";

const features = [
  {
    icon: Brain,
    title: "Estudo Inteligente",
    description: "Sistema que identifica seus pontos fracos e adapta o conteúdo automaticamente para otimizar seu aprendizado.",
  },
  {
    icon: Target,
    title: "Foco no Objetivo",
    description: "Questões específicas e atualizadas, focadas no conteúdo que realmente cai na prova do CHQAO.",
  },
  {
    icon: BookOpen,
    title: "Material Completo",
    description: "Banco de questões extenso com explicações detalhadas e referências para aprofundamento.",
  },
  {
    icon: BarChart3,
    title: "Análise Detalhada",
    description: "Acompanhe seu progresso com estatísticas detalhadas e identifique áreas para melhorar.",
  },
  {
    icon: Timer,
    title: "Gestão do Tempo",
    description: "Simulados cronometrados e feedback sobre seu ritmo de resolução para otimizar seu tempo de prova.",
  },
  {
    icon: Star,
    title: "Experiência Real",
    description: "Interface similar à prova oficial e questões no mesmo nível de dificuldade do concurso.",
  },
];

export const FeaturesSection = () => {
  return (
    <section className="py-8 sm:py-12 bg-white/80 backdrop-blur-sm">
      <div className="container mx-auto px-4">
        <div className="text-center mb-8 sm:mb-12">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">
            Por que escolher nossa plataforma?
          </h2>
          <p className="mt-2 text-base sm:text-lg text-gray-600">
            Recursos exclusivos para maximizar seu aprendizado
          </p>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="group bg-white rounded-lg p-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border border-gray-100"
            >
              <div className="w-10 h-10 bg-primary-light rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                <feature.icon className="w-5 h-5 text-primary" />
              </div>
              <h3 className="text-lg font-semibold mb-2 text-gray-900">{feature.title}</h3>
              <p className="text-sm text-gray-600 leading-relaxed">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};