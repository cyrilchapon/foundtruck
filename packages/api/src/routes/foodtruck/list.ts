import { Foodtruck } from '@chimanos/foundtruck-db'
import { Knex } from 'knex'
import { z } from 'zod'
import { createEndpoint } from '../../util/validated-handler'

const listResponseSchema = z.array(
  z
    .object({
      id: z.string(),
      name: z.string(),
      created_at: z.date(),
      updated_at: z.date(),
    })
    .strict() satisfies z.ZodType<Foodtruck>,
)

type ListRes = z.infer<typeof listResponseSchema>

const listHandler = (knex: Knex) =>
  createEndpoint({
    res: listResponseSchema,
  })(async () => {
    const foodtrucks = await knex<Foodtruck>('foodtrucks').select()

    return {
      statusCode: 201,
      body: foodtrucks.map((foodtruck) => ({
        id: foodtruck.id,
        name: foodtruck.name,
        created_at: foodtruck.created_at,
        updated_at: foodtruck.updated_at,
      })),
    }
  })

export { listHandler, ListRes }
