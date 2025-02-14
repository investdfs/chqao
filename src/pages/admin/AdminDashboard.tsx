import { StatisticsCards } from "@/components/admin/StatisticsCards";
import { SyncDatabaseButton } from "@/components/admin/SyncDatabaseButton";
import { AdminStatus } from "@/types/database/supabase";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useEffect, useState } from "react";
import { SupabaseHealthCheck } from "@/components/admin/SupabaseHealthCheck";

export const AdminDashboard = () => {
  const [totalStudents, setTotalStudents] = useState(0);
  const [onlineUsers, setOnlineUsers] = useState(0);

  useEffect(() => {
    const fetchTotalStudents = async () => {
      const { count, error } = await supabase
        .from('students')
        .select('*', { count: 'exact', head: true })
        .neq('status', 'blocked');

      if (error) {
        console.error('Error fetching total students:', error);
        return;
      }

      setTotalStudents(count || 0);
    };

    fetchTotalStudents();
  }, []);

  return (
    <div className="container mx-auto py-6">
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <SupabaseHealthCheck />
        <StatisticsCards
          totalStudents={totalStudents}
          onlineUsers={onlineUsers}
        />
        <div className="col-span-3 flex justify-end">
          <SyncDatabaseButton />
        </div>
      </div>
    </div>
  );
};
