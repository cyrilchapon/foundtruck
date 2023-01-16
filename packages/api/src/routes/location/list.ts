import { Location } from '@chimanos/foundtruck-db'
import { Knex } from 'knex'
import { z } from 'zod'
import { createEndpoint } from '../../util/validated-handler'
import knexPostgis from 'knex-postgis'

const listResponseSchema = z.array(
  z
    .object({
      id: z.string(),
      coords: z.tuple([z.number(), z.number()]),
      created_at: z.date(),
      updated_at: z.date(),
    })
    .strict() satisfies z.ZodType<Location>,
)

type ListRes = z.infer<typeof listResponseSchema>

const listHandler = (knex: Knex) =>
  createEndpoint({
    res: listResponseSchema,
  })(async () => {
    const st = knexPostgis(knex)
    const locations = await knex<Location>('locations').select(
      '*', st.asGeoJSON('coords')
    )

    return {
      statusCode: 201,
      body: locations.map((location) => ({
        id: location.id,
        coords: JSON.parse(location.coords),
        created_at: location.created_at,
        updated_at: location.updated_at,
      })),
    }
  })

export { listHandler, ListRes }
