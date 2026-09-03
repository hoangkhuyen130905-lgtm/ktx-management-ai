import type { InputHTMLAttributes, ReactNode } from 'react'

type FormFieldProps = InputHTMLAttributes<HTMLInputElement> & { label: string; description?: string; error?: string; children?: ReactNode }

export function FormField({ label, description, error, id, required, children, ...props }: FormFieldProps) {
  const inputId = id ?? label.toLowerCase().replaceAll(' ', '-')
  const helpId = `${inputId}-help`
  const errorId = `${inputId}-error`
  return <div className="form-field"><label className="form-label" htmlFor={inputId}>{label} {required && <span className="required" aria-hidden="true">*</span>}</label>{children ?? <input id={inputId} className="form-input" aria-invalid={Boolean(error)} aria-describedby={error ? errorId : description ? helpId : undefined} required={required} {...props} />}{description && !error && <span id={helpId} className="form-help">{description}</span>}{error && <span id={errorId} className="form-error" role="alert">{error}</span>}</div>
}
