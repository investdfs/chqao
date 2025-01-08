import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Trophy, Award, Star } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Tooltip } from "@/components/ui/tooltip";

interface Badge {
  icon: JSX.Element;
  title: string;
  description: string;
  daysRequired: number;
}

export const StudyStreak = () => {
  const { data: streakData } = useQuery({
    queryKey: ['study-streak'],
    queryFn: async () => {
      const { data: { session } } = await supabase.auth.getSession();
      const userId = session?.user?.id;
      
      if (!userId) {
        console.log("Usuário não autenticado");
        return null;
      }

      console.log("Buscando streak de estudos para usuário:", userId);
      
      const { data: logins, error } = await supabase
        .from('student_logins')
        .select('id, login_date')
        .eq('student_id', userId)
        .order('login_date', { ascending: false });

      if (error) {
        console.error('Erro ao buscar logins:', error);
        return null;
      }

      console.log("Logins encontrados:", logins);
      
      // Calcular streak atual
      let currentStreak = 0;
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      if (logins) {
        for (let i = 0; i < logins.length; i++) {
          const loginDate = new Date(logins[i].login_date);
          loginDate.setHours(0, 0, 0, 0);

          const expectedDate = new Date(today);
          expectedDate.setDate(today.getDate() - i);
          expectedDate.setHours(0, 0, 0, 0);

          if (loginDate.getTime() === expectedDate.getTime()) {
            currentStreak++;
          } else {
            break;
          }
        }
      }

      return {
        currentStreak,
        totalLogins: logins?.length || 0
      };
    },
    refetchInterval: 1000
  });

  const badges: Badge[] = [
    {
      icon: <Star className="h-6 w-6 text-yellow-400" />,
      title: "Iniciante Dedicado",
      description: "7 dias consecutivos de estudo",
      daysRequired: 7
    },
    {
      icon: <Award className="h-6 w-6 text-blue-500" />,
      title: "Mestre da Consistência",
      description: "15 dias consecutivos de estudo",
      daysRequired: 15
    },
    {
      icon: <Trophy className="h-6 w-6 text-purple-500" />,
      title: "Lenda do Estudo",
      description: "30 dias consecutivos de estudo",
      daysRequired: 30
    }
  ];

  return (
    <Card className="bg-white/80 backdrop-blur-sm hover:shadow-lg transition-all duration-300">
      <CardHeader>
        <CardTitle className="text-sm font-medium">STREAK DE ESTUDOS</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="text-center">
            <div className="text-3xl font-bold text-primary">
              {streakData?.currentStreak || 0}
            </div>
            <div className="text-sm text-muted-foreground">
              dias consecutivos
            </div>
          </div>

          <div className="flex justify-center gap-4">
            {badges.map((badge, index) => (
              <Tooltip key={index}>
                <div
                  className={`p-3 rounded-full transition-all duration-300 ${
                    (streakData?.currentStreak || 0) >= badge.daysRequired
                      ? "bg-primary/10"
                      : "bg-gray-100 opacity-50"
                  }`}
                >
                  {badge.icon}
                </div>
                <div className="text-xs">
                  <div className="font-semibold">{badge.title}</div>
                  <div className="text-muted-foreground">{badge.description}</div>
                </div>
              </Tooltip>
            ))}
          </div>

          <div className="text-center text-sm text-muted-foreground">
            Total de dias de estudo: {streakData?.totalLogins || 0}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};