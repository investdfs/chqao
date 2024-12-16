export default function About() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-6">Sobre o Sistema</h1>
      <div className="prose dark:prose-invert max-w-none">
        <p className="text-lg mb-4">
          Este é um sistema de gestão de questões desenvolvido para auxiliar no estudo
          e preparação para concursos e exames.
        </p>
        <h2 className="text-2xl font-semibold mt-8 mb-4">Principais Funcionalidades</h2>
        <ul className="list-disc pl-6 space-y-2">
          <li>Banco de questões organizado por matérias e tópicos</li>
          <li>Sistema de prática com feedback imediato</li>
          <li>Estatísticas de desempenho detalhadas</li>
          <li>Área administrativa para gestão de conteúdo</li>
        </ul>
      </div>
    </div>
  );
}