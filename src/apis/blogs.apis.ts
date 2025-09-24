import http from '@/lib/http'
import { CreateBlogReqBody, CreateBlogResponse, GetBlogsResponse } from '@/types/blogs.types'

const blogsApis = {
  getBlogs() {
    return http.get<GetBlogsResponse>('/blogs')
  },

  createBlog(body: CreateBlogReqBody) {
    return http.post<CreateBlogResponse>('/blogs', body)
  }
} as const

export default blogsApis
