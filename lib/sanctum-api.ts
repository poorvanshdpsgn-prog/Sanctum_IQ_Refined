/** HTTP transport for the Arduino UNO R4 WiFi firmware. */
export type ArduinoState =
  | "ST_IDLE"
  | "ST_ALERT"
  | "ST_WATER_ALERT"
  | "ST_OWNER_MODE"
  | "ST_MISUSE"
  | "ST_SURV_ALERT"

export type RfidStatus = "NOT_INSTALLED" | "AUTHORIZED" | "DENIED"

export type DeviceStatus = {
  device: string
  connected: boolean
  state: ArduinoState
  servoAngle: number
  bagDistance: number
  surveillanceDistance: number
  bagOpen: boolean
  personDetected: boolean
  waterDetected: boolean
  moistureValue: number
  ownerMode: boolean
  timestamp: string
  temperature?: number
  rfidStatus?: RfidStatus
  event?: string
}

export type SanctumCommand = "LOCK_BAG" | "OWNER_MODE" | "DISABLE_OWNER_MODE" | "TEST_ALARM"

const defaultBaseUrl = () => process.env.NEXT_PUBLIC_SANCTUM_DEVICE_URL?.replace(/\/$/, "") ?? ""

function endpoint(path: string, baseUrl = defaultBaseUrl()) {
  if (!baseUrl) throw new Error("Set NEXT_PUBLIC_SANCTUM_DEVICE_URL to the Arduino URL (for example http://192.168.1.42).")
  return `${baseUrl}${path}`
}

async function request<T>(path: string, init?: RequestInit, baseUrl?: string): Promise<T> {
  const response = await fetch(endpoint(path, baseUrl), {
    ...init,
    headers: { "Content-Type": "application/json", ...init?.headers },
    cache: "no-store",
  })
  if (!response.ok) throw new Error(`Arduino request failed (${response.status})`)
  return response.json() as Promise<T>
}

export function getDeviceStatus(baseUrl?: string) {
  return request<DeviceStatus>("/status", undefined, baseUrl)
}

export async function connectDevice(baseUrl?: string) {
  return getDeviceStatus(baseUrl)
}

/** Stops this dashboard's polling session. Firmware does not need a disconnect endpoint. */
export async function disconnectDevice() {
  return undefined
}

export function sendCommand(command: SanctumCommand, baseUrl?: string) {
  return request<{ ok?: boolean; status?: DeviceStatus }>(
    "/command",
    { method: "POST", body: JSON.stringify({ command }) },
    baseUrl,
  )
}
