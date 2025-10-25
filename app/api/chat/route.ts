import { consumeStream, convertToModelMessages, streamText, type UIMessage } from "ai"

export const maxDuration = 30

export async function POST(req: Request) {
  const { messages }: { messages: UIMessage[] } = await req.json()

  const systemPrompt = `Eres un asistente de análisis de negocios experto. Tu trabajo es ayudar a los usuarios a entender sus datos de negocio, métricas y rendimiento.

Contexto del dashboard:
- Ingresos totales: $45,231.89 (↑20.1% vs mes anterior)
- Clientes activos: 2,350 (↑15.3% vs mes anterior)
- Ventas: 1,234 (↓4.2% vs mes anterior)
- Tasa de conversión: 3.24% (↑8.7% vs mes anterior)

Productos principales:
- Producto A: $4,000 en ventas
- Producto B: $3,000 en ventas
- Producto C: $2,000 en ventas
- Producto D: $2,780 en ventas
- Producto E: $1,890 en ventas

Responde de manera concisa, profesional y útil. Proporciona insights accionables cuando sea posible.`

  const prompt = [{ role: "system" as const, content: systemPrompt }, ...convertToModelMessages(messages)]

  const result = streamText({
    model: "openai/gpt-5-mini",
    messages: prompt,
    abortSignal: req.signal,
    maxOutputTokens: 500,
    temperature: 0.7,
  })

  return result.toUIMessageStreamResponse({
    onFinish: async ({ isAborted }) => {
      if (isAborted) {
        console.log("[v0] Chat aborted by user")
      }
    },
    consumeSseStream: consumeStream,
  })
}
