// Planos de assinatura do curso online (valores em reais).
export const PLANOS = [
  {
    id: "mensal",
    nome: "Mensal",
    preco: 147.9,
    periodo: "por mês",
    destaque: "Comece já e toque no seu ritmo.",
  },
  {
    id: "anual",
    nome: "Anual",
    preco: 1500,
    periodo: "por ano",
    destaque: "Um ano inteiro de violão com o professor.",
  },
] as const;

export type PlanoId = (typeof PLANOS)[number]["id"];

export function formatarPreco(valor: number) {
  return valor.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}
