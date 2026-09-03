import { X } from 'lucide-react'
import type { ReactNode } from 'react'
import { Button } from './button'

type DialogProps = { open: boolean; title: string; description?: string; onClose: () => void; children: ReactNode; footer?: ReactNode }

export function Dialog({ open, title, description, onClose, children, footer }: DialogProps) {
  if (!open) return null
  return <div className="dialog-backdrop" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) onClose() }}>
    <section className="dialog" role="dialog" aria-modal="true" aria-labelledby="dialog-title">
      <header className="dialog-header"><div><h2 id="dialog-title" className="dialog-title">{title}</h2>{description && <p className="dialog-description">{description}</p>}</div><button className="icon-button" type="button" aria-label="Đóng hộp thoại" onClick={onClose}><X size={18} /></button></header>
      <div className="dialog-body">{children}</div>
      {footer && <footer className="dialog-footer">{footer}</footer>}
    </section>
  </div>
}

export function DialogActions({ onCancel, submitLabel = 'Lưu', onSubmit, submitDisabled = false }: { onCancel: () => void; submitLabel?: string; onSubmit: () => void; submitDisabled?: boolean }) {
  return <><Button variant="secondary" type="button" onClick={onCancel}>Hủy</Button><Button type="button" onClick={onSubmit} disabled={submitDisabled}>{submitLabel}</Button></>
}
