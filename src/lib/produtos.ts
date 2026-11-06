import violao from "@/assets/loja-violao.jpg";
import viola from "@/assets/loja-viola-caipira.jpg";
import cavaquinho from "@/assets/loja-cavaquinho.jpg";
import acessorios from "@/assets/loja-acessorios.jpg";

export type Categoria = {
  id: string;
  nome: string;
  descricao: string;
  imagem: string;
  itens: string[];
};

export const CATEGORIAS: Categoria[] = [
  {
    id: "violoes",
    nome: "Violões",
    descricao: "Acústicos e elétricos, de nylon ou aço, para quem está começando ou já sobe no palco.",
    imagem: violao,
    itens: ["Violão de nylon", "Violão de aço", "Violão elétrico (eletroacústico)", "Violão infantil"],
  },
  {
    id: "violas",
    nome: "Violas caipiras",
    descricao: "O som de 10 cordas que é a alma da música raiz e do sertanejo.",
    imagem: viola,
    itens: ["Viola caipira acústica", "Viola caipira elétrica"],
  },
  {
    id: "cavaquinhos",
    nome: "Cavaquinhos e ukuleles",
    descricao: "Pequenos no tamanho, gigantes na alegria. Para o samba, o pagode e muito mais.",
    imagem: cavaquinho,
    itens: ["Cavaquinho", "Ukulele soprano", "Ukulele concert"],
  },
  {
    id: "acessorios",
    nome: "Acessórios",
    descricao: "Tudo o que você precisa para tocar bem e cuidar do seu instrumento.",
    imagem: acessorios,
    itens: ["Encordoamentos", "Capotraste", "Palhetas", "Afinador", "Correias", "Capas e bags", "Suportes"],
  },
];
