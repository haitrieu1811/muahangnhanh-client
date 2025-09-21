import { cookies } from 'next/headers'

import mediasApis from '@/apis/medias.apis'
import ImagesList from '@/app/(admin)/admin/images/images-list'
import { ImageType } from '@/types/utils.types'

export default async function AdminImagesPage({
  searchParams
}: {
  searchParams?: Promise<{
    page?: string
  }>
}) {
  const _searchParams = await searchParams
  const currentPage = Number(_searchParams?.page) || 1

  const cookieStore = await cookies()
  const accessToken = cookieStore.get('accessToken')?.value ?? ''

  let images: ImageType[] = []
  let totalPages = 1

  try {
    const res = await mediasApis.getImages({
      accessToken,
      query: {
        page: currentPage
      }
    })
    images = res.payload.data.images
    totalPages = res.payload.data.pagination.totalPages
  } catch {}

  return (
    <div>
      <h1 className='font-semibold tracking-tight text-3xl mb-10'>Thư viện ảnh</h1>
      <ImagesList images={images} totalPages={totalPages} />
    </div>
  )
}
