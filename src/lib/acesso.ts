// Regras de acesso ao curso: só quem tem o acesso liberado (pagamento confirmado
// ou liberação do professor) vê as aulas; o professor sempre vê.
export type ContaAcesso = { isAdmin: boolean; isAluno: boolean } | null;

export function temAcessoAoCurso(conta: ContaAcesso) {
  return !!conta && (conta.isAdmin || conta.isAluno);
}

// Para onde a pessoa vai depois de entrar ou se cadastrar.
export function destinoAposEntrar(conta: ContaAcesso) {
  if (conta?.isAdmin) return "/professor" as const;
  if (temAcessoAoCurso(conta)) return "/area-do-aluno" as const;
  return "/assinatura" as const;
}
