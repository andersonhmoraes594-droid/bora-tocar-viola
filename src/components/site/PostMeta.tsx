import { Clock } from "lucide-react";

import { formatarData } from "@/lib/blog";

export function PostMeta({ categoria, data, leitura }: { categoria: string; data: string; leitura: number }) {
  return (
    <p className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs font-medium uppercase tracking-wider text-muted-foreground">
      <span className="text-primary">{categoria}</span>
      <span>·</span>
      <span>{formatarData(data)}</span>
      <span>·</span>
      <span className="inline-flex items-center gap-1">
        <Clock className="size-3" /> {leitura} min
      </span>
    </p>
  );
}
