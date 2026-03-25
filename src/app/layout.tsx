import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/ThemeProvider";
import { Navbar } from "@/components/Navbar";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "LapidaAI — Analisador de Currículo com IA",
  description:
    "Analise seu currículo com inteligência artificial. Receba scores, identifique skills e obtenha recomendações acionáveis para aumentar suas chances no mercado.",
  keywords: [
    "currículo",
    "análise de currículo",
    "IA",
    "ATS",
    "vaga de emprego",
    "LapidaAI",
  ],
  openGraph: {
    title: "LapidaAI — Analisador de Currículo com IA",
    description:
      "Analise seu currículo com inteligência artificial. Receba scores e recomendações acionáveis.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <Navbar />
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
