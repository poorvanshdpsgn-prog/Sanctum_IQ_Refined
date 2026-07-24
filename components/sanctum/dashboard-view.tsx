"use client"

import { SectionTitle } from "./primitives"
import { SystemStatus } from "./system-status"
import { SurveillanceRadar } from "./surveillance-radar"
import { StateMonitor } from "./state-monitor"
import { BagIntrusion } from "./bag-intrusion"
import { EventLog } from "./event-log"
import { ControlPanel } from "./control-panel"

export function DashboardView() {
  return (
    <div>
      <SectionTitle
        eyebrow="Command Center"
        title="Security Overview"
        description="Real-time protection status for your Sanctum IQ smart security bag, streamed live from the Arduino UNO R4 WiFi controller."
      />

      <div className="grid gap-4">
        <SystemStatus />

        <div className="grid gap-4 xl:grid-cols-[1.6fr_1fr]">
          <SurveillanceRadar />
          <StateMonitor />
        </div>

        <div className="grid gap-4 lg:grid-cols-2">
          <BagIntrusion />
          <EventLog compact />
        </div>

        <ControlPanel compact />
      </div>
    </div>
  )
}
