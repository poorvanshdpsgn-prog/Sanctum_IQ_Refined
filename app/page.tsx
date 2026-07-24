import { TelemetryProvider } from "@/lib/telemetry"
import { Shell } from "@/components/sanctum/shell"

export default function Page() {
  return (
    <TelemetryProvider>
      <Shell />
    </TelemetryProvider>
  )
}
