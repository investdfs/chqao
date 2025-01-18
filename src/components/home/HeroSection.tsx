import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { NotificationDemo } from "@/components/ui/success-alert-with-button";

export const HeroSection = () => {
  const navigate = useNavigate();

  return (
    <section className="relative py-6 sm:py-12">
      <div className="container mx-auto px-4 relative">
        <div className="flex flex-col lg:flex-row items-center gap-8 lg:gap-12">
          {/* Imagem */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="flex-1"
          >
            <div className="relative w-full aspect-video rounded-xl overflow-hidden shadow-2xl">
              <img
                src="https://i.ibb.co/7rYH9L5/IMGCHQ1.webp"
                alt="Militares realizando prova do CHQAO"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent">
                <div className="absolute bottom-3 left-3 right-3 text-white">
                  <p className="font-medium text-sm sm:text-base">
                    Ambiente real de prova CHQAO
                  </p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Conteúdo de texto */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="flex-1 space-y-4 sm:space-y-6 text-center lg:text-left"
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary">
              <Sparkles className="w-4 h-4" />
              <span className="text-sm font-medium">Plataforma Inteligente</span>
            </div>
            
            <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 leading-tight">
              Prepare-se para o <span className="text-primary">CHQAO</span> com Excelência
            </h1>
            
            <p className="text-base sm:text-lg text-gray-600">
              Sistema especializado que aumenta suas chances de aprovação através de questões personalizadas e feedback instantâneo.
            </p>

            <div className="flex flex-col sm:flex-row gap-3 justify-center lg:justify-start">
              <NotificationDemo />
              
              <Button
                onClick={() => navigate("/login")}
                variant="outline"
                className="px-6 py-2 border-2 hover:bg-primary-light transition-colors duration-300 rounded-lg"
              >
                Já sou Aluno
              </Button>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};