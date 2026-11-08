import { useMutation, useQueryClient, useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute, Link } from "@tanstack/react-router";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { CheckCircle2, Circle, Download, FileText, LogOut, Megaphone, PlayCircle, Settings } from "lucide-react";
import { useMemo, useState } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { supabase } from "@/integrations/supabase/client";
import {
  aulasQuery,
  baixarMaterial,
  materiaisQuery,
  minhaContaQuery,
  progressoQuery,
  recadosQuery,
  type Material,
} from "@/lib/area-aluno.queries";
import { useSignOut } from "@/lib/auth";
import { whatsappLink } from "@/lib/contato";
import { ETAPAS } from "@/lib/etapas";
import { calcularProgresso } from "@/lib/progresso";
import { toEmbedUrl } from "@/lib/video";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/_authenticated/area-do-aluno")({
  head: () => ({
    meta: [
      { title: "Minhas aulas — Área do Aluno | Bora Tocar" },
      { name: "description", content: "Vídeo-aulas, cifras e recados do curso de violão Bora Tocar." },
      { name: "robots", content: "noindex" },
      { property: "og:title", content: "Área do Aluno — Bora Tocar" },
      { property: "og:description", content: "Suas aulas de violão com o professor Anderson Moraes." },
    ],
  }),
  loader: async ({ context }) => {
    await Promise.all([
      context.queryClient.ensureQueryData(minhaContaQuery),
      context.queryClient.ensureQueryData(aulasQuery),
      context.queryClient.ensureQueryData(materiaisQuery),
      context.queryClient.ensureQueryData(recadosQuery),
      context.queryClient.ensureQueryData(progressoQuery),
    ]);
  },
  component: AreaDoAlunoPage,
});

function dataBr(iso: string) {
  return format(new Date(iso), "d 'de' MMMM", { locale: ptBR });
}

function AreaDoAlunoPage() {
  const { data: conta } = useSuspenseQuery(minhaContaQuery);
  const { data: aulas } = useSuspenseQuery(aulasQuery);
  const { data: materiais } = useSuspenseQuery(materiaisQuery);
  const { data: recados } = useSuspenseQuery(recadosQuery);
  const { data: concluidas } = useSuspenseQuery(progressoQuery);
  const sair = useSignOut();
  const queryClient = useQueryClient();

  const feitas = useMemo(() => new Set(concluidas), [concluidas]);
  const [selecionadaId, setSelecionadaId] = useState<string | null>(null);
  const atual =
    aulas.find((a) => a.id === selecionadaId) ?? aulas.find((a) => !feitas.has(a.id)) ?? aulas[0] ?? null;
  const progresso = calcularProgresso(
    aulas.map((a) => a.id),
    concluidas,
  );

  const alternar = useMutation({
    mutationFn: async ({ id, feita }: { id: string; feita: boolean }) => {
      if (!conta) return;
      const { error } = feita
        ? await supabase.from("lesson_progress").delete().eq("user_id", conta.userId).eq("lesson_id", id)
        : await supabase.from("lesson_progress").insert({ user_id: conta.userId, lesson_id: id });
      if (error) throw error;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: progressoQuery.queryKey }),
    onError: () => toast.error("Não foi possível salvar. Tente de novo."),
  });

  async function baixar(m: Material) {
    try {
      await baixarMaterial(m);
    } catch {
      toast.error("Não foi possível baixar o arquivo.");
    }
  }

  if (!conta) return null;

  if (!conta.isAdmin && !conta.isAluno) {
    return (
      <div className="mx-auto max-w-xl px-5 py-24 text-center">
        <h1 className="text-3xl font-semibold">Sua conta ainda não foi liberada</h1>
        <p className="mt-3 text-muted-foreground">Fale com o professor para liberar seu acesso.</p>
        <div className="mt-6 flex justify-center gap-3">
          <Button asChild variant="whatsapp">
            <a href={whatsappLink("Olá Anderson! Minha conta da Área do Aluno não está liberada.")} target="_blank" rel="noreferrer">
              Falar com o professor
            </a>
          </Button>
          <Button variant="stage" onClick={sair}>Sair</Button>
        </div>
      </div>
    );
  }

  const embed = atual ? toEmbedUrl(atual.video_url) : null;
  const atualFeita = atual ? feitas.has(atual.id) : false;

  return (
    <>
      <section className="border-b border-border bg-stage">
        <div className="mx-auto max-w-6xl px-5 py-10 md:py-14">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <p className="eyebrow">Área do aluno</p>
              <h1 className="mt-3 text-4xl font-semibold md:text-5xl">
                Bora <span className="italic text-primary">tocar!</span>
              </h1>
              <p className="mt-2 text-sm text-muted-foreground">{conta.email}</p>
            </div>
            <div className="flex flex-wrap gap-2">
              {conta.isAdmin && (
                <Button asChild variant="stage" size="sm">
                  <Link to="/professor">
                    <Settings /> Painel do professor
                  </Link>
                </Button>
              )}
              <Button variant="ghost" size="sm" onClick={sair}>
                <LogOut /> Sair
              </Button>
            </div>
          </div>

          <div className="mt-8 max-w-md">
            <div className="flex items-center justify-between text-sm">
              <span className="font-semibold">Seu progresso</span>
              <span className="text-muted-foreground">
                {progresso.feitas} de {progresso.total} aulas · {progresso.porcentagem}%
              </span>
            </div>
            <Progress value={progresso.porcentagem} className="mt-2 h-2" />
          </div>
        </div>
      </section>

      {recados[0] && (
        <div className="border-b border-border bg-primary/10">
          <div className="mx-auto flex max-w-6xl items-start gap-3 px-5 py-4">
            <Megaphone className="mt-0.5 size-5 shrink-0 text-primary" />
            <p className="text-sm">
              <span className="font-semibold">{recados[0].title}</span>
              {recados[0].body && <span className="text-muted-foreground"> — {recados[0].body}</span>}
            </p>
          </div>
        </div>
      )}

      <section className="mx-auto max-w-6xl px-5 py-12">
        {aulas.length === 0 ? (
          <div className="rounded-lg border border-dashed border-border p-10 text-center">
            <PlayCircle className="mx-auto size-10 text-primary" />
            <h2 className="mt-4 text-2xl font-semibold">As aulas estão chegando</h2>
            <p className="mt-2 text-muted-foreground">
              O professor ainda não publicou as vídeo-aulas. Assim que sair a primeira, ela aparece aqui.
            </p>
          </div>
        ) : (
          <div className="grid gap-8 lg:grid-cols-[1fr_340px]">
            <div>
              {atual && (
                <>
                  <div className="aspect-video overflow-hidden rounded-lg border border-border bg-card">
                    {embed ? (
                      <iframe
                        key={atual.id}
                        src={embed}
                        title={atual.title}
                        className="size-full"
                        allow="autoplay; fullscreen; picture-in-picture; encrypted-media"
                        allowFullScreen
                      />
                    ) : (
                      <div className="flex size-full items-center justify-center p-6 text-center text-sm text-muted-foreground">
                        Não foi possível mostrar este vídeo aqui.{" "}
                        <a href={atual.video_url} target="_blank" rel="noreferrer" className="ml-1 text-primary underline">
                          Abrir o vídeo
                        </a>
                      </div>
                    )}
                  </div>
                  <p className="eyebrow mt-6">
                    Etapa {String(atual.stage).padStart(2, "0")} ·{" "}
                    {ETAPAS.find((e) => e.numero === atual.stage)?.titulo}
                  </p>
                  <div className="mt-2 flex flex-wrap items-start justify-between gap-4">
                    <h2 className="text-3xl font-semibold">{atual.title}</h2>
                    <Button
                      variant={atualFeita ? "stage" : "hero"}
                      disabled={alternar.isPending}
                      onClick={() => {
                        setSelecionadaId(atual.id);
                        alternar.mutate({ id: atual.id, feita: atualFeita });
                      }}
                    >
                      {atualFeita ? (
                        <>
                          <CheckCircle2 /> Aula concluída
                        </>
                      ) : (
                        <>
                          <Circle /> Marcar como concluída
                        </>
                      )}
                    </Button>
                  </div>
                  {atual.description && (
                    <p className="mt-4 whitespace-pre-line text-muted-foreground">{atual.description}</p>
                  )}
                </>
              )}
            </div>

            <aside className="space-y-6">
              {ETAPAS.map((etapa) => {
                const daEtapa = aulas.filter((a) => a.stage === etapa.numero);
                if (daEtapa.length === 0) return null;
                return (
                  <div key={etapa.numero}>
                    <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
                      {etapa.n} · {etapa.titulo}
                    </p>
                    <ul className="mt-2 divide-y divide-border overflow-hidden rounded-lg border border-border bg-card">
                      {daEtapa.map((aula) => {
                        const feita = feitas.has(aula.id);
                        const ativa = atual?.id === aula.id;
                        return (
                          <li key={aula.id}>
                            <button
                              type="button"
                              onClick={() => setSelecionadaId(aula.id)}
                              className={cn(
                                "flex w-full items-center gap-3 px-4 py-3 text-left text-sm transition-colors hover:bg-secondary",
                                ativa && "bg-secondary",
                              )}
                            >
                              {feita ? (
                                <CheckCircle2 className="size-4 shrink-0 text-primary" />
                              ) : (
                                <PlayCircle className="size-4 shrink-0 text-muted-foreground" />
                              )}
                              <span className={cn(ativa && "font-semibold text-primary")}>{aula.title}</span>
                            </button>
                          </li>
                        );
                      })}
                    </ul>
                  </div>
                );
              })}
            </aside>
          </div>
        )}
      </section>

      <section className="border-t border-border bg-card">
        <div className="mx-auto grid max-w-6xl gap-10 px-5 py-12 md:grid-cols-2">
          <div>
            <p className="eyebrow">Cifras e materiais</p>
            <h2 className="mt-2 text-2xl font-semibold">Para baixar</h2>
            {materiais.length === 0 ? (
              <p className="mt-4 text-sm text-muted-foreground">Nenhum material publicado ainda.</p>
            ) : (
              <ul className="mt-4 space-y-3">
                {materiais.map((m) => (
                  <li key={m.id} className="flex items-center gap-3 rounded-lg border border-border bg-background p-4">
                    <FileText className="size-5 shrink-0 text-primary" />
                    <div className="min-w-0 flex-1">
                      <p className="font-semibold">{m.title}</p>
                      {m.description && <p className="text-sm text-muted-foreground">{m.description}</p>}
                    </div>
                    <Button size="sm" variant="stage" onClick={() => baixar(m)}>
                      <Download /> Baixar
                    </Button>
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div>
            <p className="eyebrow">Recados do professor</p>
            <h2 className="mt-2 text-2xl font-semibold">Mural</h2>
            {recados.length === 0 ? (
              <p className="mt-4 text-sm text-muted-foreground">Nenhum recado por enquanto.</p>
            ) : (
              <ul className="mt-4 space-y-3">
                {recados.map((r) => (
                  <li key={r.id} className="rounded-lg border border-border bg-background p-4">
                    <p className="text-xs text-muted-foreground">{dataBr(r.created_at)}</p>
                    <p className="mt-1 font-semibold">{r.title}</p>
                    {r.body && <p className="mt-1 whitespace-pre-line text-sm text-muted-foreground">{r.body}</p>}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </section>
    </>
  );
}
