import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'

const assets = [
  {
    id: 'VH-0124',
    type: 'Truck',
    hours: '12,400',
    lastOverhaul: '2024-03-18',
    status: 'Overhaul due',
  },
  {
    id: 'VH-0187',
    type: 'Excavator',
    hours: '8,950',
    lastOverhaul: '2024-11-02',
    status: 'Watchlist',
  },
  {
    id: 'VH-0203',
    type: 'Generator',
    hours: '22,100',
    lastOverhaul: '2023-08-27',
    status: 'Overhaul due',
  },
  {
    id: 'VH-0310',
    type: 'Truck',
    hours: '6,300',
    lastOverhaul: '2025-06-14',
    status: 'Healthy',
  },
]

function statusVariant(status: string) {
  if (status === 'Healthy') return 'default' as const
  if (status === 'Watchlist') return 'secondary' as const
  return 'destructive' as const
}

function Assets() {
  return (
    <div className="space-y-6 p-6">
      <header>
        <h1 className="text-2xl font-semibold">Assets</h1>
        <p className="text-sm text-muted-foreground">
          Vehicles and equipment tracked for maintenance forecasting.
        </p>
      </header>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Register</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Asset ID</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Usage Hours</TableHead>
                <TableHead>Last Overhaul</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {assets.map((asset) => (
                <TableRow key={asset.id}>
                  <TableCell className="font-medium">{asset.id}</TableCell>
                  <TableCell>{asset.type}</TableCell>
                  <TableCell>{asset.hours}</TableCell>
                  <TableCell>{asset.lastOverhaul}</TableCell>
                  <TableCell>
                    <Badge variant={statusVariant(asset.status)}>
                      {asset.status}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}

export default Assets
