import { Card, CardContent } from "@/components/ui/card";
import { FileText, Code, CheckCircle2 } from "lucide-react";
import Link from "next/link";

export default function SobrePage() {
  return (
    <main className="min-h-[calc(100vh-4rem)] p-4 sm:p-8 bg-gradient-to-b from-background to-muted/20">
      <div className="max-w-3xl mx-auto space-y-10">
        <div className="space-y-4 text-center">
          <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight">Sobre o LapidaAI</h1>
          <p className="text-lg text-muted-foreground">
            O analisador de currículo inteligente construído para maximizar seu potencial no mercado de trabalho.
          </p>
        </div>

        <Card className="shadow-lg border-border/60 bg-background/50 backdrop-blur-md">
          <CardContent className="p-6 sm:p-10 space-y-8">
            <div className="space-y-4">
              <h2 className="text-2xl font-bold flex items-center gap-2">
                <FileText className="text-primary h-6 w-6" />
                Como funciona?
              </h2>
              <p className="text-muted-foreground leading-relaxed text-base">
                Você faz o upload do seu currículo em formato PDF ou cola o texto bruto e, opcionalmente, 
                anexa a descrição da sua vaga dos sonhos. O sistema extrai suas informações e as envia 
                para um modelo de Inteligência Artificial de última geração, que avalia seu perfil com base 
                em critérios técnicos, clareza e estrutura voltada para sistemas ATS.
              </p>
            </div>

            <div className="space-y-4">
              <h2 className="text-2xl font-bold">Principais Tecnologias</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {[
                  "Next.js 14+ (App Router)",
                  "TypeScript (Strict Typings)",
                  "Tailwind CSS e shadcn/ui",
                  "Zustand State Management",
                  "Recharts (Gráficos Radar)",
                  "pdf-parse (Backend Extraction)",
                  "Integração com LLM via API"
                ].map((tech) => (
                  <div key={tech} className="flex items-center gap-2 bg-muted/40 p-3 rounded-md border border-border/50">
                    <CheckCircle2 className="h-4 w-4 text-green-500 shrink-0" />
                    <span className="text-sm font-medium">{tech}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-6 border-t border-border/50 text-center">
              <Link 
                href="https://github.com/jotape12-Dev" 
                target="_blank" 
                className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
              >
                <Code className="h-5 w-5" />
                Desenvolvido por João Paulo Albuquerque de Almeida Marques
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
