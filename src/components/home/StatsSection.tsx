import { motion } from "framer-motion";

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

export const StatsSection = () => {
  return (
    <section className="py-8 sm:py-12 bg-gradient-to-br from-primary-light/20 to-white">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="bg-white rounded-lg p-4 sm:p-6 text-center transform hover:-translate-y-1 transition-all duration-300 shadow-lg hover:shadow-xl border border-gray-100"
            >
              <div className="text-2xl sm:text-3xl font-bold text-primary mb-1 animate-float">
                {stat.value}
              </div>
              <div className="text-sm sm:text-base text-gray-600 font-medium">{stat.label}</div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};