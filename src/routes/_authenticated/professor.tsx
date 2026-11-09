import { useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute, Link, redirect } from "@tanstack/react-router";
import { Eye, LogOut } from "lucide-react";

import { AlunosPainel } from "@/components/professor/AlunosPainel";
import { AulasPainel } from "@/components/professor/AulasPainel";
import { DuvidasPainel } from "@/components/professor/DuvidasPainel";
import { MateriaisPainel } from "@/components/professor/MateriaisPainel";
import { RecadosPainel } from "@/components/professor/RecadosPainel";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  aulasQuery,
  duvidasQuery,
  materiaisQuery,
  minhaContaQuery,
  recadosQuery,
} from "@/lib/area-aluno.queries";
import { useSignOut } from "@/lib/auth";

export const Route = createFileRoute("/_authenticated/professor")({
  head: () => ({
    meta: [
      { title: "Painel do professor | Bora Tocar" },
      { name: "description", content: "Gestão de alunos, aulas, materiais e recados do Bora Tocar." },
      { name: "robots", content: "noindex" },
      { property: "og:title", content: "Painel do professor — Bora Tocar" },
      { property: "og:description", content: "Área de gestão do professor Anderson Moraes." },
    ],
  }),
  beforeLoad: async ({ context }) => {
    const conta = await context.queryClient.ensureQueryData(minhaContaQuery);
    if (!conta?.isAdmin) throw redirect({ to: "/area-do-aluno" });
  },
  loader: async ({ context }) => {
    await Promise.all([
      context.queryClient.ensureQueryData(aulasQuery),
      context.queryClient.ensureQueryData(materiaisQuery),
      context.queryClient.ensureQueryData(recadosQuery),
      context.queryClient.ensureQueryData(duvidasQuery),
    ]);
  },
  component: ProfessorPage,
});

function ProfessorPage() {
  const sair = useSignOut();
  const { data: duvidas } = useSuspenseQuery(duvidasQuery);
  const pendentes = duvidas.filter((d) => !d.answer).length;

  return (
    <>
      <section className="border-b border-border bg-stage">
        <div className="mx-auto flex max-w-6xl flex-wrap items-end justify-between gap-4 px-5 py-10">
          <div>
            <p className="eyebrow">Painel do professor</p>
            <h1 className="mt-3 text-4xl font-semibold md:text-5xl">
              Olá, <span className="italic text-primary">Anderson</span>
            </h1>
            <p className="mt-2 text-muted-foreground">Gerencie seus alunos, aulas, materiais, recados e dúvidas.</p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button asChild variant="stage" size="sm">
              <Link to="/area-do-aluno">
                <Eye /> Ver como aluno
              </Link>
            </Button>
            <Button variant="ghost" size="sm" onClick={sair}>
              <LogOut /> Sair
            </Button>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-5 py-10">
        <Tabs defaultValue="alunos">
          <TabsList className="flex h-auto flex-wrap justify-start">
            <TabsTrigger value="alunos">Alunos</TabsTrigger>
            <TabsTrigger value="aulas">Aulas</TabsTrigger>
            <TabsTrigger value="materiais">Materiais</TabsTrigger>
            <TabsTrigger value="recados">Recados</TabsTrigger>
            <TabsTrigger value="duvidas">Dúvidas{pendentes > 0 ? ` (${pendentes})` : ""}</TabsTrigger>
          </TabsList>
          <TabsContent value="alunos" className="mt-8">
            <AlunosPainel />
          </TabsContent>
          <TabsContent value="aulas" className="mt-8">
            <AulasPainel />
          </TabsContent>
          <TabsContent value="materiais" className="mt-8">
            <MateriaisPainel />
          </TabsContent>
          <TabsContent value="recados" className="mt-8">
            <RecadosPainel />
          </TabsContent>
          <TabsContent value="duvidas" className="mt-8">
            <DuvidasPainel />
          </TabsContent>
        </Tabs>
      </section>
    </>
  );
}
