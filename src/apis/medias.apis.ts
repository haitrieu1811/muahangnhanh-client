import http from '@/lib/http'
import { GetImagesResponse, OnlyMessageResponse, PaginationReqQuery, UploadImagesResponse } from '@/types/utils.types'

const mediasApis = {
  uploadImages(body: FormData) {
    return http.post<UploadImagesResponse>('/medias/upload-images', body)
  },

  getImagesFromNextServerToServer({ query, accessToken }: { query?: PaginationReqQuery; accessToken: string }) {
    return http.get<GetImagesResponse>(`/medias/images?page=${query?.page}`, {
      headers: {
        Authorization: `Bearer ${accessToken}`
      }
    })
  },

  getImagesFromNextClientToServer(query?: PaginationReqQuery) {
    return http.get<GetImagesResponse>(`/medias/images?page=${query?.page}&limit=${query?.limit}`)
  },

  deleteImage(imageId: string) {
    return http.delete<OnlyMessageResponse>(`/medias/images/${imageId}`, {})
  }
} as const

export default mediasApis
