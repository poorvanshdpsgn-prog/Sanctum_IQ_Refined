"use client"

import { ShieldCheck, Wifi, Cpu, Clock, Radio } from "lucide-react"
import { STATE_META, useTelemetry } from "@/lib/telemetry"
import { Panel, StatusDot } from "./primitives"
import { cn } from "@/lib/utils"

function ago(ts: number) {
  const s = Math.max(0, Math.round((Date.now() - ts) / 1000))
  if (s < 2) return "Just now"
  if (s < 60) return `${s}s ago`
  return `${Math.round(s / 60)}m ago`
}

export function SystemStatus() {
  const t = useTelemetry()
  const meta = STATE_META[t.systemState]
  const secured = t.systemState === "idle" || t.systemState === "owner_mode"

  return (
    <Panel glow className="grid gap-6 lg:grid-cols-[1.1fr_1fr]">
      {/* big status indicator */}
      <div className="flex items-center gap-5">
        <div className="relative flex size-24 shrink-0 items-center justify-center">
          <span
            className={cn(
              "absolute inset-0 rounded-full opacity-60 animate-pulse-ring",
              secured ? "bg-success/30" : "bg-destructive/30",
            )}
          />
          <span
            className={cn(
              "absolute inset-2 rounded-full ring-1",
              secured ? "ring-success/40" : "ring-destructive/40",
            )}
          />
          <div
            className={cn(
              "flex size-16 items-center justify-center rounded-full",
              secured ? "bg-success/15 text-success" : "bg-destructive/15 text-destructive",
            )}
          >
            <ShieldCheck className="size-7" />
          </div>
        </div>
        <div>
          <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-muted-foreground">
            Security State
          </p>
          <p className={cn("text-glow mt-1 text-3xl font-semibold tracking-tight", secured ? "text-success" : "text-destructive")}>
            {meta.label}
          </p>
          <div className="mt-2 flex items-center gap-2">
            <StatusDot className={meta.dot} />
            <span className={cn("font-mono text-xs uppercase tracking-wider", meta.token)}>
              {meta.label}
            </span>
          </div>
        </div>
      </div>

      {/* status grid */}
      <div className="grid grid-cols-2 gap-3">
        <StatusItem
          icon={Radio}
          label="Hardware Connection"
          value={t.bleStatus === "connected" ? "ONLINE" : "DEVICE OFFLINE"}
          tone={t.bleStatus === "connected" ? "text-success" : "text-destructive"}
          dot={t.bleStatus === "connected" ? "bg-success" : "bg-destructive"}
        />
        <StatusItem icon={Cpu} label="Controller" value="Arduino UNO R4 WiFi" tone="text-primary" />
        <StatusItem
          icon={Clock}
          label="Last Update"
          value={ago(t.lastUpdate)}
          tone="text-foreground"
        />
        <StatusItem icon={Wifi} label="Device" value={t.deviceName ?? "Sanctum-IQ"} tone="text-foreground" />
      </div>
    </Panel>
  )
}

function StatusItem({
  icon: Icon,
  label,
  value,
  tone,
  dot,
}: {
  icon: typeof Wifi
  label: string
  value: string
  tone: string
  dot?: string
}) {
  return (
    <div className="rounded-xl border border-border/60 bg-background/40 p-3">
      <div className="flex items-center gap-1.5 text-muted-foreground">
        <Icon className="size-3" />
        <span className="font-mono text-[10px] uppercase tracking-[0.15em]">{label}</span>
      </div>
      <div className="mt-1.5 flex items-center gap-2">
        {dot ? <span className={cn("size-1.5 rounded-full", dot)} /> : null}
        <span className={cn("font-mono text-sm font-semibold", tone)}>{value}</span>
      </div>
    </div>
  )
}
