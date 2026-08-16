import { Routes, Route, Navigate } from 'react-router-dom';
import { Sidebar } from '@/components/layout/Sidebar';
import { TopBar } from '@/components/layout/TopBar';

import { OverviewPage } from '@/pages/Overview';
import { EquipmentPage } from '@/pages/Equipment';
import { EquipmentDetailPage } from '@/pages/EquipmentDetail';
import { SparesPage } from '@/pages/Spares';
import { SustainmentCasesPage } from '@/pages/SustainmentCases';
import { SimulatorPage } from '@/pages/Simulator';
import { ForecastAccuracyPage } from '@/pages/ForecastAccuracy';
import { HistoryPage } from '@/pages/History';
import { DataPage } from '@/pages/Data';
import { SettingsPage } from '@/pages/Settings';

function App() {
  return (
    <div className="flex h-screen w-screen overflow-hidden" style={{ background: 'var(--bg-base)' }}>
      <Sidebar />

      <div className="flex-1 flex flex-col min-w-0 h-full overflow-hidden">
        <TopBar />

        {/* Main content — MUST be overflow-hidden for split-view pages to scroll internally */}
        <main className="flex-1 overflow-hidden" style={{ background: 'var(--bg-base)' }}>
          <Routes>
            <Route path="/" element={<OverviewPage />} />
            <Route path="/equipment" element={<EquipmentPage />} />
            <Route path="/equipment/:id" element={<EquipmentDetailPage />} />
            <Route path="/spares" element={<SparesPage />} />
            <Route path="/cases" element={<SustainmentCasesPage />} />
            <Route path="/simulator" element={<SimulatorPage />} />
            <Route path="/accuracy" element={<ForecastAccuracyPage />} />
            <Route path="/history" element={<HistoryPage />} />
            <Route path="/data" element={<DataPage />} />
            <Route path="/settings" element={<SettingsPage />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
      </div>
    </div>
  );
}

export default App;
