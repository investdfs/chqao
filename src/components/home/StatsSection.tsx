import { motion } from "framer-motion";

const stats = [
  {
    value: "10.000+",
    label: "Questões",
  },
  {
    value: "95%",
    label: "Aprovação",
  },
  {
    value: "50.000+",
    label: "Alunos",
  },
  {
    value: "24/7",
    label: "Suporte",
  },
];

export const StatsSection = () => {
  return (
    <section className="py-4 sm:py-12 bg-gradient-to-br from-primary-light/20 to-white">
      <div className="container mx-auto px-4">
        {/* Mobile View */}
        <div className="sm:hidden grid grid-cols-2 gap-2">
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
              className="bg-white p-3 rounded-lg text-center shadow-sm border border-gray-100"
            >
              <div className="text-lg font-bold text-primary">{stat.value}</div>
              <div className="text-xs text-gray-600">{stat.label}</div>
            </motion.div>
          ))}
        </div>

        {/* Desktop View */}
        <div className="hidden sm:grid lg:grid-cols-4 gap-4">
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