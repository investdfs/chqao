import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { ArrowRight } from "lucide-react";

export const Hero = () => {
  const navigate = useNavigate();

  return (
    <section className="py-20 sm:py-32">
      <div className="container mx-auto px-4">
        <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-24">
          <div className="lg:w-1/2 space-y-8">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight">
              Prepare-se para o <span className="text-primary">Sucesso</span> no CHQAO
            </h1>
            <p className="text-lg sm:text-xl text-gray-600 leading-relaxed">
              Domine o conteúdo através de questões personalizadas e feedback instantâneo. 
              Uma plataforma desenvolvida especialmente para seu sucesso.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <Button
                onClick={() => navigate("/register")}
                className="group relative px-8 py-6 text-lg"
              >
                <span className="relative z-10 flex items-center gap-2">
                  Comece Agora
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </span>
              </Button>
              <Button
                onClick={() => navigate("/login")}
                variant="outline"
                className="px-8 py-6 text-lg"
              >
                Já tenho conta
              </Button>
            </div>
          </div>
          <div className="lg:w-1/2">
            <div className="relative w-full aspect-square max-w-lg mx-auto">
              <img
                src="/placeholder.svg"
                alt="Estudante praticando questões"
                className="w-full h-full object-cover rounded-lg shadow-xl"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};