import { cookies } from 'next/headers'

import mediasApis from '@/apis/medias.apis'
import UploadImages from '@/components/upload-images'
import ImagesList from '@/app/(admin)/admin/images/images-list'
import { ImageType } from '@/types/utils.types'
import PageTitle from '@/app/(admin)/_components/page-title'

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
  let totalRows = 0

  try {
    const res = await mediasApis.getImagesFromNextServerToServer({
      accessToken,
      query: {
        page: currentPage
      }
    })
    images = res.payload.data.images
    totalPages = res.payload.data.pagination.totalPages
    totalRows = res.payload.data.pagination.totalRows
  } catch {}

  return (
    <div className='space-y-10'>
      <div className='flex justify-between items-center space-x-10'>
        <PageTitle title='Thư viện ảnh' subTitle={totalRows.toString()} />
        <UploadImages />
      </div>
      <ImagesList images={images} totalPages={totalPages} />
    </div>
  )
}
