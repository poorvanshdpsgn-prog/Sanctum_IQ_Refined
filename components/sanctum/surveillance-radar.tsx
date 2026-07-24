"use client"

import { Radar, Crosshair, Target } from "lucide-react"
import { useTelemetry } from "@/lib/telemetry"
import { Panel, Stat, Pill } from "./primitives"
import { cn } from "@/lib/utils"

const threatToken: Record<string, string> = {
  low: "text-success",
  medium: "text-warning",
  high: "text-destructive",
}

export function SurveillanceRadar() {
  const t = useTelemetry()

  // radar geometry: 0..180 servo angle mapped onto a semicircle facing up.
  const size = 300
  const cx = size / 2
  const cy = size / 2
  const r = size / 2 - 10

  // convert servo angle (0 left, 180 right) to screen angle.
  const rad = (Math.PI * (180 - t.servoAngle)) / 180
  const beamX = cx + r * Math.cos(rad)
  const beamY = cy - r * Math.sin(rad)

  // detection point along the beam scaled by distance (cap 200cm)
  const distNorm = Math.min(t.scanDistance, 200) / 200
  const detX = cx + r * distNorm * Math.cos(rad)
  const detY = cy - r * distNorm * Math.sin(rad)

  return (
    <Panel glow className="flex flex-col">
      <div className="mb-4 flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="flex size-9 items-center justify-center rounded-lg bg-primary/10 text-primary ring-1 ring-primary/20">
            <Radar className="size-4" />
          </div>
          <div>
            <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
              Servo-mounted ultrasonic turret
            </p>
            <h3 className="text-sm font-semibold tracking-wide">180° Surveillance Scanner</h3>
          </div>
        </div>
        <Pill className={cn(t.targetLocked ? "border-destructive/50 text-destructive" : "border-success/40 text-success")}>
          {t.targetLocked ? (
            <>
              <Target className="size-3" /> Target Lock
            </>
          ) : (
            <>
              <Crosshair className="size-3" /> Scanning
            </>
          )}
        </Pill>
      </div>

      <div className="grid gap-5 lg:grid-cols-[300px_1fr]">
        {/* radar scope */}
        <div className="relative mx-auto aspect-square w-full max-w-[300px]">
          <svg viewBox={`0 0 ${size} ${size}`} className="size-full">
            <defs>
              <radialGradient id="scopeGlow" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="var(--primary)" stopOpacity="0.18" />
                <stop offset="70%" stopColor="var(--primary)" stopOpacity="0.04" />
                <stop offset="100%" stopColor="transparent" />
              </radialGradient>
              <linearGradient id="sweepGrad" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor="var(--primary)" stopOpacity="0" />
                <stop offset="100%" stopColor="var(--primary)" stopOpacity="0.55" />
              </linearGradient>
            </defs>

            <circle cx={cx} cy={cy} r={r} fill="url(#scopeGlow)" />

            {/* range rings */}
            {[0.33, 0.66, 1].map((f) => (
              <circle
                key={f}
                cx={cx}
                cy={cy}
                r={r * f}
                fill="none"
                stroke="var(--primary)"
                strokeOpacity={0.18}
                strokeWidth={1}
              />
            ))}

            {/* cross axes */}
            <line x1={cx - r} y1={cy} x2={cx + r} y2={cy} stroke="var(--primary)" strokeOpacity={0.14} />
            <line x1={cx} y1={cy - r} x2={cx} y2={cy + r} stroke="var(--primary)" strokeOpacity={0.14} />

            {/* rotating sweep */}
            <g
              className={t.targetLocked ? undefined : "animate-radar-sweep"}
              style={{ transformOrigin: `${cx}px ${cy}px` }}
            >
              <path
                d={`M ${cx} ${cy} L ${cx + r} ${cy} A ${r} ${r} 0 0 0 ${
                  cx + r * Math.cos(-0.5)
                } ${cy + r * Math.sin(-0.5)} Z`}
                fill="url(#sweepGrad)"
              />
              <line x1={cx} y1={cy} x2={cx + r} y2={cy} stroke="var(--primary)" strokeWidth={1.5} />
            </g>

            {/* live beam (servo direction) */}
            <line
              x1={cx}
              y1={cy}
              x2={beamX}
              y2={beamY}
              stroke={t.targetLocked ? "var(--destructive)" : "var(--primary)"}
              strokeWidth={2}
              strokeLinecap="round"
              opacity={0.9}
            />

            {/* detection point */}
            {t.objectDetected ? (
              <>
                <circle cx={detX} cy={detY} r={5} fill="var(--destructive)" />
                <circle
                  cx={detX}
                  cy={detY}
                  r={5}
                  fill="none"
                  stroke="var(--destructive)"
                  strokeWidth={1.5}
                  className="animate-pulse-ring"
                  style={{ transformOrigin: `${detX}px ${detY}px` }}
                />
              </>
            ) : null}

            {/* hub */}
            <circle cx={cx} cy={cy} r={4} fill="var(--primary)" />
          </svg>

          <div className="pointer-events-none absolute inset-x-0 bottom-2 text-center font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
            {t.servoAngle}° / 180°
          </div>
        </div>

        {/* readouts */}
        <div className="grid grid-cols-2 gap-3 self-start">
          <Stat label="Scanning Status" value={t.targetLocked ? "TARGET LOCKED" : "ACTIVE"} accent={t.targetLocked ? "text-destructive" : "text-success"} />
          <Stat label="Servo Angle" value={`${t.servoAngle}°`} accent="text-primary" />
          <Stat label="Detection Distance" value={`${t.scanDistance} cm`} accent="text-foreground" />
          <Stat
            label="Detected Object"
            value={t.objectDetected ? "YES" : "NO"}
            accent={t.objectDetected ? "text-destructive" : "text-muted-foreground"}
          />
          <div className="col-span-2 rounded-xl border border-border/60 bg-background/40 p-3">
            <p className="font-mono text-[10px] uppercase tracking-[0.15em] text-muted-foreground">
              Threat Level
            </p>
            <div className="mt-2 flex items-center gap-3">
              {(["low", "medium", "high"] as const).map((lvl) => {
                const active =
                  (t.threatLevel === "low" && lvl === "low") ||
                  (t.threatLevel === "medium" && (lvl === "low" || lvl === "medium")) ||
                  t.threatLevel === "high"
                const tone =
                  lvl === "low" ? "bg-success" : lvl === "medium" ? "bg-warning" : "bg-destructive"
                return (
                  <div
                    key={lvl}
                    className={cn("h-2 flex-1 rounded-full transition-colors", active ? tone : "bg-secondary")}
                  />
                )
              })}
            </div>
            <p className={cn("mt-2 font-mono text-sm font-semibold uppercase", threatToken[t.threatLevel])}>
              {t.threatLevel}
            </p>
          </div>
          <p className="col-span-2 text-pretty text-xs leading-relaxed text-muted-foreground">
            The bag is actively monitoring its surroundings. On suspicious movement the turret locks
            onto the detected bearing and dispatches an owner alert.
          </p>
        </div>
      </div>
    </Panel>
  )
}
