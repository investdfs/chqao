import { useState } from "react";
import { DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { ArrowUpDown } from "lucide-react";
import { useLoginControl } from "./useLoginControl";

export const LoginControlDialog = () => {
  const { loginData, isLoading } = useLoginControl();
  const [sortConfig, setSortConfig] = useState<{
    key: 'lastLogin' | 'totalLogins';
    direction: 'asc' | 'desc';
  }>({ key: 'lastLogin', direction: 'desc' });

  const handleSort = (key: 'lastLogin' | 'totalLogins') => {
    setSortConfig(current => ({
      key,
      direction: current.key === key && current.direction === 'desc' ? 'asc' : 'desc'
    }));
  };

  const sortedData = [...loginData].sort((a, b) => {
    const multiplier = sortConfig.direction === 'asc' ? 1 : -1;
    if (sortConfig.key === 'lastLogin') {
      return multiplier * (new Date(b.lastLogin).getTime() - new Date(a.lastLogin).getTime());
    }
    return multiplier * (b.totalLogins - a.totalLogins);
  });

  if (isLoading) {
    return <DialogContent>Carregando...</DialogContent>;
  }

  return (
    <DialogContent className="max-w-3xl">
      <DialogHeader>
        <DialogTitle>Controle de Login</DialogTitle>
      </DialogHeader>
      
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Nome</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>
              <Button 
                variant="ghost" 
                onClick={() => handleSort('lastLogin')}
                className="flex items-center gap-1"
              >
                Último Login
                <ArrowUpDown className="h-4 w-4" />
              </Button>
            </TableHead>
            <TableHead>
              <Button 
                variant="ghost" 
                onClick={() => handleSort('totalLogins')}
                className="flex items-center gap-1"
              >
                Total de Logins
                <ArrowUpDown className="h-4 w-4" />
              </Button>
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {sortedData.map((student) => (
            <TableRow key={student.id}>
              <TableCell>{student.name}</TableCell>
              <TableCell>{student.email}</TableCell>
              <TableCell>{new Date(student.lastLogin).toLocaleString()}</TableCell>
              <TableCell>{student.totalLogins}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </DialogContent>
  );
};