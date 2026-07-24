"use client"

import { Bluetooth, BluetoothConnected, BluetoothOff, Radio, ScrollText, Loader2 } from "lucide-react"
import { useTelemetry } from "@/lib/telemetry"
import { Panel, PanelHeader, Stat, StatusDot, SectionTitle } from "./primitives"
import { cn } from "@/lib/utils"

const STATUS_META = {
  connected: { label: "Connected", dot: "bg-success", tone: "text-success" },
  connecting: { label: "Connecting…", dot: "bg-warning", tone: "text-warning" },
  disconnected: { label: "Disconnected", dot: "bg-muted-foreground", tone: "text-muted-foreground" },
  unsupported: { label: "Unsupported", dot: "bg-destructive", tone: "text-destructive" },
} as const

export function ConnectivityView() {
  const t = useTelemetry()
  const live = t.mode === "live"
  const meta = STATUS_META[t.bleStatus]

  return (
    <div>
      <SectionTitle
        eyebrow="Connectivity"
        title="Live Device Link"
        description="Use the Arduino UNO R4 WiFi HTTP status endpoint for real-time telemetry. BLE remains available to firmware and local mobile clients."
      />

      <div className="grid gap-4 lg:grid-cols-[1fr_1fr]">
        <Panel glow>
          <PanelHeader
            icon={Bluetooth}
            eyebrow="WiFi HTTP · Arduino UNO R4 WiFi"
            title="Hardware Connection"
          />

          <div
            className={cn(
              "flex items-center gap-4 rounded-xl border p-4",
              live ? "border-success/30 bg-success/5" : "border-border/60 bg-background/30",
            )}
          >
            <div
              className={cn(
                "relative flex size-14 items-center justify-center rounded-full",
                live ? "bg-success/15 text-success" : "bg-secondary/60 text-muted-foreground",
              )}
            >
              {t.bleStatus === "connecting" ? (
                <Loader2 className="size-6 animate-spin" />
              ) : live ? (
                <BluetoothConnected className="size-6" />
              ) : (
                <Bluetooth className="size-6" />
              )}
              {live ? (
                <span className="absolute inset-0 rounded-full ring-1 ring-success/40 animate-pulse-ring" />
              ) : null}
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <StatusDot className={meta.dot} />
                <p className={cn("text-xl font-semibold", meta.tone)}>{meta.label}</p>
              </div>
              <p className="font-mono text-xs text-muted-foreground">
                Device: {t.deviceName ?? "Sanctum-IQ"}
              </p>
            </div>
          </div>

          <div className="mt-4 flex flex-wrap gap-3">
            {live ? (
              <button
                type="button"
                onClick={t.disconnect}
                className="inline-flex items-center gap-2 rounded-lg border border-destructive/40 bg-destructive/10 px-4 py-2.5 text-sm font-medium text-destructive transition-colors hover:bg-destructive/20"
              >
                <BluetoothOff className="size-4" />
                Switch to demo
              </button>
            ) : (
              <button
                type="button"
                onClick={t.connect}
                disabled={t.bleStatus === "connecting" || t.bleStatus === "unsupported"}
                className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground shadow-[0_0_20px_-4px_var(--color-primary)] transition-colors hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {t.bleStatus === "connecting" ? (
                  <Loader2 className="size-4 animate-spin" />
                ) : (
                  <Bluetooth className="size-4" />
                )}
                {t.bleStatus === "connecting" ? "Connecting…" : "Connect live device"}
              </button>
            )}
            <span
              className={cn(
                "inline-flex items-center rounded-lg border px-3 py-2.5 font-mono text-[11px] uppercase tracking-wider",
                live
                  ? "border-success/30 text-success"
                  : "border-border/60 text-muted-foreground",
              )}
            >
              {live ? "Live HTTP telemetry" : "Demo telemetry"}
            </span>
          </div>
          <div className="mt-4 inline-flex rounded-lg border border-border/60 bg-background/30 p-1 font-mono text-[10px] uppercase tracking-wider">
            <button type="button" onClick={() => void t.setMode("live")} className={cn("rounded-md px-3 py-2 transition-colors", live ? "bg-success/15 text-success" : "text-muted-foreground hover:text-foreground")}>Live mode</button>
            <button type="button" onClick={() => void t.setMode("demo")} className={cn("rounded-md px-3 py-2 transition-colors", !live ? "bg-secondary text-foreground" : "text-muted-foreground hover:text-foreground")}>Demo mode</button>
          </div>

          <p className="mt-3 text-pretty text-xs leading-relaxed text-muted-foreground">
            Set <span className="font-mono text-foreground">NEXT_PUBLIC_SANCTUM_DEVICE_URL</span> to your Arduino address, then connect. The dashboard polls <span className="font-mono text-foreground">/status</span> and sends commands to <span className="font-mono text-foreground">/command</span>.
          </p>
          {t.error ? <p className="mt-2 text-xs text-destructive">{t.error}</p> : null}

          <div className="mt-4 grid grid-cols-2 gap-3">
            <Stat label="Mode" value={live ? "REAL-TIME" : "DEMO"} accent={live ? "text-success" : "text-muted-foreground"} />
            <Stat label="Transport" value="HTTP / WiFi" accent="text-primary" />
            <Stat label="Events" value={String(t.events.length)} accent="text-foreground" />
            <Stat label="Last update" value={t.rtcTime} accent="text-foreground" />
          </div>
        </Panel>

        <div className="grid gap-4">
          <Panel>
            <PanelHeader icon={Radio} eyebrow="Arduino API" title="Endpoint Details" />
            <ul className="grid gap-2.5">
              {[
                { label: "Device", value: "Sanctum-IQ" },
                { label: "Status", value: "GET /status" },
                { label: "Commands", value: "POST /command" },
                { label: "Payload", value: "JSON" },
              ].map(({ label, value }) => (
                <li
                  key={label}
                  className="flex flex-col gap-0.5 rounded-xl border border-border/50 bg-background/30 p-3"
                >
                  <span className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
                    {label}
                  </span>
                  <span className="break-all font-mono text-xs text-foreground">{value}</span>
                </li>
              ))}
            </ul>
          </Panel>

          <Panel className="flex min-h-0 flex-col">
            <PanelHeader icon={ScrollText} eyebrow="Live events" title="Device Event Stream" />
            <div className="max-h-56 overflow-y-auto rounded-xl border border-border/50 bg-background/50 p-3 font-mono text-xs">
              {t.messages.length === 0 ? (
                <p className="text-muted-foreground">
                  No events yet. {live ? "Waiting for Arduino status updates…" : "Demo scenarios will appear here."}
                </p>
              ) : (
                <ul className="grid gap-1.5">
                  {t.events.map((m) => (
                    <li key={m.id} className="flex gap-2">
                      <span className="shrink-0 text-muted-foreground">{m.time}</span>
                      <span className="text-primary">›</span>
                      <span className="break-all text-foreground">{m.detail}</span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </Panel>
        </div>
      </div>
    </div>
  )
}
