import { useMutation, useQueryClient, useSuspenseQuery } from "@tanstack/react-query";
import { Pencil, Plus, Trash2, X } from "lucide-react";
import { useState, type FormEvent } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { supabase } from "@/integrations/supabase/client";
import { aulasQuery, type Aula } from "@/lib/area-aluno.queries";
import { ETAPAS } from "@/lib/etapas";

const VAZIO = { stage: 1, title: "", video_url: "", description: "", position: 0 };

export function AulasPainel() {
  const queryClient = useQueryClient();
  const { data: aulas } = useSuspenseQuery(aulasQuery);
  const [form, setForm] = useState(VAZIO);
  const [editando, setEditando] = useState<string | null>(null);

  const atualizar = () => queryClient.invalidateQueries({ queryKey: aulasQuery.queryKey });

  const salvar = useMutation({
    mutationFn: async () => {
      const dados = { ...form, title: form.title.trim(), video_url: form.video_url.trim() };
      const { error } = editando
        ? await supabase.from("lessons").update(dados).eq("id", editando)
        : await supabase.from("lessons").insert(dados);
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success(editando ? "Aula atualizada." : "Aula publicada.");
      setForm(VAZIO);
      setEditando(null);
      atualizar();
    },
    onError: () => toast.error("Não foi possível salvar a aula."),
  });

  const apagar = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("lessons").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success("Aula apagada.");
      atualizar();
    },
    onError: () => toast.error("Não foi possível apagar."),
  });

  function editar(a: Aula) {
    setEditando(a.id);
    setForm({
      stage: a.stage,
      title: a.title,
      video_url: a.video_url,
      description: a.description,
      position: a.position,
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function enviar(e: FormEvent) {
    e.preventDefault();
    salvar.mutate();
  }

  return (
    <div className="grid gap-8 lg:grid-cols-[360px_1fr]">
      <form onSubmit={enviar} className="h-fit space-y-4 rounded-lg border border-border bg-card p-6">
        <h3 className="text-xl font-semibold">{editando ? "Editar aula" : "Nova aula"}</h3>
        <div className="space-y-2">
          <Label htmlFor="aula-etapa">Etapa</Label>
          <select
            id="aula-etapa"
            value={form.stage}
            onChange={(e) => setForm({ ...form, stage: Number(e.target.value) })}
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 text-sm"
          >
            {ETAPAS.map((et) => (
              <option key={et.numero} value={et.numero}>
                {et.n} · {et.titulo}
              </option>
            ))}
          </select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="aula-titulo">Título</Label>
          <Input
            id="aula-titulo"
            required
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="aula-video">Link do vídeo</Label>
          <Input
            id="aula-video"
            type="url"
            required
            placeholder="YouTube, Vimeo ou Google Drive"
            value={form.video_url}
            onChange={(e) => setForm({ ...form, video_url: e.target.value })}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="aula-desc">Descrição</Label>
          <Textarea
            id="aula-desc"
            rows={3}
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="aula-ordem">Ordem dentro da etapa</Label>
          <Input
            id="aula-ordem"
            type="number"
            min={0}
            value={form.position}
            onChange={(e) => setForm({ ...form, position: Number(e.target.value) || 0 })}
          />
        </div>
        <div className="flex gap-2">
          <Button type="submit" variant="hero" className="flex-1" disabled={salvar.isPending}>
            <Plus /> {editando ? "Salvar" : "Publicar aula"}
          </Button>
          {editando && (
            <Button
              type="button"
              variant="ghost"
              onClick={() => {
                setEditando(null);
                setForm(VAZIO);
              }}
            >
              <X /> Cancelar
            </Button>
          )}
        </div>
      </form>

      <div className="space-y-6">
        {aulas.length === 0 && (
          <p className="rounded-lg border border-dashed border-border p-8 text-center text-sm text-muted-foreground">
            Nenhuma aula publicada ainda.
          </p>
        )}
        {ETAPAS.map((et) => {
          const daEtapa = aulas.filter((a) => a.stage === et.numero);
          if (daEtapa.length === 0) return null;
          return (
            <div key={et.numero}>
              <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
                {et.n} · {et.titulo}
              </p>
              <ul className="mt-2 divide-y divide-border overflow-hidden rounded-lg border border-border bg-card">
                {daEtapa.map((a) => (
                  <li key={a.id} className="flex items-center gap-3 p-4">
                    <div className="min-w-0 flex-1">
                      <p className="font-semibold">{a.title}</p>
                      <p className="truncate text-xs text-muted-foreground">{a.video_url}</p>
                    </div>
                    <Button size="sm" variant="ghost" onClick={() => editar(a)} aria-label={`Editar ${a.title}`}>
                      <Pencil />
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      className="text-destructive"
                      aria-label={`Apagar ${a.title}`}
                      onClick={() => {
                        if (window.confirm(`Apagar a aula "${a.title}"?`)) apagar.mutate(a.id);
                      }}
                    >
                      <Trash2 />
                    </Button>
                  </li>
                ))}
              </ul>
            </div>
          );
        })}
      </div>
    </div>
  );
}
