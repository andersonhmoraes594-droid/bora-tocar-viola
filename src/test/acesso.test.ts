import { describe, expect, it } from "vitest";

import { destinoAposEntrar, temAcessoAoCurso } from "@/lib/acesso";
import { PLANOS } from "@/lib/planos";

describe("Acesso ao curso", () => {
  it("aluno recém-cadastrado, sem pagamento, vai para a página de pagamento", () => {
    const conta = { isAdmin: false, isAluno: false };
    expect(temAcessoAoCurso(conta)).toBe(false);
    expect(destinoAposEntrar(conta)).toBe("/assinatura");
  });

  it("aluno com acesso liberado vai para as aulas", () => {
    const conta = { isAdmin: false, isAluno: true };
    expect(temAcessoAoCurso(conta)).toBe(true);
    expect(destinoAposEntrar(conta)).toBe("/area-do-aluno");
  });

  it("professor vai para o painel", () => {
    expect(destinoAposEntrar({ isAdmin: true, isAluno: false })).toBe("/professor");
  });
});

describe("Preços do curso", () => {
  it("mensal custa R$ 147,90", () => {
    expect(PLANOS.find((p) => p.id === "mensal")?.preco).toBe(147.9);
  });
  it("anual custa R$ 1.500,00", () => {
    expect(PLANOS.find((p) => p.id === "anual")?.preco).toBe(1500);
  });
});
