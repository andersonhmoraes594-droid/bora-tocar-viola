import { createFileRoute } from "@tanstack/react-router";
import { Check } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { WhatsAppIcon } from "@/components/site/WhatsAppIcon";
import { whatsappLink } from "@/lib/contato";
import maosViolao from "@/assets/maos-violao.jpeg.asset.json";

export const Route = createFileRoute("/curso")({
  head: () => ({
    meta: [
      { title: "Curso de violão online — Método prático | Bora Tocar" },
      {
        name: "description",
        content:
          "Aprenda violão online com um método prático e toque as músicas que você mais gosta. Curso do professor Anderson Moraes.",
      },
      { property: "og:title", content: "Curso de violão online — Bora Tocar" },
      {
        property: "og:description",
        content: "Método prático para sair tocando: acordes, batidas e as suas músicas favoritas.",
      },
    ],
  }),
  component: CursoPage,
});

const ETAPAS = [
  {
    n: "01",
    titulo: "Primeiros acordes",
    texto: "Postura, afinação e os acordes que abrem as portas para centenas de músicas.",
  },
  {
    n: "02",
    titulo: "Ritmo e batidas",
    texto: "As levadas do sertanejo, do pop, da MPB e do gospel, explicadas de forma simples.",
  },
  {
    n: "03",
    titulo: "Suas músicas favoritas",
    texto: "Você escolhe o que quer tocar e aprende aplicando direto no repertório que ama.",
  },
  {
    n: "04",
    titulo: "Tocar e cantar",
    texto: "Juntar voz e violão com segurança, como quem já tem palco.",
  },
];

const PARA_QUEM = [
  "Nunca pegou num violão e quer começar do jeito certo",
  "Já tentou aprender sozinho e travou",
  "Quer tocar na roda de amigos, na igreja ou em família",
  "Sonha em tocar e cantar as músicas que mais gosta",
];

const FAQ = [
  {
    q: "Preciso saber alguma coisa antes de começar?",
    a: "Não. O curso parte do zero e vai no seu ritmo. Se você já toca um pouco, a gente ajusta o caminho.",
  },
  {
    q: "Eu não tenho violão. E agora?",
    a: "Sem problema! Na loja Bora Tocar eu te ajudo a escolher o instrumento ideal para o seu bolso e o seu estilo.",
  },
  {
    q: "Consigo aprender as músicas que eu escolher?",
    a: "Esse é o centro do método. Você me conta o que gosta de ouvir e o aprendizado é montado em cima disso.",
  },
  {
    q: "Como faço para me inscrever e saber o valor?",
    a: "É só me chamar no WhatsApp (11) 97395-1734. Te explico tudo e você já começa.",
  },
];

function CursoPage() {
  return (
    <>
      <section className="relative overflow-hidden border-b border-border">
        <div className="absolute inset-0 bg-stage" />
        <div className="relative mx-auto grid max-w-6xl items-center gap-12 px-5 py-24 md:grid-cols-[1.3fr_1fr]">
          <div>
            <p className="eyebrow">Curso de violão online</p>
            <h1 className="mt-5 text-5xl font-semibold leading-[1.05] md:text-6xl">
              Um método <em className="text-gradient-amber">prático</em> para você sair tocando.
            </h1>
            <p className="mt-6 max-w-lg text-lg text-muted-foreground">
              Aulas online, direto ao ponto, para você aprender violão de verdade e tocar as músicas
              que mais gosta — de onde estiver.
            </p>
            <Button asChild variant="hero" size="xl" className="mt-10">
              <a
                href={whatsappLink("Olá Anderson! Quero me inscrever no curso de violão online.")}
                target="_blank"
                rel="noreferrer"
              >
                <WhatsAppIcon /> Quero me inscrever
              </a>
            </Button>
          </div>
          <img
            src={maosViolao.url}
            alt="Mãos tocando violão"
            width={183}
            height={275}
            className="mx-auto aspect-[2/3] w-full max-w-xs rounded-lg object-cover shadow-card"
          />
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-5 py-24">
        <p className="eyebrow">Como funciona</p>
        <h2 className="mt-4 text-4xl font-semibold md:text-5xl">O caminho, passo a passo</h2>
        <div className="mt-14 grid gap-10 md:grid-cols-2">
          {ETAPAS.map((e) => (
            <div key={e.n} className="flex gap-6 border-t border-border pt-6">
              <span className="font-display text-5xl font-semibold italic text-primary">{e.n}</span>
              <div>
                <h3 className="text-2xl font-semibold">{e.titulo}</h3>
                <p className="mt-2 text-muted-foreground">{e.texto}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="strings-lines border-y border-border bg-card">
        <div className="mx-auto max-w-6xl px-5 py-24">
          <p className="eyebrow">Para quem é</p>
          <h2 className="mt-4 text-4xl font-semibold md:text-5xl">Esse curso é pra você se…</h2>
          <ul className="mt-12 grid gap-4 md:grid-cols-2">
            {PARA_QUEM.map((item) => (
              <li key={item} className="flex items-start gap-4 rounded-lg border border-border bg-background p-6">
                <Check className="mt-0.5 size-5 shrink-0 text-primary" />
                <span className="text-lg">{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="mx-auto max-w-3xl px-5 py-24">
        <p className="eyebrow">Dúvidas</p>
        <h2 className="mt-4 text-4xl font-semibold">Perguntas frequentes</h2>
        <Accordion type="single" collapsible className="mt-10">
          {FAQ.map((f) => (
            <AccordionItem key={f.q} value={f.q}>
              <AccordionTrigger className="text-left text-lg">{f.q}</AccordionTrigger>
              <AccordionContent className="text-base text-muted-foreground">{f.a}</AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
        <div className="mt-14 text-center">
          <Button asChild variant="whatsapp" size="xl">
            <a
              href={whatsappLink("Olá Anderson! Tenho uma dúvida sobre o curso de violão.")}
              target="_blank"
              rel="noreferrer"
            >
              <WhatsAppIcon /> Tirar dúvidas no WhatsApp
            </a>
          </Button>
        </div>
      </section>
    </>
  );
}
