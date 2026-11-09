import { useMutation, useQueryClient, useSuspenseQuery } from "@tanstack/react-query";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Megaphone, Trash2 } from "lucide-react";
import { useState, type FormEvent } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { supabase } from "@/integrations/supabase/client";
import { recadosQuery } from "@/lib/area-aluno.queries";

export function RecadosPainel() {
  const queryClient = useQueryClient();
  const { data: recados } = useSuspenseQuery(recadosQuery);
  const [titulo, setTitulo] = useState("");
  const [texto, setTexto] = useState("");

  const atualizar = () => queryClient.invalidateQueries({ queryKey: recadosQuery.queryKey });

  const publicar = useMutation({
    mutationFn: async () => {
      const { error } = await supabase
        .from("announcements")
        .insert({ title: titulo.trim(), body: texto.trim() });
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success("Recado publicado.");
      setTitulo("");
      setTexto("");
      atualizar();
    },
    onError: () => toast.error("Não foi possível publicar."),
  });

  const apagar = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("announcements").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success("Recado apagado.");
      atualizar();
    },
    onError: () => toast.error("Não foi possível apagar."),
  });

  function enviar(e: FormEvent) {
    e.preventDefault();
    publicar.mutate();
  }

  return (
    <div className="grid gap-8 lg:grid-cols-[360px_1fr]">
      <form onSubmit={enviar} className="h-fit space-y-4 rounded-lg border border-border bg-card p-6">
        <h3 className="text-xl font-semibold">Novo recado</h3>
        <div className="space-y-2">
          <Label htmlFor="rec-titulo">Título</Label>
          <Input id="rec-titulo" required value={titulo} onChange={(e) => setTitulo(e.target.value)} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="rec-texto">Mensagem</Label>
          <Textarea id="rec-texto" rows={4} value={texto} onChange={(e) => setTexto(e.target.value)} />
        </div>
        <Button type="submit" variant="hero" className="w-full" disabled={publicar.isPending}>
          <Megaphone /> Publicar recado
        </Button>
      </form>

      <div>
        {recados.length === 0 ? (
          <p className="rounded-lg border border-dashed border-border p-8 text-center text-sm text-muted-foreground">
            Nenhum recado ainda.
          </p>
        ) : (
          <ul className="space-y-3">
            {recados.map((r) => (
              <li key={r.id} className="flex items-start gap-3 rounded-lg border border-border bg-card p-4">
                <div className="min-w-0 flex-1">
                  <p className="text-xs text-muted-foreground">
                    {format(new Date(r.created_at), "d 'de' MMMM", { locale: ptBR })}
                  </p>
                  <p className="mt-1 font-semibold">{r.title}</p>
                  {r.body && <p className="mt-1 whitespace-pre-line text-sm text-muted-foreground">{r.body}</p>}
                </div>
                <Button
                  size="sm"
                  variant="ghost"
                  className="text-destructive"
                  aria-label={`Apagar ${r.title}`}
                  onClick={() => {
                    if (window.confirm(`Apagar o recado "${r.title}"?`)) apagar.mutate(r.id);
                  }}
                >
                  <Trash2 />
                </Button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
