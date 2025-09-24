import { useQuery } from '@tanstack/react-query'
import React from 'react'

import productsApis from '@/apis/products.apis'
import { GetProductsReqQuery } from '@/types/products.types'

export default function useProducts({ query, enabled = true }: { query: GetProductsReqQuery; enabled?: boolean }) {
  const getProductsQuery = useQuery({
    queryKey: ['get-products', query],
    queryFn: () => productsApis.getProducts(query),
    enabled
  })

  const products = React.useMemo(
    () => getProductsQuery.data?.payload.data.products ?? [],
    [getProductsQuery.data?.payload.data.products]
  )

  const totalProducts = getProductsQuery.data?.payload.data.pagination.totalRows ?? 0

  return {
    products,
    totalProducts,
    isFetching: getProductsQuery.isFetching
  }
}
