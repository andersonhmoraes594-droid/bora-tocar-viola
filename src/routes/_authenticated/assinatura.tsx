import { useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute, redirect } from "@tanstack/react-router";
import { Check, CreditCard, LogOut } from "lucide-react";

import { WhatsAppIcon } from "@/components/site/WhatsAppIcon";
import { Button } from "@/components/ui/button";
import { temAcessoAoCurso } from "@/lib/acesso";
import { minhaContaQuery } from "@/lib/area-aluno.queries";
import { useSignOut } from "@/lib/auth";
import { whatsappLink } from "@/lib/contato";
import { formatarPreco, PLANOS } from "@/lib/planos";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/_authenticated/assinatura")({
  head: () => ({
    meta: [
      { title: "Escolha seu plano | Bora Tocar" },
      { name: "description", content: "Escolha o plano mensal ou anual do curso de violão Bora Tocar." },
      { name: "robots", content: "noindex" },
      { property: "og:title", content: "Planos do curso — Bora Tocar" },
      { property: "og:description", content: "Assinatura mensal ou anual do curso de violão online." },
    ],
  }),
  beforeLoad: async ({ context }) => {
    const conta = await context.queryClient.ensureQueryData(minhaContaQuery);
    if (temAcessoAoCurso(conta)) throw redirect({ to: "/area-do-aluno" });
  },
  loader: ({ context }) => context.queryClient.ensureQueryData(minhaContaQuery),
  component: AssinaturaPage,
});

const INCLUI = [
  "Todas as vídeo-aulas das 4 etapas do método",
  "Cifras e materiais em PDF para baixar",
  "Mural de dúvidas respondidas pelo professor",
  "Recados e novidades do Anderson",
];

function AssinaturaPage() {
  const { data: conta } = useSuspenseQuery(minhaContaQuery);
  const sair = useSignOut();
  const primeiroNome = conta?.nome.split(" ")[0];

  return (
    <section className="bg-stage">
      <div className="mx-auto max-w-5xl px-5 py-16 md:py-20">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="eyebrow">Passo 2 de 2 · Pagamento</p>
            <h1 className="mt-3 text-4xl font-semibold md:text-5xl">
              {primeiroNome ? `${primeiroNome}, escolha` : "Escolha"} seu{" "}
              <span className="italic text-primary">plano</span>
            </h1>
            <p className="mt-3 max-w-xl text-muted-foreground">
              Seu acesso às aulas é liberado assim que o pagamento for confirmado.
            </p>
          </div>
          <Button variant="ghost" size="sm" onClick={sair}>
            <LogOut /> Sair
          </Button>
        </div>

        <div className="mt-12 grid gap-6 md:grid-cols-2">
          {PLANOS.map((plano) => (
            <div
              key={plano.id}
              className={cn(
                "flex flex-col rounded-lg border bg-card p-8 shadow-card",
                plano.id === "anual" ? "border-primary" : "border-border",
              )}
            >
              <p className="text-xs font-bold uppercase tracking-widest text-primary">{plano.nome}</p>
              <p className="mt-4 font-display text-5xl font-semibold">{formatarPreco(plano.preco)}</p>
              <p className="mt-1 text-sm text-muted-foreground">{plano.periodo}</p>
              <p className="mt-4">{plano.destaque}</p>
              <ul className="mt-6 flex-1 space-y-3 text-sm">
                {INCLUI.map((item) => (
                  <li key={item} className="flex gap-3">
                    <Check className="size-4 shrink-0 text-primary" /> {item}
                  </li>
                ))}
              </ul>
              <Button variant="hero" size="lg" className="mt-8 w-full" disabled>
                <CreditCard /> Pagar com cartão
              </Button>
            </div>
          ))}
        </div>

        <div className="mt-10 rounded-lg border border-border bg-card p-6 text-center">
          <p className="font-semibold">O pagamento com cartão pelo site está sendo ativado.</p>
          <p className="mt-1 text-sm text-muted-foreground">
            Enquanto isso, fale com o professor para fazer sua inscrição e liberar suas aulas.
          </p>
          <Button asChild variant="whatsapp" className="mt-4">
            <a
              href={whatsappLink(
                `Olá Anderson! Criei minha conta no site (${conta?.email ?? ""}) e quero assinar o curso.`,
              )}
              target="_blank"
              rel="noreferrer"
            >
              <WhatsAppIcon /> Falar com o professor
            </a>
          </Button>
        </div>
      </div>
    </section>
  );
}
