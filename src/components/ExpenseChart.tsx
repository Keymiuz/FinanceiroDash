import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

interface Expense {
  id: number;
  description: string;
  amount: number;
  category: string;
  date: string;
}

export const ExpenseChart = ({ expenses }: { expenses: Expense[] }) => {
  const data = React.useMemo(() => {
    const groupedExpenses = expenses.reduce((acc, expense) => {
      if (!acc[expense.category]) {
        acc[expense.category] = 0;
      }
      acc[expense.category] += expense.amount;
      return acc;
    }, {} as Record<string, number>);

    return Object.entries(groupedExpenses).map(([category, total]) => ({
      category,
      total,
    }));
  }, [expenses]);

  return (
    <div className="h-[400px] bg-white p-4 rounded-lg shadow">
      <h3 className="text-lg font-heading mb-4">Despesas por Categoria</h3>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="category" />
          <YAxis
            tickFormatter={(value) =>
              value.toLocaleString("pt-BR", {
                style: "currency",
                currency: "BRL",
                minimumFractionDigits: 0,
                maximumFractionDigits: 0,
              })
            }
          />
          <Tooltip
            formatter={(value: number) =>
              value.toLocaleString("pt-BR", {
                style: "currency",
                currency: "BRL",
              })
            }
          />
          <Bar dataKey="total" fill="#1E40AF" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};
