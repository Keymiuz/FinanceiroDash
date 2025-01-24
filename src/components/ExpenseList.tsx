import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface Expense {
  id: number;
  description: string;
  amount: number;
  category: string;
  date: string;
}

export const ExpenseList = ({ expenses }: { expenses: Expense[] }) => {
  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Data</TableHead>
            <TableHead>Descrição</TableHead>
            <TableHead>Categoria</TableHead>
            <TableHead className="text-right">Valor</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {expenses.map((expense) => (
            <TableRow key={expense.id}>
              <TableCell>{new Date(expense.date).toLocaleDateString()}</TableCell>
              <TableCell>{expense.description}</TableCell>
              <TableCell>{expense.category}</TableCell>
              <TableCell className="text-right">
                {expense.amount.toLocaleString("pt-BR", {
                  style: "currency",
                  currency: "BRL",
                })}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};
