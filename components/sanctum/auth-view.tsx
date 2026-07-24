"use client"

import { Nfc, CheckCircle2, XCircle, KeyRound } from "lucide-react"
import { useTelemetry } from "@/lib/telemetry"
import { Panel, PanelHeader, Stat } from "./primitives"
import { cn } from "@/lib/utils"

export function AuthView() {
  const t = useTelemetry()
  const installed = t.rfidStatus !== "NOT_INSTALLED"
  const verified = t.rfidStatus === "AUTHORIZED"

  return (
    <div className="grid gap-4 lg:grid-cols-[1fr_1fr]">
      <Panel glow>
        <PanelHeader icon={Nfc} eyebrow="RC522 RFID module" title="Owner Authentication" />
        <div
          className={cn(
            "flex items-center gap-4 rounded-xl border p-4",
            verified ? "border-success/30 bg-success/5" : "border-border/60 bg-background/30",
          )}
        >
          <div
            className={cn(
              "flex size-14 items-center justify-center rounded-full",
              verified ? "bg-success/15 text-success" : "bg-secondary/60 text-muted-foreground",
            )}
          >
            <KeyRound className="size-6" />
          </div>
          <div>
            <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
              Status
            </p>
            <p className={cn("text-xl font-semibold", verified ? "text-success" : "text-warning")}>
              {installed ? (verified ? "Authorized" : "Denied") : "Not installed"}
            </p>
            <p className="text-xs text-muted-foreground">
              {installed ? "Status is reported by the Arduino firmware" : "RC522 support is reserved; no RFID data is fabricated."}
            </p>
          </div>
        </div>
        <div className="mt-4 grid grid-cols-2 gap-3">
          <Stat label="RFID status" value={t.rfidStatus} accent={verified ? "text-success" : "text-muted-foreground"} />
          <Stat label="Controller" value="Awaiting RC522" accent="text-foreground" />
          <Stat label="Last Access" value="—" accent="text-foreground" />
          <Stat
            label="Link"
            value={t.mode === "live" ? "LIVE" : "DEMO"}
            accent={t.mode === "live" ? "text-success" : "text-muted-foreground"}
          />
        </div>
      </Panel>

      <Panel>
        <PanelHeader icon={CheckCircle2} eyebrow="Access ledger" title="Authentication History" />
        {t.rfidLog.length === 0 ? (
          <p className="rounded-xl border border-border/50 bg-background/30 p-4 text-sm text-muted-foreground">
            No RFID scans recorded yet.
          </p>
        ) : (
          <ul className="grid gap-2">
            {t.rfidLog.map((h) => (
              <li
                key={h.id}
                className="flex items-center gap-3 rounded-xl border border-border/50 bg-background/30 p-3"
              >
                {h.granted ? (
                  <CheckCircle2 className="size-5 shrink-0 text-success" />
                ) : (
                  <XCircle className="size-5 shrink-0 text-destructive" />
                )}
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium text-foreground">{h.label}</p>
                  <p className="font-mono text-[11px] text-muted-foreground">RFID · {h.uid}</p>
                </div>
                <span className="font-mono text-[11px] text-muted-foreground">{h.time}</span>
              </li>
            ))}
          </ul>
        )}
      </Panel>
    </div>
  )
}
