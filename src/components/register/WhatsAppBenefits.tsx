import { CheckCircle2 } from "lucide-react";

const WhatsAppBenefits = () => {
  return (
    <div className="w-full lg:flex-1 space-y-6">
      <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 shadow-lg border border-primary/10">
        <h3 className="text-xl font-semibold text-primary mb-4">
          Por que fornecer seu WhatsApp?
        </h3>
        <ul className="space-y-4">
          <li className="flex items-start gap-3">
            <CheckCircle2 className="w-5 h-5 text-success mt-1" />
            <span>Receba materiais exclusivos de estudo</span>
          </li>
          <li className="flex items-start gap-3">
            <CheckCircle2 className="w-5 h-5 text-success mt-1" />
            <span>Dicas personalizadas baseadas no seu desempenho</span>
          </li>
          <li className="flex items-start gap-3">
            <CheckCircle2 className="w-5 h-5 text-success mt-1" />
            <span>Lembretes de estudo e novidades importantes</span>
          </li>
          <li className="flex items-start gap-3">
            <CheckCircle2 className="w-5 h-5 text-success mt-1" />
            <span>Suporte rápido quando precisar de ajuda</span>
          </li>
        </ul>
      </div>

      <div className="bg-primary/5 rounded-xl p-6">
        <p className="text-sm text-gray-600 italic">
          "Nossos alunos que ativam as notificações por WhatsApp têm, em média, 
          40% mais engajamento nos estudos e melhores resultados!"
        </p>
      </div>
    </div>
  );
};

export default WhatsAppBenefits;