import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

interface LoginFormProps {
  onSubmit: (email: string, password: string) => void;
  loading: boolean;
  isAdmin: boolean;
  onAdminToggle: (checked: boolean) => void;
}

export const LoginForm = ({ onSubmit, loading, isAdmin, onAdminToggle }: LoginFormProps) => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData.email, formData.password);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="flex items-center space-x-2">
        <Switch
          id="admin-mode"
          checked={isAdmin}
          onCheckedChange={onAdminToggle}
        />
        <Label htmlFor="admin-mode">Logar como Administrador</Label>
      </div>
      <div className="space-y-2">
        <label className="text-sm font-medium">Email</label>
        <Input
          type="email"
          required
          value={formData.email}
          onChange={(e) =>
            setFormData({ ...formData, email: e.target.value })
          }
        />
      </div>
      <div className="space-y-2">
        <label className="text-sm font-medium">Senha</label>
        <Input
          type="password"
          required
          value={formData.password}
          onChange={(e) =>
            setFormData({ ...formData, password: e.target.value })
          }
        />
      </div>
      <Button
        type="submit"
        className="w-full"
        disabled={loading}
      >
        {loading ? "Entrando..." : "Entrar"}
      </Button>
    </form>
  );
};