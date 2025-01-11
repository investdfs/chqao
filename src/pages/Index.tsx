import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import {
  ArrowRight,
  Brain,
  Target,
  Trophy,
  Users,
  CheckCircle,
  Sparkles,
  BookOpen,
  Star,
  Timer,
  BarChart3,
} from "lucide-react";
import { motion } from "framer-motion";

const Index = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-primary-light/5">
      {/* Hero Section */}
      <section className="relative py-12 sm:py-20">
        <div className="container mx-auto px-4 relative">
          <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-24">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="lg:w-1/2 space-y-6"
            >
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary">
                <Sparkles className="w-4 h-4" />
                <span className="text-sm font-medium">Plataforma Inteligente de Estudos</span>
              </div>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight">
                Prepare-se para o <span className="text-primary">CHQAO</span> com Excelência
              </h1>
              <p className="text-lg text-gray-600 leading-relaxed">
                Sistema especializado que aumenta suas chances de aprovação através de questões personalizadas, 
                análise de desempenho e feedback instantâneo.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                <Button
                  onClick={() => navigate("/register")}
                  className="group relative overflow-hidden px-8 py-4 text-lg bg-primary hover:bg-primary-hover text-white rounded-lg shadow-lg hover:shadow-xl transition-all duration-300"
                >
                  <span className="relative z-10 flex items-center gap-2">
                    Comece Agora Gratuitamente
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </span>
                </Button>
                <Button
                  onClick={() => navigate("/login")}
                  variant="outline"
                  className="px-8 py-4 text-lg border-2 hover:bg-primary-light transition-colors duration-300 rounded-lg"
                >
                  Já sou Aluno
                </Button>
              </div>
            </motion.div>
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="lg:w-1/2 relative"
            >
              <div className="relative w-full aspect-[4/3] rounded-2xl overflow-hidden shadow-2xl">
                <img
                  src="https://images.unsplash.com/photo-1519389950473-47ba0277781c"
                  alt="CHQAO Ambiente de Prova"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent">
                  <div className="absolute bottom-4 left-4 right-4 text-white text-sm">
                    <p className="font-medium">
                      Ambiente real de prova CHQAO - Prepare-se adequadamente
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white/80 backdrop-blur-sm">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900">
              Por que escolher nossa plataforma?
            </h2>
            <p className="mt-4 text-lg text-gray-600">
              Recursos exclusivos para maximizar seu aprendizado
            </p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="group bg-white rounded-xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border border-gray-100"
              >
                <div className="w-12 h-12 bg-primary-light rounded-lg flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                  <feature.icon className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-4 text-gray-900">{feature.title}</h3>
                <p className="text-gray-600 leading-relaxed">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-gradient-to-br from-primary-light/20 to-white">
        <div className="container mx-auto px-4">
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="bg-white rounded-xl p-8 text-center transform hover:-translate-y-1 transition-all duration-300 shadow-lg hover:shadow-xl border border-gray-100"
              >
                <div className="text-3xl sm:text-4xl font-bold text-primary mb-2 animate-float">
                  {stat.value}
                </div>
                <div className="text-gray-600 font-medium">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-primary text-white">
        <div className="container mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="max-w-3xl mx-auto space-y-8"
          >
            <h2 className="text-3xl sm:text-4xl font-bold">
              Comece sua jornada rumo à aprovação
            </h2>
            <p className="text-lg text-white/90">
              Junte-se a milhares de militares que já estão se preparando de forma inteligente para o CHQAO
            </p>
            <Button
              onClick={() => navigate("/register")}
              className="bg-white text-primary hover:bg-gray-100 px-8 py-4 rounded-lg text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
            >
              Criar Conta Gratuita
            </Button>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

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

const stats = [
  {
    value: "10.000+",
    label: "Questões Disponíveis",
  },
  {
    value: "95%",
    label: "Taxa de Aprovação",
  },
  {
    value: "50.000+",
    label: "Alunos Cadastrados",
  },
  {
    value: "24/7",
    label: "Suporte Disponível",
  },
];

export default Index;
