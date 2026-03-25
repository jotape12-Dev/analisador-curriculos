import { X, CheckCircle2, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";

interface PremiumModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCheckout: () => void;
  isLoading: boolean;
}

export function PremiumModal({ isOpen, onClose, onCheckout, isLoading }: PremiumModalProps) {
  if (!isOpen) return null;

  const benefits = [
    "Acesso total ao Plano de Ação exclusivo escrito pela Inteligência Artificial.",
    "Sugestões textuais práticas para melhorar o seu currículo e suas chances.",
    "Entenda quais seções críticas os robôs (ATS) não conseguiram analisar.",
    "Acesso validado por sessão na aba atual (analise múltiplos currículos tranquilamente)."
  ];

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg bg-white dark:bg-zinc-950 border border-border/50 rounded-2xl shadow-2xl overflow-hidden flex flex-col animate-in zoom-in-95 duration-200">
        
        {/* Header Visual */}
        <div className="bg-primary/5 p-6 flex items-start justify-between border-b border-border/50">
          <div>
            <h2 className="text-2xl font-bold flex items-center gap-2">
              <span className="text-yellow-500">⭐</span> LapidaAI Premium
            </h2>
            <p className="text-muted-foreground mt-1 text-sm">
              Eleve o seu perfil profissional com conselhos direcionados.
            </p>
          </div>
          <button 
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-background/50 transition-colors text-muted-foreground"
            disabled={isLoading}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Corpo Visual */}
        <div className="p-6 space-y-6">
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
            <p className="text-xs text-muted-foreground mt-1">Processamento super seguro via Stripe</p>
          </div>
        </div>

        {/* Footer/Ações */}
        <div className="p-6 pt-0 flex flex-col sm:flex-row gap-3">
          <Button 
            variant="outline" 
            className="w-full sm:w-1/3" 
            onClick={onClose}
            disabled={isLoading}
          >
            Cancelar
          </Button>
          <Button 
            className="w-full sm:w-2/3 font-bold bg-white text-zinc-950 border border-zinc-200 hover:bg-zinc-100 hover:-translate-y-0.5 shadow-lg hover:shadow-xl transition-all focus:ring-2 focus:ring-zinc-950" 
            onClick={onCheckout}
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Iniciando Checkout...
              </>
            ) : (
              "Assinar o Premium"
            )}
          </Button>
        </div>

      </div>
    </div>
  );
}
