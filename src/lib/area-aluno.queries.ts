import { queryOptions } from "@tanstack/react-query";

import { supabase } from "@/integrations/supabase/client";
import type { Database } from "@/integrations/supabase/types";

export type Aula = Database["public"]["Tables"]["lessons"]["Row"];
export type Material = Database["public"]["Tables"]["materials"]["Row"];
export type Recado = Database["public"]["Tables"]["announcements"]["Row"];

export const minhaContaQuery = queryOptions({
  queryKey: ["minha-conta"],
  queryFn: async () => {
    const { data: auth } = await supabase.auth.getUser();
    const user = auth.user;
    if (!user) return null;
    const { data, error } = await supabase.from("user_roles").select("role").eq("user_id", user.id);
    if (error) throw error;
    const roles = data.map((r) => r.role);
    const nome = user.user_metadata?.["nome"];
    return {
      userId: user.id,
      email: user.email ?? "",
      nome: typeof nome === "string" ? nome : "",
      isAdmin: roles.includes("admin"),
      isAluno: roles.includes("aluno"),
    };
  },
});

export const aulasQuery = queryOptions({
  queryKey: ["aulas"],
  queryFn: async () => {
    const { data, error } = await supabase
      .from("lessons")
      .select("*")
      .order("stage")
      .order("position")
      .order("created_at");
    if (error) throw error;
    return data;
  },
});

export const materiaisQuery = queryOptions({
  queryKey: ["materiais"],
  queryFn: async () => {
    const { data, error } = await supabase
      .from("materials")
      .select("*")
      .order("created_at", { ascending: false });
    if (error) throw error;
    return data;
  },
});

export const recadosQuery = queryOptions({
  queryKey: ["recados"],
  queryFn: async () => {
    const { data, error } = await supabase
      .from("announcements")
      .select("*")
      .order("created_at", { ascending: false });
    if (error) throw error;
    return data;
  },
});

export type Duvida = Database["public"]["Tables"]["questions"]["Row"];

export const duvidasQuery = queryOptions({
  queryKey: ["duvidas"],
  queryFn: async () => {
    const { data, error } = await supabase
      .from("questions")
      .select("*")
      .order("created_at", { ascending: false });
    if (error) throw error;
    return data;
  },
});

export const progressoQuery = queryOptions({
  queryKey: ["progresso"],
  queryFn: async () => {
    const { data: auth } = await supabase.auth.getUser();
    if (!auth.user) return [] as string[];
    const { data, error } = await supabase
      .from("lesson_progress")
      .select("lesson_id")
      .eq("user_id", auth.user.id);
    if (error) throw error;
    return data.map((p) => p.lesson_id);
  },
});

export async function baixarMaterial(material: Material) {
  const { data, error } = await supabase.storage
    .from("materiais")
    .createSignedUrl(material.file_path, 60 * 10, { download: material.file_name || true });
  if (error) throw error;
  window.location.assign(data.signedUrl);
}
