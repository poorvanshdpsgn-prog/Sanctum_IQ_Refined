"use client"

import { Activity } from "lucide-react"
import { STATE_META, useTelemetry, type SystemStateId } from "@/lib/telemetry"
import { Panel, PanelHeader } from "./primitives"
import { cn } from "@/lib/utils"

const ORDER: SystemStateId[] = [
  "idle",
  "bag_alert",
  "water_alert",
  "owner_mode",
  "misuse",
  "surveillance_alert",
]

export function StateMonitor() {
  const t = useTelemetry()

  return (
    <Panel className="h-full">
      <PanelHeader
        icon={Activity}
        eyebrow="Finite state machine"
        title="System State Monitor"
      />
      <div className="grid gap-2.5">
        {ORDER.map((id) => {
          const meta = STATE_META[id]
          const active = t.systemState === id
          return (
            <div
              key={id}
              className={cn(
                "flex items-center gap-3 rounded-xl border p-3 transition-all",
                active
                  ? "border-primary/40 bg-primary/5 ring-1 ring-primary/25"
                  : "border-border/50 bg-background/30 opacity-70",
              )}
            >
              <span className="relative flex size-3">
                {active ? (
                  <span
                    className={cn(
                      "absolute inline-flex size-full rounded-full opacity-70 animate-ping-slow",
                      meta.dot,
                    )}
                  />
                ) : null}
                <span className={cn("relative inline-flex size-3 rounded-full", meta.dot)} />
              </span>
              <div className="min-w-0 flex-1">
                <p className={cn("font-mono text-xs font-semibold uppercase tracking-wider", active ? meta.token : "text-foreground")}>
                  {meta.label}
                </p>
                <p className="truncate text-xs text-muted-foreground">{meta.description}</p>
              </div>
              {active ? (
                <span className="shrink-0 rounded-full bg-primary/15 px-2 py-0.5 font-mono text-[9px] uppercase tracking-widest text-primary">
                  Active
                </span>
              ) : null}
            </div>
          )
        })}
      </div>
    </Panel>
  )
}
