import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, Guitar, Music2, Mic2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { WhatsAppIcon } from "@/components/site/WhatsAppIcon";
import { whatsappLink } from "@/lib/contato";
import { CATEGORIAS } from "@/lib/produtos";
import andersonPhoto from "@/assets/anderson-moraes-palco.jpeg.asset.json";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Bora Tocar — Aprenda violão tocando as músicas que você ama" },
      {
        name: "description",
        content:
          "Curso de violão online com método prático do professor Anderson Moraes, mais loja de instrumentos de cordas e acessórios.",
      },
      { property: "og:title", content: "Bora Tocar — Curso de violão online" },
      {
        property: "og:description",
        content: "Método prático para tocar violão e as músicas que você mais gosta. Fale com o professor no WhatsApp.",
      },
    ],
  }),
  component: Index,
});

const PILARES = [
  {
    icon: Guitar,
    titulo: "Prático desde a 1ª aula",
    texto: "Nada de teoria sem fim. Você pega o violão e já sai tocando acordes e batidas.",
  },
  {
    icon: Music2,
    titulo: "As músicas que você ama",
    texto: "O caminho é montado em cima do seu gosto: sertanejo, MPB, pop, gospel, rock.",
  },
  {
    icon: Mic2,
    titulo: "Tocar e cantar junto",
    texto: "Experiência de quem viveu o palco: ritmo, voz e violão andando juntos.",
  },
];

function Index() {
  return (
    <>
      {/* Hero */}
      <section className="relative isolate overflow-hidden">
        <div className="absolute inset-y-0 right-0 -z-10 w-full md:w-3/5">
          <img
            src={andersonPhoto.url}
            alt="Anderson Moraes tocando violão e cantando no palco"
            width={960}
            height={1280}
            className="h-full w-full object-cover object-[70%_center] opacity-60 md:opacity-100"
          />
          <div className="absolute inset-0 bg-fade-left" />
          <div className="absolute inset-0 bg-fade-bottom" />
        </div>

        <div className="mx-auto flex min-h-[calc(100vh-4rem)] max-w-6xl flex-col justify-center px-5 py-20">
          <p className="eyebrow animate-rise">Curso de violão online</p>
          <h1 className="mt-5 max-w-2xl animate-rise text-5xl font-semibold leading-[1.02] md:text-7xl [animation-delay:120ms]">
            Aprenda violão tocando as músicas que{" "}
            <em className="text-gradient-amber">você ama.</em>
          </h1>
          <p className="mt-6 max-w-lg animate-rise text-lg text-muted-foreground [animation-delay:240ms]">
            Um método prático, criado por quem passou 10 anos nos palcos do sertanejo e ensina
            violão há 12 anos. Bora tocar?
          </p>
          <div className="mt-10 flex animate-rise flex-wrap gap-3 [animation-delay:360ms]">
            <Button asChild variant="hero" size="xl">
              <a
                href={whatsappLink("Olá Anderson! Quero aprender violão com o curso Bora Tocar.")}
                target="_blank"
                rel="noreferrer"
              >
                <WhatsAppIcon /> Quero aprender
              </a>
            </Button>
            <Button asChild variant="stage" size="xl">
              <Link to="/curso">
                Conhecer o método <ArrowRight />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Pilares do método */}
      <section className="strings-lines border-y border-border">
        <div className="mx-auto max-w-6xl px-5 py-24">
          <p className="eyebrow">O método Bora Tocar</p>
          <h2 className="mt-4 max-w-2xl text-4xl font-semibold md:text-5xl">
            Menos teoria travada. Mais música saindo do seu violão.
          </h2>
          <div className="mt-14 grid gap-px overflow-hidden rounded-lg border border-border bg-border md:grid-cols-3">
            {PILARES.map(({ icon: Icon, titulo, texto }) => (
              <div key={titulo} className="bg-background p-8">
                <Icon className="size-8 text-primary" strokeWidth={1.5} />
                <h3 className="mt-6 text-2xl font-semibold">{titulo}</h3>
                <p className="mt-3 text-muted-foreground">{texto}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Sobre - teaser */}
      <section className="mx-auto grid max-w-6xl items-center gap-12 px-5 py-24 md:grid-cols-2">
        <div className="relative">
          <img
            src={andersonPhoto.url}
            alt="Professor Anderson Moraes"
            loading="lazy"
            width={960}
            height={1280}
            className="aspect-[4/5] w-full rounded-lg object-cover shadow-card"
          />
          <div className="absolute -bottom-6 -right-4 rounded-lg bg-primary px-6 py-4 text-primary-foreground shadow-glow md:-right-8">
            <p className="font-display text-4xl font-semibold leading-none">12</p>
            <p className="text-xs font-bold uppercase tracking-widest">anos ensinando</p>
          </div>
        </div>
        <div>
          <p className="eyebrow">Seu professor</p>
          <h2 className="mt-4 text-4xl font-semibold md:text-5xl">Anderson Moraes</h2>
          <p className="mt-6 text-lg text-muted-foreground">
            Natural de Bragança Paulista – SP, fui cantor sertanejo por 10 anos e carrego um vasto
            repertório. Hoje coloco toda essa estrada em um jeito simples e direto de ensinar
            violão.
          </p>
          <Button asChild variant="link" className="mt-6 px-0 text-base">
            <Link to="/sobre">
              Conheça minha história <ArrowRight />
            </Link>
          </Button>
        </div>
      </section>

      {/* Loja - teaser */}
      <section className="border-t border-border bg-card">
        <div className="mx-auto max-w-6xl px-5 py-24">
          <div className="flex flex-wrap items-end justify-between gap-6">
            <div>
              <p className="eyebrow">Loja Bora Tocar</p>
              <h2 className="mt-4 text-4xl font-semibold md:text-5xl">Instrumentos e acessórios</h2>
            </div>
            <Button asChild variant="stage">
              <Link to="/loja">
                Ver a loja <ArrowRight />
              </Link>
            </Button>
          </div>
          <div className="mt-12 grid grid-cols-2 gap-4 md:grid-cols-4">
            {CATEGORIAS.map((cat) => (
              <Link
                key={cat.id}
                to="/loja"
                hash={cat.id}
                className="group relative overflow-hidden rounded-lg"
              >
                <img
                  src={cat.imagem}
                  alt={cat.nome}
                  loading="lazy"
                  width={1024}
                  height={1280}
                  className="aspect-[4/5] w-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-fade-bottom" />
                <p className="absolute bottom-4 left-4 font-display text-xl font-semibold">
                  {cat.nome}
                </p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* CTA final */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-stage" />
        <div className="relative mx-auto max-w-3xl px-5 py-28 text-center">
          <h2 className="text-4xl font-semibold md:text-6xl">
            Seu violão está esperando. <em className="text-gradient-amber">Bora tocar?</em>
          </h2>
          <p className="mx-auto mt-6 max-w-md text-muted-foreground">
            Me chama no WhatsApp, me conta quais músicas você quer tocar e eu te explico como
            funciona o curso.
          </p>
          <Button asChild variant="whatsapp" size="xl" className="mt-10">
            <a
              href={whatsappLink("Olá Anderson! Quero saber como funciona o curso de violão.")}
              target="_blank"
              rel="noreferrer"
            >
              <WhatsAppIcon /> Falar com o Anderson
            </a>
          </Button>
        </div>
      </section>
    </>
  );
}
