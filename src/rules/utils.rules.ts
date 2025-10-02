import z from 'zod'

export const metadataRules = z.object({
  title: z
    .string()
    .min(30, 'Metadata title nên có độ dài tối thiểu 30 ký tự.')
    .max(65, 'Metadata title nên có độ dài tối đa 65 ký tự.'),
  description: z
    .string()
    .min(120, 'Metadata description có độ dài tối thiểu 120 ký tự.')
    .max(320, 'Metadata description nên có độ dài tối đa 320 ký tự.')
})

export type MetadataSchema = z.infer<typeof metadataRules>
