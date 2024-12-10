const stats = [
  {
    value: "10.000+",
    label: "Questões Disponíveis",
  },
  {
    value: "50.000+",
    label: "Alunos Cadastrados",
  },
  {
    value: "95%",
    label: "Taxa de Aprovação",
  },
  {
    value: "24/7",
    label: "Suporte Disponível",
  },
];

export const Stats = () => {
  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <div
              key={index}
              className="bg-gray-50 rounded-lg p-8 text-center transform hover:-translate-y-1 transition-all duration-300 shadow-sm hover:shadow"
            >
              <div className="text-3xl sm:text-4xl font-bold text-primary mb-2">
                {stat.value}
              </div>
              <div className="text-gray-600 font-medium">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};