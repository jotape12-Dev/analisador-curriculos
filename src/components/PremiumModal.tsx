"use client";

import { useState } from "react";
import { X, CheckCircle2, Loader2, Copy, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { QRCodeSVG } from "qrcode.react";
import { getLapidaPixPayload, PIX_CONFIG } from "@/lib/pix";
import { useAnalysisStore } from "@/store/analysisStore";

interface PremiumModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function PremiumModal({ isOpen, onClose }: PremiumModalProps) {
  const [step, setStep] = useState<"benefits" | "pix">("benefits");
  const [copied, setCopied] = useState(false);
  const [confirming, setConfirming] = useState(false);
  const { setProfile } = useAnalysisStore();

  if (!isOpen) return null;

  const pixPayload = getLapidaPixPayload();

  const handleCopy = async () => {
    await navigator.clipboard.writeText(pixPayload);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleConfirmPayment = async () => {
    setConfirming(true);
    try {
      const res = await fetch("/api/payment/confirm", { method: "POST" });
      const data = await res.json();
      if (data.success) {
        setProfile({ analysis_count: 0, is_premium: true });
        alert("Premium ativado com sucesso! 🎉");
        onClose();
        setStep("benefits");
      } else {
        alert(data.error || "Erro ao confirmar pagamento.");
      }
    } catch {
      alert("Erro de conexão. Tente novamente.");
    } finally {
      setConfirming(false);
    }
  };

  const handleClose = () => {
    onClose();
    setStep("benefits");
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
            onClick={handleClose}
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
                <div className="text-3xl font-extrabold text-foreground mt-1">R$ {PIX_CONFIG.amount.toFixed(2).replace('.', ',')}</div>
                <p className="text-xs text-muted-foreground mt-1">Pagamento rápido e seguro via PIX</p>
              </div>
            </>
          ) : (
            <>
              {/* QR Code */}
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

              {/* Código PIX */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
                    Código PIX Copia e Cola
                  </label>
                  <span className="text-xs font-bold text-primary">
                    Valor: R$ {PIX_CONFIG.amount.toFixed(2).replace('.', ',')}
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
        </div>

        {/* Footer */}
        <div className="p-6 pt-0 flex flex-col sm:flex-row gap-3">
          <Button 
            variant="outline" 
            className="w-full sm:w-1/3" 
            onClick={step === "pix" ? () => setStep("benefits") : handleClose}
            disabled={confirming}
          >
            {step === "pix" ? "Voltar" : "Cancelar"}
          </Button>

          {step === "benefits" ? (
            <Button 
              className="w-full sm:w-2/3 font-bold bg-white text-zinc-950 border border-zinc-200 hover:bg-zinc-100 hover:-translate-y-0.5 shadow-lg hover:shadow-xl transition-all" 
              onClick={() => setStep("pix")}
            >
              Pagar com PIX
            </Button>
          ) : (
            <Button
              className="w-full sm:w-2/3 font-bold bg-green-600 hover:bg-green-700 text-white hover:-translate-y-0.5 shadow-lg hover:shadow-xl transition-all"
              onClick={handleConfirmPayment}
              disabled={confirming}
            >
              {confirming ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Confirmando...
                </>
              ) : (
                "✅ Já realizei o pagamento"
              )}
            </Button>
          )}
        </div>

      </div>
    </div>
  );
}
