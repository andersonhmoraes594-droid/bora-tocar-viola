import type { SupabaseClient } from "@supabase/supabase-js";
import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import type { Database } from "@/integrations/supabase/types";

const senhaSchema = z
  .string()
  .min(6, "A senha precisa ter pelo menos 6 caracteres.")
  .max(72, "Senha longa demais.");

async function exigirProfessor(ctx: { supabase: SupabaseClient<Database>; userId: string }) {
  const { data, error } = await ctx.supabase.rpc("has_role", {
    _user_id: ctx.userId,
    _role: "admin",
  });
  if (error || !data) throw new Error("Acesso restrito ao professor.");
}

function traduzirErro(message: string) {
  const m = message.toLowerCase();
  if (m.includes("already") && m.includes("registered")) return "Já existe uma conta com esse e-mail.";
  if (m.includes("pwned") || m.includes("weak") || m.includes("known to be"))
    return "Essa senha é muito fácil de adivinhar. Escolha outra.";
  if (m.includes("password")) return "Senha inválida. Use pelo menos 6 caracteres.";
  if (m.includes("email")) return "E-mail inválido.";
  return "Não foi possível concluir. Tente de novo.";
}

async function garantirQueEhAluno(userId: string) {
  const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
  const { data } = await supabaseAdmin.from("user_roles").select("role").eq("user_id", userId);
  const roles = (data ?? []).map((r) => r.role);
  if (!roles.includes("aluno") || roles.includes("admin")) {
    throw new Error("Essa conta não é de aluno.");
  }
  return supabaseAdmin;
}

export const listarAlunos = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    await exigirProfessor(context);
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");

    const { data: roles, error } = await supabaseAdmin
      .from("user_roles")
      .select("user_id")
      .eq("role", "aluno");
    if (error) throw new Error("Não foi possível carregar os alunos.");
    const ids = new Set(roles.map((r) => r.user_id));

    const { data: lista, error: usersError } = await supabaseAdmin.auth.admin.listUsers({
      perPage: 1000,
    });
    if (usersError) throw new Error("Não foi possível carregar os alunos.");

    const alunos = lista.users.filter((u) => ids.has(u.id));
    const contagens = await Promise.all(
      alunos.map(async (u) => {
        const { count } = await supabaseAdmin
          .from("lesson_progress")
          .select("lesson_id", { count: "exact", head: true })
          .eq("user_id", u.id);
        return count ?? 0;
      }),
    );

    return alunos
      .map((u, i) => ({
        id: u.id,
        email: u.email ?? "",
        criadoEm: u.created_at,
        ultimoAcesso: u.last_sign_in_at ?? null,
        concluidas: contagens[i] ?? 0,
      }))
      .sort((a, b) => b.criadoEm.localeCompare(a.criadoEm));
  });

export const criarAluno = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: unknown) =>
    z
      .object({ email: z.string().trim().toLowerCase().email("E-mail inválido."), password: senhaSchema })
      .parse(input),
  )
  .handler(async ({ data, context }) => {
    await exigirProfessor(context);
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");

    const { data: criado, error } = await supabaseAdmin.auth.admin.createUser({
      email: data.email,
      password: data.password,
      email_confirm: true,
    });
    if (error || !criado.user) throw new Error(traduzirErro(error?.message ?? ""));

    const { error: roleError } = await supabaseAdmin
      .from("user_roles")
      .insert({ user_id: criado.user.id, role: "aluno" });
    if (roleError) {
      await supabaseAdmin.auth.admin.deleteUser(criado.user.id);
      throw new Error("Não foi possível liberar o acesso. Tente de novo.");
    }
    return { id: criado.user.id, email: data.email };
  });

export const trocarSenhaAluno = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: unknown) =>
    z.object({ userId: z.string().uuid(), password: senhaSchema }).parse(input),
  )
  .handler(async ({ data, context }) => {
    await exigirProfessor(context);
    const supabaseAdmin = await garantirQueEhAluno(data.userId);
    const { error } = await supabaseAdmin.auth.admin.updateUserById(data.userId, {
      password: data.password,
    });
    if (error) throw new Error(traduzirErro(error.message));
    return { ok: true };
  });

export const removerAluno = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: unknown) => z.object({ userId: z.string().uuid() }).parse(input))
  .handler(async ({ data, context }) => {
    await exigirProfessor(context);
    const supabaseAdmin = await garantirQueEhAluno(data.userId);
    await supabaseAdmin.from("lesson_progress").delete().eq("user_id", data.userId);
    const { error } = await supabaseAdmin.auth.admin.deleteUser(data.userId);
    if (error) throw new Error("Não foi possível remover o aluno.");
    return { ok: true };
  });

// Primeiro acesso: só funciona enquanto ainda não existe nenhum professor cadastrado.
export const professorJaCadastrado = createServerFn({ method: "GET" }).handler(async () => {
  const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
  const { count } = await supabaseAdmin
    .from("user_roles")
    .select("id", { count: "exact", head: true })
    .eq("role", "admin");
  return (count ?? 0) > 0;
});

export const cadastrarProfessor = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) =>
    z
      .object({ email: z.string().trim().toLowerCase().email("E-mail inválido."), password: senhaSchema })
      .parse(input),
  )
  .handler(async ({ data }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { count } = await supabaseAdmin
      .from("user_roles")
      .select("id", { count: "exact", head: true })
      .eq("role", "admin");
    if ((count ?? 0) > 0) throw new Error("O professor já foi cadastrado.");

    const { data: criado, error } = await supabaseAdmin.auth.admin.createUser({
      email: data.email,
      password: data.password,
      email_confirm: true,
    });
    if (error || !criado.user) throw new Error(traduzirErro(error?.message ?? ""));

    const { error: roleError } = await supabaseAdmin
      .from("user_roles")
      .insert({ user_id: criado.user.id, role: "admin" });
    if (roleError) {
      await supabaseAdmin.auth.admin.deleteUser(criado.user.id);
      throw new Error("Não foi possível concluir. Tente de novo.");
    }
    return { ok: true };
  });
