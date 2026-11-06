import { createFileRoute } from "@tanstack/react-router";
import { MapPin } from "lucide-react";

import { Button } from "@/components/ui/button";
import { WhatsAppIcon } from "@/components/site/WhatsAppIcon";
import { WHATSAPP_DISPLAY, whatsappLink } from "@/lib/contato";

export const Route = createFileRoute("/contato")({
  head: () => ({
    meta: [
      { title: "Contato e WhatsApp | Bora Tocar" },
      {
        name: "description",
        content: "Fale com o professor Anderson Moraes pelo WhatsApp (11) 97395-1734 sobre o curso ou a loja.",
      },
      { property: "og:title", content: "Fale com o Bora Tocar no WhatsApp" },
      {
        property: "og:description",
        content: "Tire dúvidas sobre o curso de violão online e os produtos da loja.",
      },
    ],
  }),
  component: ContatoPage,
});

const ASSUNTOS = [
  { label: "Quero fazer o curso", msg: "Olá Anderson! Quero fazer o curso de violão online." },
  { label: "Dúvida sobre a loja", msg: "Olá Anderson! Tenho uma dúvida sobre os produtos da loja." },
  { label: "Me ajuda a escolher um violão", msg: "Olá Anderson! Pode me ajudar a escolher um violão?" },
  { label: "Outro assunto", msg: "Olá Anderson! Vim pelo site Bora Tocar." },
];

function ContatoPage() {
  return (
    <section className="relative overflow-hidden">
      <div className="absolute inset-0 bg-stage" />
      <div className="relative mx-auto max-w-3xl px-5 py-24 text-center md:py-32">
        <p className="eyebrow">Contato</p>
        <h1 className="mt-5 text-5xl font-semibold leading-[1.05] md:text-6xl">
          Bora <em className="text-gradient-amber">conversar?</em>
        </h1>
        <p className="mx-auto mt-6 max-w-md text-lg text-muted-foreground">
          O jeito mais rápido de falar comigo é pelo WhatsApp. Escolha o assunto e a mensagem já vai
          pronta.
        </p>

        <a
          href={whatsappLink("Olá Anderson! Vim pelo site Bora Tocar.")}
          target="_blank"
          rel="noreferrer"
          className="mt-12 inline-flex items-center gap-4 rounded-lg border border-border bg-card px-8 py-6 shadow-card transition-colors hover:border-whatsapp"
        >
          <WhatsAppIcon className="size-10 text-whatsapp" />
          <span className="text-left">
            <span className="block text-xs font-bold uppercase tracking-widest text-muted-foreground">WhatsApp</span>
            <span className="font-display text-3xl font-semibold">{WHATSAPP_DISPLAY}</span>
          </span>
        </a>

        <div className="mx-auto mt-12 grid max-w-xl gap-3 sm:grid-cols-2">
          {ASSUNTOS.map((a) => (
            <Button key={a.label} asChild variant="stage" size="lg" className="w-full">
              <a href={whatsappLink(a.msg)} target="_blank" rel="noreferrer">
                {a.label}
              </a>
            </Button>
          ))}
        </div>

        <p className="mt-12 inline-flex items-center gap-2 text-sm text-muted-foreground">
          <MapPin className="size-4" /> Bragança Paulista – SP · Aulas online para todo o Brasil
        </p>
      </div>
    </section>
  );
}
