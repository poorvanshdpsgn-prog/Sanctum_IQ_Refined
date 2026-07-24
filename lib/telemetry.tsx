"use client"

import { createContext, useContext, useMemo } from "react"
import { useSanctumDevice, type DeviceEventType } from "./use-sanctum-device"

export type SystemStateId = "idle" | "bag_alert" | "water_alert" | "owner_mode" | "misuse" | "surveillance_alert"
export type ThreatLevel = "low" | "medium" | "high"
export type LinkMode = "demo" | "live"
export type BleStatus = "unsupported" | "disconnected" | "connecting" | "connected"
export type SanctumEvent = { id: string; time: string; state: SystemStateId; title: string; detail: string; angle?: number; distance?: number; action?: string }
export type RfidRecord = { id: string; time: string; uid: string; granted: boolean; label: string }
export type BleMessage = { id: string; time: string; text: string }

export const STATE_META: Record<SystemStateId, { label: string; description: string; token: string; dot: string }> = {
  idle: { label: "SECURE", description: "System secured and surveillance scanning", token: "text-success", dot: "bg-success" },
  bag_alert: { label: "BAG OPEN ALERT", description: "Bag opening detected", token: "text-destructive", dot: "bg-destructive" },
  water_alert: { label: "WATER DETECTED", description: "Water detected", token: "text-info", dot: "bg-info" },
  owner_mode: { label: "OWNER MODE ACTIVE", description: "Authorized bypass mode", token: "text-primary", dot: "bg-primary" },
  misuse: { label: "UNAUTHORIZED ACCESS", description: "Unauthorized access detected", token: "text-warning", dot: "bg-warning" },
  surveillance_alert: { label: "SURVEILLANCE ALERT", description: "Person detected by turret", token: "text-chart-5", dot: "bg-chart-5" },
}

const mapState = (state: string): SystemStateId => ({ ST_IDLE: "idle", ST_ALERT: "bag_alert", ST_WATER_ALERT: "water_alert", ST_OWNER_MODE: "owner_mode", ST_MISUSE: "misuse", ST_SURV_ALERT: "surveillance_alert" }[state] ?? "idle")
const mapEvent = (type: DeviceEventType): SystemStateId => ({ BAG_ALERT: "bag_alert", WATER_ALERT: "water_alert", SURVEILLANCE_ALERT: "surveillance_alert", MISUSE: "misuse", OWNER_MODE: "owner_mode" }[type])

type TelemetryContextValue = ReturnType<typeof buildTelemetry>
const TelemetryContext = createContext<TelemetryContextValue | null>(null)

function buildTelemetry(device: ReturnType<typeof useSanctumDevice>) {
  const systemState = mapState(device.status.state)
  const threatLevel: ThreatLevel = device.status.personDetected || device.status.bagOpen || device.status.waterDetected || systemState === "misuse" ? "high" : "low"
  const events: SanctumEvent[] = device.events.map((event) => ({ id: event.id, time: event.time, state: mapEvent(event.type), title: event.type.replace("_", " "), detail: event.message, angle: event.angle, distance: event.distance }))
  return {
    systemState, mode: device.mode as LinkMode, bleStatus: (device.mode === "live" && device.connected ? "connected" : "disconnected") as BleStatus, deviceName: device.status.device, lastUpdate: device.lastUpdate,
    servoAngle: device.status.servoAngle, scanDistance: device.status.surveillanceDistance, objectDetected: device.status.personDetected, threatLevel, targetLocked: systemState === "surveillance_alert" && device.status.personDetected, scanning: systemState !== "surveillance_alert",
    bagSecured: !device.status.bagOpen, bagDistance: device.status.bagDistance, zipStatus: (device.status.bagOpen ? "tampered" : "normal") as "normal" | "tampered", moisture: device.status.waterDetected, moistureValue: device.status.moistureValue, rtcTime: device.status.timestamp,
    rfidStatus: device.rfidStatus, ownerVerified: device.rfidStatus === "AUTHORIZED", lastAccess: "—", lastRfidUid: null, rfidLog: [] as RfidRecord[], events, messages: [] as BleMessage[], error: device.error,
    connect: () => device.setDeviceMode("live"), disconnect: device.disconnect, setMode: device.setDeviceMode,
    lockSystem: () => device.command("LOCK_BAG"), ownerUnlock: () => device.command("OWNER_MODE"), disableOwnerMode: () => device.command("DISABLE_OWNER_MODE"), testAlarm: () => device.command("TEST_ALARM"), refreshDevice: device.refresh, simulateThreat: () => device.simulate("SURVEILLANCE_ALERT"), simulate: device.simulate,
  }
}

export function TelemetryProvider({ children }: { children: React.ReactNode }) {
  const device = useSanctumDevice()
  const value = useMemo(() => buildTelemetry(device), [device])
  return <TelemetryContext.Provider value={value}>{children}</TelemetryContext.Provider>
}

export function useTelemetry() {
  const ctx = useContext(TelemetryContext)
  if (!ctx) throw new Error("useTelemetry must be used within TelemetryProvider")
  return ctx
}
