"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAnalysisStore } from "@/store/analysisStore";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Upload, FileText, Briefcase, ArrowRight, Loader2 } from "lucide-react";
import { LoadingOverlay } from "@/components/LoadingOverlay";
import { PremiumModal } from "@/components/PremiumModal";
import { ErrorMessage } from "@/components/ErrorMessage";

const FREE_LIMIT = 3;

function Home() {
  const router = useRouter();
  const { setStatus, setResult, setError, status, errorMessage, isPremium, user, profile, setProfile } = useAnalysisStore();
  
  const [curriculoText, setCurriculoText] = useState("");
  const [vagaText, setVagaText] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isPremiumModalOpen, setPremiumModalOpen] = useState(false);
  const [isCheckoutLoading, setIsCheckoutLoading] = useState(false);

  const analysisCount = profile?.analysis_count ?? 0;
  const hasReachedLimit = !isPremium && analysisCount >= FREE_LIMIT;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0]);
      setCurriculoText("");
    }
  };

  const clearFile = () => {
    setFile(null);
  };

  const handleCheckout = async () => {
    setIsCheckoutLoading(true);
    try {
      const res = await fetch('/api/stripe/create-checkout', { 
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ origin: '/' })
      });
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      } else {
        alert(data.error || 'Erro ao iniciar o pagamento.');
        setIsCheckoutLoading(false);
      }
    } catch {
      alert('Erro de conexão com o servidor de pagamento.');
      setIsCheckoutLoading(false);
    }
  };

  const handleAnalyze = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file && !curriculoText.trim()) return;

    // Require login
    if (!user) {
      router.push('/login');
      return;
    }

    if (hasReachedLimit) {
      setError(`Você já utilizou suas ${FREE_LIMIT} análises gratuitas. Assine o Premium para ter análises ilimitadas!`);
      setPremiumModalOpen(true);
      return;
    }

    setIsLoading(true);
    setStatus("loading");
    setError("");

    try {
      let body: FormData | string;
      const headers: Record<string, string> = {};

      if (file) {
        const formData = new FormData();
        formData.append("file", file);
        if (vagaText) formData.append("vaga", vagaText);
        body = formData;
      } else {
        headers["Content-Type"] = "application/json";
        body = JSON.stringify({
          curriculo: curriculoText,
          vaga: vagaText,
        });
      }

      const res = await fetch("/api/analyze", {
        method: "POST",
        headers,
        body,
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Erro ao analisar o currículo.");
      }

      // Update profile count from server response 
      if (data._profile) {
        setProfile(data._profile);
      }

      setResult(data);
      setIsLoading(false);
      router.push("/resultado");
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Erro desconhecido.";
      setError(msg);
      setStatus("error");
      setIsLoading(false);
    }
  };

  return (
    <>
      <LoadingOverlay isVisible={isLoading} />
      
      <PremiumModal 
        isOpen={isPremiumModalOpen} 
        onClose={() => setPremiumModalOpen(false)} 
        onCheckout={handleCheckout} 
        isLoading={isCheckoutLoading} 
      />

      <main className="min-h-screen flex flex-col items-center justify-center p-4 sm:p-8 bg-gradient-to-b from-background to-muted/20 relative overflow-hidden">
        {/* Background decorations */}
        <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-primary/10 blur-3xl rounded-full pointer-events-none" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-primary/5 blur-[100px] rounded-full pointer-events-none" />

        <div className="w-full max-w-4xl space-y-10 relative z-10">
          <div className="text-center space-y-5">
            <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight">
              Eleve seu currículo com <span className="text-transparent bg-clip-text bg-gradient-to-r from-zinc-900 to-zinc-500 dark:from-zinc-100 dark:to-zinc-500">LapidaAI</span>
            </h1>
            <p className="text-lg text-muted-foreground w-full max-w-3xl mx-auto font-medium">
              Entenda o impacto do seu currículo. Nosso analisador inteligente extrai suas habilidades cruciais, identifica deficiências com ATS e fornece um plano acionável para a vaga dos seus sonhos.
            </p>
          </div>

          {status === "error" && errorMessage && (
            <div className="animate-in slide-in-from-top-4 fade-in max-w-2xl mx-auto">
              <ErrorMessage message={errorMessage} />
            </div>
          )}

          <Card className="border-border/60 shadow-2xl bg-background/50 backdrop-blur-3xl mx-auto max-w-3xl overflow-hidden">
            <CardHeader className="bg-muted/30 border-b border-border/50 pb-6">
              <CardTitle className="text-2xl">Pronto para a análise?</CardTitle>
              <CardDescription className="text-base">
                Envie o seu documento PDF ou cole todo o texto. Diga-nos a vaga almejada se preferir resultados ainda mais afiados.
              </CardDescription>
              {user && !isPremium && (
                <p className="text-xs text-muted-foreground mt-2">
                  Análises gratuitas: <span className="font-bold text-foreground">{analysisCount}/{FREE_LIMIT}</span>
                </p>
              )}
            </CardHeader>
            <CardContent className="pt-8">
              <form onSubmit={handleAnalyze} className="space-y-8">
                <div className="space-y-6">
                  
                  {/* Section Currículo */}
                  <div className="space-y-3">
                    <label className="text-sm font-bold flex items-center gap-2 text-foreground">
                      <FileText className="h-4 w-4 text-primary" />
                      Seu Currículo (Obrigatório)
                    </label>
                    
                    <div className="flex flex-col sm:flex-row gap-4 h-auto sm:h-[180px]">
                      <div className="flex-1 relative h-[180px] sm:h-full">
                        <Textarea 
                          placeholder={file ? "Arquivo PDF anexado." : "Cole o texto do currículo aqui..."}
                          className="h-full resize-none bg-background shadow-xs text-sm"
                          value={curriculoText}
                          onChange={(e) => {
                            setCurriculoText(e.target.value);
                            if (file) clearFile();
                          }}
                          disabled={file !== null}
                        />
                      </div>
                      
                      <div className="relative flex shrink-0 items-center justify-center flex-col gap-3 rounded-lg border-2 border-dashed border-border/80 p-4 bg-muted/20 hover:bg-muted/40 transition-colors focus-within:ring-2 focus-within:ring-primary h-[140px] sm:h-full w-full sm:w-[220px] overflow-hidden">
                        <input 
                          type="file" 
                          accept="application/pdf"
                          className="absolute inset-0 opacity-0 cursor-pointer z-10 w-full h-full"
                          onChange={handleFileChange}
                          title="Faça upload do seu PDF aqui"
                        />
                        <Upload className="h-8 w-8 text-primary/70 shrink-0" />
                        <div className="text-center px-1 w-full flex flex-col items-center">
                          <span className="text-xs text-foreground font-semibold block truncate w-full max-w-[180px]">
                            {file ? file.name : "Upload de PDF"}
                          </span>
                          {!file && <span className="text-[10px] text-muted-foreground mt-1 block truncate">Clique ou arraste</span>}
                        </div>

                        {file && (
                          <Button 
                            type="button" 
                            variant="secondary" 
                            size="sm" 
                            className="h-7 text-xs px-3 relative z-20 hover:bg-destructive hover:text-destructive-foreground transition-colors shrink-0"
                            onClick={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              clearFile();
                            }}
                          >
                            Remover File
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Section Vaga */}
                  <div className="space-y-3">
                    <label className="text-sm font-bold flex items-center gap-2 text-foreground">
                      <Briefcase className="h-4 w-4 text-primary" />
                      A Vaga de Emprego (Opcional)
                    </label>
                    <Textarea 
                      placeholder="Cole a descrição completa da vaga para análise de adesão e match entre habilidades..." 
                      className="h-[120px] resize-none bg-background shadow-xs text-sm"
                      value={vagaText}
                      onChange={(e) => setVagaText(e.target.value)}
                    />
                  </div>
                </div>

                <div className="pt-2">
                  {!user ? (
                    <Button 
                      type="button"
                      size="lg"
                      className="w-full h-14 text-base font-bold shadow-md hover:shadow-lg transition-all"
                      onClick={() => router.push('/login')}
                    >
                      Entrar para Analisar
                      <ArrowRight className="ml-2 h-5 w-5" />
                    </Button>
                  ) : hasReachedLimit ? (
                    <Button 
                      type="button"
                      size="lg"
                      className="w-full h-14 text-base font-bold shadow-md hover:shadow-lg transition-all bg-amber-500 hover:bg-amber-600"
                      onClick={() => setPremiumModalOpen(true)}
                    >
                      <span className="text-xl mr-2">⭐</span>
                      Limite Atingido - Assinar Premium
                    </Button>
                  ) : (
                    <Button 
                      type="submit" 
                      size="lg"
                      className="w-full h-14 text-base font-bold shadow-md hover:shadow-lg transition-all"
                      disabled={isLoading || (!file && !curriculoText.trim())}
                    >
                      {isLoading ? (
                        <>
                          <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                          Analisando seu perfil...
                        </>
                      ) : (
                        <>
                          Analisar Meu Perfil Agora
                          <ArrowRight className="ml-2 h-5 w-5" />
                        </>
                      )}
                    </Button>
                  )}
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </main>
    </>
  );
}

function PremiumQueryHandler() {
  const searchParams = useSearchParams();
  const { setPremium } = useAnalysisStore();
  
  useEffect(() => {
    if (searchParams.get('premium') === 'true') {
      setPremium(true);
      // Refresh profile from server
      fetch('/api/auth/me').then(r => r.json()).then(data => {
        if (data.profile) {
          useAnalysisStore.getState().setProfile(data.profile);
        }
      });
    }
  }, [searchParams, setPremium]);

  return null;
}

export default function HomeWithSuspense() {
  return (
    <Suspense fallback={null}>
      <PremiumQueryHandler />
      <Home />
    </Suspense>
  );
}
