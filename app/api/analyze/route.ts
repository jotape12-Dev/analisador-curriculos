import { NextRequest, NextResponse } from "next/server";
import pdfParse from "pdf-parse";

const systemPrompt = `Você é um especialista em recrutamento e otimização de currículos. Analise o currículo abaixo e retorne APENAS um JSON válido com a seguinte estrutura:

{
  "score_geral": <número 0-100>,
  "scores": {
    "ats": <número 0-100>,
    "aderencia_vaga": <número 0-100>,
    "qualidade_experiencias": <número 0-100>,
    "clareza": <número 0-100>
  },
  "resumo": "<string: 2-3 frases resumindo a análise>",
  "skills_encontradas": ["skill1", "skill2", ...],
  "skills_faltantes": ["skill1", "skill2", ...],
  "secoes_presentes": ["Resumo", "Experiência", ...],
  "secoes_faltantes": ["Certificações", ...],
  "recomendacoes": [
    {
      "titulo": "<título curto do problema>",
      "descricao": "<explicação>",
      "sugestao": "<texto melhorado ou ação concreta>"
    }
  ]
}`;

export async function POST(req: NextRequest) {
  try {
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

    const promptUser = `Currículo:\n${curriculoText}\n\nVaga (se fornecida):\n${vagaText}`;

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

    } else if (provider === "anthropic") {
       const apiKey = process.env.ANTHROPIC_API_KEY;
       if (!apiKey) return NextResponse.json({ error: "ANTHROPIC_API_KEY não configurada." }, { status: 500 });
       
       const response = await fetch("https://api.anthropic.com/v1/messages", {
         method: "POST",
         headers: {
           "Content-Type": "application/json",
           "x-api-key": apiKey,
           "anthropic-version": "2023-06-01"
         },
         body: JSON.stringify({
           model: "claude-3-5-sonnet-20240620",
           max_tokens: 4000,
           system: systemPrompt,
           messages: [
             { role: "user", content: promptUser + "\n\nPor favor, retorne APENAS o JSON válido, sem tags markdown ou comentários adicionais." }
           ]
         })
       });

       if (!response.ok) {
         const err = await response.text();
         throw new Error(`Anthropic Error: ${err}`);
       }

       const data = await response.json();
       resultJsonString = data.content[0].text;
    } else {
       return NextResponse.json({ error: "Provedor de IA inválido em AI_PROVIDER." }, { status: 500 });
    }

    // Attempt to parse exactly the json
    const startIdx = resultJsonString.indexOf('{');
    const endIdx = resultJsonString.lastIndexOf('}');
    if (startIdx !== -1 && endIdx !== -1) {
      resultJsonString = resultJsonString.substring(startIdx, endIdx + 1);
    }
    
    const parsedResult = JSON.parse(resultJsonString);

    return NextResponse.json(parsedResult);

  } catch (error: any) {
    console.error("API Error:", error);
    return NextResponse.json({ error: error.message || "Falha ao processar o currículo." }, { status: 500 });
  }
}
