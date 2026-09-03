import type { ReactNode } from 'react'

export function PageHeader({ eyebrow = 'KTX ICTU', title, description, actions }: { eyebrow?: string; title: string; description: string; actions?: ReactNode }) {
  return <div className="page-header"><div className="page-header-copy"><span className="page-eyebrow">{eyebrow}</span><h1 className="page-title">{title}</h1><p className="page-description">{description}</p></div>{actions && <div className="page-actions">{actions}</div>}</div>
}
