import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";

import { Button } from "@/components/ui/button";
import { WhatsAppIcon } from "@/components/site/WhatsAppIcon";
import { whatsappLink } from "@/lib/contato";
import andersonPhoto from "@/assets/anderson-moraes-palco.jpeg.asset.json";

export const Route = createFileRoute("/sobre")({
  head: () => ({
    meta: [
      { title: "Anderson Moraes — Professor de violão há 12 anos | Bora Tocar" },
      {
        name: "description",
        content:
          "Conheça Anderson Moraes: professor de violão há 12 anos, natural de Bragança Paulista – SP, ex-cantor sertanejo com vasto repertório.",
      },
      { property: "og:title", content: "Anderson Moraes — Professor de violão" },
      {
        property: "og:description",
        content: "12 anos ensinando violão e 10 anos nos palcos do sertanejo.",
      },
    ],
  }),
  component: SobrePage,
});

const NUMEROS = [
  { valor: "12", rotulo: "anos dando aulas de violão" },
  { valor: "10", rotulo: "anos como cantor sertanejo" },
  { valor: "∞", rotulo: "músicas no repertório" },
];

function SobrePage() {
  return (
    <>
      <section className="mx-auto grid max-w-6xl gap-14 px-5 py-20 md:grid-cols-[1fr_1.1fr] md:py-28">
        <div className="md:sticky md:top-24 md:self-start">
          <img
            src={andersonPhoto.url}
            alt="Anderson Moraes cantando e tocando violão no palco"
            width={960}
            height={1280}
            className="aspect-[3/4] w-full rounded-lg object-cover shadow-card"
          />
        </div>

        <div>
          <p className="eyebrow">Biografia</p>
          <h1 className="mt-5 text-5xl font-semibold leading-[1.05] md:text-6xl">
            Anderson <em className="text-gradient-amber">Moraes</em>
          </h1>
          <p className="mt-3 text-muted-foreground">Professor de violão · Bragança Paulista – SP</p>

          <div className="mt-10 space-y-6 text-lg leading-relaxed text-foreground/85">
            <p>
              Me chamo <strong className="text-foreground">Anderson Moraes</strong>, sou natural de
              Bragança Paulista, no interior de São Paulo, e há{" "}
              <strong className="text-foreground">12 anos</strong> dou aulas de violão.
            </p>
            <p>
              Durante <strong className="text-foreground">10 anos</strong> fui cantor sertanejo.
              Foram muitas noites de palco, barzinho e estrada — e foi ali que construí um vasto
              repertório e aprendi, na prática, o que realmente faz alguém tocar bem: ritmo, segurança
              e amor pela música.
            </p>
            <p>
              Toda essa experiência virou o <strong className="text-foreground">Bora Tocar</strong>:
              um método prático, sem enrolação, para você aprender violão tocando as músicas que mais
              gosta. Meu objetivo é simples — fazer você pegar o violão e sentir o prazer de tocar
              desde a primeira aula.
            </p>
          </div>

          <dl className="mt-12 grid grid-cols-3 gap-px overflow-hidden rounded-lg border border-border bg-border">
            {NUMEROS.map((n) => (
              <div key={n.rotulo} className="bg-card p-5">
                <dt className="font-display text-4xl font-semibold text-primary">{n.valor}</dt>
                <dd className="mt-2 text-xs font-medium uppercase tracking-wider text-muted-foreground">
                  {n.rotulo}
                </dd>
              </div>
            ))}
          </dl>

          <div className="mt-12 flex flex-wrap gap-3">
            <Button asChild variant="whatsapp" size="lg">
              <a
                href={whatsappLink("Olá Anderson! Vi sua história no site e quero aprender violão com você.")}
                target="_blank"
                rel="noreferrer"
              >
                <WhatsAppIcon /> Quero ter aula com você
              </a>
            </Button>
            <Button asChild variant="stage" size="lg">
              <Link to="/curso">
                Ver o curso <ArrowRight />
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </>
  );
}
