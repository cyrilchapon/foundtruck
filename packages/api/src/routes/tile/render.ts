import { vectorTile } from '@chimanos/foundtruck-db'
import { Knex } from 'knex'
import { z } from 'zod'
import { createEndpoint } from '../../util/validated-handler'

const renderResponseSchema = z.any()
type RenderRes = z.infer<typeof renderResponseSchema>

const renderParamsSchema = z.object({
  x: z.coerce.number(),
  y: z.coerce.number(),
  z: z.coerce.number(),
})
type RenderParams = z.infer<typeof renderParamsSchema>

const renderHandler = (knex: Knex) =>
  createEndpoint({
    res: renderResponseSchema,
    params: renderParamsSchema,
  })(async (req) => {
    const { x, y, z } = req.params
    const tile = await vectorTile(knex)(x, y, z, 4096, 64)

    console.log(tile)

    return {
      statusCode: 200,
      contentType: 'application/x-protobuf',
      body: tile,
    }
  })

export { renderHandler, RenderRes, RenderParams }
