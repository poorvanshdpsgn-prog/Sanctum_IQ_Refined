"use client"

import {
  AlertTriangle,
  ArrowRight,
  CheckCircle2,
  Droplets,
  LockKeyhole,
  Radar,
  ShieldCheck,
  Sparkles,
  Target,
} from "lucide-react"
import { Panel, PanelHeader, SectionTitle } from "./primitives"

const pillars = [
  {
    icon: LockKeyhole,
    title: "Detect unauthorized opening",
    text: "An ultrasonic sensor inside the bag monitors for changes associated with the bag being opened or tampered with.",
  },
  {
    icon: Radar,
    title: "Watch the surroundings",
    text: "A servo-mounted ultrasonic sensor scans across 0–180° to detect nearby objects or people around the bag.",
  },
  {
    icon: Droplets,
    title: "Protect against water",
    text: "A moisture sensor can identify wet conditions and provide an early warning against rain or water exposure.",
  },
]

const flow = [
  { label: "Sensors", text: "Capture changes around and inside the bag." },
  { label: "UNO R4 WiFi", text: "Processes the system state and coordinates responses." },
  { label: "Alert", text: "The system can trigger an alarm, notify the owner, and record an event." },
]

export function AboutView() {
  return (
    <div className="space-y-6">
      <SectionTitle
        eyebrow="Project Overview"
        title="What is Sanctum IQ?"
        description="A smart protection system designed to make everyday bags more aware of intrusion, surroundings, and environmental risk."
      />

      <Panel glow className="overflow-hidden">
        <div className="grid gap-6 lg:grid-cols-[1.35fr_0.65fr] lg:items-center">
          <div>
            <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-primary/25 bg-primary/10 px-3 py-1.5 font-mono text-[10px] uppercase tracking-[0.18em] text-primary">
              <ShieldCheck className="size-3.5" />
              Intelligent Protection
            </div>
            <h2 className="text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
              Security that reacts to what is happening around your bag.
            </h2>
            <p className="mt-4 max-w-2xl text-sm leading-7 text-muted-foreground">
              Sanctum IQ combines multiple sensors with an Arduino UNO R4 WiFi controller to
              monitor the bag, detect selected threats, and provide an immediate response path.
              The goal is simple: turn a normally passive bag into a monitored, responsive system.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="rounded-xl border border-border/50 bg-background/40 p-4">
              <p className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">Core</p>
              <p className="mt-1 font-mono text-sm font-semibold text-primary">UNO R4 WiFi</p>
            </div>
            <div className="rounded-xl border border-border/50 bg-background/40 p-4">
              <p className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">Focus</p>
              <p className="mt-1 font-mono text-sm font-semibold text-foreground">Protection</p>
            </div>
            <div className="rounded-xl border border-border/50 bg-background/40 p-4">
              <p className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">Sensors</p>
              <p className="mt-1 font-mono text-sm font-semibold text-foreground">Multi-layer</p>
            </div>
            <div className="rounded-xl border border-border/50 bg-background/40 p-4">
              <p className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">Response</p>
              <p className="mt-1 font-mono text-sm font-semibold text-success">Real-time</p>
            </div>
          </div>
        </div>
      </Panel>

      <div className="grid gap-4 lg:grid-cols-2">
        <Panel>
          <PanelHeader icon={AlertTriangle} eyebrow="The problem" title="Why is Sanctum IQ needed?" />
          <div className="space-y-3 text-sm leading-7 text-muted-foreground">
            <p>
              A conventional school or travel bag normally gives no active warning when it is
              opened, approached, or exposed to water.
            </p>
            <p>
              That leaves several useful pieces of information invisible to the owner until
              after an incident has already happened. Sanctum IQ is designed to address that gap
              by continuously monitoring selected physical conditions.
            </p>
          </div>
        </Panel>

        <Panel>
          <PanelHeader icon={Target} eyebrow="The objective" title="What does it aim to solve?" />
          <div className="grid gap-2.5">
            {pillars.map(({ icon: Icon, title, text }) => (
              <div key={title} className="flex gap-3 rounded-xl border border-border/50 bg-background/30 p-3">
                <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <Icon className="size-4" />
                </span>
                <div>
                  <p className="text-sm font-medium text-foreground">{title}</p>
                  <p className="mt-1 text-xs leading-5 text-muted-foreground">{text}</p>
                </div>
              </div>
            ))}
          </div>
        </Panel>
      </div>

      <Panel>
        <PanelHeader icon={ArrowRight} eyebrow="System flow" title="How it works" />
        <div className="grid gap-3 md:grid-cols-3">
          {flow.map((item, index) => (
            <div key={item.label} className="relative rounded-xl border border-border/50 bg-background/30 p-4">
              <div className="mb-3 flex items-center justify-between">
                <span className="font-mono text-[10px] uppercase tracking-widest text-primary">
                  0{index + 1}
                </span>
                {index < flow.length - 1 ? <ArrowRight className="hidden size-4 text-muted-foreground md:block" /> : null}
              </div>
              <p className="font-semibold text-foreground">{item.label}</p>
              <p className="mt-1 text-xs leading-5 text-muted-foreground">{item.text}</p>
            </div>
          ))}
        </div>
      </Panel>

      <div className="grid gap-4 lg:grid-cols-2">
        <Panel>
          <PanelHeader icon={Sparkles} eyebrow="Effectiveness" title="What makes the approach useful?" />
          <div className="space-y-3">
            {[
              "Multiple layers of monitoring instead of relying on one sensor.",
              "Immediate local response can draw attention when a security event is detected.",
              "Timestamped events make incidents easier to understand after they occur.",
              "The modular design allows additional sensors and features to be added over time.",
            ].map((text) => (
              <div key={text} className="flex gap-2.5 text-sm leading-6 text-muted-foreground">
                <CheckCircle2 className="mt-1 size-4 shrink-0 text-success" />
                <span>{text}</span>
              </div>
            ))}
          </div>
          <p className="mt-4 border-t border-border/50 pt-4 text-xs leading-5 text-muted-foreground">
            Effectiveness depends on sensor placement, calibration, environmental conditions, and
            how the prototype is configured. The system is designed to provide an additional layer
            of protection, not to guarantee prevention of every possible incident.
          </p>
        </Panel>

        <Panel>
          <PanelHeader icon={Droplets} eyebrow="Beyond security" title="Built as an expandable platform" />
          <p className="text-sm leading-7 text-muted-foreground">
            Sanctum IQ is not limited to a single security trigger. Its architecture is intended
            to support monitoring, authentication, alerts, connectivity, and future hardware
            improvements around one controller.
          </p>
          <div className="mt-4 rounded-xl border border-primary/20 bg-primary/5 p-4">
            <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-primary">Design principle</p>
            <p className="mt-2 text-sm font-medium text-foreground">
              Detect → Decide → Respond → Record
            </p>
          </div>
        </Panel>
      </div>
    </div>
  )
}
