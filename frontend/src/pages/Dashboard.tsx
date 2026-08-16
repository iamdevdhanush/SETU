import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

const readinessData = [
  { month: 'Jan', ready: 92, atRisk: 6, down: 2 },
  { month: 'Feb', ready: 90, atRisk: 8, down: 2 },
  { month: 'Mar', ready: 88, atRisk: 9, down: 3 },
  { month: 'Apr', ready: 91, atRisk: 7, down: 2 },
  { month: 'May', ready: 89, atRisk: 8, down: 3 },
  { month: 'Jun', ready: 94, atRisk: 5, down: 1 },
]

const stats = [
  { label: 'Total Assets', value: '1,284' },
  { label: 'Fleet Readiness', value: '94%' },
  { label: 'Overhaul Due (90d)', value: '37' },
  { label: 'Spares Shortfall', value: '12' },
]

function Dashboard() {
  return (
    <div className="space-y-6 p-6">
      <header>
        <h1 className="text-2xl font-semibold">Dashboard</h1>
        <p className="text-sm text-muted-foreground">
          Fleet readiness and provisioning at a glance.
        </p>
      </header>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.label}>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {stat.label}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-semibold">{stat.value}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Readiness Trend</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={readinessData}>
              <defs>
                <linearGradient id="ready" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="var(--chart-1)" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="var(--chart-1)" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis domain={[0, 100]} />
              <Tooltip />
              <Area
                type="monotone"
                dataKey="ready"
                name="Ready %"
                stroke="var(--chart-1)"
                fill="url(#ready)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  )
}

export default Dashboard
