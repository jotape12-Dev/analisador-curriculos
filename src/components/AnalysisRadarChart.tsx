"use client";

import { ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, Tooltip } from "recharts";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

interface AnalysisRadarChartProps {
  scores: {
    ats: number;
    aderencia_vaga: number;
    qualidade_experiencias: number;
    clareza: number;
  };
}

export function AnalysisRadarChart({ scores }: AnalysisRadarChartProps) {
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);
  const data = [
    { subject: "ATS", A: scores.ats, fullMark: 100 },
    { subject: "Aderência", A: scores.aderencia_vaga, fullMark: 100 },
    { subject: "Experiências", A: scores.qualidade_experiencias, fullMark: 100 },
    { subject: "Clareza", A: scores.clareza, fullMark: 100 },
  ];

  if (!mounted) {
    return <div className="h-[320px] w-full" />;
  }

  const isDark = resolvedTheme === "dark";

  const labelColor = isDark ? "#ffffff" : "#374151";
  const gridColor = isDark ? "#ffffff" : "#374151";
  const strokeColor = isDark ? "#ffffff" : "#374151";

  return (
    <div className="h-[320px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <RadarChart cx="50%" cy="50%" outerRadius="55%" data={data}>
          <PolarGrid stroke={gridColor} strokeOpacity={0.3} />
          <PolarAngleAxis 
            dataKey="subject" 
            tick={{ fill: labelColor, fontWeight: 600, fontSize: 14 }} 
          />
          <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
          <Tooltip 
            contentStyle={{ 
              backgroundColor: "hsl(var(--background))", 
              borderColor: "hsl(var(--border))", 
              borderRadius: "8px",
              boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)"
            }}
            itemStyle={{ color: "hsl(var(--foreground))", fontWeight: 600 }}
          />
          <Radar 
            name="Score Obtido" 
            dataKey="A" 
            stroke={strokeColor}
            fill={strokeColor}
            fillOpacity={0.15}
          />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  );
}
