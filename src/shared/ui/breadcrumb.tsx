import * as React from 'react'
import {
  Breadcrumb as BreadcrumbItemPrimitive,
  Breadcrumbs as BreadcrumbListPrimitive,
  Link as BreadcrumbLinkPrimitive,
} from 'react-aria-components'
import { ChevronRight, MoreHorizontal } from 'lucide-react'

import { cn } from '@/shared/lib/cn'

function Breadcrumb({ className, ...props }: React.ComponentProps<'nav'>) {
  return (
    <nav
      aria-label="Breadcrumb"
      data-slot="breadcrumb"
      className={className}
      {...props}
    />
  )
}

function BreadcrumbList({ className, ...props }: React.ComponentProps<typeof BreadcrumbListPrimitive>) {
  return (
    <BreadcrumbListPrimitive
      data-slot="breadcrumb-list"
      className={cn(
        'flex flex-wrap items-center gap-1.5 text-sm text-post-muted sm:gap-2.5',
        className,
      )}
      {...props}
    />
  )
}

function BreadcrumbItem({ className, ...props }: React.ComponentProps<typeof BreadcrumbItemPrimitive>) {
  return (
    <BreadcrumbItemPrimitive
      data-slot="breadcrumb-item"
      className={cn(
        'inline-flex items-center gap-1.5 after:size-1.5 after:rotate-45 after:border-r after:border-t after:border-current last:after:hidden sm:gap-2.5',
        className,
      )}
      {...props}
    />
  )
}

function BreadcrumbLink({ className, ...props }: React.ComponentProps<typeof BreadcrumbLinkPrimitive>) {
  return (
    <BreadcrumbLinkPrimitive
      data-slot="breadcrumb-link"
      className={cn(
        'cursor-pointer rounded-sm transition-colors hover:text-post-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-post-focus',
        className,
      )}
      {...props}
    />
  )
}

function BreadcrumbPage({ className, ...props }: React.ComponentProps<'span'>) {
  return (
    <span
      aria-current="page"
      data-slot="breadcrumb-page"
      className={cn('font-medium text-post-foreground', className)}
      {...props}
    />
  )
}

function BreadcrumbSeparator({ children, className, ...props }: React.ComponentProps<'span'>) {
  return (
    <span
      aria-hidden="true"
      data-slot="breadcrumb-separator"
      className={cn('[&>svg]:size-3.5', className)}
      {...props}
    >
      {children ?? <ChevronRight />}
    </span>
  )
}

function BreadcrumbEllipsis({ className, ...props }: React.ComponentProps<'span'>) {
  return (
    <span
      aria-hidden="true"
      data-slot="breadcrumb-ellipsis"
      className={cn('flex size-9 items-center justify-center', className)}
      {...props}
    >
      <MoreHorizontal className="size-4" />
      <span className="sr-only">More</span>
    </span>
  )
}

export {
  Breadcrumb,
  BreadcrumbEllipsis,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
}