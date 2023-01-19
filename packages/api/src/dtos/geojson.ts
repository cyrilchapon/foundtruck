import { Point } from 'geojson'
import { z } from 'zod'

export const pointZ = z
  .object({
    type: z.literal('Point'),
    coordinates: z.tuple([z.number(), z.number()]),
  })
  .strict() satisfies z.ZodType<Point>
