import { Location } from '@chimanos/foundtruck-db'
import { z } from 'zod'
import { pointZ } from './geojson'
import { FlattenId } from './object-id'

type _SerializedLocation = FlattenId<Location>

export const locationZ = z
  .object({
    _id: z.string(),
    name: z.string(),
    point: pointZ,
  })
  .strict() satisfies z.ZodType<_SerializedLocation>

export type SerializedLocation = z.infer<typeof locationZ>
