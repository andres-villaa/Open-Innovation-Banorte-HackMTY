import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowDown, ArrowUp, DollarSign, ShoppingCart, TrendingUp, Users, CreditCard, Percent } from "lucide-react"
import dashboardData from "@/data/dashboard_metrics.json"
import summaryCompanies from "@/data/summary_companies.json"

// Map icon name from JSON to actual lucide component
const iconMap: Record<string, any> = {
  DollarSign,
  Users,
  ShoppingCart,
  TrendingUp,
  CreditCard,
  Percent,
}

interface MetricsGridProps {
  empresaId: string
}

export function MetricsGrid({ empresaId }: MetricsGridProps) {
  // Buscar la empresa seleccionada
  const empresa = (summaryCompanies as any[]).find(e => e.empresa_id === empresaId)

  // Si existe la empresa, usar sus datos, si no, mostrar los valores originales
  const metrics = [
    {
      title: "Ingresos Totales",
      value: empresa && typeof empresa.ingresos === 'number' ? `$${empresa.ingresos.toLocaleString(undefined, {maximumFractionDigits:2})}` : dashboardData.metrics[0].value,
      change: empresa ? undefined : dashboardData.metrics[0].change,
      trend: empresa ? undefined : dashboardData.metrics[0].trend,
      icon: "DollarSign"
    },
    {
      title: "Gastos Totales",
      value: empresa && typeof empresa.gastos === 'number' ? `$${empresa.gastos.toLocaleString(undefined, {maximumFractionDigits:2})}` : dashboardData.metrics[1].value,
      change: empresa ? undefined : dashboardData.metrics[1].change,
      trend: empresa ? undefined : dashboardData.metrics[1].trend,
      icon: "CreditCard"
    },
    {
      title: "Beneficio Neto",
      value: empresa && typeof empresa.beneficio === 'number' ? `$${empresa.beneficio.toLocaleString(undefined, {maximumFractionDigits:2})}` : (empresa && typeof empresa.utilidad === 'number' ? `$${empresa.utilidad.toLocaleString(undefined, {maximumFractionDigits:2})}` : dashboardData.metrics[2].value),
      change: empresa ? undefined : dashboardData.metrics[2].change,
      trend: empresa ? undefined : dashboardData.metrics[2].trend,
      icon: "TrendingUp"
    },
    {
      title: "Transacciones",
      value: empresa && typeof empresa.transacciones === 'number' ? empresa.transacciones.toLocaleString() : "-",
      change: undefined,
      trend: undefined,
      icon: "Users"
    }
  ]

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
