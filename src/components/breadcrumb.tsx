import Link from 'next/link'
import React from 'react'

import {
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
  Breadcrumb as ShadcnBreadcrumb
} from '@/components/ui/breadcrumb'
import PATH from '@/constants/path'
import { cn } from '@/lib/utils'

type BreadcrumbType = {
  path?: string
  name: string
}

export default function Breadcrumb({ data = [], className }: { data?: BreadcrumbType[]; className?: string }) {
  return (
    <ShadcnBreadcrumb className={cn('py-4', className)}>
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbLink asChild>
            <Link href={PATH.HOME}>Trang chủ</Link>
          </BreadcrumbLink>
        </BreadcrumbItem>
        {data.map((item) => (
          <React.Fragment key={item.name}>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              {item.path ? (
                <BreadcrumbLink asChild>
                  <Link href={item.path}>{item.name}</Link>
                </BreadcrumbLink>
              ) : (
                <BreadcrumbPage>{item.name}</BreadcrumbPage>
              )}
            </BreadcrumbItem>
          </React.Fragment>
        ))}
      </BreadcrumbList>
    </ShadcnBreadcrumb>
  )
}
