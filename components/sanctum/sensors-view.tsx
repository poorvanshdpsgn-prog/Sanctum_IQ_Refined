"use client"

import { Droplets, PackageOpen, Radar, Clock3, type LucideIcon } from "lucide-react"
import { useTelemetry } from "@/lib/telemetry"
import { Panel, PanelHeader, SectionTitle } from "./primitives"
import { cn } from "@/lib/utils"

function Metric({
  label,
  value,
  tone = "text-foreground",
}: {
  label: string
  value: string
  tone?: string
}) {
  return (
    <div className="flex items-baseline justify-between rounded-lg border border-border/50 bg-background/30 px-3 py-2">
      <span className="font-mono text-[11px] uppercase tracking-wider text-muted-foreground">
        {label}
      </span>
      <span className={cn("font-mono text-base font-semibold", tone)}>{value}</span>
    </div>
  )
}

function SensorCard({
  icon: Icon,
  eyebrow,
  title,
  purpose,
  tone,
  children,
}: {
  icon: LucideIcon
  eyebrow: string
  title: string
  purpose?: string
  tone: string
  children: React.ReactNode
}) {
  return (
    <Panel className="flex h-full flex-col">
      <PanelHeader icon={Icon} eyebrow={eyebrow} title={title} />
      <div className="grid gap-2">{children}</div>
      {purpose ? (
        <p className="mt-3 text-pretty text-xs leading-relaxed text-muted-foreground">{purpose}</p>
      ) : null}
      <div className={cn("mt-3 h-0.5 w-full rounded-full", tone)} />
    </Panel>
  )
}

export function SensorsView() {
  const t = useTelemetry()

  return (
    <div>
      <SectionTitle
        eyebrow="Telemetry"
        title="Sensor Monitoring"
        description="Live readings from every sensor physically wired to the Arduino UNO R4 WiFi controller, streamed over BLE in real time."
      />
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        <SensorCard
          icon={PackageOpen}
          eyebrow="HC-SR04 · pins D3/D2"
          title="Bag Intrusion (Zip)"
          purpose="Ultrasonic zip detection. A rising distance means the bag has been opened."
          tone="bg-destructive/50"
        >
          <Metric
            label="Zip"
            value={t.bagSecured ? "SECURE" : "OPENED"}
            tone={t.bagSecured ? "text-success" : "text-destructive"}
          />
          <Metric label="Distance" value={`${t.bagDistance} cm`} tone="text-foreground" />
        </SensorCard>

        <SensorCard
          icon={Radar}
          eyebrow="HC-SR04 · pins D4/D5"
          title="Surveillance Turret"
          purpose="Servo-mounted ultrasonic sensor sweeping 0–180° to detect nearby people."
          tone="bg-chart-5/50"
        >
          <Metric label="Servo Angle" value={`${Math.round(t.servoAngle)}°`} tone="text-chart-5" />
          <Metric
            label="Range"
            value={`${t.scanDistance} cm`}
            tone={t.objectDetected ? "text-destructive" : "text-foreground"}
          />
        </SensorCard>

        <SensorCard
          icon={Droplets}
          eyebrow="Capacitive moisture · pin A0"
          title="Moisture Protection"
          purpose="Protects against rain and water damage to the bag and its contents."
          tone="bg-info/50"
        >
          <Metric
            label="Status"
            value={t.moisture ? "WET" : "DRY"}
            tone={t.moisture ? "text-info" : "text-success"}
          />
          <Metric label="Moisture value" value={String(t.moistureValue)} tone="text-foreground" />
        </SensorCard>

        <SensorCard icon={Clock3} eyebrow="Arduino status packet" title="System" purpose="State and timestamp provided by the controller's latest status response." tone="bg-primary/50">
          <Metric label="State" value={t.systemState.toUpperCase()} tone="text-primary" />
          <Metric label="Timestamp" value={t.rtcTime} tone="text-foreground" />
        </SensorCard>
      </div>
    </div>
  )
}
