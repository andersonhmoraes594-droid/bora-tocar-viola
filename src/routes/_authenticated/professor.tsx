import { createFileRoute, Link, redirect } from "@tanstack/react-router";

import { Button } from "@/components/ui/button";
import { minhaContaQuery } from "@/lib/area-aluno.queries";

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
  component: ProfessorPage,
});

function ProfessorPage() {
  return (
    <div className="mx-auto max-w-xl px-5 py-24 text-center">
      <p className="eyebrow">Painel do professor</p>
      <h1 className="mt-3 text-3xl font-semibold">Painel em construção</h1>
      <p className="mt-3 text-muted-foreground">
        Em breve aqui você vai cadastrar alunos, publicar aulas, PDFs e recados.
      </p>
      <Button asChild variant="stage" className="mt-6">
        <Link to="/area-do-aluno">Ver a área do aluno</Link>
      </Button>
    </div>
  );
}
