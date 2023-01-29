import { Models } from '@chimanos/foundtruck-db'
import { Mongoose } from 'mongoose'
import { z } from 'zod'
import { GeoJSONVT, getJsonTile, getMvtTile, getPbfTile } from '../../tiles'
import { createEndpoint } from '../../util/validated-handler'

const renderResponseSchema = z.any()
type RenderRes = z.infer<typeof renderResponseSchema>

const renderParamsSchema = z.object({
  x: z.coerce.number(),
  y: z.coerce.number(),
  z: z.coerce.number(),
})
type RenderParams = z.infer<typeof renderParamsSchema>

const renderHandler = (
  mongoose: Mongoose,
  models: Models,
  tileIndex: GeoJSONVT,
) =>
  createEndpoint({
    res: renderResponseSchema,
    params: renderParamsSchema,
  })(async (req) => {
    const { z, x, y } = req.params

    const jsonTile = getJsonTile({ foodtrucks: tileIndex })(z, x, y)
    console.log(jsonTile.foodtrucks?.features[0])
    const tile = await getMvtTile({ foodtrucks: tileIndex })(z, x, y)

    return {
      statusCode: 200,
      contentType: 'application/x-protobuf',
      contentEncoding: 'gzip',
      body: tile,
    }
  })

export { renderHandler, RenderRes, RenderParams }
