import { useQuery, useQueryClient } from "@tanstack/react-query";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { KeyRound } from "lucide-react";
import { useState, type FormEvent } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { cadastrarProfessor, professorJaCadastrado } from "@/lib/alunos.functions";

export const Route = createFileRoute("/primeiro-acesso")({
  head: () => ({
    meta: [
      { title: "Primeiro acesso do professor | Bora Tocar" },
      { name: "description", content: "Crie a conta do professor para gerenciar a Área do Aluno." },
      { name: "robots", content: "noindex" },
      { property: "og:title", content: "Primeiro acesso do professor — Bora Tocar" },
      { property: "og:description", content: "Configuração inicial da Área do Aluno." },
    ],
  }),
  component: PrimeiroAcessoPage,
});

function PrimeiroAcessoPage() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const checar = useServerFn(professorJaCadastrado);
  const cadastrar = useServerFn(cadastrarProfessor);
  const { data: jaCadastrado, isLoading } = useQuery({
    queryKey: ["professor-cadastrado"],
    queryFn: () => checar(),
  });

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
      await cadastrar({ data: { email, password: senha } });
      await supabase.auth.signInWithPassword({ email: email.trim().toLowerCase(), password: senha });
      queryClient.setQueryData(["professor-cadastrado"], true);
      navigate({ to: "/professor" });
    } catch (err) {
      setErro(err instanceof Error ? err.message : "Não foi possível concluir.");
    } finally {
      setEnviando(false);
    }
  }

  return (
    <section className="bg-stage">
      <div className="mx-auto flex min-h-[75vh] max-w-6xl items-center justify-center px-5 py-16">
        <div className="w-full max-w-md rounded-lg border border-border bg-card p-8 shadow-card">
          <div className="flex size-11 items-center justify-center rounded-full bg-primary/15 text-primary">
            <KeyRound className="size-5" />
          </div>
          <p className="eyebrow mt-6">Só para o professor</p>
          <h1 className="mt-2 text-3xl font-semibold">Crie sua conta de professor</h1>

          {isLoading ? (
            <p className="mt-6 text-sm text-muted-foreground">Carregando...</p>
          ) : jaCadastrado ? (
            <div className="mt-6 space-y-4">
              <p className="text-sm text-muted-foreground">
                A conta do professor já foi criada. Entre com seu e-mail e senha.
              </p>
              <Button asChild variant="hero" className="w-full">
                <Link to="/auth">Entrar</Link>
              </Button>
            </div>
          ) : (
            <form onSubmit={enviar} className="mt-6 space-y-4">
              <p className="text-sm text-muted-foreground">
                Esta página só funciona uma vez. Depois de criada, a sua conta é a única que pode
                cadastrar alunos e publicar aulas.
              </p>
              <div className="space-y-2">
                <Label htmlFor="email">Seu e-mail</Label>
                <Input id="email" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="senha">Senha (mínimo 6 caracteres)</Label>
                <Input
                  id="senha"
                  type="password"
                  autoComplete="new-password"
                  required
                  minLength={6}
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
                  required
                  value={confirma}
                  onChange={(e) => setConfirma(e.target.value)}
                />
              </div>
              {erro && <p className="text-sm text-destructive">{erro}</p>}
              <Button type="submit" variant="hero" className="w-full" disabled={enviando}>
                {enviando ? "Criando..." : "Criar conta de professor"}
              </Button>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}
