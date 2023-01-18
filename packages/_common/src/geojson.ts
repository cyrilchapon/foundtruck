import { z } from 'zod'

export const pointSchema = z.object({
  type: z.literal('Point'),
  coordinates: z.tuple([z.number(), z.number()])
})

export type Point = z.infer<typeof pointSchema>
