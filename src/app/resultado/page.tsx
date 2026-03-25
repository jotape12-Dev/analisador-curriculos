"use client";

import { useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAnalysisStore } from "@/store/analysisStore";
import { ScoreCard } from "@/components/ScoreCard";
import { RecommendationItem } from "@/components/RecommendationItem";
import { SkillBadge } from "@/components/SkillBadge";
import { AnalysisRadarChart } from "@/components/AnalysisRadarChart";
import { PremiumGate } from "@/components/PremiumGate";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { ErrorMessage } from "@/components/ErrorMessage";
import { RefreshCw, FileText } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

function ResultadoContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { result, status, errorMessage, reset, isPremium, setPremium } = useAnalysisStore();

  useEffect(() => {
    if (searchParams.get('premium') === 'true') {
      setPremium(true);
    }
  }, [searchParams, setPremium]);

  useEffect(() => {
    if (status === "idle" && !result) {
      router.replace("/");
    }
  }, [status, result, router]);

  const handleNewAnalysis = () => {
    reset();
    router.push("/");
  };

  const handleCheckout = async () => {
    try {
      const res = await fetch('/api/stripe/create-checkout', { method: 'POST' });
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      } else {
        alert(data.error || 'Erro ao iniciar o pagamento.');
      }
    } catch {
      alert('Erro de conexão com o servidor de pagamento.');
    }
  };

  if (status === "error" && errorMessage) {
    return (
      <main className="min-h-screen flex flex-col items-center justify-center p-4 bg-background">
        <div className="max-w-md space-y-4 text-center">
          <ErrorMessage message={errorMessage} />
          <Button onClick={handleNewAnalysis} variant="outline" className="mt-4">
            Voltar e Tentar Novamente
          </Button>
        </div>
      </main>
    );
  }

  if (!result || status === "loading") {
    return (
      <main className="min-h-screen p-4 sm:p-8 bg-muted/20">
        <div className="max-w-6xl mx-auto space-y-8">
          <div className="flex items-center justify-between">
            <Skeleton className="h-10 w-48" />
            <Skeleton className="h-10 w-32" />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Skeleton className="h-[140px] rounded-xl" />
            <Skeleton className="h-[140px] rounded-xl" />
            <Skeleton className="h-[140px] rounded-xl" />
            <Skeleton className="h-[140px] rounded-xl" />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-8">
              <Skeleton className="h-[200px] w-full rounded-xl" />
              <Skeleton className="h-[300px] w-full rounded-xl" />
            </div>
            <div className="space-y-8">
              <Skeleton className="h-[350px] w-full rounded-xl" />
            </div>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen p-4 sm:p-8 bg-muted/10">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <h1 className="text-3xl font-bold tracking-tight">Resultado da Análise</h1>
            <p className="text-muted-foreground flex items-center gap-2">
              <FileText className="h-4 w-4" />
              Relatório gerado por Inteligência Artificial
            </p>
          </div>
          <Button onClick={handleNewAnalysis} variant="outline" className="shrink-0 font-medium">
            <RefreshCw className="mr-2 h-4 w-4" />
            Nova Análise
          </Button>
        </div>

        {/* Resumo */}
        <Card className="bg-primary/5 border-primary/20">
          <CardContent className="p-6">
            <h3 className="font-semibold text-primary mb-2 text-lg">Resumo Executivo</h3>
            <p className="text-foreground leading-relaxed">{result.resumo}</p>
          </CardContent>
        </Card>

        {/* Scores em Destaque */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <ScoreCard 
            title="Score Geral" 
            value={result.score_geral} 
            description="Avaliação consolidada do seu perfil na vaga."
          />
          <ScoreCard 
            title="Aderência à Vaga" 
            value={result.scores.aderencia_vaga} 
            description="Fit exato das suas competências descritas."
          />
          <ScoreCard 
            title="Compatibilidade ATS" 
            value={result.scores.ats} 
            description="Leitura da estrutura por robôs."
          />
          <ScoreCard 
            title="Clareza e Comunicação" 
            value={result.scores.clareza} 
            description="Tom, coesão e objetividade."
          />
        </div>

        {/* Dashboard grid (Radar + Skills) */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          <div className="lg:col-span-1 space-y-8">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Métricas em Detalhe</CardTitle>
              </CardHeader>
              <CardContent className="flex justify-center">
                <AnalysisRadarChart scores={result.scores} />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Análise de Seções</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4 className="text-sm font-semibold text-muted-foreground mb-2">Seções Encontradas</h4>
                  <div className="flex flex-wrap gap-2">
                    {result.secoes_presentes.map((sec, i) => (
                      <span key={i} className="px-2 py-1 bg-secondary rounded-md text-xs font-medium border text-secondary-foreground">{sec}</span>
                    ))}
                    {result.secoes_presentes.length === 0 && <span className="text-xs text-muted-foreground">Nenhuma encontrada</span>}
                  </div>
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-muted-foreground mb-2">Seções Recomendadas (Faltam)</h4>
                  <div className="flex flex-wrap gap-2">
                    {result.secoes_faltantes.map((sec, i) => (
                      <span key={i} className="px-2 py-1 bg-destructive/10 rounded-md text-xs font-medium border border-destructive/20 text-destructive">{sec}</span>
                    ))}
                    {result.secoes_faltantes.length === 0 && <span className="text-xs text-green-600 dark:text-green-400 font-medium">Padrão excelente</span>}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="lg:col-span-2 space-y-8">
            {/* Skills */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Mapeamento de Habilidades</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <h4 className="text-sm font-semibold text-muted-foreground mb-3 uppercase tracking-wider">Habilidades Encontradas</h4>
                  <div className="flex flex-wrap gap-2">
                    {result.skills_encontradas.map((skill, i) => (
                      <SkillBadge key={i} skill={skill} type="found" />
                    ))}
                    {result.skills_encontradas.length === 0 && <span className="text-sm text-muted-foreground">Não identificamos habilidades hard/soft claras.</span>}
                  </div>
                </div>
                
                {result.skills_faltantes.length > 0 && (
                  <div>
                    <h4 className="text-sm font-semibold text-muted-foreground mb-3 uppercase tracking-wider">Habilidades Faltantes (Gap)</h4>
                    <div className="flex flex-wrap gap-2">
                      {result.skills_faltantes.map((skill, i) => (
                        <SkillBadge key={i} skill={skill} type="missing" />
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Recomendações — Premium Gate */}
            <div className="space-y-4">
              <h3 className="text-xl font-bold tracking-tight mb-4 flex items-center gap-2">
                Plano de Ação
              </h3>
              {isPremium ? (
                result.recomendacoes.length > 0 ? (
                  result.recomendacoes.map((rec, i) => (
                    <RecommendationItem 
                      key={i}
                      titulo={rec.titulo}
                      descricao={rec.descricao}
                      sugestao={rec.sugestao}
                    />
                  ))
                ) : (
                  <Card className="bg-green-50/50 dark:bg-green-950/20 border-green-200 dark:border-green-900">
                    <CardContent className="p-6 text-center">
                      <p className="text-green-700 dark:text-green-400 font-medium">Seu currículo está impecável! Não temos sugestões drásticas de melhoria.</p>
                    </CardContent>
                  </Card>
                )
              ) : (
                <PremiumGate onUnlock={handleCheckout} />
              )}
            </div>
          </div>

        </div>
      </div>
    </main>
  );
}

export default function ResultadoPage() {
  return (
    <Suspense fallback={
      <main className="min-h-screen p-4 sm:p-8 bg-muted/20">
        <div className="max-w-6xl mx-auto space-y-8">
          <Skeleton className="h-10 w-48" />
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Skeleton className="h-[140px] rounded-xl" />
            <Skeleton className="h-[140px] rounded-xl" />
            <Skeleton className="h-[140px] rounded-xl" />
            <Skeleton className="h-[140px] rounded-xl" />
          </div>
        </div>
      </main>
    }>
      <ResultadoContent />
    </Suspense>
  );
}
