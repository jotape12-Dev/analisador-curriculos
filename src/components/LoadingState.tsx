"use client";

import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";

const MESSAGES = [
  "Lendo seu currículo...",
  "Identificando habilidades...",
  "Avaliando estrutura e clareza...",
  "Analisando aderência à vaga...",
  "Gerando recomendações práticas...",
];

export function LoadingState() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % MESSAGES.length);
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex flex-col items-center justify-center space-y-6 text-center p-8 animate-in fade-in duration-500">
      <Loader2 className="h-12 w-12 animate-spin text-primary" />
      <div className="space-y-2">
        <p className="text-xl font-semibold text-foreground transition-all duration-300 min-h-[30px]">
          {MESSAGES[index]}
        </p>
        <p className="text-sm text-muted-foreground max-w-sm mx-auto">
          Nossa inteligência artificial está processando profundamente o seu perfil profissional. Por favor, aguarde.
        </p>
      </div>
    </div>
  );
}
