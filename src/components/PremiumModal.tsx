"use client";

import { useState, useEffect } from "react";
import { X, CheckCircle2, Loader2, Copy, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { QRCodeSVG } from "qrcode.react";
import { useAnalysisStore } from "@/store/analysisStore";

interface PremiumModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function PremiumModal({ isOpen, onClose }: PremiumModalProps) {
  const [step, setStep] = useState<"benefits" | "pix">("benefits");
  const [copied, setCopied] = useState(false);
  const [confirming, setConfirming] = useState(false);
  const [loadingPix, setLoadingPix] = useState(false);
  const [pixPayload, setPixPayload] = useState<string>("");
  const [paymentId, setPaymentId] = useState<string | null>(null);

  const { setProfile } = useAnalysisStore();

  useEffect(() => {
    if (!isOpen) {
      setStep("benefits");
      setConfirming(false);
      setLoadingPix(false);
      setPixPayload("");
      setPaymentId(null);
    }
  }, [isOpen]);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (step === "pix" && paymentId && !confirming) {
      interval = setInterval(async () => {
        try {
          const res = await fetch(`/api/payment/mp/status?id=${paymentId}`);
          const data = await res.json();
          if (data.status === "approved") {
            clearInterval(interval);
            setConfirming(true);
            setProfile({ analysis_count: 0, is_premium: true });
            setTimeout(() => {
              alert("Pagamento confirmado! 🎉 Seu acesso Premium foi liberado.");
              onClose();
            }, 600);
          }
        } catch {
          // ignora
        }
      }, 3000);
    }
    return () => clearInterval(interval);
  }, [step, paymentId, confirming, setProfile, onClose]);

  if (!isOpen) return null;

  const handleGeneratePix = async () => {
    setStep("pix");
    setLoadingPix(true);
    try {
      const res = await fetch("/api/payment/mp/create", { method: "POST" });
      const data = await res.json();
      
      if (data.qr_code && data.payment_id) {
        setPixPayload(data.qr_code);
        setPaymentId(data.payment_id);
      } else {
        alert("Erro ao gerar PIX: " + (data.error || "A chave do Mercado Pago não foi configurada."));
        setStep("benefits");
      }
    } catch {
      alert("Erro de conexão ao gerar PIX.");
      setStep("benefits");
    } finally {
      setLoadingPix(false);
    }
  };

  const handleCopy = async () => {
    if (!pixPayload) return;
    await navigator.clipboard.writeText(pixPayload);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const checkPaymentManual = async () => {
    if (!paymentId) return;
    setConfirming(true);
    try {
      const res = await fetch(`/api/payment/mp/status?id=${paymentId}`);
      const data = await res.json();
      if (data.status === "approved") {
        setProfile({ analysis_count: 0, is_premium: true });
        alert("Pagamento confirmado! 🎉 Seu acesso Premium foi liberado.");
        onClose();
      } else {
        alert("Ainda não recebemos a confirmação. Aguarde uns segundinhos.");
      }
    } catch {
      alert("Erro ao verificar status.");
    } finally {
      setConfirming(false);
    }
  };

  const benefits = [
    "Acesso total ao Plano de Ação exclusivo escrito pela Inteligência Artificial.",
    "Sugestões textuais práticas para melhorar o seu currículo e suas chances.",
    "Entenda quais seções críticas os robôs (ATS) não conseguiram analisar.",
    "Análises ilimitadas — sem restrição de uso.",
  ];

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg bg-white dark:bg-zinc-950 border border-border/50 rounded-2xl shadow-2xl overflow-hidden flex flex-col animate-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="bg-primary/5 p-6 flex items-start justify-between border-b border-border/50">
          <div>
            <h2 className="text-2xl font-bold flex items-center gap-2">
              <span className="text-yellow-500">⭐</span> LapidaAI Premium
            </h2>
            <p className="text-muted-foreground mt-1 text-sm">
              {step === "benefits"
                ? "Eleve o seu perfil profissional com conselhos direcionados."
                : "Escaneie o QR Code ou copie o código PIX."}
            </p>
          </div>
          <button 
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-background/50 transition-colors text-muted-foreground"
            disabled={confirming}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {step === "benefits" ? (
            <>
              <ul className="space-y-4">
                {benefits.map((benefit, i) => (
                  <li key={i} className="flex gap-3">
                    <CheckCircle2 className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                    <span className="text-sm font-medium leading-relaxed text-foreground/90">
                      {benefit}
                    </span>
                  </li>
                ))}
              </ul>

              <div className="bg-muted/30 p-4 rounded-xl border border-border text-center space-y-1">
                <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Pagamento Único</span>
                <div className="text-3xl font-extrabold text-foreground mt-1">R$ 9,90</div>
                <p className="text-xs text-muted-foreground mt-1">Pagamento automático (liberação imediata)</p>
              </div>
            </>
          ) : (
            <>
              {loadingPix ? (
                <div className="flex flex-col items-center justify-center py-10 space-y-4">
                  <Loader2 className="h-8 w-8 text-primary animate-spin" />
                  <p className="text-sm font-medium text-muted-foreground">Gerando PIX único e seguro...</p>
                </div>
              ) : (
                <>
                  <div className="flex justify-center">
                    <div className="bg-white p-4 rounded-xl shadow-md">
                      <QRCodeSVG
                        value={pixPayload}
                        size={200}
                        level="M"
                        includeMargin={false}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
                        Código PIX Copia e Cola
                      </label>
                      <span className="text-xs font-bold text-primary">
                        Valor: R$ 9,90
                      </span>
                    </div>
                    <div className="flex gap-2">
                      <div className="flex-1 bg-muted/30 border border-border rounded-lg p-3 text-xs font-mono break-all max-h-20 overflow-y-auto select-all">
                        {pixPayload}
                      </div>
                      <Button
                        variant="outline"
                        size="icon"
                        className="shrink-0 h-auto"
                        onClick={handleCopy}
                      >
                        {copied ? (
                          <Check className="h-4 w-4 text-green-500" />
                        ) : (
                          <Copy className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
                  </div>
                </>
              )}
            </>
          )}
        </div>

        {/* Footer */}
        <div className="p-6 pt-0 flex flex-col sm:flex-row gap-3">
          <Button 
            variant="outline" 
            className="w-full sm:w-1/3" 
            onClick={step === "pix" ? () => setStep("benefits") : onClose}
            disabled={confirming || loadingPix}
          >
            {step === "pix" ? "Voltar" : "Cancelar"}
          </Button>

          {step === "benefits" ? (
            <Button 
              className="w-full sm:w-2/3 font-bold bg-white text-zinc-950 border border-zinc-200 hover:bg-zinc-100 hover:-translate-y-0.5 shadow-lg hover:shadow-xl transition-all" 
              onClick={handleGeneratePix}
            >
              Pagar com PIX
            </Button>
          ) : (
            <Button
              className="w-full sm:w-2/3 font-bold bg-green-600 hover:bg-green-700 text-white hover:-translate-y-0.5 shadow-lg hover:shadow-xl transition-all"
              onClick={checkPaymentManual}
              disabled={confirming || loadingPix}
            >
              {confirming ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Liberando Acesso!
                </>
              ) : (
                "Verificar Pagamento"
              )}
            </Button>
          )}
        </div>

      </div>
    </div>
  );
}
