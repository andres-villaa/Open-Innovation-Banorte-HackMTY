"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts"

import dashboardData from "@/data/dashboard_metrics.json"
import summaryCompanies from "@/data/summary_companies.json"

const revenueData = dashboardData.revenueData || []
const trafficData = dashboardData.trafficData || []
const performanceData = dashboardData.performanceData || []
const monthlyBreakdown = dashboardData.monthlyBreakdown || []
const productSalesPerformance = dashboardData.productSalesPerformance || {}
const topExpenseCategory = dashboardData.topExpenseCategory || {}

// Pie chart data for product sales concentration
const productPieData = [
  {
    name: "Producto A",
    value: productSalesPerformance.producto_a?.concentration || 0,
  },
  {
    name: "Producto B",
    value: productSalesPerformance.producto_b?.concentration || 0,
  },
]

const pieColors = ["#3b82f6", "#f59e42"]

interface ChartsSectionProps {
  empresaId: string;
}

export function ChartsSection({ empresaId }: ChartsSectionProps) {

  // Buscar la empresa seleccionada
  const empresa = (summaryCompanies as any[]).find(e => e.empresa_id === empresaId);

  let chartData;
  const monthNames = ["Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"];
  if (empresa && empresa.mensual) {
    // Convertir el objeto mensual a un array y ordenar por fecha ascendente
    const mensualArr = Object.entries(empresa.mensual)
      .map(([fecha, valores]: any) => {
        // fecha: "2023-01" => mes = 1, año = 2023
        const [anio, mes] = fecha.split("-");
        const mesIdx = parseInt(mes, 10) - 1;
        return {
          month: `${monthNames[mesIdx]} '${anio.slice(2)}`,
          revenue: valores.ingresos,
          expenses: valores.gastos,
          profit: valores.utilidad,
        };
      })
      .sort((a, b) => a.month.localeCompare(b.month));
    // Tomar los últimos 12 meses
    chartData = mensualArr.slice(-12);
  } else {
    // Usar los datos globales
    chartData = monthlyBreakdown.slice(-12);
  }

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      {/* Gráfica: Evolución mensual de ingresos, gastos y utilidad */}
      <Card className="lg:col-span-2">
        <CardHeader>
          <CardTitle>Evolución mensual de ingresos, gastos y utilidad</CardTitle>
          <CardDescription>Serie de los últimos 12 meses</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={320}>
            <LineChart data={chartData} margin={{ top: 5, right: 10, left: 10, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
              <XAxis dataKey="month" className="text-xs" />
              <YAxis className="text-xs" tickFormatter={v => `$${(v/1e6).toFixed(0)}M`} />
              <Tooltip formatter={v => `$${Number(v).toLocaleString()}`}/>
              <Legend />
              <Line type="monotone" dataKey="revenue" name="Ingresos" stroke="#3b82f6" strokeWidth={2} dot={false} />
              <Line type="monotone" dataKey="expenses" name="Gastos" stroke="#ef4444" strokeWidth={2} dot={false} />
              <Line type="monotone" dataKey="profit" name="Utilidad" stroke="#22c55e" strokeWidth={2} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
      {/* Nueva gráfica: Concentración de ventas por producto */}
      <Card>
        <CardHeader>
          <CardTitle>Concentración de Ventas</CardTitle>
          <CardDescription>Porcentaje de ventas por producto</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={productPieData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={80}
                label={({ name, percent }) => `${name}: ${typeof percent === 'number' ? (percent * 100).toFixed(1) : '0.0'}%`}
              >
                {productPieData.map((entry, idx) => (
                  <Cell key={`cell-${idx}`} fill={pieColors[idx % pieColors.length]} />
                ))}
              </Pie>
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
      {/* Nueva gráfica: Desglose de gastos por categoría */}
      <Card>
        <CardHeader>
          <CardTitle>Desglose de Gastos por Categoría</CardTitle>
          <CardDescription>Principales categorías de gasto</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={performanceData.filter(d => d.category !== "Producto A" && d.category !== "Producto B")}> 
              <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
              <XAxis dataKey="category" className="text-xs" />
              <YAxis className="text-xs" tickFormatter={v => `$${(v/1e9).toFixed(1)}B`} />
              <Tooltip formatter={v => `$${Number(v).toLocaleString()}`}/>
              <Bar dataKey="value" fill="#f59e42" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
      
    </div>
  );
}
