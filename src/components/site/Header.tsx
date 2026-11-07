import { Link } from "@tanstack/react-router";
import { Menu, X } from "lucide-react";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { whatsappLink } from "@/lib/contato";
import { WhatsAppIcon } from "./WhatsAppIcon";

const NAV = [
  { to: "/curso", label: "Curso" },
  { to: "/loja", label: "Loja" },
  { to: "/blog", label: "Blog" },
  { to: "/sobre", label: "Sobre mim" },
  { to: "/contato", label: "Contato" },
] as const;

export function Header() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background/85 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-5">
        <Link to="/" className="flex items-baseline gap-1" onClick={() => setOpen(false)}>
          <span className="font-display text-2xl font-semibold italic text-foreground">Bora</span>
          <span className="font-display text-2xl font-semibold text-primary">Tocar</span>
        </Link>

        <nav className="hidden items-center gap-8 md:flex">
          {NAV.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
              activeProps={{ className: "text-primary" }}
            >
              {item.label}
            </Link>
          ))}
          <Button asChild variant="whatsapp" size="sm">
            <a href={whatsappLink("Olá Anderson! Vim pelo site Bora Tocar.")} target="_blank" rel="noreferrer">
              <WhatsAppIcon /> WhatsApp
            </a>
          </Button>
        </nav>

        <button
          type="button"
          className="text-foreground md:hidden"
          aria-label={open ? "Fechar menu" : "Abrir menu"}
          onClick={() => setOpen((v) => !v)}
        >
          {open ? <X className="size-6" /> : <Menu className="size-6" />}
        </button>
      </div>

      {open && (
        <nav className="border-t border-border bg-background px-5 py-4 md:hidden">
          <div className="flex flex-col gap-4">
            {NAV.map((item) => (
              <Link
                key={item.to}
                to={item.to}
                onClick={() => setOpen(false)}
                className="text-lg font-medium text-foreground"
                activeProps={{ className: "text-primary" }}
              >
                {item.label}
              </Link>
            ))}
            <Button asChild variant="whatsapp">
              <a href={whatsappLink("Olá Anderson! Vim pelo site Bora Tocar.")} target="_blank" rel="noreferrer">
                <WhatsAppIcon /> Falar no WhatsApp
              </a>
            </Button>
          </div>
        </nav>
      )}
    </header>
  );
}
