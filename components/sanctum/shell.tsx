"use client"

import { useState } from "react"
import {
  LayoutDashboard,
  Info,
  PackageOpen,
  Radar,
  Cpu,
  Rocket,
  Nfc,
  Bluetooth,
  History,
  ShieldCheck,
  Menu,
  X,
  type LucideIcon,
} from "lucide-react"
import { STATE_META, useTelemetry } from "@/lib/telemetry"
import { cn } from "@/lib/utils"
import { DashboardView } from "./dashboard-view"
import { BagIntrusion } from "./bag-intrusion"
import { SensorsView } from "./sensors-view"
import { EventLog } from "./event-log"
import { AuthView } from "./auth-view"
import { ControlPanel } from "./control-panel"
import { ConnectivityView } from "./connectivity-view"
import { ArchitectureView } from "./architecture-view"
import { RoadmapView } from "./roadmap-view"
import { AboutView } from "./about-view"
import { SectionTitle, StatusDot } from "./primitives"

type NavId =
  | "dashboard"
  | "about"
  | "bag"
  | "sensors"
  | "log"
  | "auth"
  | "controls"
  | "connectivity"
  | "architecture"
  | "roadmap"

const NAV: { id: NavId; label: string; icon: LucideIcon; group: string }[] = [
  { id: "dashboard", label: "Command Center", icon: LayoutDashboard, group: "Monitor" },
  { id: "about", label: "About Sanctum IQ", icon: Info, group: "System" },
  { id: "bag", label: "Bag Security", icon: PackageOpen, group: "Monitor" },
  { id: "sensors", label: "Sensors", icon: Radar, group: "Monitor" },
  { id: "log", label: "Event Log", icon: History, group: "Monitor" },
  { id: "auth", label: "Authentication", icon: Nfc, group: "Control" },
  { id: "controls", label: "Control Panel", icon: ShieldCheck, group: "Control" },
  { id: "connectivity", label: "Connectivity", icon: Bluetooth, group: "Control" },
  { id: "architecture", label: "Architecture", icon: Cpu, group: "System" },
  { id: "roadmap", label: "Roadmap", icon: Rocket, group: "System" },
]

const GROUPS = ["Monitor", "Control", "System"]

function BrandMark() {
  return (
    <div className="flex items-center gap-3">
      <div className="relative flex size-10 items-center justify-center rounded-xl bg-primary/10 ring-1 ring-primary/30">
        <ShieldCheck className="size-5 text-primary" />
        <span className="absolute inset-0 rounded-xl ring-1 ring-primary/20 animate-pulse-ring" />
      </div>
      <div className="leading-tight">
        <p className="font-mono text-sm font-bold tracking-[0.15em] text-foreground">
          SANCTUM<span className="text-primary"> IQ</span>
        </p>
        <p className="font-mono text-[9px] uppercase tracking-[0.2em] text-muted-foreground">
          Southeast Studios
        </p>
      </div>
    </div>
  )
}

export function Shell() {
  const [active, setActive] = useState<NavId>("dashboard")
  const [mobileOpen, setMobileOpen] = useState(false)
  const t = useTelemetry()
  const meta = STATE_META[t.systemState]
  const secured = t.systemState === "idle" || t.systemState === "owner_mode"

  const nav = (
    <nav className="flex flex-1 flex-col gap-5 overflow-y-auto px-3 py-4">
      {GROUPS.map((group) => (
        <div key={group}>
          <p className="px-3 pb-2 font-mono text-[9px] uppercase tracking-[0.25em] text-muted-foreground/70">
            {group}
          </p>
          <div className="grid gap-1">
            {NAV.filter((n) => n.group === group).map((item) => {
              const isActive = active === item.id
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => {
                    setActive(item.id)
                    setMobileOpen(false)
                  }}
                  className={cn(
                    "group flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors",
                    isActive
                      ? "bg-primary/10 text-primary ring-1 ring-primary/25"
                      : "text-muted-foreground hover:bg-secondary/50 hover:text-foreground",
                  )}
                >
                  <item.icon className={cn("size-4 shrink-0", isActive && "text-primary")} />
                  <span className="truncate">{item.label}</span>
                  {isActive ? (
                    <span className="ml-auto size-1.5 rounded-full bg-primary" />
                  ) : null}
                </button>
              )
            })}
          </div>
        </div>
      ))}
    </nav>
  )

  return (
    <div className="grid-bg relative min-h-screen bg-background">
      <div className="pointer-events-none fixed inset-0 bg-[radial-gradient(ellipse_at_top,color-mix(in_oklch,var(--primary)_10%,transparent),transparent_55%)]" />

      <div className="relative mx-auto flex min-h-screen w-full max-w-[1600px]">
        {/* desktop sidebar */}
        <aside className="sticky top-0 hidden h-screen w-64 shrink-0 flex-col border-r border-sidebar-border bg-sidebar/80 backdrop-blur-xl lg:flex">
          <div className="flex h-16 items-center border-b border-sidebar-border px-5">
            <BrandMark />
          </div>
          {nav}
          <div className="border-t border-sidebar-border p-4">
            <div className="flex items-center gap-2 rounded-lg bg-background/40 px-3 py-2">
              <StatusDot className={meta.dot} />
              <span className={cn("font-mono text-[10px] uppercase tracking-wider", meta.token)}>
                {meta.label}
              </span>
            </div>
          </div>
        </aside>

        {/* mobile drawer */}
        {mobileOpen ? (
          <div className="fixed inset-0 z-50 lg:hidden">
            <div
              className="absolute inset-0 bg-background/70 backdrop-blur-sm"
              onClick={() => setMobileOpen(false)}
              aria-hidden
            />
            <aside className="absolute left-0 top-0 flex h-full w-72 flex-col border-r border-sidebar-border bg-sidebar shadow-2xl animate-float-up">
              <div className="flex h-16 items-center justify-between border-b border-sidebar-border px-5">
                <BrandMark />
                <button
                  type="button"
                  onClick={() => setMobileOpen(false)}
                  className="text-muted-foreground hover:text-foreground"
                  aria-label="Close navigation"
                >
                  <X className="size-5" />
                </button>
              </div>
              {nav}
            </aside>
          </div>
        ) : null}

        {/* main */}
        <div className="flex min-w-0 flex-1 flex-col">
          {/* top bar */}
          <header className="sticky top-0 z-30 flex h-16 items-center gap-3 border-b border-border/60 bg-background/70 px-4 backdrop-blur-xl sm:px-6">
            <button
              type="button"
              onClick={() => setMobileOpen(true)}
              className="flex size-9 items-center justify-center rounded-lg border border-border/60 text-muted-foreground lg:hidden"
              aria-label="Open navigation"
            >
              <Menu className="size-5" />
            </button>

            <div className="flex items-center gap-2 lg:hidden">
              <ShieldCheck className="size-5 text-primary" />
              <span className="font-mono text-sm font-bold tracking-[0.1em]">
                SANCTUM<span className="text-primary"> IQ</span>
              </span>
            </div>

            <p className="ml-auto hidden text-pretty text-sm text-muted-foreground md:block">
              Intelligent Protection. Real-Time Security.
            </p>

            <div className="ml-auto flex items-center gap-2 md:ml-4">
              <span
                className={cn(
                  "flex items-center gap-2 rounded-full border px-3 py-1.5 font-mono text-[11px] uppercase tracking-wider",
                  secured
                    ? "border-success/40 bg-success/10 text-success"
                    : "border-destructive/40 bg-destructive/10 text-destructive",
                )}
              >
                <StatusDot className={secured ? "bg-success" : "bg-destructive"} />
                {t.connection === "online" ? "Online" : "Offline"}
              </span>
            </div>
          </header>

          <main className="flex-1 px-4 py-6 sm:px-6 lg:px-8">
            {active === "dashboard" ? <DashboardView /> : null}

            {active === "about" ? <AboutView /> : null}

            {active === "bag" ? (
              <div>
                <SectionTitle
                  eyebrow="Intrusion"
                  title="Bag Security"
                  description="Live monitoring of the internal HC-SR04 ultrasonic sensor guarding against unauthorized bag opening."
                />
                <div className="max-w-2xl">
                  <BagIntrusion />
                </div>
              </div>
            ) : null}

            {active === "sensors" ? <SensorsView /> : null}

            {active === "log" ? (
              <div>
                <SectionTitle
                  eyebrow="History"
                  title="Surveillance Event Log"
                  description="Chronological, timestamped record of every security event captured by the system."
                />
                <div className="max-w-2xl">
                  <EventLog />
                </div>
              </div>
            ) : null}

            {active === "auth" ? (
              <div>
                <SectionTitle
                  eyebrow="Identity"
                  title="Owner Authentication"
                  description="RC522 RFID access control with a full authentication ledger."
                />
                <AuthView />
              </div>
            ) : null}

            {active === "controls" ? (
              <div>
                <SectionTitle
                  eyebrow="Commands"
                  title="Smart Control Panel"
                  description="Send secure commands to the controller over BLE — arm, bypass, test, and diagnostics."
                />
                <ControlPanel />
              </div>
            ) : null}

            {active === "connectivity" ? (
              <div>
                <SectionTitle
                  eyebrow="Link"
                  title="Connectivity"
                  description="Bluetooth Low Energy and network status for the Arduino UNO R4 WiFi controller."
                />
                <ConnectivityView />
              </div>
            ) : null}

            {active === "architecture" ? <ArchitectureView /> : null}

            {active === "roadmap" ? <RoadmapView /> : null}
          </main>
        </div>
      </div>
    </div>
  )
}
