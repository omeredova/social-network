import { cn } from '@/shared/lib/cn'
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
} from '@/shared/ui/breadcrumb'

interface PageBreadcrumbItem {
  label: string
  href?: string
}

interface PageBreadcrumbProps {
  items: readonly PageBreadcrumbItem[]
  className?: string
}

function PageBreadcrumb({ items, className }: PageBreadcrumbProps) {
  return (
    <Breadcrumb className={cn('mb-5', className)}>
      <BreadcrumbList>
        {items.map((item, index) => {
          const isCurrentPage = index === items.length - 1

          return (
            <BreadcrumbItem key={`${item.label}-${String(index)}`}>
              {isCurrentPage || !item.href ? (
                <BreadcrumbPage>{item.label}</BreadcrumbPage>
              ) : (
                <BreadcrumbLink href={item.href}>{item.label}</BreadcrumbLink>
              )}
            </BreadcrumbItem>
          )
        })}
      </BreadcrumbList>
    </Breadcrumb>
  )
}

export { PageBreadcrumb, type PageBreadcrumbItem }