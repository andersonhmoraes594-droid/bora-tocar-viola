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

// Garante que a conta alvo não é a do professor.
async function garantirQueNaoEhProfessor(userId: string) {
  const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
  const { data } = await supabaseAdmin.from("user_roles").select("role").eq("user_id", userId);
  if ((data ?? []).some((r) => r.role === "admin")) {
    throw new Error("Essa conta não é de aluno.");
  }
  return supabaseAdmin;
}

export const listarAlunos = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    await exigirProfessor(context);
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");

    const { data: roles, error } = await supabaseAdmin.from("user_roles").select("user_id, role");
    if (error) throw new Error("Não foi possível carregar os alunos.");
    const ativos = new Set(roles.filter((r) => r.role === "aluno").map((r) => r.user_id));
    const professores = new Set(roles.filter((r) => r.role === "admin").map((r) => r.user_id));

    const { data: lista, error: usersError } = await supabaseAdmin.auth.admin.listUsers({
      perPage: 1000,
    });
    if (usersError) throw new Error("Não foi possível carregar os alunos.");

    const alunos = lista.users.filter((u) => !professores.has(u.id));
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
        nome: typeof u.user_metadata?.["nome"] === "string" ? (u.user_metadata["nome"] as string) : "",
        liberado: ativos.has(u.id),
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
      .object({
        nome: z.string().trim().max(80).optional(),
        email: z.string().trim().toLowerCase().email("E-mail inválido."),
        password: senhaSchema,
      })
      .parse(input),
  )
  .handler(async ({ data, context }) => {
    await exigirProfessor(context);
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");

    const { data: criado, error } = await supabaseAdmin.auth.admin.createUser({
      email: data.email,
      password: data.password,
      email_confirm: true,
      user_metadata: data.nome ? { nome: data.nome } : undefined,
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
    const supabaseAdmin = await garantirQueNaoEhProfessor(data.userId);
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
    const supabaseAdmin = await garantirQueNaoEhProfessor(data.userId);
    await supabaseAdmin.from("lesson_progress").delete().eq("user_id", data.userId);
    const { error } = await supabaseAdmin.auth.admin.deleteUser(data.userId);
    if (error) throw new Error("Não foi possível remover o aluno.");
    return { ok: true };
  });

// Professor libera ou bloqueia o acesso de um aluno manualmente.
export const definirAcessoAluno = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: unknown) =>
    z.object({ userId: z.string().uuid(), liberado: z.boolean() }).parse(input),
  )
  .handler(async ({ data, context }) => {
    await exigirProfessor(context);
    const supabaseAdmin = await garantirQueNaoEhProfessor(data.userId);
    const { error } = data.liberado
      ? await supabaseAdmin
          .from("user_roles")
          .upsert({ user_id: data.userId, role: "aluno" }, { onConflict: "user_id,role", ignoreDuplicates: true })
      : await supabaseAdmin.from("user_roles").delete().eq("user_id", data.userId).eq("role", "aluno");
    if (error) throw new Error("Não foi possível alterar o acesso.");
    return { ok: true };
  });

// Cadastro aberto: o aluno cria a conta com e-mail e senha. A conta nasce SEM acesso
// às aulas; o acesso só é liberado depois do pagamento (ou pelo professor).
export const cadastrarAluno = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) =>
    z
      .object({
        nome: z.string().trim().min(2, "Digite seu nome.").max(80, "Nome longo demais."),
        email: z.string().trim().toLowerCase().email("E-mail inválido."),
        password: senhaSchema,
      })
      .parse(input),
  )
  .handler(async ({ data }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data: criado, error } = await supabaseAdmin.auth.admin.createUser({
      email: data.email,
      password: data.password,
      email_confirm: true,
      user_metadata: { nome: data.nome },
    });
    if (error || !criado.user) throw new Error(traduzirErro(error?.message ?? ""));
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
