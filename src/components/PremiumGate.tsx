'use client'

export function PremiumGate({ onUnlock }: { onUnlock: () => void }) {
  return (
    <div className="relative rounded-xl border border-border overflow-hidden">
      {/* Preview borrada das recomendações (skeletons fake) */}
      <div className="blur-sm pointer-events-none select-none p-6 space-y-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="rounded-lg border border-border p-4 space-y-2">
            <div className="h-4 w-48 bg-muted rounded" />
            <div className="h-3 w-full bg-muted rounded" />
            <div className="h-3 w-3/4 bg-muted rounded" />
          </div>
        ))}
      </div>

      {/* Overlay de upgrade */}
      <div className="absolute inset-0 flex flex-col items-center justify-center bg-background/80 backdrop-blur-sm gap-4 p-6 text-center">
        <span className="text-3xl">🔒</span>
        <h3 className="text-xl font-bold">Plano de Ação Premium</h3>
        <p className="text-muted-foreground text-sm max-w-xs">
          Desbloqueie recomendações acionáveis detalhadas com sugestões 
          de texto para melhorar seu currículo e aumentar suas chances.
        </p>
        <button
          onClick={onUnlock}
          className="bg-primary text-primary-foreground px-6 py-3 rounded-lg font-semibold hover:opacity-90 transition"
        >
          Desbloquear por R$ 9,90
        </button>
        <p className="text-xs text-muted-foreground">
          Pagamento único • Acesso imediato • Sem assinatura
        </p>
      </div>
    </div>
  )
}
