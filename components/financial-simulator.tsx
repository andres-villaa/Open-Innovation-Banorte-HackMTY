import ReactMarkdown from "react-markdown";


import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import { Line, LineChart, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Legend, Tooltip } from "recharts"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { TrendingUp, TrendingDown, DollarSign, Loader2, Sparkles } from "lucide-react"
import axios from "axios"; // Importar Axios para realizar solicitudes HTTP

import dashboardData from "@/data/dashboard_metrics.json"

// Configuración de la API de Gemini
const GEMINI_API_KEY = process.env.NEXT_PUBLIC_GEMINI_API_KEY;
const GEMINI_API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_API_KEY}`;

// Initial base values for the simulation (sourced from dashboard JSON)
const BASE_REVENUE = dashboardData.financialBase?.baseRevenue ?? 100000
const BASE_COST = dashboardData.financialBase?.baseCost ?? 70000

// Mover la definición de fetchWithRetry al inicio del archivo para que esté disponible globalmente
const fetchWithRetry = async (url: string, options: any, retries = 3, delay = 1000): Promise<any> => {
  for (let i = 0; i < retries; i++) {
    try {
      const response = await axios.post(url, options);
      return response;
    } catch (error: any) {
      if (error.response?.status === 429 && i < retries - 1) {
        await new Promise((resolve) => setTimeout(resolve, delay * (i + 1)));
      } else if (error.response?.status === 403) {
        console.error("Authorization error: Check your API key or permissions.");
        throw new Error("Authorization error: Access denied.");
      } else {
        throw error;
      }
    }
  }
};

export function FinancialSimulator() {
  // Debug: Print Gemini API key at runtime
  console.log('Gemini API Key:', process.env.NEXT_PUBLIC_GEMINI_API_KEY);
  // State for slider values
  const [revenueGrowth, setRevenueGrowth] = useState(10)
  const [costIncrease, setCostIncrease] = useState(5)
  const [inflationRate, setInflationRate] = useState(3)

  // State for simulation
  const [isSimulating, setIsSimulating] = useState(false)
  const [hasSimulated, setHasSimulated] = useState(false)

  // State for AI insight
  const [isFetchingInsight, setIsFetchingInsight] = useState(false);
  const [insightError, setInsightError] = useState<string | null>(null);
  const [aiInsight, setAiInsight] = useState<string | null>(null); // Estado para almacenar la respuesta de Gemini

  // Calculate projected values based on slider inputs
  const calculateProjections = () => {
    const months = []

    for (let i = 0; i < 12; i++) {
      // Calculate monthly growth factors
      const monthlyRevenueGrowth = revenueGrowth / 100 / 12
      const monthlyCostIncrease = costIncrease / 100 / 12
      const monthlyInflation = inflationRate / 100 / 12

      // Calculate values for this month
      const revenue = BASE_REVENUE * (1 + monthlyRevenueGrowth * i)
      const cost = BASE_COST * (1 + monthlyCostIncrease * i)
      const inflationImpact = revenue * monthlyInflation * i
      const profit = revenue - cost - inflationImpact

      months.push({
        month: `Month ${i + 1}`,
        revenue: Math.round(revenue),
        cost: Math.round(cost),
        profit: Math.round(profit),
      })
    }

    return months
  }

  // Get current and projected totals
  const projectionData = calculateProjections()
  const currentProfit = BASE_REVENUE - BASE_COST
  const projectedProfit = projectionData[11].profit
  const profitChange = ((projectedProfit - currentProfit) / currentProfit) * 100

  // Run simulation with loading animation
  const handleRunSimulation = async () => {
    setIsSimulating(true)
    setHasSimulated(false)
    setAiInsight(null); // Reiniciar el estado del insight

    // Simular tiempo de procesamiento
    setTimeout(async () => {
      setIsSimulating(false)
      setHasSimulated(true)

      // Generar el insight después de la simulación
      await handleGenerateInsight();
    }, 1500)
  }

  // Generate AI insight based on the scenario
  const generateInsight = async () => {
    try {
      const response = await fetchWithRetry(
        GEMINI_API_URL,
        {
          contents: [
            {
              role: "user",
              parts: [
                {
                  text: `With a ${revenueGrowth}% increase in revenue and ${costIncrease}% higher costs, your projected profit is expected to ${profitChange > 0 ? "grow" : "decline"} by ${Math.abs(profitChange).toFixed(1)}% over the next year.\n\nPlease provide:\n- A summary of the financial outlook.\n- 3 bullet points with actionable recommendations for the business, formatted as a Markdown list.\n- IMPORTANT: Add a blank line before the bullet list so it renders correctly in Markdown.\n- Keep the response concise and clear for business decision makers.`
                }
              ]
            }
          ]
        },
        3, // Número de reintentos
        1000 // Retraso entre reintentos
      );

      // Debug: Log full Gemini API response
      console.log('Gemini API full response:', response.data);
      if (
        !response.data ||
        !response.data.candidates ||
        !response.data.candidates[0] ||
        !response.data.candidates[0].content ||
        !response.data.candidates[0].content.parts ||
        !response.data.candidates[0].content.parts[0] ||
        !response.data.candidates[0].content.parts[0].text
      ) {
        // Log the full error object if available
        if (response.data && response.data.error) {
          console.error('Gemini API error object:', response.data.error);
        }
        throw new Error("Invalid API response structure");
      }

      return response.data.candidates[0].content.parts[0].text;
    } catch (error) {
      // Log the full Axios error object
      if (error.response) {
        console.error('Gemini API Axios error response:', error.response.data);
      }
      console.error("Error fetching insight from Gemini:", error);
      return "There was an error generating the insight. Please try again later.";
    }
  };

  const handleGenerateInsight = async () => {
    setIsFetchingInsight(true);
    setInsightError(null);
    console.log("handleGenerateInsight called"); // Depuración para confirmar que la función se ejecuta

    try {
    const insight = await generateInsight();
    console.log("AI Insight:", insight); // Depuración para verificar el valor de la respuesta
    setAiInsight(insight); // Guardar la respuesta en el estado, con Markdown
    console.log("AI Insight State:", aiInsight); // Depuración para verificar el estado actualizado
    } catch (error) {
      setInsightError("Failed to fetch insight. Please try again later.");
    } finally {
      setIsFetchingInsight(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Financial Simulator</h1>
        <p className="text-muted-foreground mt-2">Predict future financial outcomes by adjusting key variables</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Left Column: Controls & Summary */}
        <div className="space-y-6">
          {/* Controls Card */}
          <Card>
            <CardHeader>
              <CardTitle>Simulation Controls</CardTitle>
              <CardDescription>Adjust variables to see projected outcomes</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Revenue Growth Slider */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-sm font-medium">Revenue Growth (%)</label>
                  <span className="text-sm font-semibold text-primary">{revenueGrowth}%</span>
                </div>
                <Slider
                  value={[revenueGrowth]}
                  onValueChange={(value) => setRevenueGrowth(value[0])}
                  min={-20}
                  max={50}
                  step={1}
                  className="w-full"
                />
              </div>

              {/* Operational Cost Increase Slider */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-sm font-medium">Operational Cost Increase (%)</label>
                  <span className="text-sm font-semibold text-orange-600">{costIncrease}%</span>
                </div>
                <Slider
                  value={[costIncrease]}
                  onValueChange={(value) => setCostIncrease(value[0])}
                  min={-10}
                  max={30}
                  step={1}
                  className="w-full"
                />
              </div>

              {/* Inflation Rate Slider */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-sm font-medium">Inflation Rate (%)</label>
                  <span className="text-sm font-semibold text-red-600">{inflationRate}%</span>
                </div>
                <Slider
                  value={[inflationRate]}
                  onValueChange={(value) => setInflationRate(value[0])}
                  min={0}
                  max={15}
                  step={0.5}
                  className="w-full"
                />
              </div>

              {/* Run Simulation Button */}
              <Button onClick={handleRunSimulation} disabled={isSimulating} className="w-full" size="lg">
                {isSimulating ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Running Simulation...
                  </>
                ) : (
                  <>
                    <Sparkles className="mr-2 h-4 w-4" />
                    Run Simulation
                  </>
                )}
              </Button>
            </CardContent>
          </Card>

          {/* Summary Card */}
          <Card>
            <CardHeader>
              <CardTitle>Financial Summary</CardTitle>
              <CardDescription>Current vs. Projected Values</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Current Profit */}
              <div className="flex items-center justify-between rounded-lg bg-accent/50 p-4">
                <div className="flex items-center gap-3">
                  <div className="rounded-full bg-blue-500/10 p-2">
                    <DollarSign className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Current Profit</p>
                    <p className="text-2xl font-bold">${currentProfit.toLocaleString()}</p>
                  </div>
                </div>
              </div>

              {/* Projected Profit */}
              <div className="flex items-center justify-between rounded-lg bg-accent/50 p-4">
                <div className="flex items-center gap-3">
                  <div className={`rounded-full p-2 ${profitChange >= 0 ? "bg-green-500/10" : "bg-red-500/10"}`}>
                    {profitChange >= 0 ? (
                      <TrendingUp className="h-5 w-5 text-green-600" />
                    ) : (
                      <TrendingDown className="h-5 w-5 text-red-600" />
                    )}
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Projected Profit (Year End)</p>
                    <p className="text-2xl font-bold">${projectedProfit.toLocaleString()}</p>
                  </div>
                </div>
              </div>

              {/* Change Indicator */}
              <div className="rounded-lg border border-border bg-card p-4">
                <p className="text-sm text-muted-foreground mb-1">Expected Change</p>
                <p className={`text-xl font-bold ${profitChange >= 0 ? "text-green-600" : "text-red-600"}`}>
                  {profitChange >= 0 ? "+" : ""}
                  {profitChange.toFixed(1)}%
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column: Charts & Insights */}
        <div className="space-y-6">
          {/* Chart Card */}
          <Card>
            <CardHeader>
              <CardTitle>12-Month Projection</CardTitle>
              <CardDescription>Revenue, Cost, and Profit trends</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={320}>
                <LineChart data={projectionData} margin={{ top: 5, right: 10, left: 10, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                  <XAxis dataKey="month" className="text-xs" />
                  <YAxis
                    className="text-xs"
                    tickFormatter={(value) => `$${(value / 1e9).toFixed(1)}B`} // Formato en billones
                  />
                  <Tooltip formatter={(value: number) => `$${Number(value).toLocaleString()}`} />
                  <Legend />
                  <Line type="monotone" dataKey="revenue" name="Revenue" stroke="#3b82f6" strokeWidth={2} dot={false} />
                  <Line type="monotone" dataKey="cost" name="Cost" stroke="#ef4444" strokeWidth={2} dot={false} />
                  <Line type="monotone" dataKey="profit" name="Profit" stroke="#22c55e" strokeWidth={2} dot={false} />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* AI Insights Card debajo de la gráfica */}
          {aiInsight && (
            <Card className="border-primary/50 bg-primary/5">
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Sparkles className="h-5 w-5 text-primary" />
                  <CardTitle>AI Insights</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-sm leading-relaxed">
                  <ReactMarkdown>{aiInsight ?? ""}</ReactMarkdown>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}

const fetchInsight = async (revenueGrowth: number, costIncrease: number, profitChange: number) => {
    const generateInsight = async () => {
      try {
        const response = await fetchWithRetry(
          GEMINI_API_URL,
          {
            contents: [
              {
                parts: [
                  {
                    text: `With a ${revenueGrowth}% increase in revenue and ${costIncrease}% higher costs, your projected profit is expected to ${profitChange > 0 ? "grow" : "decline"} by ${Math.abs(profitChange).toFixed(1)}%.`
                  }
                ]
              }
            ]
          },
          3, // Número de reintentos
          1000 // Retraso entre reintentos
        );

        if (!response.data || !response.data.contents || !response.data.contents[0] || !response.data.contents[0].parts || !response.data.contents[0].parts[0]) {
          throw new Error("Invalid API response structure");
        }

        return response.data.contents[0].parts[0].text;
      } catch (error) {
        console.error("Error fetching insight from Gemini:", error);
        return "There was an error generating the insight. Please try again later.";
      }
    };

    return await generateInsight();
  };
