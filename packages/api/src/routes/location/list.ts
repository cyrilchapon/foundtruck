import { listLocations, listLocationsWithin, Location } from '@chimanos/foundtruck-db'
import { GeoJSON } from '@chimanos/foundtruck-common'
import { Knex } from 'knex'
import { z } from 'zod'
import { createEndpoint } from '../../util/validated-handler'

const listResponseSchema = z.array(
  z
    .object({
      id: z.string(),
      coords: GeoJSON.pointSchema,
      created_at: z.date(),
      updated_at: z.date(),
    })
    .strict() satisfies z.ZodType<Location>,
)

const listRequestBodySchema = z.object({
  coords: GeoJSON.pointSchema,
  radius: z.number().int().min(1000).max(50000)
})

type ListRes = z.infer<typeof listResponseSchema>

const listHandler = (knex: Knex) =>
  createEndpoint({
    res: listResponseSchema,
    body: listRequestBodySchema
  })(async (req) => {
    const locations = await listLocationsWithin(knex)(req.body)

    return {
      statusCode: 201,
      body: locations,
    }
  })

export { listHandler, ListRes }
