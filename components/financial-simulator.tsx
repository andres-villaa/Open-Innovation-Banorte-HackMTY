"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import { Line, LineChart, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Legend } from "recharts"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { TrendingUp, TrendingDown, DollarSign, Loader2, Sparkles } from "lucide-react"

import dashboardData from "@/data/dashboard_metrics.json"

// Initial base values for the simulation (sourced from dashboard JSON)
const BASE_REVENUE = dashboardData.financialBase?.baseRevenue ?? 100000
const BASE_COST = dashboardData.financialBase?.baseCost ?? 70000

export function FinancialSimulator() {
  // State for slider values
  const [revenueGrowth, setRevenueGrowth] = useState(10)
  const [costIncrease, setCostIncrease] = useState(5)
  const [inflationRate, setInflationRate] = useState(3)

  // State for simulation
  const [isSimulating, setIsSimulating] = useState(false)
  const [hasSimulated, setHasSimulated] = useState(false)

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
  const handleRunSimulation = () => {
    setIsSimulating(true)
    // Simulate processing time
    setTimeout(() => {
      setIsSimulating(false)
      setHasSimulated(true)
    }, 1500)
  }

  // Generate AI insight based on the scenario
  const generateInsight = () => {
    const profitDirection = profitChange > 0 ? "grow" : "decline"
    const profitEmoji = profitChange > 0 ? "📈" : "📉"

    return `With a ${revenueGrowth}% increase in revenue and ${costIncrease}% higher costs, your projected profit is expected to ${profitDirection} by ${Math.abs(profitChange).toFixed(1)}%. ${profitEmoji}`
  }

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
              <ChartContainer
                config={{
                  revenue: {
                    label: "Revenue",
                    color: "hsl(var(--chart-1))",
                  },
                  cost: {
                    label: "Cost",
                    color: "hsl(var(--chart-2))",
                  },
                  profit: {
                    label: "Profit",
                    color: "hsl(var(--chart-3))",
                  },
                }}
                className="h-[350px]"
              >
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={projectionData} margin={{ top: 5, right: 10, left: 10, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                    <XAxis dataKey="month" className="text-xs" tick={{ fontSize: 11 }} />
                    <YAxis
                      className="text-xs"
                      tick={{ fontSize: 11 }}
                      tickFormatter={(value) => `$${(value / 1000).toFixed(0)}k`}
                    />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Legend />
                    <Line type="monotone" dataKey="revenue" stroke="var(--color-revenue)" strokeWidth={2} dot={false} />
                    <Line type="monotone" dataKey="cost" stroke="var(--color-cost)" strokeWidth={2} dot={false} />
                    <Line type="monotone" dataKey="profit" stroke="var(--color-profit)" strokeWidth={2} dot={false} />
                  </LineChart>
                </ResponsiveContainer>
              </ChartContainer>
            </CardContent>
          </Card>

          {/* AI Insights Card */}
          {hasSimulated && (
            <Card className="border-primary/50 bg-primary/5">
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Sparkles className="h-5 w-5 text-primary" />
                  <CardTitle>AI Insights</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm leading-relaxed">{generateInsight()}</p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}
