import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { KeyRound, Lock, Trash2, Unlock, UserPlus } from "lucide-react";
import { useState, type FormEvent } from "react";
import { toast } from "sonner";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  criarAluno,
  definirAcessoAluno,
  listarAlunos,
  removerAluno,
  trocarSenhaAluno,
} from "@/lib/alunos.functions";

const CHAVE = ["professor", "alunos"];

function msg(err: unknown) {
  return err instanceof Error ? err.message : "Não foi possível concluir.";
}

export function AlunosPainel() {
  const queryClient = useQueryClient();
  const listar = useServerFn(listarAlunos);
  const criar = useServerFn(criarAluno);
  const trocar = useServerFn(trocarSenhaAluno);
  const remover = useServerFn(removerAluno);
  const definirAcesso = useServerFn(definirAcessoAluno);

  const { data: alunos, isLoading, error } = useQuery({ queryKey: CHAVE, queryFn: () => listar() });
  const atualizar = () => queryClient.invalidateQueries({ queryKey: CHAVE });

  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");

  const criarMut = useMutation({
    mutationFn: () => criar({ data: { nome, email, password: senha } }),
    onSuccess: () => {
      toast.success("Aluno cadastrado com acesso liberado.");
      setNome("");
      setEmail("");
      setSenha("");
      atualizar();
    },
    onError: (e) => toast.error(msg(e)),
  });

  const acessoMut = useMutation({
    mutationFn: (v: { userId: string; liberado: boolean }) => definirAcesso({ data: v }),
    onSuccess: (_, v) => {
      toast.success(v.liberado ? "Acesso liberado." : "Acesso bloqueado.");
      atualizar();
    },
    onError: (e) => toast.error(msg(e)),
  });

  async function trocarSenha(userId: string, email: string) {
    const nova = window.prompt(`Nova senha para ${email} (mínimo 6 caracteres):`);
    if (!nova) return;
    try {
      await trocar({ data: { userId, password: nova } });
      toast.success("Senha alterada. Passe a nova senha para o aluno.");
    } catch (e) {
      toast.error(msg(e));
    }
  }

  async function apagar(userId: string, email: string) {
    if (!window.confirm(`Remover a conta de ${email}? Isso não pode ser desfeito.`)) return;
    try {
      await remover({ data: { userId } });
      toast.success("Aluno removido.");
      atualizar();
    } catch (e) {
      toast.error(msg(e));
    }
  }

  function enviar(e: FormEvent) {
    e.preventDefault();
    criarMut.mutate();
  }

  const aguardando = alunos?.filter((a) => !a.liberado).length ?? 0;

  return (
    <div className="grid gap-8 lg:grid-cols-[320px_1fr]">
      <form onSubmit={enviar} className="h-fit space-y-4 rounded-lg border border-border bg-card p-6">
        <h3 className="text-xl font-semibold">Cadastrar aluno</h3>
        <p className="text-sm text-muted-foreground">
          Use para quem pagou por fora (Pix, dinheiro). A conta já nasce com acesso liberado.
        </p>
        <div className="space-y-2">
          <Label htmlFor="al-nome">Nome</Label>
          <Input id="al-nome" value={nome} onChange={(e) => setNome(e.target.value)} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="al-email">E-mail</Label>
          <Input id="al-email" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="al-senha">Senha</Label>
          <Input
            id="al-senha"
            type="text"
            minLength={6}
            required
            value={senha}
            onChange={(e) => setSenha(e.target.value)}
          />
        </div>
        <Button type="submit" variant="hero" className="w-full" disabled={criarMut.isPending}>
          <UserPlus /> {criarMut.isPending ? "Cadastrando..." : "Cadastrar aluno"}
        </Button>
      </form>

      <div>
        <div className="flex flex-wrap items-baseline justify-between gap-2">
          <h3 className="text-xl font-semibold">Alunos ({alunos?.length ?? 0})</h3>
          {aguardando > 0 && (
            <p className="text-sm text-muted-foreground">{aguardando} aguardando pagamento</p>
          )}
        </div>
        {isLoading ? (
          <p className="mt-4 text-sm text-muted-foreground">Carregando…</p>
        ) : error ? (
          <p className="mt-4 text-sm text-destructive">{msg(error)}</p>
        ) : alunos && alunos.length > 0 ? (
          <ul className="mt-4 divide-y divide-border overflow-hidden rounded-lg border border-border bg-card">
            {alunos.map((a) => (
              <li key={a.id} className="flex flex-wrap items-center gap-3 p-4">
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="font-semibold">{a.nome || a.email}</p>
                    {a.liberado ? (
                      <Badge>Acesso liberado</Badge>
                    ) : (
                      <Badge variant="outline">Aguardando pagamento</Badge>
                    )}
                  </div>
                  {a.nome && <p className="text-sm text-muted-foreground">{a.email}</p>}
                  <p className="mt-1 text-xs text-muted-foreground">
                    Desde {format(new Date(a.criadoEm), "dd/MM/yyyy", { locale: ptBR })} · {a.concluidas}{" "}
                    aulas concluídas
                  </p>
                </div>
                <div className="flex flex-wrap gap-2">
                  <Button
                    size="sm"
                    variant={a.liberado ? "ghost" : "stage"}
                    disabled={acessoMut.isPending}
                    onClick={() => acessoMut.mutate({ userId: a.id, liberado: !a.liberado })}
                  >
                    {a.liberado ? (
                      <>
                        <Lock /> Bloquear
                      </>
                    ) : (
                      <>
                        <Unlock /> Liberar acesso
                      </>
                    )}
                  </Button>
                  <Button size="sm" variant="ghost" onClick={() => trocarSenha(a.id, a.email)}>
                    <KeyRound /> Senha
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    className="text-destructive"
                    onClick={() => apagar(a.id, a.email)}
                    aria-label={`Remover ${a.email}`}
                  >
                    <Trash2 />
                  </Button>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <p className="mt-4 rounded-lg border border-dashed border-border p-8 text-center text-sm text-muted-foreground">
            Nenhum aluno ainda.
          </p>
        )}
      </div>
    </div>
  );
}
