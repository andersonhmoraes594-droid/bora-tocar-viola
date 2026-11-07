import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";

import { PostMeta } from "@/components/site/PostMeta";
import { POSTS } from "@/lib/blog";

export const Route = createFileRoute("/blog/")({
  head: () => ({
    meta: [
      { title: "Blog Bora Tocar — Dicas e benefícios de tocar violão" },
      {
        name: "description",
        content:
          "Artigos do professor Anderson Moraes sobre violão para ansiedade, música no dia a dia, dicas para iniciantes e os primeiros acordes.",
      },
      { property: "og:title", content: "Blog Bora Tocar — Dicas de violão" },
      {
        property: "og:description",
        content: "Benefícios de tocar violão, dicas para iniciantes e aulas rápidas de acordes.",
      },
    ],
  }),
  component: BlogPage,
});

function BlogPage() {
  const destaque = POSTS[0]!;
  const outros = POSTS.slice(1);

  return (
    <div className="mx-auto max-w-6xl px-5 py-20 md:py-28">
      <p className="eyebrow">Blog Bora Tocar</p>
      <h1 className="mt-5 max-w-3xl text-5xl font-semibold leading-[1.05] md:text-6xl">
        Histórias, dicas e <em className="text-gradient-amber">o poder do violão.</em>
      </h1>
      <p className="mt-6 max-w-xl text-lg text-muted-foreground">
        Conteúdo para quem quer começar a tocar, evoluir no instrumento e levar mais música para o
        dia a dia.
      </p>

      {/* Destaque */}
      <Link
        to="/blog/$slug"
        params={{ slug: destaque.slug }}
        className="group mt-16 grid overflow-hidden rounded-lg border border-border bg-card md:grid-cols-[1.3fr_1fr]"
      >
        <div className="overflow-hidden">
          <img
            src={destaque.imagem}
            alt={destaque.imagemAlt}
            width={1280}
            height={832}
            className="aspect-[16/10] h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
          />
        </div>
        <div className="flex flex-col justify-center p-8 md:p-10">
          <PostMeta categoria={destaque.categoria} data={destaque.data} leitura={destaque.leitura} />
          <h2 className="mt-4 text-3xl font-semibold leading-tight md:text-4xl">{destaque.titulo}</h2>
          <p className="mt-4 text-muted-foreground">{destaque.resumo}</p>
          <span className="mt-6 inline-flex items-center gap-2 font-semibold text-primary">
            Ler artigo <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
          </span>
        </div>
      </Link>

      {/* Demais posts */}
      <div className="mt-10 grid gap-8 md:grid-cols-3">
        {outros.map((post) => (
          <Link
            key={post.slug}
            to="/blog/$slug"
            params={{ slug: post.slug }}
            className="group flex flex-col overflow-hidden rounded-lg border border-border bg-card"
          >
            <div className="overflow-hidden">
              <img
                src={post.imagem}
                alt={post.imagemAlt}
                loading="lazy"
                width={1280}
                height={832}
                className="aspect-[16/10] w-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
            </div>
            <div className="flex flex-1 flex-col p-6">
              <PostMeta categoria={post.categoria} data={post.data} leitura={post.leitura} />
              <h2 className="mt-3 text-2xl font-semibold leading-snug">{post.titulo}</h2>
              <p className="mt-3 flex-1 text-sm text-muted-foreground">{post.resumo}</p>
              <span className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-primary">
                Ler artigo <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
              </span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
