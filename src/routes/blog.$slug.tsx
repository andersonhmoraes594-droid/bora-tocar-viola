import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { ArrowLeft, Lightbulb } from "lucide-react";

import { Button } from "@/components/ui/button";
import { ChordDiagram } from "@/components/site/ChordDiagram";
import { PostMeta } from "@/components/site/PostMeta";
import { WhatsAppIcon } from "@/components/site/WhatsAppIcon";
import { whatsappLink } from "@/lib/contato";
import { POSTS, getPost, type Bloco } from "@/lib/blog";

export const Route = createFileRoute("/blog/$slug")({
  loader: ({ params }) => {
    const post = getPost(params.slug);
    if (!post) throw notFound();
    return post;
  },
  head: ({ loaderData }) =>
    loaderData
      ? {
          meta: [
            { title: `${loaderData.titulo} | Blog Bora Tocar` },
            { name: "description", content: loaderData.resumo },
            { property: "og:title", content: loaderData.titulo },
            { property: "og:description", content: loaderData.resumo },
            { property: "og:type", content: "article" },
          ],
        }
      : { meta: [{ title: "Artigo não encontrado | Blog Bora Tocar" }, { name: "robots", content: "noindex" }] },
  component: PostPage,
});

function Conteudo({ bloco }: { bloco: Bloco }) {
  switch (bloco.tipo) {
    case "h2":
      return <h2 className="pt-6 text-3xl font-semibold">{bloco.texto}</h2>;
    case "p":
      return <p>{bloco.texto}</p>;
    case "lista":
      return (
        <ul className="space-y-3 pl-1">
          {bloco.itens.map((item) => (
            <li key={item} className="flex gap-3">
              <span className="mt-2.5 size-1.5 shrink-0 rounded-full bg-primary" />
              <span>{item}</span>
            </li>
          ))}
        </ul>
      );
    case "dica":
      return (
        <aside className="flex gap-4 rounded-lg border border-primary/40 bg-card p-6">
          <Lightbulb className="mt-1 size-5 shrink-0 text-primary" />
          <p>
            <strong className="text-foreground">Dica do professor:</strong> {bloco.texto}
          </p>
        </aside>
      );
    case "acordes":
      return (
        <div className="grid grid-cols-3 gap-4">
          {bloco.acordes.map((a) => (
            <ChordDiagram key={a.cifra} acorde={a} />
          ))}
        </div>
      );
  }
}

function PostPage() {
  const post = Route.useLoaderData();
  const outros = POSTS.filter((p) => p.slug !== post.slug).slice(0, 3);

  return (
    <article className="pb-24">
      <div className="mx-auto max-w-3xl px-5 pt-16 md:pt-24">
        <Link to="/blog" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground">
          <ArrowLeft className="size-4" /> Voltar ao blog
        </Link>
        <div className="mt-8">
          <PostMeta categoria={post.categoria} data={post.data} leitura={post.leitura} />
        </div>
        <h1 className="mt-5 text-4xl font-semibold leading-[1.08] md:text-6xl">{post.titulo}</h1>
        <p className="mt-6 text-xl text-muted-foreground">{post.resumo}</p>
        <p className="mt-6 text-sm text-muted-foreground">
          Por <span className="text-foreground">Anderson Moraes</span>
        </p>
      </div>

      <div className="mx-auto mt-12 max-w-5xl px-5">
        <img
          src={post.imagem}
          alt={post.imagemAlt}
          width={1280}
          height={832}
          className="aspect-[16/9] w-full rounded-lg object-cover shadow-card"
        />
      </div>

      <div className="mx-auto mt-14 max-w-3xl space-y-6 px-5 text-lg leading-relaxed text-foreground/85">
        {post.conteudo.map((bloco, i) => (
          <Conteudo key={i} bloco={bloco} />
        ))}
      </div>

      <div className="mx-auto mt-16 max-w-3xl px-5">
        <div className="rounded-lg border border-border bg-card p-8 text-center">
          <h2 className="text-3xl font-semibold">
            Quer aprender de verdade? <em className="text-gradient-amber">Bora tocar!</em>
          </h2>
          <p className="mx-auto mt-3 max-w-md text-muted-foreground">
            Me chama no WhatsApp e me conta quais músicas você quer tocar.
          </p>
          <Button asChild variant="whatsapp" size="lg" className="mt-6">
            <a
              href={whatsappLink(`Olá Anderson! Li o artigo "${post.titulo}" no blog e quero aprender violão.`)}
              target="_blank"
              rel="noreferrer"
            >
              <WhatsAppIcon /> Falar com o Anderson
            </a>
          </Button>
        </div>
      </div>

      <div className="mx-auto mt-20 max-w-6xl px-5">
        <p className="eyebrow">Continue lendo</p>
        <div className="mt-6 grid gap-6 md:grid-cols-3">
          {outros.map((p) => (
            <Link
              key={p.slug}
              to="/blog/$slug"
              params={{ slug: p.slug }}
              className="group overflow-hidden rounded-lg border border-border bg-card"
            >
              <img
                src={p.imagem}
                alt={p.imagemAlt}
                loading="lazy"
                width={1280}
                height={832}
                className="aspect-[16/10] w-full object-cover"
              />
              <h3 className="p-5 text-xl font-semibold leading-snug group-hover:text-primary">{p.titulo}</h3>
            </Link>
          ))}
        </div>
      </div>
    </article>
  );
}
