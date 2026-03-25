import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface ScoreCardProps {
  title: string;
  value: number;
  description?: string;
}

export function ScoreCard({ title, value, description }: ScoreCardProps) {
  const getColor = (val: number) => {
    if (val >= 80) return "text-green-500";
    if (val >= 60) return "text-yellow-500";
    return "text-destructive";
  };

  const getBgColor = (val: number) => {
    if (val >= 80) return "bg-green-500";
    if (val >= 60) return "bg-yellow-500";
    return "bg-destructive";
  };

  return (
    <Card className="flex flex-col border border-border/50 bg-background/50 backdrop-blur-sm">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-baseline space-x-2">
          <span className={`text-4xl font-bold tracking-tight ${getColor(value)}`}>{value}</span>
          <span className="text-sm font-medium text-muted-foreground">/ 100</span>
        </div>
        
        <div className="mt-4 h-2 w-full overflow-hidden rounded-full bg-secondary">
          <div className={`h-full transition-all duration-1000 ${getBgColor(value)}`} style={{ width: `${value}%` }} />
        </div>
        
        {description && <p className="mt-3 text-xs text-muted-foreground">{description}</p>}
      </CardContent>
    </Card>
  );
}
