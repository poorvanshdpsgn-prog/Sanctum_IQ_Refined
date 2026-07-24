"use client"

import type { LucideIcon } from "lucide-react"
import { cn } from "@/lib/utils"

export function Panel({
  className,
  children,
  glow = false,
}: {
  className?: string
  children: React.ReactNode
  glow?: boolean
}) {
  return (
    <div
      className={cn(
        "glass relative overflow-hidden rounded-2xl p-5",
        glow && "ring-1 ring-primary/25",
        className,
      )}
    >
      {children}
    </div>
  )
}

export function PanelHeader({
  icon: Icon,
  title,
  eyebrow,
  right,
}: {
  icon?: LucideIcon
  title: string
  eyebrow?: string
  right?: React.ReactNode
}) {
  return (
    <div className="mb-4 flex items-start justify-between gap-3">
      <div className="flex items-center gap-3">
        {Icon ? (
          <div className="flex size-9 items-center justify-center rounded-lg bg-primary/10 text-primary ring-1 ring-primary/20">
            <Icon className="size-4" />
          </div>
        ) : null}
        <div>
          {eyebrow ? (
            <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
              {eyebrow}
            </p>
          ) : null}
          <h3 className="text-sm font-semibold tracking-wide text-foreground">{title}</h3>
        </div>
      </div>
      {right}
    </div>
  )
}

export function Stat({
  label,
  value,
  accent = "text-foreground",
  mono = true,
}: {
  label: string
  value: React.ReactNode
  accent?: string
  mono?: boolean
}) {
  return (
    <div className="rounded-xl border border-border/60 bg-background/40 p-3">
      <p className="font-mono text-[10px] uppercase tracking-[0.15em] text-muted-foreground">
        {label}
      </p>
      <p className={cn("mt-1 text-lg font-semibold leading-tight", mono && "font-mono", accent)}>
        {value}
      </p>
    </div>
  )
}

export function StatusDot({
  className,
  pulse = true,
}: {
  className?: string
  pulse?: boolean
}) {
  return (
    <span className="relative flex size-2.5">
      {pulse ? (
        <span
          className={cn(
            "absolute inline-flex size-full rounded-full opacity-70 animate-ping-slow",
            className,
          )}
        />
      ) : null}
      <span className={cn("relative inline-flex size-2.5 rounded-full", className)} />
    </span>
  )
}

export function Pill({
  children,
  className,
}: {
  children: React.ReactNode
  className?: string
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border border-border/70 bg-background/50 px-2.5 py-1 font-mono text-[10px] uppercase tracking-[0.15em] text-muted-foreground",
        className,
      )}
    >
      {children}
    </span>
  )
}

export function SectionTitle({
  eyebrow,
  title,
  description,
}: {
  eyebrow: string
  title: string
  description?: string
}) {
  return (
    <div className="mb-6">
      <p className="font-mono text-[11px] uppercase tracking-[0.3em] text-primary/80">{eyebrow}</p>
      <h2 className="mt-1 text-balance text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
        {title}
      </h2>
      {description ? (
        <p className="mt-2 max-w-2xl text-pretty text-sm leading-relaxed text-muted-foreground">
          {description}
        </p>
      ) : null}
    </div>
  )
}
