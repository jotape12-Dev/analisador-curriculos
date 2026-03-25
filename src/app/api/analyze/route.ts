/* eslint-disable @typescript-eslint/no-require-imports */
import { NextRequest, NextResponse } from "next/server";
import { createClient } from '@/lib/supabase/server'

const systemPromptWithVaga = `Você é um especialista sênior em recrutamento e otimização de currículos no mercado brasileiro.

Analise o currículo fornecido COMPARANDO com a vaga de emprego fornecida e avalie:
- Aderência do currículo aos requisitos obrigatórios e desejáveis da vaga
- Compatibilidade com sistemas ATS (palavras-chave da vaga presentes no currículo)
- Qualidade e impacto das experiências descritas (verbos de ação, métricas, resultados)
- Clareza, objetividade e alinhamento do texto com o perfil da vaga

REGRAS OBRIGATÓRIAS:
1. Responda APENAS com JSON puro, sem markdown, sem blocos de código, sem texto antes ou depois.
2. Responda sempre em português brasileiro.
3. Gere entre 3 e 5 recomendações — apenas as mais impactantes para aumentar as chances nesta vaga.
4. Use os critérios abaixo para os scores (seja criterioso, não generoso):
   - 0-40: grave, prejudica muito a candidatura
   - 41-60: abaixo do esperado, precisa de melhorias significativas
   - 61-75: adequado, mas com pontos de melhoria claros
   - 76-90: bom, acima da média
   - 91-100: excelente, difícil de melhorar
5. "skills_encontradas" deve listar apenas skills que aparecem no currículo E são relevantes para a vaga.
6. "skills_faltantes" deve listar skills mencionadas na vaga que estão ausentes no currículo.

Retorne exatamente neste formato JSON:
{
  "score_geral": <número 0-100>,
  "scores": {
    "ats": <número 0-100>,
    "aderencia_vaga": <número 0-100>,
    "qualidade_experiencias": <número 0-100>,
    "clareza": <número 0-100>
  },
  "resumo": "<2-3 frases objetivas sobre o alinhamento do currículo com esta vaga específica>",
  "skills_encontradas": ["skill1", "skill2"],
  "skills_faltantes": ["skill1", "skill2"],
  "secoes_presentes": ["Resumo", "Experiência"],
  "secoes_faltantes": ["Certificações"],
  "recomendacoes": [
    {
      "titulo": "<título curto e direto do problema>",
      "descricao": "<explicação do problema e por que prejudica a candidatura nesta vaga>",
      "sugestao": "<ação concreta ou exemplo de texto melhorado>"
    }
  ]
}`;

const systemPromptSemVaga = `Você é um especialista sênior em recrutamento e otimização de currículos no mercado brasileiro.

Analise o currículo fornecido de forma geral (sem vaga específica) e avalie:
- Compatibilidade com sistemas ATS (palavras-chave, formatação, ausência de elementos problemáticos)
- Qualidade e impacto das experiências descritas (uso de verbos de ação, métricas, resultados)
- Clareza, objetividade e organização do texto
- Posicionamento geral para o mercado de trabalho

REGRAS OBRIGATÓRIAS:
1. Responda APENAS com JSON puro, sem markdown, sem blocos de código, sem texto antes ou depois.
2. Responda sempre em português brasileiro.
3. Gere entre 3 e 5 recomendações — apenas as mais impactantes, não todas as possíveis.
4. Use os critérios abaixo para os scores (seja criterioso, não generoso):
   - 0-40: grave, prejudica muito a candidatura
   - 41-60: abaixo do esperado, precisa de melhorias significativas
   - 61-75: adequado, mas com pontos de melhoria claros
   - 76-90: bom, acima da média
   - 91-100: excelente, difícil de melhorar
5. "skills_faltantes" deve listar skills relevantes para a área do candidato que estão ausentes no currículo.

Retorne exatamente neste formato JSON:
{
  "score_geral": <número 0-100>,
  "scores": {
    "ats": <número 0-100>,
    "aderencia_vaga": <número 0-100>,
    "qualidade_experiencias": <número 0-100>,
    "clareza": <número 0-100>
  },
  "resumo": "<2-3 frases objetivas resumindo os pontos fortes e fracos principais>",
  "skills_encontradas": ["skill1", "skill2"],
  "skills_faltantes": ["skill1", "skill2"],
  "secoes_presentes": ["Resumo", "Experiência"],
  "secoes_faltantes": ["Certificações"],
  "recomendacoes": [
    {
      "titulo": "<título curto e direto do problema>",
      "descricao": "<explicação do problema e por que prejudica o currículo>",
      "sugestao": "<ação concreta ou exemplo de texto melhorado>"
    }
  ]
}`;


const FREE_LIMIT = 3;

export async function POST(req: NextRequest) {
  try {
    // Auth check
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Faça login para analisar seu currículo." }, { status: 401 });
    }

    // Fetch profile & check limits
    const { data: profile } = await supabase
      .from('profiles')
      .select('analysis_count, is_premium')
      .eq('id', user.id)
      .single();

    const analysisCount = profile?.analysis_count ?? 0;
    const isPremium = profile?.is_premium ?? false;

    if (!isPremium && analysisCount >= FREE_LIMIT) {
      return NextResponse.json(
        { error: `Limite de ${FREE_LIMIT} análises gratuitas atingido. Assine o Premium para continuar.` },
        { status: 403 }
      );
    }

    const contentType = req.headers.get("content-type") || "";
    
    let curriculoText = "";
    let vagaText = "";

    if (contentType.includes("multipart/form-data")) {
      const formData = await req.formData();
      const file = formData.get("file") as File | null;
      vagaText = (formData.get("vaga") as string) || "";

      if (!file) {
        return NextResponse.json({ error: "Nenhum arquivo enviado." }, { status: 400 });
      }

      const buffer = Buffer.from(await file.arrayBuffer());
      const pdfParse = require("pdf-parse/lib/pdf-parse.js");
      const parsed = await pdfParse(buffer);
      curriculoText = parsed.text;

    } else if (contentType.includes("application/json")) {
      const body = await req.json();
      curriculoText = body.curriculo || "";
      vagaText = body.vaga || "";

      if (!curriculoText) {
        return NextResponse.json({ error: "Currículo não fornecido." }, { status: 400 });
      }
    } else {
      return NextResponse.json({ error: "Content-Type não suportado." }, { status: 415 });
    }

    const hasVaga = vagaText.trim().length > 0;
    const systemPrompt = hasVaga ? systemPromptWithVaga : systemPromptSemVaga;
    const promptUser = hasVaga
      ? `CURRÍCULO:\n${curriculoText}\n\nVAGA:\n${vagaText}`
      : `CURRÍCULO:\n${curriculoText}`;

    const provider = process.env.AI_PROVIDER || "openai";
    let resultJsonString = "";

    if (provider === "openai") {
      const apiKey = process.env.OPENAI_API_KEY;
      if (!apiKey) return NextResponse.json({ error: "OPENAI_API_KEY não configurada." }, { status: 500 });
      
      const response = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${apiKey}`
        },
        body: JSON.stringify({
          model: "gpt-4o",
          messages: [
            { role: "system", content: systemPrompt },
            { role: "user", content: promptUser }
          ],
          response_format: { type: "json_object" }
        })
      });

      if (!response.ok) {
         const err = await response.text();
         throw new Error(`OpenAI Error: ${err}`);
      }
      
      const data = await response.json();
      resultJsonString = data.choices[0].message.content;

    } else if (provider === "google") {
       const apiKey = process.env.GEMINI_API_KEY;
       if (!apiKey) return NextResponse.json({ error: "GEMINI_API_KEY não configurada." }, { status: 500 });
       
       const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`, {
         method: "POST",
         headers: {
           "Content-Type": "application/json"
         },
         body: JSON.stringify({
           system_instruction: {
             parts: [{ text: systemPrompt }]
           },
           contents: [{
             parts: [{ text: promptUser }]
           }],
           generationConfig: {
             responseMimeType: "application/json"
           }
         })
       });

       if (!response.ok) {
         const err = await response.text();
         throw new Error(`Google Gemini Error: ${err}`);
       }

       const data = await response.json();
       resultJsonString = data.candidates?.[0]?.content?.parts?.[0]?.text || "";
    } else {
       return NextResponse.json({ error: "Provedor de IA inválido em AI_PROVIDER." }, { status: 500 });
    }

    // Limpar possível markdown que o modelo insira mesmo com a instrução
    resultJsonString = resultJsonString
      .replace(/```json\n?/g, '')
      .replace(/```\n?/g, '')
      .trim();

    // Extrair JSON válido
    const startIdx = resultJsonString.indexOf('{');
    const endIdx = resultJsonString.lastIndexOf('}');
    if (startIdx !== -1 && endIdx !== -1) {
      resultJsonString = resultJsonString.substring(startIdx, endIdx + 1);
    }
    
    const parsedResult = JSON.parse(resultJsonString);

    // Increment analysis count for non-premium users
    if (!isPremium) {
      await supabase
        .from('profiles')
        .update({ analysis_count: analysisCount + 1 })
        .eq('id', user.id);
    }

    // Fetch updated profile
    const { data: updatedProfile } = await supabase
      .from('profiles')
      .select('analysis_count, is_premium')
      .eq('id', user.id)
      .single();

    return NextResponse.json({ ...parsedResult, _profile: updatedProfile });

  } catch (error: unknown) {
    console.error("[analyze] error:", error);
    return NextResponse.json(
      { error: "Erro ao processar análise. Tente novamente." },
      { status: 500 }
    );
  }
}
