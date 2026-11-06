import { createFileRoute } from "@tanstack/react-router";

import { Button } from "@/components/ui/button";
import { WhatsAppIcon } from "@/components/site/WhatsAppIcon";
import { whatsappLink } from "@/lib/contato";
import { CATEGORIAS } from "@/lib/produtos";

export const Route = createFileRoute("/loja")({
  head: () => ({
    meta: [
      { title: "Loja de instrumentos de cordas e acessórios | Bora Tocar" },
      {
        name: "description",
        content:
          "Violões, violas caipiras, cavaquinhos, ukuleles e acessórios. Peça e tire dúvidas direto pelo WhatsApp.",
      },
      { property: "og:title", content: "Loja Bora Tocar — Instrumentos e acessórios" },
      {
        property: "og:description",
        content: "Instrumentos de cordas e acessórios de música, com indicação de quem é professor.",
      },
    ],
  }),
  component: LojaPage,
});

function LojaPage() {
  return (
    <>
      <section className="relative overflow-hidden border-b border-border">
        <div className="absolute inset-0 bg-stage" />
        <div className="relative mx-auto max-w-6xl px-5 py-24">
          <p className="eyebrow">Loja Bora Tocar</p>
          <h1 className="mt-5 max-w-3xl text-5xl font-semibold leading-[1.05] md:text-6xl">
            O instrumento certo, <em className="text-gradient-amber">indicado por professor.</em>
          </h1>
          <p className="mt-6 max-w-xl text-lg text-muted-foreground">
            Instrumentos de cordas e acessórios de música. Escolha a categoria e me chame no WhatsApp
            para ver modelos, valores e disponibilidade.
          </p>
        </div>
      </section>

      <div className="mx-auto max-w-6xl space-y-24 px-5 py-24">
        {CATEGORIAS.map((cat, i) => (
          <section
            key={cat.id}
            id={cat.id}
            className="grid scroll-mt-24 items-center gap-10 md:grid-cols-2"
          >
            <img
              src={cat.imagem}
              alt={cat.nome}
              loading="lazy"
              width={1024}
              height={1280}
              className={`aspect-[4/5] w-full rounded-lg object-cover shadow-card ${i % 2 === 1 ? "md:order-2" : ""}`}
            />
            <div>
              <p className="eyebrow">Categoria</p>
              <h2 className="mt-3 text-4xl font-semibold md:text-5xl">{cat.nome}</h2>
              <p className="mt-4 text-lg text-muted-foreground">{cat.descricao}</p>
              <ul className="mt-8 divide-y divide-border border-y border-border">
                {cat.itens.map((item) => (
                  <li key={item} className="flex items-center justify-between gap-4 py-4">
                    <span className="font-medium">{item}</span>
                    <a
                      href={whatsappLink(`Olá Anderson! Tenho interesse em: ${item}. Pode me passar modelos e valores?`)}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex shrink-0 items-center gap-1.5 text-sm font-semibold text-primary hover:text-primary-glow"
                    >
                      <WhatsAppIcon className="size-4" /> Consultar
                    </a>
                  </li>
                ))}
              </ul>
              <Button asChild variant="whatsapp" size="lg" className="mt-8">
                <a
                  href={whatsappLink(`Olá Anderson! Quero ver as opções de ${cat.nome.toLowerCase()} da loja.`)}
                  target="_blank"
                  rel="noreferrer"
                >
                  <WhatsAppIcon /> Ver opções de {cat.nome.toLowerCase()}
                </a>
              </Button>
            </div>
          </section>
        ))}
      </div>
    </>
  );
}
