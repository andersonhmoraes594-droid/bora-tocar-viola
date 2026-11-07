import ansiedade from "@/assets/blog-ansiedade.jpg";
import diaADia from "@/assets/blog-dia-a-dia.jpg";
import iniciante from "@/assets/blog-iniciante.jpg";
import tresAcordes from "@/assets/blog-tres-acordes.jpg";

/** Casas por corda, da 6ª (Mi grave) à 1ª (Mi agudo). null = corda não tocada, 0 = solta. */
export type Acorde = { nome: string; cifra: string; casas: (number | null)[] };

export type Bloco =
  | { tipo: "p"; texto: string }
  | { tipo: "h2"; texto: string }
  | { tipo: "lista"; itens: string[] }
  | { tipo: "dica"; texto: string }
  | { tipo: "acordes"; acordes: Acorde[] };

export type Post = {
  slug: string;
  titulo: string;
  resumo: string;
  categoria: string;
  data: string; // ISO
  leitura: number; // minutos
  imagem: string;
  imagemAlt: string;
  conteudo: Bloco[];
};

export const POSTS: Post[] = [
  {
    slug: "violao-para-ansiedade",
    titulo: "Violão para ansiedade: como a música acalma a mente",
    resumo:
      "Tocar violão pode ser uma pausa de verdade no meio da correria. Veja por que o instrumento ajuda a desacelerar e como criar seu momento de calma.",
    categoria: "Bem-estar",
    data: "2026-11-05",
    leitura: 5,
    imagem: ansiedade,
    imagemAlt: "Mulher de olhos fechados tocando violão perto da janela ao entardecer",
    conteudo: [
      {
        tipo: "p",
        texto:
          "Quem já pegou o violão depois de um dia pesado sabe: alguns minutos tocando e a cabeça parece desligar do barulho. Não é impressão. Tocar um instrumento exige atenção no agora — nos dedos, no ritmo, no som — e isso tira o foco dos pensamentos que ficam rodando sem parar.",
      },
      { tipo: "h2", texto: "Por que o violão ajuda a desacelerar" },
      {
        tipo: "lista",
        itens: [
          "Foco no presente: enquanto você troca de acorde, não sobra espaço para a preocupação de amanhã.",
          "Respiração no ritmo: tocar e cantar faz a respiração ficar mais longa e compassada.",
          "Sensação de conquista: cada música que sai inteira é uma pequena vitória que melhora o humor.",
          "Expressão: o que é difícil de falar, às vezes sai mais fácil numa canção.",
        ],
      },
      { tipo: "h2", texto: "Como montar o seu momento de calma" },
      {
        tipo: "p",
        texto:
          "Separe de 10 a 15 minutos, de preferência sempre no mesmo horário. Deixe o celular longe, afine o violão e comece com algo simples e lento: dois acordes alternando numa batida tranquila já bastam. O objetivo aqui não é tocar perfeito, é tocar presente.",
      },
      {
        tipo: "dica",
        texto:
          "Escolha músicas lentas que você ama. Uma moda de viola ou uma MPB tranquila funcionam muito bem para relaxar no fim do dia.",
      },
      {
        tipo: "p",
        texto:
          "Lembre-se: a música é uma ótima aliada do bem-estar, mas não substitui acompanhamento com um profissional de saúde. Se a ansiedade estiver atrapalhando sua rotina, procure ajuda — e leve o violão junto nessa caminhada.",
      },
    ],
  },
  {
    slug: "musica-no-dia-a-dia",
    titulo: "Música no dia a dia: 7 benefícios de tocar violão",
    resumo:
      "Memória, coordenação, amizades e muito mais. Descubra o que muda na sua rotina quando o violão entra na sua vida.",
    categoria: "Benefícios",
    data: "2026-11-03",
    leitura: 4,
    imagem: diaADia,
    imagemAlt: "Violão encostado numa cadeira ao lado de uma xícara de café na cozinha",
    conteudo: [
      {
        tipo: "p",
        texto:
          "O violão é o instrumento mais presente na casa do brasileiro. Está no churrasco, na roda de amigos, na igreja e no quarto de quem sonha subir num palco. E não é à toa: tocar faz bem de muitas formas.",
      },
      { tipo: "h2", texto: "7 benefícios que você sente na prática" },
      {
        tipo: "lista",
        itens: [
          "Memória mais ativa: decorar acordes, letras e sequências é um treino diário para o cérebro.",
          "Coordenação motora: as duas mãos fazem coisas diferentes ao mesmo tempo, e isso se aprende.",
          "Disciplina gostosa: estudar um pouco todo dia vira um hábito que você quer manter.",
          "Menos estresse: tocar é uma pausa da tela e do trabalho.",
          "Autoestima: tocar para alguém pela primeira vez é uma sensação inesquecível.",
          "Amizades: o violão abre rodas, aproxima pessoas e puxa conversa.",
          "Criatividade: logo você começa a inventar batidas, arranjos e até suas próprias músicas.",
        ],
      },
      { tipo: "h2", texto: "Cabe na sua rotina, sim" },
      {
        tipo: "p",
        texto:
          "Você não precisa de horas livres. Deixar o violão fora da capa, num suporte à vista, já muda tudo: fica fácil pegar por cinco minutos enquanto o café passa ou antes de dormir. Pouco, mas todo dia, é o que faz a diferença.",
      },
      {
        tipo: "dica",
        texto:
          "Deixe o violão sempre à vista. Instrumento guardado no armário é instrumento esquecido.",
      },
    ],
  },
  {
    slug: "violao-para-iniciantes",
    titulo: "Violão para iniciantes: o guia para começar do jeito certo",
    resumo:
      "Qual violão comprar, como afinar, quanto tempo estudar e os erros mais comuns de quem está começando.",
    categoria: "Iniciantes",
    data: "2026-10-30",
    leitura: 6,
    imagem: iniciante,
    imagemAlt: "Pessoa sentada no sofá segurando um violão pela primeira vez",
    conteudo: [
      {
        tipo: "p",
        texto:
          "Em 12 anos dando aula, ouvi muito a frase \"eu não levo jeito\". A verdade é que todo mundo começa com os dedos doendo e o som abafado. O que separa quem toca de quem desiste é começar do jeito certo.",
      },
      { tipo: "h2", texto: "1. Escolha o violão certo" },
      {
        tipo: "p",
        texto:
          "Para a maioria dos iniciantes, o violão de nylon é o mais confortável: as cordas são mais macias e machucam menos os dedos. Se você ama sertanejo, pop ou rock e quer aquele som mais brilhante, o de aço também é uma boa escolha. O importante é que as cordas não fiquem muito altas em relação ao braço.",
      },
      { tipo: "h2", texto: "2. Aprenda a afinar" },
      {
        tipo: "p",
        texto:
          "Violão desafinado desanima qualquer um. Use um afinador de clipe ou um aplicativo e afine antes de cada estudo. Da corda mais grossa para a mais fina: Mi, Lá, Ré, Sol, Si, Mi.",
      },
      { tipo: "h2", texto: "3. Estude pouco, mas todo dia" },
      {
        tipo: "p",
        texto:
          "Quinze minutos por dia rendem muito mais do que duas horas no fim de semana. Os dedos criam calo e memória com a repetição.",
      },
      { tipo: "h2", texto: "Erros comuns de quem está começando" },
      {
        tipo: "lista",
        itens: [
          "Querer começar por músicas difíceis demais e se frustrar.",
          "Apertar a corda longe do traste, o que deixa o som chiando.",
          "Esquecer a mão direita: o ritmo é metade da música.",
          "Estudar sem um caminho, pulando de vídeo em vídeo.",
        ],
      },
      {
        tipo: "dica",
        texto:
          "Comece por uma música que você ama e que use poucos acordes. A vontade de tocá-la vai te fazer treinar sem perceber.",
      },
    ],
  },
  {
    slug: "os-tres-primeiros-acordes",
    titulo: "Os três primeiros acordes para tocar centenas de músicas",
    resumo:
      "Sol, Dó e Ré: com esses três acordes você já toca sertanejo, MPB, gospel e pop. Veja como montar cada um.",
    categoria: "Aulas",
    data: "2026-10-27",
    leitura: 5,
    imagem: tresAcordes,
    imagemAlt: "Mão formando um acorde no braço do violão",
    conteudo: [
      {
        tipo: "p",
        texto:
          "Se eu pudesse ensinar só três acordes para quem está começando, seriam Sol (G), Dó (C) e Ré (D). Eles aparecem em uma quantidade enorme de músicas e são a porta de entrada para tocar de verdade.",
      },
      { tipo: "h2", texto: "Como ler os desenhos" },
      {
        tipo: "p",
        texto:
          "Imagine o braço do violão de pé, de frente para você. As linhas verticais são as cordas (da mais grossa, à esquerda, para a mais fina, à direita) e as horizontais são os trastes. As bolinhas mostram onde apertar, o \"o\" é corda solta e o \"x\" é corda que não deve tocar.",
      },
      {
        tipo: "acordes",
        acordes: [
          { nome: "Sol", cifra: "G", casas: [3, 2, 0, 0, 0, 3] },
          { nome: "Dó", cifra: "C", casas: [null, 3, 2, 0, 1, 0] },
          { nome: "Ré", cifra: "D", casas: [null, null, 0, 2, 3, 2] },
        ],
      },
      { tipo: "h2", texto: "Exercício: troca de acordes" },
      {
        tipo: "lista",
        itens: [
          "Monte o Sol e toque as cordas uma a uma, conferindo se nenhuma está abafada.",
          "Troque para o Dó contando até quatro em cada acorde. Depois, para o Ré.",
          "Repita a sequência Sol – Dó – Ré – Sol por 5 minutos, devagar.",
          "Quando estiver fácil, conte até dois em cada acorde e depois só um.",
        ],
      },
      {
        tipo: "dica",
        texto:
          "Não olhe só para a mão esquerda. Mantenha a batida da mão direita constante, mesmo que a troca saia imperfeita no começo. O ritmo é o que faz a música acontecer.",
      },
      {
        tipo: "p",
        texto:
          "Com Sol, Dó e Ré dominados, o próximo passo é acrescentar o Mi menor (Em) e o Lá menor (Am). Aí o seu repertório explode. No curso Bora Tocar a gente segue exatamente esse caminho, já aplicando cada acorde nas músicas que você escolher.",
      },
    ],
  },
];

export function getPost(slug: string) {
  return POSTS.find((p) => p.slug === slug);
}

export function formatarData(iso: string) {
  return new Date(`${iso}T12:00:00`).toLocaleDateString("pt-BR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}
