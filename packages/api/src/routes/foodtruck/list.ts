import { Models } from '@chimanos/foundtruck-db'
import { Mongoose } from 'mongoose'
import { z } from 'zod'
import { foodtruckZ } from '../../dtos/foodtruck'
import { createEndpoint } from '../../util/validated-handler'

const listFoodtrucksQuery = z
  .object({
    near: z.tuple([
      z.coerce.number().min(-180).max(180),
      z.coerce.number().min(-90).max(90),
    ]),
    radius: z.coerce.number().max(30000),
  })
  .strict()
const listResponseSchema = z.array(foodtruckZ)

type ListRes = z.infer<typeof listResponseSchema>
type ListQuery = z.infer<typeof listFoodtrucksQuery>

const listHandler = (mongoose: Mongoose, models: Models) =>
  createEndpoint({
    res: z.any(),
    query: listFoodtrucksQuery,
  })(async (req) => {
    const nearCenter = {
      type: 'Point',
      coordinates: req.query.near,
    } as const
    const nearRadius = req.query.radius

    // const foodtrucks = await models.foodtruck.find({
    //   'locations.point': {
    //     $near: {
    //       $geometry: nearCenter,
    //       $maxDistance: nearRadius,
    //       $minDistance: 0,
    //     },
    //   },
    // })

    // const foodtrucks = await models.foodtruck.aggregate([
    //   {
    //     $geoNear: {
    //       near: nearCenter,
    //       key: 'locations.point',
    //       distanceField: 'distance',
    //       includeLocs: 'location',
    //       maxDistance: nearRadius,
    //       spherical: true,
    //     },
    //   },
    // ])

    const foodtrucks = await models.foodtruck.aggregate([
      {
        $unwind: {
          path: '$locations',
        },
      },
      {
        $match: {
          point: {
            $near: {
              $geometry: nearCenter,
              $maxDistance: nearRadius,
              $minDistance: 0,
            },
          },
        },
      },
      // {
      //   $project: {
      //     _id: 0,
      //     id: { $toString: '$locations._id' },
      //     type: { $literal: 'Feature' },
      //     properties: {
      //       foodtruck: {
      //         _id: { $toString: '$_id' },
      //         name: '$name',
      //       },
      //       location: {
      //         _id: { $toString: '$locations._id' },
      //         name: '$locations.name',
      //         dayMeals: '$locations.dayMeals',
      //       },
      //     },
      //     geometry: '$locations.point',
      //   },
      // },
    ])

    return {
      statusCode: 201,
      body: foodtrucks,
    }
  })

export { listHandler, ListRes }
