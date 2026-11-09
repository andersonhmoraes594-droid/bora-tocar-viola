import { useMutation, useQueryClient, useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute, Link, redirect } from "@tanstack/react-router";
import { formatDistanceToNow } from "date-fns";
import { ptBR } from "date-fns/locale";
import { ArrowLeft, MessageCircleQuestion, Send, Trash2 } from "lucide-react";
import { useState, type FormEvent } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { supabase } from "@/integrations/supabase/client";
import { temAcessoAoCurso } from "@/lib/acesso";
import { duvidasQuery, minhaContaQuery, type Duvida } from "@/lib/area-aluno.queries";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/_authenticated/duvidas")({
  head: () => ({
    meta: [
      { title: "Dúvidas e respostas — Área do Aluno | Bora Tocar" },
      { name: "description", content: "Pergunte ao professor Anderson e veja as respostas para a turma." },
      { name: "robots", content: "noindex" },
      { property: "og:title", content: "Dúvidas e respostas — Bora Tocar" },
      { property: "og:description", content: "Mural de dúvidas dos alunos do curso de violão." },
    ],
  }),
  beforeLoad: async ({ context }) => {
    const conta = await context.queryClient.ensureQueryData(minhaContaQuery);
    if (!temAcessoAoCurso(conta)) throw redirect({ to: "/assinatura" });
  },
  loader: async ({ context }) => {
    await Promise.all([
      context.queryClient.ensureQueryData(minhaContaQuery),
      context.queryClient.ensureQueryData(duvidasQuery),
    ]);
  },
  component: DuvidasPage,
});

function quando(iso: string) {
  return formatDistanceToNow(new Date(iso), { addSuffix: true, locale: ptBR });
}

function DuvidasPage() {
  const { data: conta } = useSuspenseQuery(minhaContaQuery);
  const { data: duvidas } = useSuspenseQuery(duvidasQuery);
  const queryClient = useQueryClient();
  const [texto, setTexto] = useState("");
  const [busca, setBusca] = useState("");

  const perguntar = useMutation({
    mutationFn: async (question: string) => {
      if (!conta) return;
      const { error } = await supabase.from("questions").insert({ user_id: conta.userId, question });
      if (error) throw error;
    },
    onSuccess: () => {
      setTexto("");
      toast.success("Dúvida enviada! O professor vai responder aqui.");
      queryClient.invalidateQueries({ queryKey: duvidasQuery.queryKey });
    },
    onError: () => toast.error("Não foi possível enviar. Tente de novo."),
  });

  const apagar = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("questions").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: duvidasQuery.queryKey }),
    onError: () => toast.error("Não foi possível apagar."),
  });

  function enviar(e: FormEvent) {
    e.preventDefault();
    const q = texto.trim();
    if (q.length < 3) return;
    perguntar.mutate(q);
  }

  const termo = busca.trim().toLowerCase();
  const filtradas = termo
    ? duvidas.filter(
        (d) => d.question.toLowerCase().includes(termo) || (d.answer ?? "").toLowerCase().includes(termo),
      )
    : duvidas;

  return (
    <>
      <section className="border-b border-border bg-stage">
        <div className="mx-auto max-w-3xl px-5 py-10 md:py-14">
          <Link
            to="/area-do-aluno"
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="size-4" /> Voltar para as aulas
          </Link>
          <p className="eyebrow mt-6">Área do aluno</p>
          <h1 className="mt-3 text-4xl font-semibold md:text-5xl">
            Dúvidas e <span className="italic text-primary">respostas</span>
          </h1>
          <p className="mt-3 text-muted-foreground">
            Travou num acorde ou numa batida? Pergunte aqui. O professor Anderson responde e toda a
            turma aprende junto.
          </p>

          <form onSubmit={enviar} className="mt-8 space-y-3">
            <Textarea
              value={texto}
              onChange={(e) => setTexto(e.target.value)}
              maxLength={2000}
              rows={4}
              placeholder="Escreva sua dúvida…"
              aria-label="Sua dúvida"
            />
            <Button type="submit" variant="hero" disabled={perguntar.isPending || texto.trim().length < 3}>
              <Send /> {perguntar.isPending ? "Enviando..." : "Enviar dúvida"}
            </Button>
          </form>
        </div>
      </section>

      <section className="mx-auto max-w-3xl px-5 py-12">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h2 className="text-2xl font-semibold">Mural da turma</h2>
          <Input
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
            placeholder="Buscar dúvidas…"
            className="max-w-xs"
            aria-label="Buscar dúvidas"
          />
        </div>

        {filtradas.length === 0 ? (
          <div className="mt-6 rounded-lg border border-dashed border-border p-10 text-center">
            <MessageCircleQuestion className="mx-auto size-10 text-primary" />
            <p className="mt-4 text-muted-foreground">
              {termo ? "Nenhuma dúvida encontrada." : "Nenhuma dúvida ainda. Seja o primeiro a perguntar!"}
            </p>
          </div>
        ) : (
          <ul className="mt-6 space-y-4">
            {filtradas.map((d) => (
              <CartaoDuvida
                key={d.id}
                duvida={d}
                minha={d.user_id === conta?.userId}
                podeApagar={d.user_id === conta?.userId || !!conta?.isAdmin}
                onApagar={() => apagar.mutate(d.id)}
              />
            ))}
          </ul>
        )}
      </section>
    </>
  );
}

function CartaoDuvida({
  duvida,
  minha,
  podeApagar,
  onApagar,
}: {
  duvida: Duvida;
  minha: boolean;
  podeApagar: boolean;
  onApagar: () => void;
}) {
  return (
    <li className={cn("rounded-lg border bg-card p-5", minha ? "border-primary/50" : "border-border")}>
      <div className="flex items-start justify-between gap-3">
        <p className="text-xs text-muted-foreground">
          <span className="font-semibold text-foreground">{minha ? "Você" : duvida.author_name}</span> ·{" "}
          {quando(duvida.created_at)}
        </p>
        {podeApagar && (
          <button
            type="button"
            onClick={() => {
              if (confirm("Apagar esta dúvida?")) onApagar();
            }}
            className="text-muted-foreground hover:text-destructive"
            aria-label="Apagar dúvida"
          >
            <Trash2 className="size-4" />
          </button>
        )}
      </div>
      <p className="mt-2 whitespace-pre-line">{duvida.question}</p>
      {duvida.answer ? (
        <div className="mt-4 rounded-md border-l-2 border-primary bg-primary/10 p-4">
          <p className="text-xs font-bold uppercase tracking-widest text-primary">Resposta do professor</p>
          <p className="mt-2 whitespace-pre-line text-sm">{duvida.answer}</p>
        </div>
      ) : (
        <p className="mt-3 text-xs italic text-muted-foreground">Aguardando resposta do professor.</p>
      )}
    </li>
  );
}
