import { useMutation, useQueryClient, useSuspenseQuery } from "@tanstack/react-query";
import { FileText, Trash2, Upload } from "lucide-react";
import { useRef, useState, type FormEvent } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { materiaisQuery, type Material } from "@/lib/area-aluno.queries";

function nomeSeguro(nome: string) {
  return nome
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-zA-Z0-9._-]+/g, "-")
    .slice(-80);
}

export function MateriaisPainel() {
  const queryClient = useQueryClient();
  const { data: materiais } = useSuspenseQuery(materiaisQuery);
  const [titulo, setTitulo] = useState("");
  const [descricao, setDescricao] = useState("");
  const [arquivo, setArquivo] = useState<File | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const atualizar = () => queryClient.invalidateQueries({ queryKey: materiaisQuery.queryKey });

  const enviar = useMutation({
    mutationFn: async () => {
      if (!arquivo) throw new Error("Escolha um arquivo.");
      const caminho = `${crypto.randomUUID()}-${nomeSeguro(arquivo.name)}`;
      const { error: upErr } = await supabase.storage.from("materiais").upload(caminho, arquivo, {
        contentType: arquivo.type || "application/pdf",
      });
      if (upErr) throw upErr;
      const { error } = await supabase.from("materials").insert({
        title: titulo.trim(),
        description: descricao.trim(),
        file_path: caminho,
        file_name: arquivo.name,
      });
      if (error) {
        await supabase.storage.from("materiais").remove([caminho]);
        throw error;
      }
    },
    onSuccess: () => {
      toast.success("Material publicado.");
      setTitulo("");
      setDescricao("");
      setArquivo(null);
      if (inputRef.current) inputRef.current.value = "";
      atualizar();
    },
    onError: () => toast.error("Não foi possível enviar o arquivo."),
  });

  const apagar = useMutation({
    mutationFn: async (m: Material) => {
      const { error } = await supabase.from("materials").delete().eq("id", m.id);
      if (error) throw error;
      await supabase.storage.from("materiais").remove([m.file_path]);
    },
    onSuccess: () => {
      toast.success("Material apagado.");
      atualizar();
    },
    onError: () => toast.error("Não foi possível apagar."),
  });

  function submeter(e: FormEvent) {
    e.preventDefault();
    enviar.mutate();
  }

  return (
    <div className="grid gap-8 lg:grid-cols-[360px_1fr]">
      <form onSubmit={submeter} className="h-fit space-y-4 rounded-lg border border-border bg-card p-6">
        <h3 className="text-xl font-semibold">Novo material</h3>
        <div className="space-y-2">
          <Label htmlFor="mat-titulo">Título</Label>
          <Input id="mat-titulo" required value={titulo} onChange={(e) => setTitulo(e.target.value)} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="mat-desc">Descrição (opcional)</Label>
          <Input id="mat-desc" value={descricao} onChange={(e) => setDescricao(e.target.value)} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="mat-arquivo">Arquivo (PDF)</Label>
          <Input
            id="mat-arquivo"
            ref={inputRef}
            type="file"
            accept="application/pdf,image/*"
            required
            onChange={(e) => setArquivo(e.target.files?.[0] ?? null)}
          />
        </div>
        <Button type="submit" variant="hero" className="w-full" disabled={enviar.isPending}>
          <Upload /> {enviar.isPending ? "Enviando..." : "Publicar material"}
        </Button>
      </form>

      <div>
        {materiais.length === 0 ? (
          <p className="rounded-lg border border-dashed border-border p-8 text-center text-sm text-muted-foreground">
            Nenhum material publicado ainda.
          </p>
        ) : (
          <ul className="divide-y divide-border overflow-hidden rounded-lg border border-border bg-card">
            {materiais.map((m) => (
              <li key={m.id} className="flex items-center gap-3 p-4">
                <FileText className="size-5 shrink-0 text-primary" />
                <div className="min-w-0 flex-1">
                  <p className="font-semibold">{m.title}</p>
                  <p className="truncate text-xs text-muted-foreground">{m.file_name}</p>
                </div>
                <Button
                  size="sm"
                  variant="ghost"
                  className="text-destructive"
                  aria-label={`Apagar ${m.title}`}
                  onClick={() => {
                    if (window.confirm(`Apagar "${m.title}"?`)) apagar.mutate(m);
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
