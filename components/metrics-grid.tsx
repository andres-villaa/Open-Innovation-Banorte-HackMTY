import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowDown, ArrowUp, DollarSign, ShoppingCart, TrendingUp, Users, CreditCard, Percent } from "lucide-react"
import dashboardData from "@/data/dashboard_metrics.json"

// Map icon name from JSON to actual lucide component
const iconMap: Record<string, any> = {
  DollarSign,
  Users,
  ShoppingCart,
  TrendingUp,
  CreditCard,
  Percent,
}

export function MetricsGrid() {
  const metrics = dashboardData.metrics || []

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
  {metrics.map((metric: any) => {
        const Icon = iconMap[metric.icon] || DollarSign

        return (
          <Card key={metric.title}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">{metric.title}</CardTitle>
              <Icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{metric.value}</div>
              <div className="flex items-center gap-1 text-xs">
                {metric.trend === "up" ? (
                  <ArrowUp className="h-3 w-3 text-green-600" />
                ) : metric.trend === "down" ? (
                  <ArrowDown className="h-3 w-3 text-red-600" />
                ) : null}
                <span className={
                  metric.trend === "up" ? "text-green-600" : 
                  metric.trend === "down" ? "text-red-600" : 
                  "text-muted-foreground"
                }>
                  {metric.change}
                </span>
                <span className="text-muted-foreground">vs mes anterior</span>
              </div>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}
