import { Models } from '@chimanos/foundtruck-db'
import { Mongoose } from 'mongoose'
import { z } from 'zod'
import { foodtruckZ } from '../../dtos/foodtruck'
import { createEndpoint } from '../../util/validated-handler'

const listResponseSchema = z.array(foodtruckZ)

type ListRes = z.infer<typeof listResponseSchema>

const listHandler = (mongoose: Mongoose, models: Models) =>
  createEndpoint({
    res: listResponseSchema,
  })(async () => {
    const foodtrucks = await models.foodtruck.find()

    return {
      statusCode: 201,
      body: foodtrucks.map((foodtruck) => foodtruck.toJSON()),
    }
  })

export { listHandler, ListRes }
