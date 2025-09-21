import http from '@/lib/http'
import { GetImagesResponse, OnlyMessageResponse, PaginationReqQuery } from '@/types/utils.types'

const mediasApis = {
  getImages({ query, accessToken }: { query?: PaginationReqQuery; accessToken: string }) {
    return http.get<GetImagesResponse>(`/medias/images?page=${query?.page}`, {
      headers: {
        Authorization: `Bearer ${accessToken}`
      }
    })
  },

  deleteImage(imageId: string) {
    return http.delete<OnlyMessageResponse>(`/medias/images/${imageId}`, {})
  }
} as const

export default mediasApis
