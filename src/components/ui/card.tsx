import type { HTMLAttributes, ReactNode } from 'react'
import { cn } from '../../lib/utils'

export function Card({ className, children, ...props }: HTMLAttributes<HTMLDivElement>) { return <section className={cn('card', className)} {...props}>{children}</section> }
export function CardHeader({ className, children, ...props }: HTMLAttributes<HTMLDivElement>) { return <div className={cn('card-header', className)} {...props}>{children}</div> }
export function CardTitle({ className, children, ...props }: HTMLAttributes<HTMLHeadingElement>) { return <h2 className={cn('card-title', className)} {...props}>{children}</h2> }
export function CardDescription({ className, children, ...props }: HTMLAttributes<HTMLParagraphElement>) { return <p className={cn('card-description', className)} {...props}>{children}</p> }
export function CardContent({ className, children, ...props }: HTMLAttributes<HTMLDivElement> & { children: ReactNode }) { return <div className={cn('card-content', className)} {...props}>{children}</div> }
