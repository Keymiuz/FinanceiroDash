import React, { useState, useMemo } from "react";
import { ExpenseChart } from "@/components/ExpenseChart";
import { Button } from "@/components/ui/button";
import { FileDown, LogIn, LogOut, Home } from "lucide-react";
import { toast } from "sonner";
import jsPDF from "jspdf";
import { LoginForm } from "@/components/LoginForm";
import { useNavigate } from "react-router-dom";
import { ModeToggle } from "@/components/ModeToggle";
import { PieChart, Pie, Cell, Legend } from "recharts";
import { format, getYear, getMonth, isSameMonth, isSameYear, parseISO } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { useTheme } from "next-themes";

// Dados fictícios expandidos
const mockExpenses = [
  { id: 1, description: "Supermercado", amount: 450.50, category: "Alimentação", date: "2024-03-09" },
  { id: 2, description: "Conta de Luz", amount: 200.00, category: "Moradia", date: "2024-03-04" },
  { id: 3, description: "Uber", amount: 35.90, category: "Transporte", date: "2024-03-07" },
  { id: 4, description: "Restaurante", amount: 120.00, category: "Alimentação", date: "2024-03-15" },
  { id: 5, description: "Cinema", amount: 80.00, category: "Lazer", date: "2024-03-20" },
  { id: 6, description: "Gasolina", amount: 150.00, category: "Transporte", date: "2024-04-02" },
  { id: 7, description: "Aluguel", amount: 1000.00, category: "Moradia", date: "2024-04-10" },
  { id: 8, description: "Supermercado", amount: 380.00, category: "Alimentação", date: "2024-04-18" },
  { id: 9, description: "Ônibus", amount: 25.00, category: "Transporte", date: "2024-04-25" },
  { id: 10, description: "Netflix", amount: 50.00, category: "Lazer", date: "2024-05-05" },
  { id: 11, description: "Médico", amount: 180.00, category: "Saúde", date: "2024-05-12" },
  { id: 12, description: "Curso Online", amount: 250.00, category: "Educação", date: "2024-05-20" },
  { id: 13, description: "Supermercado", amount: 400.00, category: "Alimentação", date: "2024-06-01" },
  { id: 14, description: "Restaurante", amount: 100.00, category: "Alimentação", date: "2024-06-15" },
  { id: 15, description: "Viagem", amount: 800.00, category: "Lazer", date: "2024-06-28" },
  { id: 16, description: "Gasolina", amount: 120.00, category: "Transporte", date: "2024-07-05" },
  { id: 17, description: "Manutenção", amount: 300.00, category: "Moradia", date: "2024-07-10" },
  { id: 18, description: "Supermercado", amount: 500.00, category: "Alimentação", date: "2024-07-20" },
  { id: 19, description: "Show", amount: 100.00, category: "Lazer", date: "2024-08-01" },
  { id: 20, description: "Táxi", amount: 40.00, category: "Transporte", date: "2024-08-10" },
  { id: 21, description: "Consulta Médica", amount: 200.00, category: "Saúde", date: "2024-08-15" },
  { id: 22, description: "Livros", amount: 150.00, category: "Educação", date: "2024-09-01" },
  { id: 23, description: "Supermercado", amount: 350.00, category: "Alimentação", date: "2024-09-10" },
  { id: 24, description: "Restaurante", amount: 150.00, category: "Alimentação", date: "2024-09-20" },
  { id: 25, description: "Cinema", amount: 70.00, category: "Lazer", date: "2024-10-01" },
  { id: 26, description: "Transporte Público", amount: 50.00, category: "Transporte", date: "2024-10-15" },
  { id: 27, description: "Academia", amount: 100.00, category: "Lazer", date: "2024-11-01" },
  { id: 28, description: "Plano de Saúde", amount: 300.00, category: "Saúde", date: "2024-11-15" },
  { id: 29, description: "Supermercado", amount: 420.00, category: "Alimentação", date: "2024-12-01" },
  { id: 30, description: "Restaurante", amount: 180.00, category: "Alimentação", date: "2024-12-15" },
  { id: 31, description: "Presente", amount: 200.00, category: "Lazer", date: "2024-12-25" },
  { id: 32, description: "Gasolina", amount: 100.00, category: "Transporte", date: "2025-01-02" },
  { id: 33, description: "Aluguel", amount: 1200.00, category: "Moradia", date: "2025-01-10" },
  { id: 34, description: "Supermercado", amount: 550.00, category: "Alimentação", date: "2025-01-15" },
  { id: 35, description: "Uber", amount: 45.00, category: "Transporte", date: "2025-01-20" },
  { id: 36, description: "Cinema", amount: 90.00, category: "Lazer", date: "2025-02-01" },
  { id: 37, description: "Restaurante", amount: 150.00, category: "Alimentação", date: "2025-02-10" },
  { id: 38, description: "Manutenção", amount: 250.00, category: "Moradia", date: "2025-02-15" },
  { id: 39, description: "Gasolina", amount: 200.00, category: "Transporte", date: "2025-02-20" },
  { id: 40, description: "Viagem", amount: 1000.00, category: "Lazer", date: "2025-03-01" },
];

const Dashboard = () => {
  const [isLoginOpen, setIsLoginOpen] = React.useState(false);
  const [user, setUser] = React.useState<string | null>(null);
  const navigate = useNavigate();
  const [selectedYear, setSelectedYear] = React.useState<number | null>(null);
  const [selectedMonth, setSelectedMonth] = React.useState<number | null>(null);
  const { theme, setTheme } = useTheme();

  const handleLogin = (email: string) => {
    setUser(email);
  };

  const handleLogout = () => {
    setUser(null);
    toast.success("Logout realizado com sucesso!");
  };

  const handleDownloadPDF = () => {
    try {
      if (typeof jsPDF === 'undefined') {
        toast.error("jsPDF is not available. Please check your environment.");
        return;
      }

      const doc = new jsPDF();
      
      // Configuração da fonte e tamanho
      doc.setFont("helvetica", "bold");
      doc.setFontSize(16);
      
      // Título
      doc.text("Relatório de Despesas", 20, 20);
      
      // Linha separadora
      doc.setLineWidth(0.5);
      doc.line(20, 25, 190, 25);
      
      // Configuração para o conteúdo
      doc.setFont("helvetica", "normal");
      doc.setFontSize(12);
      
      // Cabeçalho da tabela
      let y = 40;
      doc.text("Data", 20, y);
      doc.text("Descrição", 50, y);
      doc.text("Categoria", 100, y);
      doc.text("Valor", 150, y);
      
      // Linha separadora do cabeçalho
      y += 5;
      doc.line(20, y, 190, y);
      
      // Conteúdo da tabela
      y += 10;
      mockExpenses.forEach((expense) => {
        const date = new Date(expense.date).toLocaleDateString("pt-BR");
        const amount = expense.amount.toLocaleString("pt-BR", {
          style: "currency",
          currency: "BRL",
        });
        
        doc.text(date, 20, y);
        doc.text(expense.description, 50, y);
        doc.text(expense.category, 100, y);
        doc.text(amount, 150, y);
        
        y += 10;
      });
      
      // Total
      const totalFormatted = mockExpenses.reduce((acc, expense) => acc + expense.amount, 0).toLocaleString("pt-BR", {
        style: "currency",
        currency: "BRL",
      });
      
      y += 10;
      doc.setFont("helvetica", "bold");
      doc.text(`Total: ${totalFormatted}`, 150, y);
      
      // Download do PDF
      doc.save("relatorio-despesas.pdf");
      
      toast.success("Relatório gerado com sucesso!");
    } catch (error) {
      toast.error("Erro ao gerar o relatório. Tente novamente.");
    }
  };

  const filteredExpenses = React.useMemo(() => {
    return mockExpenses.filter(expense => {
      const expenseDate = new Date(expense.date);
      if (selectedYear !== null && getYear(expenseDate) !== selectedYear) return false;
      if (selectedMonth !== null && getMonth(expenseDate) !== selectedMonth) return false;
      return true;
    });
  }, [selectedYear, selectedMonth]);

  const expensesByMonth = React.useMemo(() => {
    if (!selectedYear && !selectedMonth) return [];

    let expensesToGroup = mockExpenses;
    if (selectedYear) {
      expensesToGroup = expensesToGroup.filter(expense => getYear(new Date(expense.date)) === selectedYear);
    }
    if (selectedMonth) {
      expensesToGroup = expensesToGroup.filter(expense => getMonth(new Date(expense.date)) === selectedMonth);
    }

    const expensesGroupedByMonth = expensesToGroup.reduce((acc, expense) => {
      const month = format(new Date(expense.date), 'MMMM');
      acc[month] = (acc[month] || 0) + expense.amount;
      return acc;
    }, {} as Record<string, number>);

    return Object.entries(expensesGroupedByMonth).map(([month, total]) => ({ name: month, value: total }));
  }, [selectedYear, selectedMonth]);

  const totalExpensesYear = React.useMemo(() => {
    if (!selectedYear) return 0;
    return mockExpenses.filter(expense => getYear(new Date(expense.date)) === selectedYear).reduce((acc, expense) => acc + expense.amount, 0);
  }, [selectedYear]);

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#99A342', '#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#99A342', '#0088FE', '#00C49F'];

  const years = [...new Set(mockExpenses.map(expense => getYear(new Date(expense.date))))].sort();
  const months = Array.from({ length: 12 }, (_, i) => i);

  const toggleDarkMode = () => {
    setTheme(theme === "light" ? "dark" : "light");
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-heading font-bold text-primary">
            Dashboard
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
            <Button onClick={() => navigate("/")} variant="outline">
              <Home className="mr-2" />
              Home
            </Button>
            <Button onClick={handleDownloadPDF}>
              <FileDown className="mr-2" />
              Baixar Relatório
            </Button>
            <ModeToggle toggleDarkMode={toggleDarkMode} />
          </div>
        </div>

        <div className="flex flex-wrap gap-4 mb-4">
          <select
            value={selectedYear || ""}
            onChange={(e) => setSelectedYear(e.target.value === "" ? null : parseInt(e.target.value, 10))}
            className="border border-gray-300 rounded px-3 py-2"
          >
            <option value="">Selecione um ano</option>
            {years.map(year => (
              <option key={year} value={year}>{year}</option>
            ))}
          </select>
          <select
            value={selectedMonth === null ? "" : selectedMonth}
            onChange={(e) => setSelectedMonth(e.target.value === "" ? null : parseInt(e.target.value, 10))}
            className="border border-gray-300 rounded px-3 py-2"
          >
            <option value="">Selecione um mês</option>
            {months.map(month => (
              <option key={month} value={month}>{format(new Date(2024, month, 1), 'MMMM')}</option>
            ))}
          </select>
        </div>

        <div className="grid gap-8">
          {expensesByMonth.length > 0 && (
            <PieChart width={400} height={400}>
              <Pie
                data={expensesByMonth}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
                label
              >
                {expensesByMonth.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Legend />
            </PieChart>
          )}
          <ExpenseChart expenses={filteredExpenses} />
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

export default Dashboard;
