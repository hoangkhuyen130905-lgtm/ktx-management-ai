import type { LucideIcon } from 'lucide-react'
import { ArrowDownRight, ArrowUpRight, Minus } from 'lucide-react'

type KpiCardProps = { label: string; value: string | number; description: string; delta: string; trend: 'up' | 'down' | 'neutral'; icon: LucideIcon; tone: 'primary' | 'success' | 'warning' | 'danger' }

export function KpiCard({ label, value, description, delta, trend, icon: Icon, tone }: KpiCardProps) {
  const TrendIcon = trend === 'up' ? ArrowUpRight : trend === 'down' ? ArrowDownRight : Minus
  return <article className="kpi-card"><div className="kpi-head"><div><div className="kpi-label">{label}</div><div className="kpi-value">{value}</div></div><span className={`kpi-icon ${tone}`}><Icon size={19} aria-hidden="true" /></span></div><div className="kpi-foot"><span className={`kpi-delta ${trend}`}><TrendIcon size={13} strokeWidth={2.5} aria-hidden="true" /> {delta}</span><span>{description}</span></div></article>
}
