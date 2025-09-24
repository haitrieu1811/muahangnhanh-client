import http from '@/lib/http'
import { CreateBlogReqBody, CreateBlogResponse, GetBlogResponse, GetBlogsResponse } from '@/types/blogs.types'
import { OnlyMessageResponse } from '@/types/utils.types'

const blogsApis = {
  getBlogs() {
    return http.get<GetBlogsResponse>('/blogs')
  },

  createBlog(body: CreateBlogReqBody) {
    return http.post<CreateBlogResponse>('/blogs', body)
  },

  getBlog(id: string) {
    return http.get<GetBlogResponse>(`/blogs/${id}`)
  },

  updateBlog({ body, id }: { body: CreateBlogReqBody; id: string }) {
    return http.put<CreateBlogResponse>(`/blogs/${id}`, body)
  },

  deleteBlog(id: string) {
    return http.delete<OnlyMessageResponse>(`/blogs/${id}`, {})
  }
} as const

export default blogsApis
