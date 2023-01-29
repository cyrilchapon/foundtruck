import { Foodtruck, Location } from '@chimanos/foundtruck-db'
import { z } from 'zod'
import { locationZ } from './location'
import { FlattenId } from './object-id'

type _SerializedFoodtruck = FlattenId<
  Omit<Foodtruck, 'locations'> & { locations: FlattenId<Location>[] }
>

export const foodtruckZ = z
  .object({
    _id: z.string(),
    name: z.string(),
    locations: z.array(locationZ),
  })
  .strict() satisfies z.ZodType<_SerializedFoodtruck>

export type SerializedFoodtruck = z.infer<typeof foodtruckZ>
