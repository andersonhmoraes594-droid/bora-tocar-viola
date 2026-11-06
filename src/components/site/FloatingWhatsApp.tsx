import { whatsappLink } from "@/lib/contato";
import { WhatsAppIcon } from "./WhatsAppIcon";

export function FloatingWhatsApp() {
  return (
    <a
      href={whatsappLink("Olá Anderson! Quero saber mais sobre o Bora Tocar.")}
      target="_blank"
      rel="noreferrer"
      aria-label="Falar com Anderson no WhatsApp"
      className="fixed bottom-5 right-5 z-50 flex size-14 items-center justify-center rounded-full bg-whatsapp text-whatsapp-foreground shadow-lg transition-transform hover:scale-110"
    >
      <WhatsAppIcon className="size-7" />
    </a>
  );
}
