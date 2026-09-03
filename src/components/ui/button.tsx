import type { ButtonHTMLAttributes, ReactNode } from 'react'
import { cn } from '../../lib/utils'

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger'
  size?: 'default' | 'sm'
  children: ReactNode
}

export function Button({ variant = 'primary', size = 'default', className, children, ...props }: ButtonProps) {
  return <button className={cn('btn', `btn-${variant}`, size === 'sm' && 'btn-sm', className)} {...props}>{children}</button>
}
