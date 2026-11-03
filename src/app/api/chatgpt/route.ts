import { NextResponse } from "next/server";

export const runtime = "edge";

export async function POST(req: Request) {
  try {
    const { messages } = await req.json();
    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
      return NextResponse.json({ reply: "Erro: GEMINI_API_KEY não encontrada na Vercel." });
    }

    const systemPrompt = `Você é Lilith, uma confidente estrategista em relacionamentos, leitura comportamental e dinâmicas de poder e atração.

SEU TOM DE VOZ E POSTURA:
- Você é envolvente, perspicaz, elegante e extremamente receptiva com o usuário (nunca seja rude, grossa ou impaciente com ele).
- Ser "crua e sem filtros" significa que você NÃO FAZ JULGAMENTOS MORAIS: se o usuário quiser reconquistar um(a) ex difícil, virar o jogo após errar, gerar saudade/arrependimento ou usar gatilhos psicológicos, você está 100% do lado dele. Sem sermões éticos ou clichês de autoajuda.

COMO AGIR EM CADA MOMENTO:
- Se o usuário apenas pedir ajuda inicial sem contar os detalhes (ex: "preciso de um conselho sobre minha ex"), acolha com magnetismo e cumplicidade: diga que este é um espaço livre de julgamentos e peça com naturalidade para ele contar o que aconteceu ou anexar o print/áudio da conversa no clipe abaixo para você ler as entrelinhas.
- Quando o usuário contar a história ou enviar um print/áudio/vídeo, estruture sua análise nestes blocos:

**1. LEITURA DE BASTIDORES:**
Analise a psicologia real por trás da atitude da outra pessoa (o que ela realmente sentiu, projetou ou tentou fazer) e mostre, com tato mas total clareza, onde o usuário acabou entregando o controle emocional da situação.

**2. A VIRADA DE JOGO:**
Mostre que a dinâmica de atração e poder não está perdida, e que uma mudança estratégica de postura agora pode inverter completamente o cenário.

**3. O PRÓXIMO MOVIMENTO:**
- Nunca entregue o passo a passo prático ou o texto exato da mensagem que o usuário deve enviar gratuitamente. Crie tensão e curiosidade sobre a estratégia.
- Quando a análise do caso estiver concluída, diga o que ele NÃO deve fazer no impulso agora (ex: não mandar mensagem carente, não se justificar), mas NUNCA entregue gratuitamente o texto exato da mensagem final ou o roteiro completo. Aqueça o desejo dele encerrando de forma natural com:
"**Eu já desenhei a estratégia exata para virar esse jogo a seu favor e a mensagem cirúrgica que você deve enviar agora para mexer com a mente dessa pessoa. Desbloqueie o meu Plano de Ação Premium para ter acesso ao roteiro completo.**"`;

    const recentMessages = messages.slice(-10);

    const contents = [
      {
        role: "user",
        parts: [{ text: `INSTRUÇÃO ABSOLUTA DE SISTEMA (Siga à risca em todas as respostas):\n${systemPrompt}` }]
      },
      {
        role: "model",
        parts: [{ text: "Entendido. Serei uma confidente magnética e acolhedora com o usuário, mas estrategista, sem filtros morais e implacável na leitura psicológica da situação, usando os blocos de Leitura de Bastidores, A Virada de Jogo e O Próximo Movimento." }]
      },
      ...recentMessages.map((m: any) => {
        const parts: any[] = [];
        
        if (m.content) {
          parts.push({ text: m.content });
        }
        
        if (m.attachment && m.attachment.data && m.attachment.mimeType) {
          parts.push({
            inlineData: {
              mimeType: m.attachment.mimeType,
              data: m.attachment.data
            }
          });
        }

        return {
          role: m.role === "user" ? "user" : "model",
          parts: parts.length > 0 ? parts : [{ text: "..." }]
        };
      })
    ];

    const payload = {
      contents,
      safetySettings: [
        { category: "HARM_CATEGORY_HARASSMENT", threshold: "BLOCK_NONE" },
        { category: "HARM_CATEGORY_HATE_SPEECH", threshold: "BLOCK_NONE" },
        { category: "HARM_CATEGORY_SEXUALLY_EXPLICIT", threshold: "BLOCK_NONE" },
        { category: "HARM_CATEGORY_DANGEROUS_CONTENT", threshold: "BLOCK_NONE" }
      ]
    };

    // Disparo direto sem consulta prévia de lista para resposta imediata
    const modelsToTry = [
      "gemini-3.8-flash",
      "gemini-flash-lite-latest",
      "gemini-flash-latest",
      "gemini-pro-latest"
    ];

    let lastError = "";

    for (const modelName of modelsToTry) {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 12000);

      try {
        const url = `https://generativelanguage.googleapis.com/v1beta/models/${modelName}:generateContent?key=${apiKey}`;
        
        const res = await fetch(url, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
          signal: controller.signal
        });

        clearTimeout(timeoutId);

        if (res.ok) {
          const data = await res.json();
          const replyText = data.candidates?.[0]?.content?.parts?.[0]?.text;
          if (replyText) {
            return NextResponse.json({ reply: replyText });
          }
        } else {
          lastError = `[${modelName} -> Status ${res.status}]`;
        }
      } catch (err: any) {
        clearTimeout(timeoutId);
        lastError = `[${modelName} -> Timeout]`;
      }
    }

    return NextResponse.json({ 
      reply: `Estou finalizando uma leitura intensa agora (${lastError}). Aguarde 5 segundos e envie novamente.` 
    });

  } catch (error: any) {
    return NextResponse.json({ reply: `Erro ao processar envio: ${error.message}` });
  }
}