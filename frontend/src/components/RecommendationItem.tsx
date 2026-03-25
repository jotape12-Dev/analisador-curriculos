import { AlertCircle, CheckCircle2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

interface RecommendationItemProps {
  titulo: string;
  descricao: string;
  sugestao: string;
}

export function RecommendationItem({ titulo, descricao, sugestao }: RecommendationItemProps) {
  return (
    <Card className="overflow-hidden border-l-4 border-l-primary bg-muted/20">
      <CardContent className="p-5 flex gap-4">
        <div className="text-primary mt-0.5 shrink-0">
          <AlertCircle className="h-5 w-5" />
        </div>
        <div className="flex-1">
          <h4 className="font-semibold text-foreground mb-1.5">{titulo}</h4>
          <p className="text-sm text-muted-foreground mb-4 leading-relaxed">{descricao}</p>
          
          <div className="bg-background rounded-lg p-4 border border-border/60 shadow-sm">
            <div className="flex items-center gap-2 mb-2">
              <CheckCircle2 className="h-4 w-4 text-green-500" />
              <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Sugestão de melhoria</span>
            </div>
            <p className="text-sm font-medium text-foreground leading-relaxed">{sugestao}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
