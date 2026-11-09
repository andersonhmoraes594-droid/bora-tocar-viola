import { useMutation, useQueryClient, useSuspenseQuery } from "@tanstack/react-query";
import { formatDistanceToNow } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Send, Trash2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { supabase } from "@/integrations/supabase/client";
import { duvidasQuery, type Duvida } from "@/lib/area-aluno.queries";

export function DuvidasPainel() {
  const { data: duvidas } = useSuspenseQuery(duvidasQuery);
  const [filtro, setFiltro] = useState<"pendentes" | "todas">("pendentes");
  const lista = filtro === "pendentes" ? duvidas.filter((d) => !d.answer) : duvidas;

  return (
    <div>
      <div className="flex gap-2">
        <Button
          size="sm"
          variant={filtro === "pendentes" ? "hero" : "stage"}
          onClick={() => setFiltro("pendentes")}
        >
          Sem resposta ({duvidas.filter((d) => !d.answer).length})
        </Button>
        <Button size="sm" variant={filtro === "todas" ? "hero" : "stage"} onClick={() => setFiltro("todas")}>
          Todas ({duvidas.length})
        </Button>
      </div>
      {lista.length === 0 ? (
        <p className="mt-6 rounded-lg border border-dashed border-border p-8 text-center text-sm text-muted-foreground">
          {filtro === "pendentes" ? "Todas as dúvidas foram respondidas. 🎸" : "Nenhuma dúvida ainda."}
        </p>
      ) : (
        <ul className="mt-6 space-y-4">
          {lista.map((d) => (
            <ResponderDuvida key={d.id} duvida={d} />
          ))}
        </ul>
      )}
    </div>
  );
}

function ResponderDuvida({ duvida }: { duvida: Duvida }) {
  const queryClient = useQueryClient();
  const [resposta, setResposta] = useState(duvida.answer ?? "");
  const atualizar = () => queryClient.invalidateQueries({ queryKey: duvidasQuery.queryKey });

  const salvar = useMutation({
    mutationFn: async () => {
      const { error } = await supabase
        .from("questions")
        .update({ answer: resposta.trim() || null })
        .eq("id", duvida.id);
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success("Resposta publicada.");
      atualizar();
    },
    onError: () => toast.error("Não foi possível salvar a resposta."),
  });

  const apagar = useMutation({
    mutationFn: async () => {
      const { error } = await supabase.from("questions").delete().eq("id", duvida.id);
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success("Dúvida apagada.");
      atualizar();
    },
    onError: () => toast.error("Não foi possível apagar."),
  });

  return (
    <li className="rounded-lg border border-border bg-card p-5">
      <div className="flex items-start justify-between gap-3">
        <p className="text-xs text-muted-foreground">
          <span className="font-semibold text-foreground">{duvida.author_name}</span> ·{" "}
          {formatDistanceToNow(new Date(duvida.created_at), { addSuffix: true, locale: ptBR })}
          {duvida.answer && (
            <Badge variant="outline" className="ml-2">
              Respondida
            </Badge>
          )}
        </p>
        <button
          type="button"
          className="text-muted-foreground hover:text-destructive"
          aria-label="Apagar dúvida"
          onClick={() => {
            if (window.confirm("Apagar esta dúvida?")) apagar.mutate();
          }}
        >
          <Trash2 className="size-4" />
        </button>
      </div>
      <p className="mt-2 whitespace-pre-line">{duvida.question}</p>
      <Textarea
        className="mt-4"
        rows={3}
        placeholder="Escreva sua resposta…"
        value={resposta}
        onChange={(e) => setResposta(e.target.value)}
        aria-label="Resposta"
      />
      <Button
        size="sm"
        variant="hero"
        className="mt-3"
        disabled={salvar.isPending || resposta.trim() === (duvida.answer ?? "")}
        onClick={() => salvar.mutate()}
      >
        <Send /> {duvida.answer ? "Atualizar resposta" : "Responder"}
      </Button>
    </li>
  );
}
