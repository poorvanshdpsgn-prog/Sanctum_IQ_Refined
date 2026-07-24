"use client"

import {
  Cpu,
  Radar,
  PackageOpen,
  Droplets,
  Clock3,
  Nfc,
  MonitorSmartphone,
  ScreenShare,
  Volume2,
  BellRing,
  Bluetooth,
  type LucideIcon,
} from "lucide-react"
import { Panel, PanelHeader, SectionTitle } from "./primitives"

const sensors: { icon: LucideIcon; name: string; role: string }[] = [
  { icon: PackageOpen, name: "HC-SR04 — Bag Detection", role: "Zip / opening detection · D3, D2" },
  { icon: Radar, name: "Servo HC-SR04 — Surveillance", role: "0–180° scanning turret · D4, D5, D10" },
  { icon: Droplets, name: "Moisture Sensor", role: "Rain / water damage protection · A0" },
  { icon: Clock3, name: "DS1307 RTC", role: "Accurate event timestamps · I2C" },
  { icon: Nfc, name: "RC522 RFID", role: "Owner authentication (being added)" },
]

const outputs: { icon: LucideIcon; name: string }[] = [
  { icon: ScreenShare, name: "LCD 16x2 (I2C)" },
  { icon: Volume2, name: "Buzzer Alarm (D6)" },
  { icon: Bluetooth, name: "Built-in BLE Link" },
  { icon: BellRing, name: "Mobile / Web Alerts" },
]

export function ArchitectureView() {
  return (
    <div>
      <SectionTitle
        eyebrow="Hardware"
        title="Device Architecture"
        description="A complete overview of the Sanctum IQ hardware stack orchestrated by a single Arduino UNO R4 WiFi controller."
      />

      <Panel glow className="mb-4">
        <div className="flex flex-col items-start gap-4 sm:flex-row sm:items-center">
          <div className="flex size-14 items-center justify-center rounded-xl bg-primary/10 text-primary ring-1 ring-primary/25">
            <Cpu className="size-7" />
          </div>
          <div className="flex-1">
            <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
              Controller
            </p>
            <h3 className="text-lg font-semibold text-foreground">Arduino UNO R4 WiFi</h3>
            <p className="text-sm text-muted-foreground">
              Renesas RA4M1 · onboard WiFi + BLE · orchestrates all sensors, outputs and alerts.
            </p>
          </div>
          <div className="flex gap-2">
            <span className="rounded-full bg-secondary/60 px-3 py-1 font-mono text-[10px] uppercase tracking-widest text-primary">
              5 Sensors
            </span>
            <span className="rounded-full bg-secondary/60 px-3 py-1 font-mono text-[10px] uppercase tracking-widest text-primary">
              4 Outputs
            </span>
          </div>
        </div>
      </Panel>

      <div className="grid gap-4 lg:grid-cols-[2fr_1fr]">
        <Panel>
          <PanelHeader icon={Radar} eyebrow="Input layer" title="Sensors" />
          <div className="grid gap-2.5 sm:grid-cols-2">
            {sensors.map(({ icon: Icon, name, role }) => (
              <div
                key={name}
                className="flex items-start gap-3 rounded-xl border border-border/50 bg-background/30 p-3"
              >
                <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-secondary/60 text-primary">
                  <Icon className="size-4" />
                </span>
                <div>
                  <p className="text-sm font-medium leading-tight text-foreground">{name}</p>
                  <p className="text-xs text-muted-foreground">{role}</p>
                </div>
              </div>
            ))}
          </div>
        </Panel>

        <Panel>
          <PanelHeader icon={MonitorSmartphone} eyebrow="Output layer" title="Outputs" />
          <div className="grid gap-2.5">
            {outputs.map(({ icon: Icon, name }) => (
              <div
                key={name}
                className="flex items-center gap-3 rounded-xl border border-border/50 bg-background/30 p-3"
              >
                <span className="flex size-9 items-center justify-center rounded-lg bg-secondary/60 text-primary">
                  <Icon className="size-4" />
                </span>
                <span className="text-sm font-medium text-foreground">{name}</span>
              </div>
            ))}
          </div>
        </Panel>
      </div>
    </div>
  )
}
