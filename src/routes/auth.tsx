import { useQuery, useQueryClient } from "@tanstack/react-query";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { LockKeyhole } from "lucide-react";
import { useState, type FormEvent } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { professorJaCadastrado } from "@/lib/alunos.functions";
import { destinoAposEntrar } from "@/lib/acesso";
import { minhaContaQuery } from "@/lib/area-aluno.queries";
import { useAuth } from "@/lib/auth";
import { whatsappLink } from "@/lib/contato";

export const Route = createFileRoute("/auth")({
  head: () => ({
    meta: [
      { title: "Entrar na Área do Aluno | Bora Tocar" },
      {
        name: "description",
        content: "Acesse suas vídeo-aulas, cifras e materiais do curso de violão Bora Tocar.",
      },
      { property: "og:title", content: "Área do Aluno — Bora Tocar" },
      {
        property: "og:description",
        content: "Entre com seu e-mail e senha para acessar o curso de violão.",
      },
    ],
  }),
  component: AuthPage,
});

function AuthPage() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { session, ready } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [erro, setErro] = useState<string | null>(null);
  const [enviando, setEnviando] = useState(false);

  const checarProfessor = useServerFn(professorJaCadastrado);
  const { data: temProfessor } = useQuery({
    queryKey: ["professor-cadastrado"],
    queryFn: () => checarProfessor(),
  });

  async function entrar(e: FormEvent) {
    e.preventDefault();
    setErro(null);
    setEnviando(true);
    const { error } = await supabase.auth.signInWithPassword({ email: email.trim(), password });
    if (error) {
      setEnviando(false);
      setErro(
        error.message.toLowerCase().includes("invalid")
          ? "E-mail ou senha incorretos."
          : "Não foi possível entrar. Tente de novo.",
      );
      return;
    }
    const conta = await queryClient.fetchQuery(minhaContaQuery);
    setEnviando(false);
    navigate({ to: destinoAposEntrar(conta) });
  }

  return (
    <section className="bg-stage">
      <div className="mx-auto flex min-h-[75vh] max-w-6xl items-center justify-center px-5 py-16">
        <div className="w-full max-w-md rounded-lg border border-border bg-card p-8 shadow-card">
          <div className="flex size-11 items-center justify-center rounded-full bg-primary/15 text-primary">
            <LockKeyhole className="size-5" />
          </div>
          <p className="eyebrow mt-6">Área do aluno</p>
          <h1 className="mt-2 text-3xl font-semibold">Entre para tocar</h1>

          {ready && session ? (
            <div className="mt-6 space-y-3">
              <p className="text-sm text-muted-foreground">Você já está conectado.</p>
              <Button asChild variant="hero" className="w-full">
                <Link to="/area-do-aluno">Ir para minhas aulas</Link>
              </Button>
            </div>
          ) : (
            <form onSubmit={entrar} className="mt-6 space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">E-mail</Label>
                <Input
                  id="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="senha">Senha</Label>
                <Input
                  id="senha"
                  type="password"
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
              {erro && <p className="text-sm text-destructive">{erro}</p>}
              <Button type="submit" variant="hero" className="w-full" disabled={enviando}>
                {enviando ? "Entrando..." : "Entrar"}
              </Button>
            </form>
          )}

          {!session && (
            <p className="mt-5 text-center text-sm text-muted-foreground">
              Ainda não é aluno?{" "}
              <Link to="/cadastro" className="font-semibold text-primary hover:underline">
                Criar minha conta
              </Link>
            </p>
          )}

          <div className="mt-8 space-y-2 border-t border-border pt-5 text-sm text-muted-foreground">
            <p>
              Esqueceu a senha ou precisa de ajuda?{" "}
              <a
                href={whatsappLink("Olá Anderson! Preciso de ajuda com meu acesso à Área do Aluno.")}
                target="_blank"
                rel="noreferrer"
                className="font-semibold text-primary hover:underline"
              >
                Fale com o professor
              </a>
            </p>
            {temProfessor === false && (
              <p>
                <Link to="/primeiro-acesso" className="text-foreground underline-offset-4 hover:underline">
                  Primeiro acesso do professor
                </Link>
              </p>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
