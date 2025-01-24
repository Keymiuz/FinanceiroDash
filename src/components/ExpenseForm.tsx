import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";

const categories = [
  "Alimentação",
  "Transporte",
  "Moradia",
  "Saúde",
  "Educação",
  "Lazer",
  "Outros",
];

export const ExpenseForm = ({ onSubmit }: { onSubmit: (data: any) => void }) => {
  const [formData, setFormData] = React.useState({
    description: "",
    amount: "",
    category: "",
    date: new Date().toISOString().split("T")[0],
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.description || !formData.amount || !formData.category) {
      toast.error("Por favor, preencha todos os campos");
      return;
    }
    onSubmit({
      ...formData,
      amount: parseFloat(formData.amount),
      id: Date.now(),
    });
    setFormData({
      description: "",
      amount: "",
      category: "",
      date: new Date().toISOString().split("T")[0],
    });
    toast.success("Despesa adicionada com sucesso!");
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 p-4 bg-white rounded-lg shadow">
      <div>
        <Label htmlFor="description">Descrição</Label>
        <Input
          id="description"
          value={formData.description}
          onChange={(e) =>
            setFormData({ ...formData, description: e.target.value })
          }
          placeholder="Digite a descrição da despesa"
        />
      </div>

      <div>
        <Label htmlFor="amount">Valor</Label>
        <Input
          id="amount"
          type="number"
          step="0.01"
          value={formData.amount}
          onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
          placeholder="0,00"
        />
      </div>

      <div>
        <Label htmlFor="category">Categoria</Label>
        <Select
          value={formData.category}
          onValueChange={(value) =>
            setFormData({ ...formData, category: value })
          }
        >
          <SelectTrigger>
            <SelectValue placeholder="Selecione uma categoria" />
          </SelectTrigger>
          <SelectContent>
            {categories.map((category) => (
              <SelectItem key={category} value={category}>
                {category}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label htmlFor="date">Data</Label>
        <Input
          id="date"
          type="date"
          value={formData.date}
          onChange={(e) => setFormData({ ...formData, date: e.target.value })}
        />
      </div>

      <Button type="submit" className="w-full">
        Adicionar Despesa
      </Button>
    </form>
  );
};
