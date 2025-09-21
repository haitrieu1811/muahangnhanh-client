'use client'

import { usePathname, useSearchParams } from 'next/navigation'
import React from 'react'

import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious
} from '@/components/ui/pagination'
import { cn } from '@/lib/utils'

const RANGE = 2

export default function CustomPagination({ totalPages }: { totalPages: number }) {
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const currentPage = Number(searchParams.get('page')) || 1

  const createPageURL = (pageNumber: number | string) => {
    const params = new URLSearchParams(searchParams)
    params.set('page', pageNumber.toString())
    return `${pathname}?${params.toString()}`
  }

  const renderPagination = () => {
    let dotBefore = false
    let dotAfter = false

    const renderDotBefore = (index: number) => {
      if (!dotBefore) {
        dotBefore = true
        return (
          <PaginationItem key={index}>
            <PaginationEllipsis />
          </PaginationItem>
        )
      }
    }

    const renderDotAfter = (index: number) => {
      if (!dotAfter) {
        dotAfter = true
        return (
          <PaginationItem key={index}>
            <PaginationEllipsis />
          </PaginationItem>
        )
      }
    }

    return Array(totalPages)
      .fill(0)
      .map((_, index) => {
        const pageNumber = index + 1
        const isActive = pageNumber === currentPage

        if (currentPage <= RANGE * 2 + 1 && pageNumber > currentPage + RANGE && pageNumber < totalPages - RANGE + 1) {
          return renderDotAfter(index)
        } else if (currentPage > RANGE * 2 + 1 && currentPage < totalPages - RANGE * 2) {
          if (pageNumber < currentPage - RANGE && pageNumber > RANGE) {
            return renderDotBefore(index)
          } else if (pageNumber > currentPage + RANGE && pageNumber < totalPages - RANGE + 1) {
            return renderDotAfter(index)
          }
        } else if (currentPage >= totalPages - RANGE * 2 && pageNumber > RANGE && pageNumber < currentPage - RANGE) {
          return renderDotBefore(index)
        }

        return (
          <PaginationItem key={index}>
            <PaginationLink href={createPageURL(pageNumber)} isActive={isActive}>
              {pageNumber}
            </PaginationLink>
          </PaginationItem>
        )
      })
  }

  return (
    <React.Fragment>
      {totalPages > 1 && (
        <Pagination>
          <PaginationContent>
            {/* Trang trước */}
            <div
              className={cn({
                'cursor-not-allowed': currentPage === 1
              })}
            >
              <PaginationItem>
                <PaginationPrevious
                  href={createPageURL(currentPage - 1)}
                  className={cn({
                    'pointer-events-none': currentPage === 1
                  })}
                />
              </PaginationItem>
            </div>
            {/* Danh sách trang */}
            {renderPagination()}
            {/* Trang sau */}
            <div
              className={cn({
                'cursor-not-allowed': currentPage === totalPages
              })}
            >
              <PaginationItem>
                <PaginationNext
                  href={createPageURL(currentPage + 1)}
                  className={cn({
                    'pointer-events-none': currentPage === totalPages
                  })}
                />
              </PaginationItem>
            </div>
          </PaginationContent>
        </Pagination>
      )}
    </React.Fragment>
  )
}
