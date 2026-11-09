import { useQueryClient } from "@tanstack/react-query";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { Guitar } from "lucide-react";
import { useState, type FormEvent } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { destinoAposEntrar } from "@/lib/acesso";
import { cadastrarAluno } from "@/lib/alunos.functions";
import { minhaContaQuery } from "@/lib/area-aluno.queries";
import { useAuth } from "@/lib/auth";

export const Route = createFileRoute("/cadastro")({
  head: () => ({
    meta: [
      { title: "Criar conta de aluno | Bora Tocar" },
      {
        name: "description",
        content: "Crie sua conta com e-mail e senha e comece o curso de violão online Bora Tocar.",
      },
      { property: "og:title", content: "Crie sua conta — Curso de violão Bora Tocar" },
      {
        property: "og:description",
        content: "Cadastre-se e comece a aprender violão com o professor Anderson Moraes.",
      },
    ],
  }),
  component: CadastroPage,
});

function CadastroPage() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { session, ready } = useAuth();
  const cadastrar = useServerFn(cadastrarAluno);

  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [confirma, setConfirma] = useState("");
  const [erro, setErro] = useState<string | null>(null);
  const [enviando, setEnviando] = useState(false);

  async function enviar(e: FormEvent) {
    e.preventDefault();
    setErro(null);
    if (senha !== confirma) {
      setErro("As senhas não são iguais.");
      return;
    }
    setEnviando(true);
    try {
      await cadastrar({ data: { nome, email, password: senha } });
      const { error } = await supabase.auth.signInWithPassword({
        email: email.trim().toLowerCase(),
        password: senha,
      });
      if (error) throw new Error("Conta criada! Entre com seu e-mail e senha.");
      const conta = await queryClient.fetchQuery(minhaContaQuery);
      navigate({ to: destinoAposEntrar(conta) });
    } catch (err) {
      setErro(err instanceof Error ? err.message : "Não foi possível concluir. Tente de novo.");
    } finally {
      setEnviando(false);
    }
  }

  return (
    <section className="bg-stage">
      <div className="mx-auto flex min-h-[75vh] max-w-6xl items-center justify-center px-5 py-16">
        <div className="w-full max-w-md rounded-lg border border-border bg-card p-8 shadow-card">
          <div className="flex size-11 items-center justify-center rounded-full bg-primary/15 text-primary">
            <Guitar className="size-5" />
          </div>
          <p className="eyebrow mt-6">Passo 1 de 2 · Sua conta</p>
          <h1 className="mt-2 text-3xl font-semibold">Crie sua conta de aluno</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Depois você escolhe o plano e cadastra o cartão. As aulas são liberadas assim que o
            pagamento for confirmado.
          </p>

          {ready && session ? (
            <div className="mt-6 space-y-3">
              <p className="text-sm text-muted-foreground">Você já está conectado.</p>
              <Button asChild variant="hero" className="w-full">
                <Link to="/area-do-aluno">Continuar</Link>
              </Button>
            </div>
          ) : (
            <form onSubmit={enviar} className="mt-6 space-y-4">
              <div className="space-y-2">
                <Label htmlFor="nome">Seu nome</Label>
                <Input
                  id="nome"
                  autoComplete="name"
                  required
                  value={nome}
                  onChange={(e) => setNome(e.target.value)}
                />
              </div>
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
                  autoComplete="new-password"
                  minLength={6}
                  required
                  value={senha}
                  onChange={(e) => setSenha(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirma">Repita a senha</Label>
                <Input
                  id="confirma"
                  type="password"
                  autoComplete="new-password"
                  minLength={6}
                  required
                  value={confirma}
                  onChange={(e) => setConfirma(e.target.value)}
                />
              </div>
              {erro && <p className="text-sm text-destructive">{erro}</p>}
              <Button type="submit" variant="hero" className="w-full" disabled={enviando}>
                {enviando ? "Criando conta..." : "Criar conta e continuar"}
              </Button>
            </form>
          )}

          <p className="mt-6 text-center text-sm text-muted-foreground">
            Já tem conta?{" "}
            <Link to="/auth" className="font-semibold text-primary hover:underline">
              Entrar
            </Link>
          </p>
        </div>
      </div>
    </section>
  );
}
