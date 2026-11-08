// As 4 etapas do método — usadas na página do curso e para organizar as aulas da área do aluno.
export const ETAPAS = [
  {
    numero: 1,
    n: "01",
    titulo: "Primeiros acordes",
    texto: "Postura, afinação e os acordes que abrem as portas para centenas de músicas.",
  },
  {
    numero: 2,
    n: "02",
    titulo: "Ritmo e batidas",
    texto: "As levadas do sertanejo, do pop, da MPB e do gospel, explicadas de forma simples.",
  },
  {
    numero: 3,
    n: "03",
    titulo: "Suas músicas favoritas",
    texto: "Você escolhe o que quer tocar e aprende aplicando direto no repertório que ama.",
  },
  {
    numero: 4,
    n: "04",
    titulo: "Tocar e cantar",
    texto: "Juntar voz e violão com segurança, como quem já tem palco.",
  },
] as const;

export function nomeEtapa(numero: number) {
  return ETAPAS.find((e) => e.numero === numero)?.titulo ?? `Etapa ${numero}`;
}
