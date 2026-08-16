import React from 'react';
import type { PlatformClass, EquipmentStatus, RiskLevel } from '@/types/equipment';
import { cn } from '@/lib/utils';

interface EquipmentVisualProps {
  platformClass: PlatformClass;
  status?: EquipmentStatus;
  riskLevel?: RiskLevel;
  className?: string;
  showHotspots?: boolean;
}

export const EquipmentVisual: React.FC<EquipmentVisualProps> = ({
  platformClass,
  status = 'OPERATIONAL',
  riskLevel = 'NORMAL',
  className,
  showHotspots = true
}) => {
  const getRiskColor = (risk: RiskLevel) => {
    switch (risk) {
      case 'CRITICAL':
        return '#ef4444';
      case 'HIGH':
        return '#f59e0b';
      case 'MODERATE':
        return '#06b6d4';
      default:
        return '#10b981';
    }
  };

  const riskColor = getRiskColor(riskLevel);

  return (
    <div
      className={cn(
        'relative rounded-md bg-[#090d13] border border-[#1b2738] p-4 flex flex-col items-center justify-center select-none overflow-hidden tactical-grid-bg min-h-[160px]',
        className
      )}
    >
      {/* Platform Badge Overlay */}
      <div className="absolute top-2 left-2 flex items-center gap-1.5 font-mono text-[10px] text-slate-400 bg-[#0d141e]/80 px-2 py-0.5 rounded border border-[#1c2a3c]">
        <span className="size-1.5 rounded-full" style={{ backgroundColor: riskColor }}></span>
        <span>{platformClass.toUpperCase()}</span>
      </div>

      <div className="absolute top-2 right-2 font-mono text-[9px] text-slate-500">
        TECHNICAL SCHEMATIC v1.2
      </div>

      {/* SVG Vector Schematics based on Platform Class */}
      <div className="w-full max-w-[280px] h-[100px] flex items-center justify-center my-2">
        {platformClass.includes('Tracked') && (
          <svg viewBox="0 0 300 120" className="w-full h-full text-slate-300">
            {/* Tracked Chassis Outline */}
            <rect x="20" y="70" width="260" height="30" rx="15" fill="#141e2b" stroke="#3e4f66" strokeWidth="2" />
            <circle cx="45" cy="85" r="10" fill="#1e2c3d" stroke="#526785" strokeWidth="2" />
            <circle cx="85" cy="85" r="10" fill="#1e2c3d" stroke="#526785" strokeWidth="2" />
            <circle cx="125" cy="85" r="10" fill="#1e2c3d" stroke="#526785" strokeWidth="2" />
            <circle cx="165" cy="85" r="10" fill="#1e2c3d" stroke="#526785" strokeWidth="2" />
            <circle cx="205" cy="85" r="10" fill="#1e2c3d" stroke="#526785" strokeWidth="2" />
            <circle cx="245" cy="85" r="10" fill="#1e2c3d" stroke="#526785" strokeWidth="2" />

            {/* Hull & Turret */}
            <path d="M 40 70 L 60 45 L 230 45 L 250 70 Z" fill="#192535" stroke="#3e4f66" strokeWidth="2" />
            <path d="M 100 45 L 120 25 L 190 25 L 210 45 Z" fill="#223347" stroke="#4e6482" strokeWidth="2" />

            {/* Main Cannon */}
            <rect x="200" y="32" width="90" height="6" fill="#2d425c" stroke="#5c789e" strokeWidth="1" />

            {/* Hotspots */}
            {showHotspots && (
              <>
                <circle cx="245" cy="85" r="5" fill={riskColor} className="animate-ping opacity-75" />
                <circle cx="245" cy="85" r="4" fill={riskColor} />
                <line x1="245" y1="85" x2="270" y2="105" stroke={riskColor} strokeWidth="1" strokeDasharray="2 2" />
                <text x="272" y="108" fill={riskColor} fontSize="8" fontFamily="monospace">Drive Sprocket Sensor</text>
              </>
            )}
          </svg>
        )}

        {platformClass.includes('Wheeled') && (
          <svg viewBox="0 0 300 120" className="w-full h-full text-slate-300">
            {/* Wheeled 8x8 Chassis */}
            <path d="M 30 70 L 50 40 L 250 40 L 270 70 Z" fill="#192535" stroke="#3e4f66" strokeWidth="2" />
            <rect x="40" y="30" width="120" height="15" fill="#223347" stroke="#4e6482" strokeWidth="2" />

            {/* Wheels */}
            <circle cx="60" cy="80" r="16" fill="#141e2b" stroke="#526785" strokeWidth="3" />
            <circle cx="110" cy="80" r="16" fill="#141e2b" stroke="#526785" strokeWidth="3" />
            <circle cx="180" cy="80" r="16" fill="#141e2b" stroke="#526785" strokeWidth="3" />
            <circle cx="230" cy="80" r="16" fill="#141e2b" stroke="#526785" strokeWidth="3" />

            {/* Hotspots */}
            {showHotspots && (
              <>
                <circle cx="60" cy="80" r="5" fill={riskColor} className="animate-ping opacity-75" />
                <circle cx="60" cy="80" r="4" fill={riskColor} />
                <text x="20" y="110" fill={riskColor} fontSize="8" fontFamily="monospace">CTIS Sensor</text>
              </>
            )}
          </svg>
        )}

        {platformClass.includes('Recovery') && (
          <svg viewBox="0 0 300 120" className="w-full h-full text-slate-300">
            {/* Recovery Platform with Crane Arm */}
            <rect x="30" y="65" width="240" height="25" rx="5" fill="#141e2b" stroke="#3e4f66" strokeWidth="2" />
            <path d="M 50 65 L 140 30 L 220 20" stroke="#4e9c6e" strokeWidth="4" fill="none" />
            <circle cx="60" cy="85" r="12" fill="#1e2c3d" stroke="#526785" strokeWidth="2" />
            <circle cx="120" cy="85" r="12" fill="#1e2c3d" stroke="#526785" strokeWidth="2" />
            <circle cx="180" cy="85" r="12" fill="#1e2c3d" stroke="#526785" strokeWidth="2" />
            <circle cx="240" cy="85" r="12" fill="#1e2c3d" stroke="#526785" strokeWidth="2" />

            {showHotspots && (
              <>
                <circle cx="140" cy="30" r="4" fill={riskColor} />
                <text x="148" y="28" fill={riskColor} fontSize="8" fontFamily="monospace">Winch Pressure</text>
              </>
            )}
          </svg>
        )}

        {platformClass.includes('Artillery') && (
          <svg viewBox="0 0 300 120" className="w-full h-full text-slate-300">
            {/* Artillery System */}
            <rect x="40" y="70" width="220" height="25" fill="#141e2b" stroke="#3e4f66" strokeWidth="2" />
            <line x1="120" y1="70" x2="280" y2="20" stroke="#5c789e" strokeWidth="6" />
            <rect x="100" y="55" width="40" height="20" fill="#223347" stroke="#4e6482" strokeWidth="2" />
            <circle cx="70" cy="90" r="14" fill="#141e2b" stroke="#526785" strokeWidth="3" />
            <circle cx="230" cy="90" r="14" fill="#141e2b" stroke="#526785" strokeWidth="3" />

            {showHotspots && (
              <>
                <circle cx="120" cy="70" r="5" fill={riskColor} className="animate-ping opacity-75" />
                <circle cx="120" cy="70" r="4" fill={riskColor} />
                <text x="130" y="85" fill={riskColor} fontSize="8" fontFamily="monospace">Recoil Seal Sensor</text>
              </>
            )}
          </svg>
        )}
      </div>

      {/* Footer Specs Overlay */}
      <div className="w-full flex items-center justify-between text-[10px] font-mono text-slate-400 border-t border-[#162232] pt-2">
        <span>STATUS: <strong className="text-slate-200">{status}</strong></span>
        <span>TELEMETRY: <strong className="text-emerald-400">ACTIVE</strong></span>
      </div>
    </div>
  );
};
