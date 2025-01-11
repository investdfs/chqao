import { motion } from "framer-motion";
import { Brain, Target, BookOpen, BarChart3, Timer, Star, ChevronRight } from "lucide-react";

const features = [
  {
    icon: Brain,
    title: "Estudo Inteligente",
    description: "Sistema que identifica seus pontos fracos e adapta o conteúdo automaticamente.",
  },
  {
    icon: Target,
    title: "Foco no Objetivo",
    description: "Questões específicas e atualizadas para o CHQAO.",
  },
  {
    icon: BookOpen,
    title: "Material Completo",
    description: "Banco de questões extenso com explicações detalhadas.",
  },
  {
    icon: BarChart3,
    title: "Análise Detalhada",
    description: "Acompanhe seu progresso com estatísticas detalhadas.",
  },
  {
    icon: Timer,
    title: "Gestão do Tempo",
    description: "Simulados cronometrados e feedback sobre seu ritmo.",
  },
  {
    icon: Star,
    title: "Experiência Real",
    description: "Interface e questões similares à prova oficial.",
  },
];

export const FeaturesSection = () => {
  return (
    <section className="py-4 sm:py-12 bg-white/80 backdrop-blur-sm">
      <div className="container mx-auto px-4">
        <div className="text-center mb-4 sm:mb-12">
          <h2 className="text-xl sm:text-3xl font-bold text-gray-900">
            Por que escolher nossa plataforma?
          </h2>
        </div>
        
        {/* Mobile View */}
        <div className="sm:hidden space-y-2">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
              className="flex items-center gap-3 p-3 bg-white rounded-lg shadow-sm hover:shadow-md transition-all duration-300 border border-gray-100"
            >
              <div className="bg-primary-light rounded-lg p-2 flex-shrink-0">
                <feature.icon className="w-4 h-4 text-primary" />
              </div>
              <div className="flex-grow">
                <h3 className="text-sm font-semibold text-gray-900">{feature.title}</h3>
                <p className="text-xs text-gray-600 mt-0.5">{feature.description}</p>
              </div>
              <ChevronRight className="w-4 h-4 text-gray-400 flex-shrink-0" />
            </motion.div>
          ))}
        </div>

        {/* Desktop View */}
        <div className="hidden sm:grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
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