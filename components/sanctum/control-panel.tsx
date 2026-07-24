"use client"

import { useState } from "react"
import { Lock, Unlock, BellRing, RefreshCw, Settings, ShieldAlert, type LucideIcon } from "lucide-react"
import { useTelemetry } from "@/lib/telemetry"
import { Panel, PanelHeader } from "./primitives"
import { cn } from "@/lib/utils"

function ControlButton({
  icon: Icon,
  label,
  onClick,
  tone = "primary",
}: {
  icon: LucideIcon
  label: string
  onClick?: () => void
  tone?: "primary" | "danger" | "neutral"
}) {
  const [flash, setFlash] = useState(false)
  const toneClass =
    tone === "danger"
      ? "hover:border-destructive/60 hover:bg-destructive/10 hover:text-destructive"
      : tone === "neutral"
        ? "hover:border-border hover:bg-secondary"
        : "hover:border-primary/60 hover:bg-primary/10 hover:text-primary"

  return (
    <button
      type="button"
      onClick={() => {
        setFlash(true)
        onClick?.()
        setTimeout(() => setFlash(false), 320)
      }}
      className={cn(
        "group flex flex-col items-center gap-2.5 rounded-2xl border border-border/60 bg-background/40 p-5 text-muted-foreground transition-all duration-200 active:scale-[0.97]",
        toneClass,
        flash && "ring-2 ring-primary/50",
      )}
    >
      <span className="flex size-11 items-center justify-center rounded-xl bg-secondary/60 transition-transform duration-200 group-hover:scale-110 group-hover:bg-transparent">
        <Icon className="size-5" />
      </span>
      <span className="text-xs font-medium tracking-wide">{label}</span>
    </button>
  )
}

export function ControlPanel({ compact = false }: { compact?: boolean }) {
  const t = useTelemetry()

  return (
    <Panel>
      <PanelHeader icon={Settings} eyebrow="Remote commands" title="Smart Control Panel" />
      <div className={cn("grid gap-3", compact ? "grid-cols-2 sm:grid-cols-3" : "grid-cols-2 sm:grid-cols-3 lg:grid-cols-6")}>
        <ControlButton icon={Lock} label="Lock Bag" onClick={t.lockSystem} />
        <ControlButton icon={Unlock} label="Enable Owner Mode" onClick={t.ownerUnlock} />
        <ControlButton icon={Lock} label="Disable Owner Mode" onClick={t.disableOwnerMode} />
        <ControlButton icon={BellRing} label="Test Alarm" onClick={t.testAlarm} tone="neutral" />
        <ControlButton icon={RefreshCw} label="Refresh Device" onClick={t.refreshDevice} tone="neutral" />
        {t.mode === "demo" ? <ControlButton icon={ShieldAlert} label="Simulate Threat" onClick={t.simulateThreat} tone="danger" /> : null}
      </div>
      <p className="mt-3 font-mono text-[11px] text-muted-foreground">
        {t.mode === "live" ? "Commands are sent to POST /command on the Arduino." : "Demo mode only: simulation controls do not reach hardware."}
      </p>
    </Panel>
  )
}
