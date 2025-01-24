import React from "react";
import { ExpenseForm } from "@/components/ExpenseForm";
import { ExpenseList } from "@/components/ExpenseList";
import { Button } from "@/components/ui/button";
import { BarChart, LogIn, LogOut, Sun, Moon } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { LoginForm } from "@/components/LoginForm";
import { toast } from "sonner";
import { ModeToggle } from "@/components/ModeToggle";
import { useTheme } from "next-themes";

// Dados fictícios para teste
const mockExpenses = [
  {
    id: 1,
    description: "Supermercado",
    amount: 450.50,
    category: "Alimentação",
    date: "2024-03-09",
  },
  {
    id: 2,
    description: "Conta de Luz",
    amount: 200.00,
    category: "Moradia",
    date: "2024-03-04",
  },
  {
    id: 3,
    description: "Uber",
    amount: 35.90,
    category: "Transporte",
    date: "2024-03-07",
  },
];

const Index = () => {
  const [expenses, setExpenses] = React.useState(mockExpenses);
  const [isLoginOpen, setIsLoginOpen] = React.useState(false);
  const [user, setUser] = React.useState<string | null>(null);
  const navigate = useNavigate();
  const { theme, setTheme } = useTheme();

  const handleAddExpense = (newExpense: any) => {
    setExpenses([newExpense, ...expenses]);
  };

  const handleLogin = (email: string) => {
    setUser(email);
  };

  const handleLogout = () => {
    setUser(null);
    toast.success("Logout realizado com sucesso!");
  };

  const toggleDarkMode = () => {
    setTheme(theme === "light" ? "dark" : "light");
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-heading font-bold text-primary">
            Controle Financeiro
          </h1>
          <div className="flex gap-2">
            {user ? (
              <>
                <span className="text-sm text-muted-foreground self-center mr-2">
                  {user}
                </span>
                <Button onClick={handleLogout} variant="outline">
                  <LogOut className="mr-2" />
                  Sair
                </Button>
              </>
            ) : (
              <Button onClick={() => setIsLoginOpen(true)} variant="outline">
                <LogIn className="mr-2" />
                Login
              </Button>
            )}
            <Button onClick={() => navigate("/dashboard")} variant="outline">
              <BarChart className="mr-2" />
              Dashboard
            </Button>
            <ModeToggle toggleDarkMode={toggleDarkMode} />
          </div>
        </div>
        
        <div className="grid gap-8">
          <div>
            <h2 className="text-xl font-heading font-semibold mb-4">
              Nova Despesa
            </h2>
            <ExpenseForm onSubmit={handleAddExpense} />
          </div>

          <div>
            <h2 className="text-xl font-heading font-semibold mb-4">
              Lista de Despesas
            </h2>
            <ExpenseList expenses={expenses} />
          </div>
        </div>
      </div>
      <LoginForm
        open={isLoginOpen}
        onOpenChange={setIsLoginOpen}
        onLogin={handleLogin}
      />
    </div>
  );
};

export default Index;
