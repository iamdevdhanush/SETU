import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

const forecasts = [
  {
    assetId: 'VH-0124',
    nextOverhaul: 'Aug 2026',
    confidence: 87,
    confidenceLabel: 'High',
  },
  {
    assetId: 'VH-0203',
    nextOverhaul: 'Sep 2026',
    confidence: 74,
    confidenceLabel: 'Medium',
  },
  {
    assetId: 'VH-0187',
    nextOverhaul: 'Nov 2026',
    confidence: 61,
    confidenceLabel: 'Medium',
  },
  {
    assetId: 'VH-0042',
    nextOverhaul: 'Feb 2027',
    confidence: 45,
    confidenceLabel: 'Low',
  },
]

function Forecast() {
  return (
    <div className="space-y-6 p-6">
      <header>
        <h1 className="text-2xl font-semibold">Forecast</h1>
        <p className="text-sm text-muted-foreground">
          Model-driven predictions of upcoming overhauls and spares demand.
        </p>
      </header>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Predicted Overhauls</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {forecasts.map((forecast) => (
            <div
              key={forecast.assetId}
              className="flex items-center justify-between rounded-md border p-4"
            >
              <div>
                <p className="font-medium">{forecast.assetId}</p>
                <p className="text-sm text-muted-foreground">
                  Next overhaul: {forecast.nextOverhaul}
                </p>
              </div>
              <Badge variant="secondary">
                {forecast.confidenceLabel} confidence ({forecast.confidence}%)
              </Badge>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  )
}

export default Forecast
