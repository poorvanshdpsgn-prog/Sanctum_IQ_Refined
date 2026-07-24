"use client"

import { Lock, Unlock, TriangleAlert, Bell, BellRing, ScrollText } from "lucide-react"
import { useTelemetry } from "@/lib/telemetry"
import { Panel, PanelHeader, Stat } from "./primitives"
import { cn } from "@/lib/utils"

export function BagIntrusion() {
  const t = useTelemetry()
  const secured = t.bagSecured

  return (
    <Panel className={cn("h-full", !secured && "ring-1 ring-destructive/40")}>
      <PanelHeader
        icon={secured ? Lock : Unlock}
        eyebrow="HC-SR04 inside bag"
        title="Bag Intrusion Monitoring"
        right={
          <span
            className={cn(
              "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 font-mono text-[10px] uppercase tracking-widest",
              secured
                ? "bg-success/15 text-success"
                : "bg-destructive/15 text-destructive",
            )}
          >
            {secured ? <Lock className="size-3" /> : <Unlock className="size-3" />}
            {secured ? "Secured" : "Breached"}
          </span>
        }
      />

      {!secured ? (
        <div className="mb-4 flex items-center gap-3 rounded-xl border border-destructive/50 bg-destructive/10 p-3 animate-float-up">
          <TriangleAlert className="size-5 text-destructive" />
          <div>
            <p className="font-mono text-sm font-semibold uppercase tracking-wider text-destructive">
              Bag Opened
            </p>
            <p className="text-xs text-muted-foreground">
              Alarm activated · owner notified · event recorded
            </p>
          </div>
        </div>
      ) : null}

      <div className="grid grid-cols-3 gap-3">
        <Stat
          label="Bag Status"
          value={secured ? "SECURED" : "OPEN"}
          accent={secured ? "text-success" : "text-destructive"}
        />
        <Stat
          label="Zip Detection"
          value={t.zipStatus === "normal" ? "NORMAL" : "TAMPERED"}
          accent={t.zipStatus === "normal" ? "text-foreground" : "text-destructive"}
        />
        <Stat label="Distance" value={`${t.bagDistance} cm`} accent="text-primary" />
      </div>

      <div className="mt-4 grid grid-cols-3 gap-2">
        {[
          { icon: BellRing, label: "Activate alarm" },
          { icon: Bell, label: "Notify owner" },
          { icon: ScrollText, label: "Record event" },
        ].map(({ icon: Icon, label }) => (
          <div
            key={label}
            className="flex flex-col items-center gap-1.5 rounded-lg border border-border/50 bg-background/30 p-2.5 text-center"
          >
            <Icon className={cn("size-4", secured ? "text-muted-foreground" : "text-destructive")} />
            <span className="text-[10px] leading-tight text-muted-foreground">{label}</span>
          </div>
        ))}
      </div>
    </Panel>
  )
}
