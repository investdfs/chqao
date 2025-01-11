import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

export const CTASection = () => {
  const navigate = useNavigate();

  return (
    <section className="py-6 sm:py-12 bg-gradient-primary text-white">
      <div className="container mx-auto px-4 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="max-w-3xl mx-auto space-y-3 sm:space-y-6"
        >
          <h2 className="text-xl sm:text-3xl font-bold">
            Comece sua jornada rumo à aprovação
          </h2>
          <p className="text-sm sm:text-lg text-white/90 px-4">
            Junte-se a milhares de militares que já estão se preparando
          </p>
          <Button
            onClick={() => navigate("/register")}
            className="w-full sm:w-auto bg-white text-primary hover:bg-gray-100 px-6 py-3 rounded-lg text-base sm:text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
          >
            Criar Conta Gratuita
          </Button>
        </motion.div>
      </div>
    </section>
  );
};