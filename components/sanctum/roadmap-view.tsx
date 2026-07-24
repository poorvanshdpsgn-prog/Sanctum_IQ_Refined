"use client"

import {
  Smartphone,
  Cloud,
  ShieldCheck,
  BarChart3,
  Camera,
  Bot,
  CloudUpload,
  UserCheck,
  ScanSearch,
  type LucideIcon,
} from "lucide-react"
import { Panel, SectionTitle } from "./primitives"
import { cn } from "@/lib/utils"

function Feature({ icon: Icon, label }: { icon: LucideIcon; label: string }) {
  return (
    <div className="flex items-center gap-2.5 rounded-lg border border-border/50 bg-background/30 px-3 py-2">
      <Icon className="size-4 shrink-0 text-primary" />
      <span className="text-sm text-foreground">{label}</span>
    </div>
  )
}

export function RoadmapView() {
  return (
    <div>
      <SectionTitle
        eyebrow="Vision"
        title="Future Development Roadmap"
        description="Where Sanctum IQ is heading — from a smarter companion app to a full AI vision security module."
      />

      <div className="grid gap-4 lg:grid-cols-2">
        {/* V2 */}
        <Panel className="relative">
          <div className="mb-4 flex items-center gap-3">
            <span className="rounded-lg bg-primary/15 px-2.5 py-1 font-mono text-xs font-semibold uppercase tracking-widest text-primary">
              V2
            </span>
            <h3 className="text-lg font-semibold text-foreground">Sanctum IQ V2</h3>
          </div>
          <div className="grid gap-2.5">
            <Feature icon={Smartphone} label="Advanced mobile application" />
            <Feature icon={Cloud} label="Cloud monitoring" />
            <Feature icon={ShieldCheck} label="Better authentication" />
            <Feature icon={BarChart3} label="Security analytics" />
          </div>
          <span className="mt-4 inline-block font-mono text-[11px] uppercase tracking-widest text-muted-foreground">
            In development
          </span>
        </Panel>

        {/* V3 */}
        <Panel glow className="relative overflow-hidden">
          <div className="pointer-events-none absolute -right-10 -top-10 size-40 rounded-full bg-primary/10 blur-3xl" />
          <div className="mb-2 flex items-center gap-3">
            <span className="rounded-lg bg-chart-5/20 px-2.5 py-1 font-mono text-xs font-semibold uppercase tracking-widest text-chart-5">
              V3
            </span>
            <h3 className="text-lg font-semibold text-foreground">AI Vision Security Module</h3>
          </div>
          <p className="mb-4 text-sm text-muted-foreground">
            Replace ultrasonic surveillance with an intelligent camera system for advanced threat
            analysis.
          </p>
          <div className="grid gap-2.5 sm:grid-cols-2">
            <Feature icon={Camera} label="Real-time video monitoring" />
            <Feature icon={Bot} label="AI suspicious-activity recognition" />
            <Feature icon={CloudUpload} label="Cloud video storage" />
            <Feature icon={UserCheck} label="Person identification" />
            <Feature icon={ScanSearch} label="Advanced threat analysis" />
          </div>
        </Panel>
      </div>

      {/* timeline strip */}
      <div className="mt-4 grid grid-cols-3 gap-3">
        {[
          { v: "V1", label: "Current Build", active: true },
          { v: "V2", label: "Connected App", active: false },
          { v: "V3", label: "AI Vision", active: false },
        ].map((s) => (
          <div
            key={s.v}
            className={cn(
              "rounded-xl border p-4 text-center",
              s.active ? "border-primary/40 bg-primary/5" : "border-border/50 bg-background/30",
            )}
          >
            <p className={cn("font-mono text-sm font-semibold", s.active ? "text-primary" : "text-muted-foreground")}>
              {s.v}
            </p>
            <p className="mt-0.5 text-xs text-muted-foreground">{s.label}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
