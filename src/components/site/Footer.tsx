import { Link } from "@tanstack/react-router";

import { WHATSAPP_DISPLAY, whatsappLink } from "@/lib/contato";
import { WhatsAppIcon } from "./WhatsAppIcon";

export function Footer() {
  return (
    <footer className="border-t border-border bg-card">
      <div className="mx-auto grid max-w-6xl gap-10 px-5 py-14 md:grid-cols-3">
        <div>
          <p className="font-display text-3xl font-semibold">
            <span className="italic">Bora</span> <span className="text-primary">Tocar</span>
          </p>
          <p className="mt-3 max-w-xs text-sm text-muted-foreground">
            Curso de violão online e loja de instrumentos de cordas e acessórios, com o professor
            Anderson Moraes.
          </p>
        </div>

        <div>
          <p className="eyebrow">Navegue</p>
          <ul className="mt-4 space-y-2 text-sm">
            <li><Link to="/curso" className="text-muted-foreground hover:text-foreground">Curso de violão</Link></li>
            <li><Link to="/loja" className="text-muted-foreground hover:text-foreground">Loja</Link></li>
            <li><Link to="/sobre" className="text-muted-foreground hover:text-foreground">Sobre o professor</Link></li>
            <li><Link to="/contato" className="text-muted-foreground hover:text-foreground">Contato</Link></li>
          </ul>
        </div>

        <div>
          <p className="eyebrow">Contato</p>
          <a
            href={whatsappLink("Olá Anderson! Vim pelo site Bora Tocar.")}
            target="_blank"
            rel="noreferrer"
            className="mt-4 inline-flex items-center gap-2 text-lg font-semibold text-foreground hover:text-primary"
          >
            <WhatsAppIcon className="size-5 text-whatsapp" /> {WHATSAPP_DISPLAY}
          </a>
          <p className="mt-2 text-sm text-muted-foreground">Bragança Paulista – SP · Aulas online para todo o Brasil</p>
        </div>
      </div>
      <div className="border-t border-border py-5 text-center text-xs text-muted-foreground">
        © {new Date().getFullYear()} Bora Tocar · Anderson Moraes
      </div>
    </footer>
  );
}
