"use client"

import { useCallback, useEffect, useRef, useState } from "react"
import {
  connectDevice,
  disconnectDevice,
  getDeviceStatus,
  sendCommand,
  type ArduinoState,
  type DeviceStatus,
  type RfidStatus,
  type SanctumCommand,
} from "./sanctum-api"

export type DeviceMode = "demo" | "live"
export type DeviceEventType = "BAG_ALERT" | "WATER_ALERT" | "SURVEILLANCE_ALERT" | "MISUSE" | "OWNER_MODE"
export type DeviceEvent = { id: string; type: DeviceEventType; time: string; message: string; angle?: number; distance?: number }

const now = () => new Date().toLocaleTimeString("en-GB", { hour12: false })
const id = () => crypto.randomUUID?.() ?? Math.random().toString(36).slice(2)

function demoStatus(): DeviceStatus {
  return { device: "Sanctum-IQ", connected: true, state: "ST_IDLE", servoAngle: 90, bagDistance: 12, surveillanceDistance: 120, bagOpen: false, personDetected: false, waterDetected: false, moistureValue: 180, ownerMode: false, timestamp: now(), rfidStatus: "NOT_INSTALLED" }
}

function eventFor(status: DeviceStatus): Omit<DeviceEvent, "id"> | null {
  const rawEvent = status.event?.toUpperCase()
  if (rawEvent?.includes("BAG OPEN")) return { type: "BAG_ALERT", time: status.timestamp, message: "Bag opened by the intrusion sensor." }
  if (rawEvent?.includes("WATER")) return { type: "WATER_ALERT", time: status.timestamp, message: `Water detected (moisture ${status.moistureValue}).` }
  if (rawEvent?.includes("SURVEILLANCE")) return { type: "SURVEILLANCE_ALERT", time: status.timestamp, message: "Person detected by surveillance turret.", angle: status.servoAngle, distance: status.surveillanceDistance }
  if (rawEvent?.includes("MISUSE")) return { type: "MISUSE", time: status.timestamp, message: "Unauthorized access detected." }
  if (status.state === "ST_ALERT" || status.bagOpen) return { type: "BAG_ALERT", time: status.timestamp, message: "Bag opened by the intrusion sensor." }
  if (status.state === "ST_WATER_ALERT" || status.waterDetected) return { type: "WATER_ALERT", time: status.timestamp, message: `Water detected (moisture ${status.moistureValue}).` }
  if (status.state === "ST_SURV_ALERT" || status.personDetected) return { type: "SURVEILLANCE_ALERT", time: status.timestamp, message: "Person detected by surveillance turret.", angle: status.servoAngle, distance: status.surveillanceDistance }
  if (status.state === "ST_MISUSE") return { type: "MISUSE", time: status.timestamp, message: "Unauthorized access detected." }
  if (status.state === "ST_OWNER_MODE" || status.ownerMode) return { type: "OWNER_MODE", time: status.timestamp, message: "Owner mode enabled." }
  return null
}

/** Single source of truth for live Arduino status, commands, event detection, and demo simulation. */
export function useSanctumDevice(pollMs = 1500) {
  const [mode, setMode] = useState<DeviceMode>("demo")
  const [status, setStatus] = useState<DeviceStatus>(demoStatus)
  const [connected, setConnected] = useState(true)
  const [lastUpdate, setLastUpdate] = useState(Date.now())
  const [events, setEvents] = useState<DeviceEvent[]>([])
  const [error, setError] = useState<string | null>(null)
  const lastEventKey = useRef("")

  const applyStatus = useCallback((next: DeviceStatus) => {
    setStatus(next); setConnected(next.connected); setLastUpdate(Date.now())
    const event = eventFor(next)
    const key = event ? `${event.type}:${event.angle ?? ""}:${event.distance ?? ""}` : ""
    if (event && key !== lastEventKey.current) {
      lastEventKey.current = key
      setEvents((previous) => [{ ...event, id: id() }, ...previous].slice(0, 50))
    }
    if (!event) lastEventKey.current = ""
  }, [])

  const refresh = useCallback(async () => {
    if (mode !== "live") return
    try { applyStatus(await getDeviceStatus()); setError(null) }
    catch (cause) { setConnected(false); setError(cause instanceof Error ? cause.message : "Unable to reach Arduino") }
  }, [applyStatus, mode])

  useEffect(() => {
    if (mode !== "live") return
    void refresh()
    const timer = window.setInterval(() => void refresh(), pollMs)
    return () => window.clearInterval(timer)
  }, [mode, pollMs, refresh])

  useEffect(() => {
    if (mode !== "demo") return
    const timer = window.setInterval(() => setStatus((previous) => {
      if (previous.state === "ST_SURV_ALERT") return { ...demoStatus(), servoAngle: previous.servoAngle }
      const angle = Math.max(0, Math.min(180, previous.servoAngle + (previous.servoAngle >= 175 ? -8 : 8)))
      const next = { ...previous, servoAngle: angle, surveillanceDistance: 90 + Math.round(Math.random() * 50), timestamp: now(), connected: true }
      setLastUpdate(Date.now()); return next
    }), 700)
    return () => window.clearInterval(timer)
  }, [mode])

  const setDeviceMode = useCallback(async (next: DeviceMode) => {
    setMode(next); setError(null); lastEventKey.current = ""
    if (next === "demo") { applyStatus(demoStatus()); return }
    setConnected(false)
    try { applyStatus(await connectDevice()); setError(null) }
    catch (cause) { setError(cause instanceof Error ? cause.message : "Unable to connect to Arduino") }
  }, [applyStatus])

  const disconnect = useCallback(async () => { await disconnectDevice(); setConnected(false); setMode("demo"); applyStatus(demoStatus()) }, [applyStatus])
  const command = useCallback(async (value: SanctumCommand) => {
    if (mode === "live") { const result = await sendCommand(value); if (result.status) applyStatus(result.status); else await refresh(); return }
    const base = demoStatus()
    const next = value === "OWNER_MODE" ? { ...base, state: "ST_OWNER_MODE" as ArduinoState, ownerMode: true } : value === "TEST_ALARM" ? { ...base, state: "ST_MISUSE" as ArduinoState } : base
    applyStatus(next)
  }, [applyStatus, mode, refresh])
  const simulate = useCallback((kind: DeviceEventType) => {
    if (mode !== "demo") return
    const base = demoStatus(); const angle = 126
    const next = kind === "BAG_ALERT" ? { ...base, state: "ST_ALERT" as ArduinoState, bagOpen: true, bagDistance: 42 } : kind === "WATER_ALERT" ? { ...base, state: "ST_WATER_ALERT" as ArduinoState, waterDetected: true, moistureValue: 720 } : kind === "SURVEILLANCE_ALERT" ? { ...base, state: "ST_SURV_ALERT" as ArduinoState, personDetected: true, servoAngle: angle, surveillanceDistance: 34 } : kind === "MISUSE" ? { ...base, state: "ST_MISUSE" as ArduinoState } : { ...base, state: "ST_OWNER_MODE" as ArduinoState, ownerMode: true }
    applyStatus(next)
  }, [applyStatus, mode])

  return { mode, setDeviceMode, status, connected, lastUpdate, events, error, refresh, disconnect, command, simulate, rfidStatus: (status.rfidStatus ?? "NOT_INSTALLED") as RfidStatus }
}
