import { motion } from "framer-motion";
import { ArrowRight, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

export const HeroSection = () => {
  const navigate = useNavigate();

  return (
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
            <div className="relative w-full aspect-[16/9] rounded-2xl overflow-hidden shadow-2xl">
              <img
                src="https://i.ibb.co/kQDwNQG/IMGCHQ1.webp"
                alt="Militares realizando prova do CHQAO"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent">
                <div className="absolute bottom-4 left-4 right-4 text-white">
                  <p className="font-medium text-base sm:text-lg">
                    Ambiente real de prova CHQAO - Prepare-se adequadamente
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};