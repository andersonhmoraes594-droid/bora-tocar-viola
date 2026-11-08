// Progresso do aluno: só conta aulas concluídas que ainda existem no curso.
export function calcularProgresso(aulaIds: string[], concluidas: string[]) {
  const feitas = new Set(concluidas);
  const total = aulaIds.length;
  const feitasNoCurso = aulaIds.filter((id) => feitas.has(id)).length;
  const porcentagem = total === 0 ? 0 : Math.round((feitasNoCurso / total) * 100);
  return { total, feitas: feitasNoCurso, porcentagem };
}
