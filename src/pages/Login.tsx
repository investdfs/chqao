import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LoginForm } from "@/components/auth/LoginForm";
import { useAuthLogin } from "@/hooks/useAuthLogin";

const Login = () => {
  const navigate = useNavigate();
  const [isAdmin, setIsAdmin] = useState(false);
  const { handleLogin, isLoading } = useAuthLogin();

  const handleSubmit = (email: string, password: string) => {
    handleLogin(email, password);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-secondary p-4">
      <Card className="w-full max-w-md animate-fade-in">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center">Login</CardTitle>
        </CardHeader>
        <CardContent>
          <LoginForm
            onSubmit={handleSubmit}
            loading={isLoading}
            isAdmin={isAdmin}
            onAdminToggle={setIsAdmin}
          />
          {!isAdmin && (
            <div className="mt-4 text-center">
              <p className="text-gray-600">
                Não tem uma conta?{" "}
                <button
                  onClick={() => navigate("/register")}
                  className="text-primary hover:underline"
                >
                  Registre-se
                </button>
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Login;