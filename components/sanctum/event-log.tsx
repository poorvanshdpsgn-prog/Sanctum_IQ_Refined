"use client"

import { History } from "lucide-react"
import { STATE_META, useTelemetry } from "@/lib/telemetry"
import { Panel, PanelHeader } from "./primitives"
import { cn } from "@/lib/utils"

export function EventLog({ compact = false }: { compact?: boolean }) {
  const t = useTelemetry()
  const events = compact ? t.events.slice(0, 4) : t.events

  return (
    <Panel className="h-full">
      <PanelHeader
        icon={History}
        eyebrow="Today"
        title="Surveillance Event Log"
        right={
          <span className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
            {t.events.length} entries
          </span>
        }
      />
      <ol className="relative ml-1.5 border-l border-border/60">
        {events.map((e) => {
          const meta = STATE_META[e.state]
          return (
            <li key={e.id} className="relative mb-4 pl-5 last:mb-0 animate-float-up">
              <span
                className={cn(
                  "absolute -left-[5px] top-1.5 size-2.5 rounded-full ring-4 ring-background",
                  meta.dot,
                )}
              />
              <div className="flex items-center gap-2">
                <span className="font-mono text-xs text-muted-foreground">{e.time}</span>
                <span className={cn("font-mono text-[11px] font-semibold uppercase tracking-wider", meta.token)}>
                  {meta.label}
                </span>
              </div>
              <p className="mt-0.5 text-sm text-foreground">{e.detail}</p>
              <div className="mt-1 flex flex-wrap gap-x-4 gap-y-0.5 font-mono text-[11px] text-muted-foreground">
                {e.angle !== undefined ? <span>Direction: {e.angle}°</span> : null}
                {e.distance !== undefined ? <span>Distance: {e.distance} cm</span> : null}
                {e.action ? <span className="text-primary/80">Action: {e.action}</span> : null}
              </div>
            </li>
          )
        })}
      </ol>
    </Panel>
  )
}
