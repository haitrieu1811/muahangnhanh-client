import http from '@/lib/http'
import { MetadataSchema } from '@/rules/utils.rules'
import { CreateMetadataResponse } from '@/types/utils.types'

const utilsApis = {
  createMetadata({ body, documentId }: { body: MetadataSchema; documentId: string }) {
    return http.post<CreateMetadataResponse>(`/metadata/documents/${documentId}`, body)
  },

  updateMetadata({ body, metadataId }: { body: MetadataSchema; metadataId: string }) {
    return http.put<CreateMetadataResponse>(`/metadata/${metadataId}`, body)
  }
} as const

export default utilsApis
